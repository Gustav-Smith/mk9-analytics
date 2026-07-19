export interface IndustryCandidate {
  code: string;
  name: string;
  normalizedName: string;
  active: boolean;
  isValid: boolean;
  errors: string[];
  deduplicationKey: string;
  originalData: Record<string, unknown>;
}
