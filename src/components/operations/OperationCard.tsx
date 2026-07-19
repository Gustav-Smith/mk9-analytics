import type { OperationsStatsData } from '@/modules/operations/dashboard/operations-dashboard.types';

export function OperationCard({ stats }: { stats: OperationsStatsData }) {
  const items = [['Operações ativas', stats.activeCount], ['Finalizadas', stats.finishedCount], ['Arquivadas ou canceladas', stats.archivedCount]] as const;
  return <section className="grid overflow-hidden rounded-md border border-[#deded9] bg-white sm:grid-cols-3">{items.map(([label, value]) => <div key={label} className="border-b border-r border-[#e7e7e3] p-4 last:border-r-0 sm:border-b-0"><p className="text-[11px] text-[#73736f]">{label}</p><p className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[#20201f]">{value}</p></div>)}</section>;
}

export default OperationCard;
