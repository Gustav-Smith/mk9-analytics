import { removeAccents } from './removeAccents';
import { collapseSpaces } from './collapseSpaces';

const SPECIAL_CHARS_MAP: Record<string, string> = {
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
  '⁰': '0',
};

export function canonicalize(text: string | null | undefined): string {
  if (text === null || text === undefined) return '';

  let result = String(text);

  // 1. Substituir caracteres especiais conhecidos
  for (const [key, value] of Object.entries(SPECIAL_CHARS_MAP)) {
    result = result.replace(new RegExp(key, 'g'), value);
  }

  // 2. Remover acentos
  result = removeAccents(result);

  // 3. Converter para uppercase
  result = result.toUpperCase();

  // 4. Remover pontuação (mantendo apenas letras, números e espaços)
  result = result.replace(/[^A-Z0-9\s]/g, '');

  // 5. Remover espaços extras
  result = collapseSpaces(result);

  return result;
}
