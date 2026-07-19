import type { StoreCandidate } from '../store/StoreCandidate';
import type { IndustryCandidate } from '../industry/IndustryCandidate';
import type { PromoterCandidate } from '../promoter/PromoterCandidate';
import type { VisitCandidate } from '../visit/VisitCandidate';

export interface OperationStatistics {
  totalStores: number;
  newStores: number;
  totalIndustries: number;
  totalPromoters: number;
  totalVisits: number;
  duplicatedStores: number;
  duplicatedIndustries: number;
  duplicatedPromoters: number;
  duplicatedVisits: number;
}

export interface OperationCandidate {
  stores: StoreCandidate[];
  industries: IndustryCandidate[];
  promoters: PromoterCandidate[];
  visits: VisitCandidate[];
  statistics: OperationStatistics;
}
