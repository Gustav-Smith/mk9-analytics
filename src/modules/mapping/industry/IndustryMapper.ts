import type { IndustryCandidate } from './IndustryCandidate';
import { normalizeText, canonicalize } from '@/modules/shared/normalization';

export interface IndustryImportRow {
  CODIGO: string;
  NOME: string;
}

export class IndustryMapper {
  static map(row: IndustryImportRow): IndustryCandidate {
    // Mapear nome da indústria
    const name = normalizeText(row.NOME);
    const code = normalizeText(row.CODIGO);

    // Gerar normalizedName usando canonicalize()
    const normalizedName = canonicalize(row.NOME);

    // Gerar deduplicationKey
    const deduplicationKey = code ? `CODE:${code}` : `NAME:${normalizedName}`;

    return {
      code,
      name,
      normalizedName,
      active: true,
      isValid: true,
      errors: [],
      deduplicationKey,
      originalData: row as unknown as Record<string, unknown>,
    };
  }
}
