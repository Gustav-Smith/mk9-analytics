import type { VisitsSummaryData } from '@/modules/visits/dashboard/visits-dashboard.types';

export function VisitsSummary({ summary }: { summary: VisitsSummaryData }) {
  const items = [['Planejadas', summary.totalPlanned], ['Realizadas', summary.totalExecuted], ['Pendentes', summary.totalPending], ['Atrasadas', summary.totalOverdue], ['Cobertura', `${summary.coverage}%`]] as const;
  return <section className="grid overflow-hidden rounded-md border border-[#deded9] bg-white sm:grid-cols-2 lg:grid-cols-5">{items.map(([label, value]) => <div key={label} className="border-b border-r border-[#e7e7e3] p-4 last:border-r-0 lg:border-b-0"><p className="text-[11px] text-[#73736f]">{label}</p><p className={`mt-2 text-2xl font-semibold tracking-[-0.02em] ${label === 'Realizadas' ? 'text-[#2f7445]' : label === 'Atrasadas' && summary.totalOverdue > 0 ? 'text-[#a53737]' : 'text-[#20201f]'}`}>{value}</p></div>)}</section>;
}
export default VisitsSummary;
