import type { StoreCandidate } from './StoreCandidate';

export interface StoreImportRow {
  CODIGO: string;
  NOME: string;
  CIDADE: string;
  UF: string;
  REDE?: string | null;
  BAIRRO?: string | null;
}

function normalizeString(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .trim()
    .replace(/\s+/g, ' ');
}

function normalizeOptionalString(value: unknown): string | null {
  const normalized = normalizeString(value);
  return normalized === '' ? null : normalized;
}

export class StoreMapper {
  static map(row: StoreImportRow): StoreCandidate {
    // Apenas chaves canônicas da entrada previamente validada
    const name = normalizeString(row.NOME).toUpperCase();
    const code = normalizeString(row.CODIGO).toUpperCase();
    const chain = normalizeOptionalString(row.REDE)?.toUpperCase() ?? null;
    const city = normalizeString(row.CIDADE).toUpperCase();
    const state = normalizeString(row.UF).toUpperCase();
    const neighborhood = normalizeOptionalString(row.BAIRRO)?.toUpperCase() ?? null;

    // Chave para futura deduplicação baseada no código único da loja
    const deduplicationKey = `CODE:${code}`;

    return {
      code,
      name,
      chain,
      city,
      state,
      neighborhood,
      isValid: true,
      errors: [],
      deduplicationKey,
      originalData: row as unknown as Record<string, unknown>,
    };
  }
}
