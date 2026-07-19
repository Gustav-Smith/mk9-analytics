import type { OperationStatus } from '@prisma/client';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDatePtBr } from '@/lib/formatters';
import type { OperationItem } from '@/modules/operations/dashboard/operations-dashboard.types';

const labels: Record<OperationStatus, string> = { PLANNING: 'Planejamento', OPEN: 'Aberta', IN_PROGRESS: 'Em andamento', FINISHED: 'Finalizada', CANCELLED: 'Cancelada', ARCHIVED: 'Arquivada' };

export function OperationsTable({ operations }: { operations: OperationItem[] }) {
  if (operations.length === 0) return <EmptyState title="Nenhuma operação encontrada" description="Ajuste os filtros ou aguarde o cadastro de uma operação." />;
  return (
    <section className="min-w-0 max-w-full overflow-hidden rounded-md border border-[#deded9] bg-white">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[920px] table-fixed text-left text-xs">
          <thead><tr className="border-b border-[#e7e7e3] text-[#74746f]"><Th className="w-[20%]">Operação</Th><Th className="w-[13%]">Cliente</Th><Th className="w-[12%]">Status</Th><Th>Lojas</Th><Th>Promotores</Th><Th>Planejadas</Th><Th>Realizadas</Th><Th className="w-[14%]">Cobertura</Th><Th className="w-[13%]">Atualização</Th></tr></thead>
          <tbody className="divide-y divide-[#ecece8]">{operations.map((item) => <tr key={item.id} className="hover:bg-[#fafaf8]"><Td strong truncate title={item.name}>{item.name}</Td><Td truncate title={item.clientId ?? undefined}>{item.clientId ?? 'Não disponível'}</Td><Td><Badge status={item.status} /></Td><Td>{item.storesCount}</Td><Td>{item.promotersCount}</Td><Td>{item.visitsPlannedCount}</Td><Td success>{item.visitsExecutedCount}</Td><Td><div className="flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden bg-[#ecece8]"><div className="h-full bg-[#292928]" style={{ width: `${Math.min(100, Math.max(0, item.coverage))}%` }} /></div><span className="font-mono">{item.coverage}%</span></div></Td><Td>{formatDatePtBr(item.updatedAt, true)}</Td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

function Badge({ status }: { status: OperationStatus }) { const problem = status === 'CANCELLED'; const success = status === 'FINISHED'; return <span className={`inline-flex rounded-sm border px-2 py-0.5 text-[10px] font-medium ${problem ? 'border-[#ead0d0] bg-[#fff8f8] text-[#a53737]' : success ? 'border-[#cde2d3] bg-[#f7fcf8] text-[#2f7445]' : 'border-[#d9d9d4] bg-[#fafaf9] text-[#62625e]'}`}>{labels[status]}</span>; }
function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) { return <th className={`px-3 py-3 font-medium first:pl-4 last:pr-4 ${className}`}>{children}</th>; }
function Td({ children, strong = false, success = false, truncate = false, title }: { children: React.ReactNode; strong?: boolean; success?: boolean; truncate?: boolean; title?: string }) { return <td title={title} className={`px-3 py-3.5 first:pl-4 last:pr-4 ${strong ? 'font-medium text-[#292928]' : success ? 'font-medium text-[#2f7445]' : 'text-[#666661]'} ${truncate ? 'truncate' : ''}`}>{children}</td>; }

export default OperationsTable;
