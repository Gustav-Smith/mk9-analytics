import type { StoreCandidate } from '../mapping/store/StoreCandidate';
import type { IndustryCandidate } from '../mapping/industry/IndustryCandidate';
import type { PromoterCandidate } from '../mapping/promoter/PromoterCandidate';
import type { VisitCandidate } from '../mapping/visit/VisitCandidate';

export interface PersistencePlan {
  storesToCreate: StoreCandidate[];
  storesToUpdate: StoreCandidate[];
  industriesToCreate: IndustryCandidate[];
  industriesToUpdate: IndustryCandidate[];
  promotersToCreate: PromoterCandidate[];
  promotersToUpdate: PromoterCandidate[];
  visitsToCreate: VisitCandidate[];
  visitsToUpdate: VisitCandidate[];
}
