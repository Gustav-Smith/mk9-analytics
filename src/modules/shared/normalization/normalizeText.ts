import { collapseSpaces } from './collapseSpaces';
import { removeAccents } from './removeAccents';

export function normalizeText(
  text: string | null | undefined,
  options: { removeAccents?: boolean } = {}
): string {
  if (text === null || text === undefined) return '';
  let result = collapseSpaces(text).toUpperCase();
  if (options.removeAccents) {
    result = removeAccents(result);
  }
  return result;
}
