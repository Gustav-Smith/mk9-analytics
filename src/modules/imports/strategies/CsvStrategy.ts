import { prisma } from '../../../lib/prisma';
import { SpreadsheetType } from '../types/SpreadsheetType';
import { ImportStrategy } from '../types/ImportStrategy';
import { parseCsv } from '../parsers/csvParser';
import type { ImportValidationError, NormalizedImportRow } from '../types/ImportPreview';
import type { StrategyPreview } from '../types/ImportStrategy';

export class CsvStrategy implements ImportStrategy {
  async detectOrigin(): Promise<string> {
    return 'local-file';
  }

  async detectType(data: unknown[]): Promise<SpreadsheetType> {
    if (!data || data.length === 0) {
      return SpreadsheetType.DESCONHECIDO;
    }

    const headers = data[0] as string[];
    const headerString = headers.join(' ').toUpperCase();

    const typeKeywords: Record<SpreadsheetType, string[]> = {
      [SpreadsheetType.PROMOTORES]: ['NOME', 'CIDADE', 'ESTADO', 'SUPERVISOR'],
      [SpreadsheetType.LOJAS]: ['NOME', 'CODIGO', 'CIDADE', 'ESTADO', 'REDE'],
      [SpreadsheetType.INDUSTRIAS]: ['CODIGO', 'NOME'],
      [SpreadsheetType.ROTEIRO_PROMOTORES]: ['PROMOTOR', 'LOJA', 'DATA', 'HORA'],
      [SpreadsheetType.FREQUENCIA_LOJAS]: ['LOJA', 'DATA', 'FREQUENCIA'],
      [SpreadsheetType.CHECKLIST_INDUSTRIA]: ['INDUSTRIA', 'ITEM', 'STATUS'],
      [SpreadsheetType.DESCONHECIDO]: []
    };

    for (const [typeStr, keywords] of Object.entries(typeKeywords)) {
      const typeEnum = typeStr as SpreadsheetType;
      const match = keywords.every((keyword) => headerString.includes(keyword));
      if (match) {
        return typeEnum;
      }
    }

    return SpreadsheetType.DESCONHECIDO;
  }

  async parse(data: ArrayBuffer): Promise<unknown[]> {
    return await parseCsv(data);
  }

  async normalize(rawData: unknown[]): Promise<NormalizedImportRow[]> {
    if (!rawData || rawData.length === 0) {
      return [];
    }

    const headers = (rawData[0] as unknown[]).map((header) => String(header ?? ''));
    const dataRows = rawData.slice(1) as unknown[][];

    return dataRows.map((row) => {
      const obj: NormalizedImportRow = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
  }

  async validate(normalizedData: NormalizedImportRow[]): Promise<{ valid: NormalizedImportRow[]; errors: ImportValidationError[] }> {
    const valid: NormalizedImportRow[] = [];
    const errors: ImportValidationError[] = [];

    for (const [index, data] of normalizedData.entries()) {
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        valid.push(data);
      } else {
        errors.push({ row: index + 2, data, message: 'A linha não contém dados válidos.' });
      }
    }

    return { valid, errors };
  }

  async detectDuplicates(validData: NormalizedImportRow[]): Promise<{ unique: NormalizedImportRow[]; duplicates: NormalizedImportRow[] }> {
    const seen = new Set<string>();
    const unique: NormalizedImportRow[] = [];
    const duplicates: NormalizedImportRow[] = [];

    for (const data of validData) {
      const key = JSON.stringify(data);
      if (seen.has(key)) {
        duplicates.push(data);
      } else {
        seen.add(key);
        unique.push(data);
      }
    }

    return { unique, duplicates };
  }

  async generatePreview(uniqueData: NormalizedImportRow[], duplicates: NormalizedImportRow[], invalidRows = 0): Promise<StrategyPreview> {
    return {
      totalRows: uniqueData.length + duplicates.length,
      validRows: uniqueData.length,
      invalidRows,
      duplicateRows: duplicates.length,
      previewData: uniqueData.slice(0, 10),
    };
  }

  async persist(uniqueData: NormalizedImportRow[]): Promise<void> {
    console.log(`Would persist ${uniqueData.length} records to database`);
    // Actual implementation would use Prisma to create records based on spreadsheet type
  }

  async logHistory(importId: string, fileName: string, size: number, result: StrategyPreview): Promise<void> {
    await prisma.importFile.create({
      data: {
        fileName,
        fileHash: `${fileName}-${size}-${Date.now()}`,
        rowCount: result.totalRows,
        importId,
      },
    });

    await prisma.syncLog.create({
      data: {
        action: 'IMPORT_FILE',
        status: 'INFO',
        message: `Imported file ${fileName} with ${result.validRows} valid rows, ${result.invalidRows} invalid, ${result.duplicateRows} duplicates`,
        details: JSON.stringify({
          importFileId: 'placeholder',
          importId,
          fileName,
          validRows: result.validRows,
          invalidRows: result.invalidRows,
          duplicateRows: result.duplicateRows,
        }),
      },
    });
  }
}
