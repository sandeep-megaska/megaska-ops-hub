import type { GstServiceResult } from "./types";

export type GstReconcileMismatchCategory =
  | "MISSING_IN_BOOKS"
  | "MISSING_IN_SOURCE"
  | "DOCUMENT_TYPE_MISMATCH"
  | "DATE_MISMATCH"
  | "TOTAL_MISMATCH"
  | "STATUS_MISMATCH";

export interface GstReconcileRecord {
  documentNumber: string;
  documentType?: string;
  documentDate?: string;
  totalAmount?: number;
  status?: string;
}

export interface GstReconcileMismatch {
  documentNumber: string;
  category: GstReconcileMismatchCategory;
  books?: GstReconcileRecord;
  source?: GstReconcileRecord;
  message: string;
}

export interface GstReconcileSummary {
  matchedCount: number;
  mismatchedCount: number;
  missingInBooksCount: number;
  missingInSourceCount: number;
  categories: Record<GstReconcileMismatchCategory, number>;
}

function asKey(value: string | undefined): string {
  return String(value || "").trim().toUpperCase();
}

export function reconcileGstDocuments(
  booksDocuments: GstReconcileRecord[],
  sourceDocuments: GstReconcileRecord[],
): GstServiceResult<{ mismatches: GstReconcileMismatch[]; summary: GstReconcileSummary }> {
  const booksMap = new Map(booksDocuments.map((doc) => [asKey(doc.documentNumber), doc]));
  const sourceMap = new Map(sourceDocuments.map((doc) => [asKey(doc.documentNumber), doc]));
  const allKeys = new Set([...booksMap.keys(), ...sourceMap.keys()]);

  const mismatches: GstReconcileMismatch[] = [];
  const categories: GstReconcileSummary["categories"] = {
    MISSING_IN_BOOKS: 0,
    MISSING_IN_SOURCE: 0,
    DOCUMENT_TYPE_MISMATCH: 0,
    DATE_MISMATCH: 0,
    TOTAL_MISMATCH: 0,
    STATUS_MISMATCH: 0,
  };

  let matchedCount = 0;

  allKeys.forEach((key) => {
    const books = booksMap.get(key);
    const source = sourceMap.get(key);

    if (!books && source) {
      categories.MISSING_IN_BOOKS += 1;
      mismatches.push({
        documentNumber: source.documentNumber,
        category: "MISSING_IN_BOOKS",
        source,
        message: "Document exists in source payload but not in GST books",
      });
      return;
    }

    if (books && !source) {
      categories.MISSING_IN_SOURCE += 1;
      mismatches.push({
        documentNumber: books.documentNumber,
        category: "MISSING_IN_SOURCE",
        books,
        message: "Document exists in GST books but not in source payload",
      });
      return;
    }

    if (!books || !source) {
      return;
    }

    let hasMismatch = false;

    if (asKey(books.documentType) !== asKey(source.documentType)) {
      categories.DOCUMENT_TYPE_MISMATCH += 1;
      hasMismatch = true;
      mismatches.push({
        documentNumber: books.documentNumber,
        category: "DOCUMENT_TYPE_MISMATCH",
        books,
        source,
        message: "Document types do not match",
      });
    }

    if (String(books.documentDate || "") !== String(source.documentDate || "")) {
      categories.DATE_MISMATCH += 1;
      hasMismatch = true;
      mismatches.push({
        documentNumber: books.documentNumber,
        category: "DATE_MISMATCH",
        books,
        source,
        message: "Document dates do not match",
      });
    }

    const booksTotal = Number(books.totalAmount || 0).toFixed(2);
    const sourceTotal = Number(source.totalAmount || 0).toFixed(2);
    if (booksTotal !== sourceTotal) {
      categories.TOTAL_MISMATCH += 1;
      hasMismatch = true;
      mismatches.push({
        documentNumber: books.documentNumber,
        category: "TOTAL_MISMATCH",
        books,
        source,
        message: "Document totals do not match",
      });
    }

    if (asKey(books.status) !== asKey(source.status)) {
      categories.STATUS_MISMATCH += 1;
      hasMismatch = true;
      mismatches.push({
        documentNumber: books.documentNumber,
        category: "STATUS_MISMATCH",
        books,
        source,
        message: "Document status does not match",
      });
    }

    if (!hasMismatch) {
      matchedCount += 1;
    }
  });

  const summary: GstReconcileSummary = {
    matchedCount,
    mismatchedCount: mismatches.length,
    missingInBooksCount: categories.MISSING_IN_BOOKS,
    missingInSourceCount: categories.MISSING_IN_SOURCE,
    categories,
  };

  console.info("[GST RECO] Reconciliation comparison completed", {
    matchedCount: summary.matchedCount,
    mismatchedCount: summary.mismatchedCount,
    missingInBooksCount: summary.missingInBooksCount,
    missingInSourceCount: summary.missingInSourceCount,
  });

  return { ok: true, data: { mismatches, summary } };
}
