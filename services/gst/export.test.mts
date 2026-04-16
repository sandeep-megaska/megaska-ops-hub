import test from 'node:test';
import assert from 'node:assert/strict';

import { prepareGstExport } from './export.ts';
import { gstDb } from './db.ts';

const originalFindMany = gstDb.gstDocument.findMany;
const originalTransaction = gstDb.$transaction;
const originalGstExportCreate = gstDb.gstExport.create;
const originalGstExportItemCreateMany = gstDb.gstExportItem.createMany;
const originalAuditCreate = gstDb.gstAuditLog.create;

function restoreDb() {
  gstDb.gstDocument.findMany = originalFindMany;
  gstDb.$transaction = originalTransaction;
  gstDb.gstExport.create = originalGstExportCreate;
  gstDb.gstExportItem.createMany = originalGstExportItemCreateMany;
  gstDb.gstAuditLog.create = originalAuditCreate;
}

test.afterEach(() => {
  restoreDb();
});

test('returns business error when no documents are found in period', async () => {
  gstDb.gstDocument.findMany = async () => [];

  const result = await prepareGstExport({
    gstSettingsId: 'gst-settings-1',
    exportType: 'invoice_register',
    periodStart: new Date('2026-04-01T00:00:00.000Z'),
    periodEnd: new Date('2026-04-30T00:00:00.000Z'),
  });

  assert.equal(result.ok, false);
  assert.equal(result.errorCode, 'NO_DOCUMENTS_IN_PERIOD');
});

test('creates export batch from eligible documents only', async () => {
  let exportItemPayloadCount = 0;

  gstDb.gstDocument.findMany = async () => [
    {
      id: 'doc-1',
      documentType: 'TAX_INVOICE',
      documentNumber: 'INV-001',
      documentDate: new Date('2026-04-10T00:00:00.000Z'),
      status: 'ISSUED',
      supplyType: 'B2C',
      placeOfSupplyStateCode: '27',
      isInterstate: false,
      taxableAmount: '1000.00',
      cgstAmount: '90.00',
      sgstAmount: '90.00',
      igstAmount: '0.00',
      cessAmount: '0.00',
      totalAmount: '1180.00',
      lines: [{ lineNumber: 1 }],
      gstSettingsId: 'gst-settings-1',
    },
    {
      id: 'doc-2',
      documentType: 'TAX_INVOICE',
      documentNumber: 'INV-002',
      documentDate: new Date('2026-04-11T00:00:00.000Z'),
      status: 'DRAFT',
      taxableAmount: '500.00',
      cgstAmount: '45.00',
      sgstAmount: '45.00',
      igstAmount: '0.00',
      cessAmount: '0.00',
      totalAmount: '590.00',
      lines: [{ lineNumber: 1 }],
      gstSettingsId: 'gst-settings-1',
    },
  ] as never;

  gstDb.$transaction = async (fn) =>
    fn({
      ...gstDb,
      gstExport: {
        ...gstDb.gstExport,
        create: async () => ({ id: 'export-1', exportType: 'invoice_register', status: 'GENERATED' }),
      },
      gstExportItem: {
        ...gstDb.gstExportItem,
        createMany: async ({ data }) => {
          exportItemPayloadCount = Array.isArray(data) ? data.length : 0;
          return { count: exportItemPayloadCount };
        },
      },
    } as never);

  gstDb.gstAuditLog.create = async () => ({ id: 'audit-1' });

  const result = await prepareGstExport({
    gstSettingsId: 'gst-settings-1',
    exportType: 'invoice_register',
    periodStart: new Date('2026-04-01T00:00:00.000Z'),
    periodEnd: new Date('2026-04-30T00:00:00.000Z'),
  });

  assert.equal(result.ok, true);
  assert.equal(result.data?.itemCount, 1);
  assert.equal(exportItemPayloadCount, 1);
});

test('returns invalid period for malformed period input', async () => {
  const result = await prepareGstExport({
    gstSettingsId: 'gst-settings-1',
    exportType: 'invoice_register',
    periodStart: new Date('not-a-date'),
    periodEnd: new Date('2026-04-30T00:00:00.000Z'),
  });

  assert.equal(result.ok, false);
  assert.equal(result.errorCode, 'INVALID_PERIOD');
});

test('returns unsupported document states when no eligible states exist', async () => {
  gstDb.gstDocument.findMany = async () => [
    {
      id: 'doc-1',
      documentType: 'TAX_INVOICE',
      documentNumber: 'INV-001',
      documentDate: new Date('2026-04-10T00:00:00.000Z'),
      status: 'DRAFT',
      taxableAmount: '1000.00',
      cgstAmount: '90.00',
      sgstAmount: '90.00',
      igstAmount: '0.00',
      cessAmount: '0.00',
      totalAmount: '1180.00',
      gstSettingsId: 'gst-settings-1',
    },
  ] as never;

  const result = await prepareGstExport({
    gstSettingsId: 'gst-settings-1',
    exportType: 'invoice_register',
    periodStart: new Date('2026-04-01T00:00:00.000Z'),
    periodEnd: new Date('2026-04-30T00:00:00.000Z'),
  });

  assert.equal(result.ok, false);
  assert.equal(result.errorCode, 'UNSUPPORTED_DOCUMENT_STATES');
});

test('returns persistence failure when export batch creation fails', async () => {
  gstDb.gstDocument.findMany = async () => [
    {
      id: 'doc-1',
      documentType: 'TAX_INVOICE',
      documentNumber: 'INV-001',
      documentDate: new Date('2026-04-10T00:00:00.000Z'),
      status: 'ISSUED',
      taxableAmount: '1000.00',
      cgstAmount: '90.00',
      sgstAmount: '90.00',
      igstAmount: '0.00',
      cessAmount: '0.00',
      totalAmount: '1180.00',
      gstSettingsId: 'gst-settings-1',
    },
  ] as never;

  gstDb.$transaction = async () => {
    throw new Error('db write failure');
  };

  const result = await prepareGstExport({
    gstSettingsId: 'gst-settings-1',
    exportType: 'invoice_register',
    periodStart: new Date('2026-04-01T00:00:00.000Z'),
    periodEnd: new Date('2026-04-30T00:00:00.000Z'),
  });

  assert.equal(result.ok, false);
  assert.equal(result.errorCode, 'EXPORT_BATCH_PERSISTENCE_FAILED');
});
