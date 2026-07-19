export function normalizeState(state: string | null | undefined): string {
  if (state === null || state === undefined) return '';
  return String(state).trim().toUpperCase();
}
