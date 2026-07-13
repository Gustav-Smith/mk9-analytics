// src/modules/imports/types/ExcelFile.ts
import { SpreadsheetType } from "./SpreadsheetType";

export interface ExcelFile {
  file: File;
  name: string;
  size: number;
  lastModified: number;
  type: string;
  preview?: any; // TODO: replace with proper type when implementing preview
  status: 'pending' | 'loading' | 'validating' | 'error' | 'imported';
  error?: string;
  detectedType?: SpreadsheetType;
}