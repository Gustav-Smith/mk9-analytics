import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ImportsDashboardService } from '@/modules/imports/dashboard/ImportsDashboardService';
import { OperationsDashboardService } from '@/modules/operations/dashboard/OperationsDashboardService';
import { VisitsDashboardService } from '@/modules/visits/dashboard/VisitsDashboardService';
import { formatDatePtBr, importStatusLabels } from '@/lib/formatters';

export const dynamic = 'force-dynamic';

const operationStatus: Record<string, string> = { PLANNING: 'Planejamento', OPEN: 'Aberta', IN_PROGRESS: 'Em andamento', FINISHED: 'Finalizada', CANCELLED: 'Cancelada', ARCHIVED: 'Arquivada' };

export default async function DashboardPage() {
  const [operationData, visitData, importData] = await Promise.all([
    OperationsDashboardService.getDashboardData({}),
    VisitsDashboardService.getDashboardData({}),
    ImportsDashboardService.getDashboardData(),
  ]);
  const { operations, stats: operationStats } = operationData;
  const { visits, summary } = visitData;
  const recentImports = importData.imports.slice(0, 5);
  const activeOperations = operations.filter((item) => ['PLANNING', 'OPEN', 'IN_PROGRESS'].includes(item.status)).slice(0, 5);
  const cancelled = visits.filter((item) => item.status === 'CANCELADA').length;
  const distribution = [
    { label: 'Realizadas', value: summary.totalExecuted, color: 'bg-[#2f7d4a]' },
    { label: 'Planejadas', value: summary.totalPending, color: 'bg-[#3b6fa8]' },
    { label: 'Canceladas', value: cancelled, color: 'bg-[#b64242]' },
    { label: 'Cobertura', value: summary.coverage, color: 'bg-[#292928]', percent: true },
  ];
  const maxDistribution = Math.max(1, summary.totalPlanned);
  const attention = [
    ...operations.filter((item) => ['PLANNING', 'OPEN', 'IN_PROGRESS'].includes(item.status) && item.coverage < 50).map((item) => ({ key: `op-${item.id}`, title: item.name, detail: `Cobertura de ${item.coverage}%`, type: 'Operação' })),
    ...(summary.totalOverdue > 0 ? [{ key: 'overdue', title: `${summary.totalOverdue} visitas atrasadas`, detail: 'Planejamento com data vencida', type: 'Visitas' }] : []),
    ...recentImports.filter((item) => item.status === 'FAILED').map((item) => ({ key: `import-${item.id}`, title: item.nomeArquivo || 'Arquivo não identificado', detail: 'Falha no processamento', type: 'Importação' })),
  ].slice(0, 5);
  const promoterRanking = [...visits.reduce((map, visit) => {
    const current = map.get(visit.promoterName) ?? { name: visit.promoterName, total: 0, completed: 0 };
    current.total += 1;
    if (visit.status === 'REALIZADA') current.completed += 1;
    map.set(visit.promoterName, current);
    return map;
  }, new Map<string, { name: string; total: number; completed: number }>()).values()].sort((a, b) => b.completed - a.completed).slice(0, 5);

  return (
    <main className="mx-auto w-full max-w-[1440px] min-w-0 px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
      <header className="mb-7 flex flex-col justify-between gap-4 border-b border-[#deded9] pb-6 md:flex-row md:items-end">
        <div><p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#73736f]">Visão executiva</p><h1 className="text-2xl font-semibold tracking-[-0.025em] text-[#171716] md:text-[28px]">Centro de Operações</h1><p className="mt-1.5 text-sm text-[#6b6b66]">Visão consolidada da execução de campo e dos pontos que exigem atenção.</p></div>
        <Link href="/dashboard/imports" className="inline-flex items-center gap-1.5 self-start rounded-md bg-[#20201f] px-3.5 py-2 text-xs font-medium text-white hover:bg-black md:self-auto">Nova importação <ArrowUpRight className="h-3.5 w-3.5" /></Link>
      </header>

      <section aria-label="Resumo operacional" className="mb-6 grid overflow-hidden rounded-md border border-[#deded9] bg-white sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Metric label="Operações ativas" value={operationStats.activeCount} />
        <Metric label="Visitas planejadas" value={summary.totalPlanned} />
        <Metric label="Visitas realizadas" value={summary.totalExecuted} success />
        <Metric label="Visitas pendentes" value={summary.totalPending} />
        <Metric label="Cobertura geral" value={`${summary.coverage}%`} />
        <Metric label="Última importação válida" value={formatDatePtBr(importData.imports.find((item) => item.status === 'SUCCESS' || item.status === 'CONFIRMED')?.createdAt)} compact />
      </section>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
        <div className="min-w-0 space-y-6">
          <Panel title="Desempenho de visitas" description="Execução consolidada das visitas disponíveis">
            {summary.totalPlanned === 0 ? <Empty text="Ainda não há visitas para calcular o desempenho." /> : <div className="space-y-4 py-3">{distribution.map((item) => <div key={item.label} className="grid grid-cols-[88px_minmax(0,1fr)_44px] items-center gap-3"><span className="text-xs text-[#5f5f5b]">{item.label}</span><div className="h-2 overflow-hidden rounded-sm bg-[#efefec]"><div className={`h-full ${item.color}`} style={{ width: `${item.percent ? item.value : Math.round((item.value / maxDistribution) * 100)}%` }} /></div><span className="text-right font-mono text-xs text-[#292928]">{item.value}{item.percent ? '%' : ''}</span></div>)}</div>}
          </Panel>

          <Panel title="Operações em andamento" description="Operações abertas, em planejamento ou execução" action={<Link href="/dashboard/operacoes">Ver todas</Link>}>
            {activeOperations.length === 0 ? <Empty text="Nenhuma operação em andamento." /> : <div className="w-full overflow-x-auto"><table className="w-full min-w-[720px] text-left text-xs"><thead><tr className="border-b border-[#ecece8] text-[#7c7c77]"><Th>Operação</Th><Th>Lojas</Th><Th>Promotores</Th><Th>Planejadas</Th><Th>Realizadas</Th><Th>Cobertura</Th><Th>Status</Th></tr></thead><tbody className="divide-y divide-[#ecece8]">{activeOperations.map((item) => <tr key={item.id}><Td strong>{item.name}</Td><Td>{item.storesCount}</Td><Td>{item.promotersCount}</Td><Td>{item.visitsPlannedCount}</Td><Td>{item.visitsExecutedCount}</Td><Td><Coverage value={item.coverage} /></Td><Td>{operationStatus[item.status]}</Td></tr>)}</tbody></table></div>}
          </Panel>
        </div>

        <div className="min-w-0 space-y-6">
          <Panel title="Atenção operacional" description="Até cinco pontos prioritários">
            {attention.length === 0 ? <Empty text="Nenhum ponto crítico identificado." /> : <div className="divide-y divide-[#ecece8]">{attention.map((item) => <div key={item.key} className="py-3.5"><div className="flex items-center justify-between gap-3"><p className="truncate text-sm font-medium text-[#292928]">{item.title}</p><span className="shrink-0 text-[10px] font-medium text-[#a53737]">{item.type}</span></div><p className="mt-1 text-xs text-[#7c7c77]">{item.detail}</p></div>)}</div>}
          </Panel>
          <Panel title="Importações recentes" description="Últimos arquivos processados" action={<Link href="/dashboard/importacoes">Histórico</Link>}>
            {recentImports.length === 0 ? <Empty text="Nenhuma importação registrada." /> : <div className="divide-y divide-[#ecece8]">{recentImports.map((item) => <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-3.5"><div className="min-w-0"><p className="truncate text-sm font-medium text-[#292928]" title={item.nomeArquivo}>{item.nomeArquivo && item.nomeArquivo !== 'N/A' ? item.nomeArquivo : 'Arquivo não identificado'}</p><p className="mt-1 text-xs text-[#858580]">{formatDatePtBr(item.createdAt, true)} · {item.validRows} válidas · {item.invalidRows} inválidas</p></div><span className="text-[10px] text-[#696965]">{importStatusLabels[item.status] ?? item.status}</span></div>)}</div>}
          </Panel>
          <Panel title="Promotores" description="Ranking por visitas realizadas">
            {promoterRanking.length === 0 ? <Empty text="Sem visitas para compor o ranking." /> : <ol className="divide-y divide-[#ecece8]">{promoterRanking.map((item, index) => <li key={item.name} className="grid grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-2 py-3"><span className="font-mono text-xs text-[#9b9b96]">{String(index + 1).padStart(2, '0')}</span><span className="truncate text-sm font-medium text-[#292928]">{item.name}</span><span className="text-xs text-[#73736f]">{item.completed} realizadas{item.total > 0 ? ` · ${Math.round((item.completed / item.total) * 100)}%` : ''}</span></li>)}</ol>}
          </Panel>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value, compact = false, success = false }: { label: string; value: string | number; compact?: boolean; success?: boolean }) { return <div className="border-b border-r border-[#e7e7e3] p-4 last:border-r-0 xl:border-b-0"><p className="text-[11px] text-[#73736f]">{label}</p><p className={`mt-2 font-semibold tracking-[-0.02em] ${compact ? 'text-sm' : 'text-2xl'} ${success ? 'text-[#2f7445]' : 'text-[#20201f]'}`}>{value}</p></div>; }
function Panel({ title, description, action, children }: { title: string; description: string; action?: React.ReactNode; children: React.ReactNode }) { return <section className="min-w-0 rounded-md border border-[#deded9] bg-white"><header className="flex items-start justify-between gap-4 border-b border-[#e7e7e3] px-5 py-4"><div><h2 className="text-sm font-semibold text-[#292928]">{title}</h2><p className="mt-0.5 text-xs text-[#858580]">{description}</p></div>{action && <div className="shrink-0 text-xs font-medium text-[#3b6fa8]">{action}</div>}</header><div className="min-w-0 px-5 py-2">{children}</div></section>; }
function Empty({ text }: { text: string }) { return <div className="py-8 text-center text-sm text-[#858580]">{text}</div>; }
function Coverage({ value }: { value: number }) { return <div className="flex min-w-[90px] items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden bg-[#ecece8]"><div className="h-full bg-[#292928]" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div><span className="w-8 text-right font-mono">{value}%</span></div>; }
function Th({ children }: { children: React.ReactNode }) { return <th className="px-3 py-3 font-medium first:pl-0 last:pr-0">{children}</th>; }
function Td({ children, strong = false }: { children: React.ReactNode; strong?: boolean }) { return <td className={`px-3 py-3.5 first:pl-0 last:pr-0 ${strong ? 'max-w-[220px] truncate font-medium text-[#292928]' : 'text-[#666661]'}`}>{children}</td>; }
