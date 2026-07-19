export interface StoreCandidate {
  code: string;
  name: string;
  chain: string | null;
  city: string | null;
  state: string | null; // Representa UF / Estado
  neighborhood: string | null; // Representa Bairro
  isValid: boolean;
  errors: string[];
  deduplicationKey: string;
  originalData: Record<string, unknown>;
}
