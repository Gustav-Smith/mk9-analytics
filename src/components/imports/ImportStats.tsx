import type { ImportsStatsData } from '@/modules/imports/dashboard/imports-dashboard.types';

export function ImportStats({ stats }: { stats: ImportsStatsData }) {
  const items = [['Total', stats.totalImports, 'Importações registradas'], ['Confirmadas', stats.confirmedCount, 'Concluídas ou confirmadas'], ['Pendentes', stats.pendingCount, 'Aguardando conclusão'], ['Com erro', stats.failedCount, 'Exigem revisão']] as const;
  return <section className="grid overflow-hidden rounded-md border border-[#deded9] bg-white sm:grid-cols-2 lg:grid-cols-4">{items.map(([label, value, note]) => <div key={label} className="border-b border-r border-[#e7e7e3] p-4 last:border-r-0 lg:border-b-0"><p className="text-[11px] text-[#73736f]">{label}</p><p className={`mt-2 text-2xl font-semibold tracking-[-0.02em] ${label === 'Com erro' && value > 0 ? 'text-[#a53737]' : label === 'Confirmadas' ? 'text-[#2f7445]' : 'text-[#20201f]'}`}>{value}</p><p className="mt-1 text-[10px] text-[#92928d]">{value === 0 ? `Nenhum registro · ${note}` : note}</p></div>)}</section>;
}
export default ImportStats;
