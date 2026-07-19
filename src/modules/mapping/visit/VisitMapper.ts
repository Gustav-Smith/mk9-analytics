import type { VisitCandidate } from './VisitCandidate';
import { StoreMapper } from '../store/StoreMapper';
import { IndustryMapper } from '../industry/IndustryMapper';
import { PromoterMapper } from '../promoter/PromoterMapper';

export interface VisitImportRow {
  INDUSTRIA?: string | null;
  CODIGO_INDUSTRIA?: string | null;
  LOJA?: string | null;
  NOME_LOJA?: string | null;
  STORE?: string | null;
  CODIGO_LOJA?: string | null;
  CODIGO?: string | null;
  STORE_CODE?: string | null;
  CIDADE?: string | null;
  CITY?: string | null;
  UF?: string | null;
  ESTADO?: string | null;
  VISITA_SEMANAL?: unknown;
  VISITA_MENSAL?: unknown;
  PROMOTOR?: string | null;
  NOME?: string | null;
  SUPERVISOR?: string | null;
}

const parseNumber = (val: unknown): number | null => {
  if (val === null || val === undefined || String(val).trim() === '') return null;
  const num = Number(val);
  return Number.isInteger(num) && num > 0 ? num : null;
};

export class VisitMapper {
  static map(row: VisitImportRow): VisitCandidate[] {
    // Relacionar StoreCandidate, IndustryCandidate e PromoterCandidate
    const store = StoreMapper.map({
      CODIGO: row.CODIGO_LOJA || row.STORE_CODE || row.CODIGO || '',
      NOME: row.LOJA || row.NOME_LOJA || row.STORE || '',
      CIDADE: row.CIDADE || row.CITY || '',
      UF: row.UF || row.ESTADO || '',
    });

    const industry = IndustryMapper.map({
      CODIGO: row.CODIGO_INDUSTRIA || '',
      NOME: row.INDUSTRIA || '',
    });

    const promoter = PromoterMapper.map({
      PROMOTOR: row.PROMOTOR || row.NOME || '',
      SUPERVISOR: row.SUPERVISOR || '',
    });

    // Interpretar VISITA_SEMANAL e VISITA_MENSAL para gerar frequência
    const weekly = parseNumber(row.VISITA_SEMANAL);
    const monthly = parseNumber(row.VISITA_MENSAL);

    let frequency = 0;
    let frequencyType: 'WEEKLY' | 'MONTHLY' | 'NONE' = 'NONE';

    if (weekly !== null) {
      frequency = weekly * 4;
      frequencyType = 'WEEKLY';
    } else if (monthly !== null) {
      frequency = monthly;
      frequencyType = 'MONTHLY';
    }

    const candidates: VisitCandidate[] = [];

    // Gerar dias planejados (lista de candidatos a visitas)
    for (let i = 1; i <= frequency; i++) {
      // Gerar deduplicationKey determinística por slot de visita
      const promoterKey = promoter ? promoter.normalizedName : 'NO_PROMOTER';
      const deduplicationKey = `VISIT:${store.code || store.name}:${industry.code || industry.name}:${promoterKey}:${i}`;

      candidates.push({
        store,
        industry,
        promoter,
        frequency,
        frequencyType,
        plannedVisitIndex: i,
        deduplicationKey,
        originalData: row as unknown as Record<string, unknown>,
      });
    }

    return candidates;
  }
}
