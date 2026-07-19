import type { StoreCandidate } from '../store/StoreCandidate';
import type { IndustryCandidate } from '../industry/IndustryCandidate';
import type { PromoterCandidate } from '../promoter/PromoterCandidate';
import type { VisitCandidate } from '../visit/VisitCandidate';
import type { OperationCandidate, OperationStatistics } from './OperationCandidate';

function deduplicate<T extends { deduplicationKey: string }>(
  list: T[]
): { unique: T[]; duplicatedCount: number } {
  const seen = new Set<string>();
  const unique: T[] = [];
  let duplicatedCount = 0;

  for (const item of list) {
    if (!item || !item.deduplicationKey) continue;
    if (seen.has(item.deduplicationKey)) {
      duplicatedCount++;
    } else {
      seen.add(item.deduplicationKey);
      unique.push(item);
    }
  }

  return { unique, duplicatedCount };
}

export class OperationMapper {
  static map(
    stores: StoreCandidate[],
    industries: IndustryCandidate[],
    promoters: PromoterCandidate[],
    visits: VisitCandidate[]
  ): OperationCandidate {
    // Agrupar todos os candidatos e remover duplicidades por deduplicationKey
    const { unique: uniqueStores, duplicatedCount: duplicatedStores } = deduplicate(stores);
    const { unique: uniqueIndustries, duplicatedCount: duplicatedIndustries } = deduplicate(industries);
    const { unique: uniquePromoters, duplicatedCount: duplicatedPromoters } = deduplicate(promoters);
    const { unique: uniqueVisits, duplicatedCount: duplicatedVisits } = deduplicate(visits);

    // Calcular estatísticas da importação
    const statistics: OperationStatistics = {
      totalStores: uniqueStores.length,
      newStores: uniqueStores.length, // Banco não consultado, todas as únicas são candidatas a novas
      totalIndustries: uniqueIndustries.length,
      totalPromoters: uniquePromoters.length,
      totalVisits: uniqueVisits.length,
      duplicatedStores,
      duplicatedIndustries,
      duplicatedPromoters,
      duplicatedVisits,
    };

    return {
      stores: uniqueStores,
      industries: uniqueIndustries,
      promoters: uniquePromoters,
      visits: uniqueVisits,
      statistics,
    };
  }
}
