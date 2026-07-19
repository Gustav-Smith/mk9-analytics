export interface VisitGroupInput {
  scheduledDate: Date;
  store?: { code: string } | null;
  industry?: { code: string } | null;
  promoter?: { name: string } | null;
}

export function groupExistingVisits<T extends VisitGroupInput>(
  visits: T[]
): Map<string, T[]> {
  const existingVisitsGrouped = new Map<string, T[]>();

  for (const visit of visits) {
    const storeCode = visit.store?.code || '';
    const industryCode = visit.industry?.code || '';
    const promoterName = visit.promoter?.name?.toUpperCase() || 'NO_PROMOTER';
    const key = `${storeCode}-${industryCode}-${promoterName}`;

    if (!existingVisitsGrouped.has(key)) {
      existingVisitsGrouped.set(key, []);
    }
    existingVisitsGrouped.get(key)!.push(visit);
  }

  // Ordenar visitas por data (crescente)
  for (const list of existingVisitsGrouped.values()) {
    list.sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
  }

  return existingVisitsGrouped;
}
