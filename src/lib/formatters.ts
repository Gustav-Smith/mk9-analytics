export function formatDatePtBr(value: Date | string | null | undefined, includeTime = false): string {
  if (!value) return 'Não disponível';
  if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}(?:,?\s+\d{2}:\d{2}(?::\d{2})?)?$/.test(value)) return value;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Não disponível';
  return includeTime ? date.toLocaleString('pt-BR') : date.toLocaleDateString('pt-BR');
}

export const importStatusLabels: Record<string, string> = {
  PROCESSING: 'Processando',
  PENDING: 'Pendente',
  SUCCESS: 'Concluída',
  COMPLETED: 'Concluída',
  FAILED: 'Com erro',
  EXPIRED: 'Expirada',
  CONFIRMED: 'Confirmada',
};
