import { EmptyState } from '@/components/ui/EmptyState';
import { formatDatePtBr } from '@/lib/formatters';
import type { VisitItem } from '@/modules/visits/dashboard/visits-dashboard.types';
import { VisitStatusBadge } from './VisitStatusBadge';

export function VisitsTable({ visits }: { visits: VisitItem[] }) {
  if (visits.length === 0) return <EmptyState title="Nenhuma visita encontrada" description="Ajuste os filtros ou aguarde novos roteiros." />;
  return <section className="min-w-0 max-w-full overflow-hidden rounded-md border border-[#deded9] bg-white"><div className="w-full overflow-x-auto"><table className="w-full min-w-[980px] table-fixed text-left text-xs"><thead><tr className="border-b border-[#e7e7e3] text-[#74746f]"><Th className="w-[12%]">Data planejada</Th><Th className="w-[15%]">Promotor</Th><Th className="w-[16%]">Loja</Th><Th className="w-[14%]">Indústria</Th><Th className="w-[16%]">Operação</Th><Th className="w-[10%]">Status</Th><Th>Foto</Th><Th>Checklist</Th></tr></thead><tbody className="divide-y divide-[#ecece8]">{visits.map((item) => <tr key={item.id} className="hover:bg-[#fafaf8]"><Td>{formatDatePtBr(item.scheduledDate)}</Td><Td strong title={item.promoterName}>{item.promoterName}</Td><Td title={item.storeName}>{item.storeName}</Td><Td title={item.industryName}>{item.industryName}</Td><Td title={item.operationName}>{item.operationName}</Td><Td><VisitStatusBadge status={item.status} /></Td><Td muted>Não disponível</Td><Td muted>Não disponível</Td></tr>)}</tbody></table></div></section>;
}
function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) { return <th className={`px-3 py-3 font-medium first:pl-4 last:pr-4 ${className}`}>{children}</th>; }
function Td({ children, strong = false, muted = false, title }: { children: React.ReactNode; strong?: boolean; muted?: boolean; title?: string }) { return <td title={title} className={`truncate px-3 py-3.5 first:pl-4 last:pr-4 ${strong ? 'font-medium text-[#292928]' : muted ? 'text-[#92928d]' : 'text-[#666661]'}`}>{children}</td>; }
export default VisitsTable;
