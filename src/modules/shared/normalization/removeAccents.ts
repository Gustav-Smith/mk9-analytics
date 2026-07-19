export function removeAccents(text: string | null | undefined): string {
  if (text === null || text === undefined) return '';
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
