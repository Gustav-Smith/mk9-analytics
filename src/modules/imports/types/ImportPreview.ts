// src/modules/imports/types/ImportPreview.ts
import { SpreadsheetType } from './SpreadsheetType';

export type NormalizedImportRow = Record<string, unknown>;

export interface ImportValidationError {
  row: number;
  message: string;
  data?: NormalizedImportRow;
}

export interface ImportFileMetadata {
  name: string;
  size: number;
  type: string;
}

export interface ImportPreview {
  success: true;
  importId: string;
  file: ImportFileMetadata;
  sheets: string[];
  detectedType: SpreadsheetType;
  columns: string[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  sample: NormalizedImportRow[];
  /** Kept for compatibility with the existing interface. */
  previewData: NormalizedImportRow[];
  errors: ImportValidationError[];
  warnings: string[];
}
