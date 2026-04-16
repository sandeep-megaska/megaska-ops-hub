import test from 'node:test'
import assert from 'node:assert/strict'

import { syncOrdersByDateRange } from './order-sync.ts'
import { generateInvoiceBatch } from './dispatch-batch.ts'
import { previewBulkProductTaxMappings } from './product-tax-bulk.ts'
import { gstDb } from './db.ts'

const originalFindMany = gstDb.gstOrderImportLine.findMany
const originalHsnFindUnique = gstDb.gstHsnCode.findUnique
const originalHsnSlabFindFirst = gstDb.gstHsnSlabMap.findFirst
const originalMapFindFirst = gstDb.gstProductTaxMap.findFirst

test.afterEach(() => {
  gstDb.gstOrderImportLine.findMany = originalFindMany
  gstDb.gstHsnCode.findUnique = originalHsnFindUnique
  gstDb.gstHsnSlabMap.findFirst = originalHsnSlabFindFirst
  gstDb.gstProductTaxMap.findFirst = originalMapFindFirst
})

test('order sync validates date range', async () => {
  const result = await syncOrdersByDateRange({
    from: '2026-04-16',
    to: '2026-04-01',
  })

  assert.equal(result.ok, false)
  assert.equal(result.error, 'from must be less than or equal to to')
})

test('invoice batch validates orderImportIds', async () => {
  const result = await generateInvoiceBatch({ orderImportIds: [] })
  assert.equal(result.ok, false)
  assert.equal(result.error, 'orderImportIds[] is required')
})

test('bulk preview returns duplicates and unknown sku rows', async () => {
  gstDb.gstOrderImportLine.findMany = async ({ where }) => {
    const sku = String((where as { sku?: string }).sku || '')
    if (sku === 'KNOWN-1') {
      return [{ shopifyProductId: '100', shopifyVariantId: '200', title: 'Known Product', sku: 'KNOWN-1', updatedAt: new Date() }]
    }
    return []
  }

  gstDb.gstHsnCode.findUnique = async ({ where }) => {
    if ((where as { hsnCode?: string }).hsnCode === '6109') {
      return { id: 'hsn-1', hsnCode: '6109' }
    }
    return null
  }

  gstDb.gstHsnSlabMap.findFirst = async () => ({ slabId: 'slab-1' })
  gstDb.gstProductTaxMap.findFirst = async () => null

  const result = await previewBulkProductTaxMappings([
    { sku: 'KNOWN-1', hsnCode: '6109' },
    { sku: 'KNOWN-1', hsnCode: '6109' },
    { sku: 'UNKNOWN-2', hsnCode: '6109' },
  ])

  assert.equal(result.ok, true)
  assert.equal(result.data?.duplicateCount, 1)
  assert.equal(result.data?.unmatchedCount, 1)
  assert.equal(result.data?.matchedCount, 2)
})
