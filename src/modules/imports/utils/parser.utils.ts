import { ExcelReaderService } from '../services/ExcelReaderService';
import { parseCsv } from '../parsers/csvParser';

export enum FileType {
  EXCEL = 'excel',
  CSV = 'csv',
  UNKNOWN = 'unknown',
}

/**
 * Detects file type based on extension
 */
export function getFileType(fileName: string): FileType {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'xlsx':
    case 'xls':
      return FileType.EXCEL;
    case 'csv':
      return FileType.CSV;
    default:
      return FileType.UNKNOWN;
  }
}

/**
 * Parses spreadsheet data from ArrayBuffer based on file type
 * @param data - File content as ArrayBuffer
 * @param fileName - Original file name (used for type detection)
 * @returns Parsed data as array of rows (each row is array of cell values)
 */
export async function parseFile(data: ArrayBuffer, fileName: string): Promise<any[]> {
  const fileType = getFileType(fileName);
  switch (fileType) {
    case FileType.EXCEL:
      return await ExcelReaderService.readFileFromBuffer(Buffer.from(data));
    case FileType.CSV:
      return await parseCsv(data);
    default:
      throw new Error(`Unsupported file type: ${fileName}`);
  }
}