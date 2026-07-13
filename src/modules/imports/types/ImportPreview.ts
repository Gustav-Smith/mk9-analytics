// src/modules/imports/types/ImportPreview.ts
export interface ImportPreview {
  headers: string[];
  rows: any[][]; // Consider using a more specific type if needed
  totalRows: number;
}