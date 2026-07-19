import type { PromoterCandidate } from './PromoterCandidate';
import { normalizeText, canonicalize } from '@/modules/shared/normalization';

export interface PromoterImportRow {
  PROMOTOR?: string | null;
  NOME?: string | null;
  SUPERVISOR?: string | null;
}

export class PromoterMapper {
  static map(row: PromoterImportRow): PromoterCandidate | null {
    // PROMOTOR é opcional. Se não existir promotor, retornar null.
    const rawName = row.PROMOTOR !== undefined ? row.PROMOTOR : row.NOME;
    if (rawName === null || rawName === undefined || String(rawName).trim() === '') {
      return null;
    }

    // Mapear nome do promotor e supervisor
    const name = normalizeText(rawName);
    const supervisor = row.SUPERVISOR ? normalizeText(row.SUPERVISOR) : null;

    // Gerar normalizedName usando canonicalize()
    const normalizedName = canonicalize(rawName);

    // Gerar deduplicationKey
    const deduplicationKey = `NAME:${normalizedName}`;

    return {
      name,
      normalizedName,
      supervisor,
      active: true,
      isValid: true,
      errors: [],
      deduplicationKey,
      originalData: row as unknown as Record<string, unknown>,
    };
  }
}
