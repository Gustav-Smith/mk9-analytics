export function collapseSpaces(text: string | null | undefined): string {
  if (text === null || text === undefined) return '';
  return String(text)
    .trim()
    .replace(/\s+/g, ' ');
}
