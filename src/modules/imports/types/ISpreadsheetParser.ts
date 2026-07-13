// src/modules/imports/types/ISpreadsheetParser.ts
export interface ISpreadsheetParser {
  parse(file: File): Promise<any>;
}