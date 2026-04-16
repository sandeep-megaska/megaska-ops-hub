# Phase 1 B2C GST Roadmap + Implementation Skeleton

## 1) Phase 1 B2C roadmap (prioritized order)

### P0 — Foundation and safe additive schema
Build first so all later flows rely on explicit, versionable GST entities instead of ad-hoc metadata.

1. Add additive schema for:
   - HSN master + tax slabs
   - product/variant GST mapping
   - GST order import snapshot + status lifecycle
   - invoice template settings/assets
   - export run registry + generated file metadata
2. Add service layer skeletons with strict backend-owned logic (no tax or compliance logic in UI).
3. Add API contracts for each new GST area; keep response style aligned with existing `{ ok, data/error }` patterns.

### P1 — Products mapping (unblocks all invoice/report quality)
Build second because invoice correctness starts from product tax mapping.

1. Products page for HSN + slab mapping at product/variant level.
2. Unmapped product detection endpoint + UI highlighting.
3. CSV import/export for bulk mapping operations.
4. Mapping inheritance strategy: variant override > product default > unresolved.

### P2 — Orders import/sync and GST order worklist
Build third because invoice/note generation should run on curated GST snapshots, not raw storefront records.

1. Import/sync pipeline from Shopify-linked orders into GST snapshot table.
2. GST-eligible order list with status transitions:
   - `IMPORTED`
   - `INVOICE_READY`
   - `INVOICED`
   - `NOTE_ISSUED`
3. Backend-only readiness checks (mapping completeness, address/state availability, amount sanity).

### P3 — Templates and PDF preparation
Build fourth to support business requirement for beautiful branded output.

1. Template CRUD (header/footer/logo/declaration/note fields).
2. Template resolution strategy (active default + optional channel override).
3. PDF preview endpoint backed by prepared payload snapshots.

### P4 — Reports and accountant exports
Build fifth after stable mapping/order/doc generation exists.

1. CSV/Excel export generator for:
   - B2C sales register
   - credit/debit note register
   - HSN summary
   - monthly/periodic summary
2. Export history with status, filters, file links, and checksum metadata.

---

## 2) Proposed models/entities (additive)

> Extend `prisma/schema.prisma` with new GST-focused models only. Do not modify old migrations; create new additive migration(s).

### A. HSN + slab master

#### `GstHsnCode`
- `id` (uuid)
- `hsnCode` (string, unique)
- `description` (string)
- `isService` (boolean, default false)
- `isActive` (boolean)
- `effectiveFrom`, `effectiveTo` (date nullable)
- `metadata` (json)
- timestamps

#### `GstTaxSlab`
- `id` (uuid)
- `slabCode` (string unique; e.g., `GST_5`, `GST_12`)
- `taxRate` (decimal 5,2)
- `cessRate` (decimal 5,2 default 0)
- `isActive` (boolean)
- `effectiveFrom`, `effectiveTo`
- timestamps

#### `GstHsnSlabMap`
- `id` (uuid)
- `hsnId` (FK `GstHsnCode`)
- `slabId` (FK `GstTaxSlab`)
- `effectiveFrom`, `effectiveTo`
- `priority` (int, default 0)
- timestamps
- unique index on active window tuple

### B. Product/variant mapping

#### `GstProductTaxMap`
- `id` (uuid)
- `shopifyProductId` (string indexed)
- `shopifyVariantId` (string nullable indexed)
- `hsnId` (FK `GstHsnCode`)
- `slabId` (FK `GstTaxSlab`)
- `source` (enum/string: `MANUAL`, `CSV_IMPORT`, `AUTO_INHERIT`)
- `status` (enum/string: `MAPPED`, `UNMAPPED`, `REVIEW_REQUIRED`)
- `effectiveFrom`, `effectiveTo`
- `lastValidatedAt` (datetime nullable)
- `metadata` (json)
- timestamps
- unique indexes:
  - (`shopifyVariantId`) where not null
  - (`shopifyProductId`, `shopifyVariantId`) depending on Prisma constraints strategy

### C. GST order import snapshot

#### `GstOrderImport`
- `id` (uuid)
- `gstSettingsId` (FK existing `GstSettings`)
- `shopifyOrderId` (string unique)
- `shopifyOrderName` (string indexed)
- `orderCreatedAt` (datetime)
- `orderCurrency` (string)
- `orderSubtotal`, `orderTaxTotal`, `orderGrandTotal` (decimal)
- `shippingStateCode`, `billingStateCode` (string nullable)
- `importStatus` (enum/string: `IMPORTED`, `INVOICE_READY`, `INVOICED`, `NOTE_ISSUED`, `FAILED`)
- `eligibilityStatus` (enum/string: `ELIGIBLE`, `NOT_ELIGIBLE`, `REVIEW_REQUIRED`)
- `readinessErrors` (json array)
- `snapshot` (json) // immutable order payload snapshot used for documents
- `lastSyncedAt`
- timestamps

#### `GstOrderImportLine`
- `id` (uuid)
- `gstOrderImportId` (FK)
- `lineNumber`
- `shopifyLineItemId`
- `shopifyProductId`, `shopifyVariantId`
- `title`, `sku`
- `quantity`, `unitPrice`, `discount`, `taxableAmount`
- `mappedHsnCode`, `mappedTaxRate`, `mappedCessRate`
- `mappingStatus` (`MAPPED`/`UNMAPPED`)
- timestamps

### D. Template entities

#### `GstInvoiceTemplate`
- `id` (uuid)
- `gstSettingsId` (FK)
- `templateName`
- `isActive` (boolean)
- `isDefault` (boolean)
- `headerText` (text nullable)
- `footerText` (text nullable)
- `declarationText` (text nullable)
- `notesText` (text nullable)
- `logoFileUrl` (string nullable)
- `themeConfig` (json; colors/font/layout)
- `version` (int)
- timestamps

#### `GstInvoiceTemplatePreview`
- `id` (uuid)
- `templateId` (FK)
- `sampleOrderImportId` (FK nullable)
- `previewPayload` (json)
- `previewPdfUrl` (string nullable)
- timestamps

### E. Reports/export run entities

#### `GstReportRun`
- `id` (uuid)
- `gstSettingsId` (FK)
- `reportType` (enum/string: `B2C_SALES_REGISTER`, `NOTE_REGISTER`, `HSN_SUMMARY`, `PERIOD_SUMMARY`)
- `periodStart`, `periodEnd`
- `format` (`CSV`/`XLSX`)
- `status` (`QUEUED`/`GENERATED`/`FAILED`)
- `filters` (json)
- `fileUrl` (string nullable)
- `checksum` (string nullable)
- `rowCount` (int)
- `generatedAt` (datetime nullable)
- `errorMessage` (string nullable)
- timestamps

#### `GstReportRunItem` (optional for traceability)
- `id` (uuid)
- `reportRunId` (FK)
- `sourceType` (`DOCUMENT`/`ORDER_IMPORT`)
- `sourceId`
- `payload` (json)
- `rowNumber`

---

## 3) Proposed backend services (skeleton)

Create new modules under `services/gst/` and keep logic backend-first.

### `services/gst/product-tax-map.ts`
Responsibilities:
- Resolve mapping for product/variant (with inheritance).
- Validate HSN/slab compatibility.
- Detect unmapped catalog rows.
- Bulk upsert from CSV parsed input.

Key APIs:
- `listProductTaxMappings(filters)`
- `upsertProductTaxMapping(input)`
- `bulkUpsertProductTaxMappings(rows)`
- `listUnmappedProducts(filters)`
- `resolveLineTaxMapping({ shopifyProductId, shopifyVariantId })`

### `services/gst/hsn.ts`
Responsibilities:
- Manage HSN and slab masters.
- Effective-dated slab resolution.

Key APIs:
- `listHsnCodes()` / `upsertHsnCode()`
- `listTaxSlabs()` / `upsertTaxSlab()`
- `assignSlabToHsn()`
- `resolveApplicableSlab(hsnCode, asOfDate)`

### `services/gst/order-import.ts`
Responsibilities:
- Import/sync Shopify-linked orders into GST snapshots.
- Compute eligibility and readiness status.
- Maintain transitions to invoiced/note-issued states.

Key APIs:
- `importOrderByShopifyId(orderId)`
- `syncOrderRange({ from, to })`
- `listImportedOrders(filters)`
- `getImportedOrderDetail(id)`
- `markOrderInvoiced({ gstOrderImportId, gstDocumentId })`
- `markOrderNoteIssued({ gstOrderImportId, gstDocumentId })`

### `services/gst/template.ts`
Responsibilities:
- Template CRUD.
- Active template resolution per GST settings.
- Payload builder for PDF renderer.

Key APIs:
- `createTemplate(input)` / `updateTemplate(id, patch)` / `listTemplates()`
- `setDefaultTemplate(id)`
- `resolveTemplateForOrder({ gstSettingsId, orderImportId })`
- `buildTemplatePreviewPayload(input)`

### `services/gst/pdf-prep.ts`
Responsibilities:
- Compose invoice/note rendering payload by merging document + order snapshot + template.
- Keep rendering deterministic for compliance and audit.

Key APIs:
- `prepareInvoicePdfPayload({ gstDocumentId })`
- `prepareNotePdfPayload({ gstDocumentId })`
- `prepareTemplatePreviewPdf({ templateId, orderImportId? })`

### `services/gst/report-export.ts`
Responsibilities:
- Build CSV/XLSX datasets for accountant workflows.
- Persist report run history.

Key APIs:
- `generateReportRun(input)`
- `getReportRun(id)`
- `listReportRuns(filters)`
- `downloadReportFile(id)`

### `services/gst/status-machine.ts` (small helper)
Responsibilities:
- Enforce allowed status transitions for `GstOrderImport.importStatus`.

---

## 4) Proposed routes (intent-level skeleton)

Use `app/api/gst/...` conventions, `runtime = "nodejs"`, and existing `NextRequest/NextResponse` style.

### Products mapping
- `GET /api/gst/products/mappings`
  - list mappings with filters (`status`, `productId`, `search`, pagination)
- `POST /api/gst/products/mappings`
  - create/update one mapping
- `POST /api/gst/products/mappings/bulk-import`
  - ingest parsed CSV rows, return per-row result summary
- `GET /api/gst/products/mappings/export`
  - export current mapping matrix CSV
- `GET /api/gst/products/unmapped`
  - list unmapped products/variants

### HSN/slab masters
- `GET /api/gst/hsn`
- `POST /api/gst/hsn`
- `GET /api/gst/tax-slabs`
- `POST /api/gst/tax-slabs`
- `POST /api/gst/hsn/{hsnId}/slabs`

### Orders import/sync
- `POST /api/gst/orders/import`
  - import one order or date range sync kickoff
- `POST /api/gst/orders/sync`
  - explicit re-sync for existing imported orders
- `GET /api/gst/orders`
  - list GST-imported orders and statuses
- `GET /api/gst/orders/{id}`
  - full snapshot + readiness diagnostics

### PDF actions
- `POST /api/gst/orders/{id}/invoice/draft`
  - create draft invoice from imported order snapshot
- `POST /api/gst/orders/{id}/note/draft`
  - create draft note from imported order snapshot
- `GET /api/gst/orders/{id}/invoice/pdf`
- `GET /api/gst/orders/{id}/note/pdf`

### Templates
- `GET /api/gst/templates`
- `POST /api/gst/templates`
- `GET /api/gst/templates/{id}`
- `PATCH /api/gst/templates/{id}`
- `POST /api/gst/templates/{id}/set-default`
- `POST /api/gst/templates/{id}/preview`

### Reports/exports
- `POST /api/gst/reports/exports`
  - generate report file for period + type + format
- `GET /api/gst/reports/exports`
  - list export history
- `GET /api/gst/reports/exports/{id}`
- `GET /api/gst/reports/exports/{id}/download`

---

## 5) Proposed admin pages/components (thin frontend)

Add under `app/admin/gst/` + `components/gst/` following current console style.

### Products page — `/admin/gst/products`
Sections/components:
- `GstProductMappingToolbar` (filters/search/import/export actions)
- `GstProductMappingTable` (product, variant, HSN, slab, status)
- `GstMappingEditorDrawer` (single-row edit)
- `GstUnmappedProductsPanel` (priority queue)
- `GstMappingBulkImportDialog` (upload CSV + result summary)

Workflow notes:
- All writes call backend APIs; UI does no tax calculation.
- Table row badges from backend status.

### Orders page — `/admin/gst/orders`
Sections/components:
- `GstOrderImportControls` (import by order id/date range, sync)
- `GstOrderListTable` (status, totals, mapping completeness)
- `GstOrderDetailPanel` (snapshot lines + readiness checks)
- row actions: `Create Draft Invoice`, `Create Draft Note`, `Download PDF`

Workflow notes:
- status badges are API-driven.
- readiness/error messages returned from backend `readinessErrors`.

### Templates page — `/admin/gst/templates`
Sections/components:
- `GstTemplateList`
- `GstTemplateEditor` (header/footer/logo/declaration/notes/theme)
- `GstTemplatePreviewPane` (sample order selector + preview trigger)
- `Set as default` action

Workflow notes:
- Preview generated server-side from `pdf-prep` service.

### Reports page — `/admin/gst/reports`
Sections/components:
- `GstReportGeneratorForm` (type, period, format)
- `GstReportHistoryTable` (status, generatedAt, rowCount, download)
- optional `GstReportRunDetailDrawer` (filters + summary)

Workflow notes:
- generation may be async-ready later; Phase 1 can be synchronous with persisted run row.

---

## 6) Phase 1 B2C-only rules baked into design

1. Default/only supported supply type in these new flows: B2C retail compatible paths.
2. No mandatory buyer GSTIN capture in import/mapping/invoice readiness for Phase 1.
3. No IRN/e-invoicing dependency gates in generation path (existing optional flags remain untouched).
4. No B2B branch explosion in templates/reports; report types optimized for accountant-led B2C filing support.
5. Note generation kept generic for retail returns/adjustments without B2B onboarding complexity.

---

## 7) Deferred Phase 2+ items (intentionally out of scope now)

1. Full B2B workflows (buyer GSTIN validation as mandatory, place-of-supply branching per B2B rules).
2. E-invoicing/IRN lifecycle orchestration and portal integrations.
3. E-way bill integrations.
4. Multi-registration/multi-GSTIN tenant partitioning UX.
5. Deep reconciliation against GSTR-1/2A/2B APIs.
6. Automated filing assistance and rule engines for exception handling.
7. Template marketplace/multi-brand advanced theming.
8. Async job queue + retry orchestration for very high-volume export generation.

---

## 8) Files/modules to create or extend

### Extend (existing)
- `prisma/schema.prisma` (new additive models and enums only)
- `services/gst/types.ts` (new DTOs/enums for mappings, imports, templates, reports)
- `services/gst/constants.ts` (new statuses/report types)
- `app/admin/gst/page.tsx` (add links for products/orders/templates/reports pages)

### Create (new backend)
- `services/gst/hsn.ts`
- `services/gst/product-tax-map.ts`
- `services/gst/order-import.ts`
- `services/gst/template.ts`
- `services/gst/pdf-prep.ts`
- `services/gst/report-export.ts`
- `services/gst/status-machine.ts`

### Create (new API routes)
- `app/api/gst/products/mappings/route.ts`
- `app/api/gst/products/mappings/bulk-import/route.ts`
- `app/api/gst/products/mappings/export/route.ts`
- `app/api/gst/products/unmapped/route.ts`
- `app/api/gst/hsn/route.ts`
- `app/api/gst/tax-slabs/route.ts`
- `app/api/gst/hsn/[hsnId]/slabs/route.ts`
- `app/api/gst/orders/import/route.ts`
- `app/api/gst/orders/sync/route.ts`
- `app/api/gst/orders/route.ts`
- `app/api/gst/orders/[id]/route.ts`
- `app/api/gst/orders/[id]/invoice/draft/route.ts`
- `app/api/gst/orders/[id]/note/draft/route.ts`
- `app/api/gst/orders/[id]/invoice/pdf/route.ts`
- `app/api/gst/orders/[id]/note/pdf/route.ts`
- `app/api/gst/templates/route.ts`
- `app/api/gst/templates/[id]/route.ts`
- `app/api/gst/templates/[id]/set-default/route.ts`
- `app/api/gst/templates/[id]/preview/route.ts`
- `app/api/gst/reports/exports/route.ts`
- `app/api/gst/reports/exports/[id]/route.ts`
- `app/api/gst/reports/exports/[id]/download/route.ts`

### Create (new admin pages/components)
- `app/admin/gst/products/page.tsx`
- `app/admin/gst/orders/page.tsx`
- `app/admin/gst/templates/page.tsx`
- `app/admin/gst/reports/page.tsx`
- `components/gst/gst-product-mapping-toolbar.tsx`
- `components/gst/gst-product-mapping-table.tsx`
- `components/gst/gst-mapping-editor-drawer.tsx`
- `components/gst/gst-unmapped-products-panel.tsx`
- `components/gst/gst-mapping-bulk-import-dialog.tsx`
- `components/gst/gst-order-import-controls.tsx`
- `components/gst/gst-order-list-table.tsx`
- `components/gst/gst-order-detail-panel.tsx`
- `components/gst/gst-template-list.tsx`
- `components/gst/gst-template-editor.tsx`
- `components/gst/gst-template-preview-pane.tsx`
- `components/gst/gst-report-generator-form.tsx`
- `components/gst/gst-report-history-table.tsx`

---

## 9) Additive-only and non-GST safety confirmation

This plan is explicitly additive and GST-focused:
- no rebuild of existing GST core tables/services,
- no modification to old migrations,
- no DB reset assumptions,
- no changes proposed to OTP, account, bag, checkout, wallet, exchange, cancellation, issue reporting, notifications, or existing Shopify-connected non-GST flows.
