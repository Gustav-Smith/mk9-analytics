import type { StoreCandidate } from './StoreCandidate';
import { normalizeText, normalizeState } from '@/modules/shared/normalization';

export interface StoreImportRow {
  CODIGO: string;
  NOME: string;
  CIDADE: string;
  UF: string;
  REDE?: string | null;
  BAIRRO?: string | null;
}

function normalizeOptional(value: string | null | undefined): string | null {
  const result = normalizeText(value);
  return result === '' ? null : result;
}

export class StoreMapper {
  static map(row: StoreImportRow): StoreCandidate {
    // Utiliza a biblioteca compartilhada de normalização
    const name = normalizeText(row.NOME);
    const code = normalizeText(row.CODIGO);
    const chain = normalizeOptional(row.REDE);
    const city = normalizeText(row.CIDADE);
    const state = normalizeState(row.UF);
    const neighborhood = normalizeOptional(row.BAIRRO);

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
