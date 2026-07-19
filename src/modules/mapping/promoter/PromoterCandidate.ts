export interface PromoterCandidate {
  name: string;
  normalizedName: string;
  supervisor: string | null;
  active: boolean;
  isValid: boolean;
  errors: string[];
  deduplicationKey: string;
  originalData: Record<string, unknown>;
}
