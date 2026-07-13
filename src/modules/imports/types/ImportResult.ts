// src/modules/imports/types/ImportResult.ts
export interface ImportResult {
  success: boolean;
  message?: string;
  importedCount?: number;
  errors?: Array<{
    row: number;
    message: string;
  }>;
}