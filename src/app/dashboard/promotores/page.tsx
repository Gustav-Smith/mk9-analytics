import { Search } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface PageProps { searchParams: Promise<{ q?: string; uf?: string; supervisor?: string }> }

export default async function PromotoresPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const promoters = await prisma.promoter.findMany({ include: { supervisor: true }, orderBy: { name: 'asc' } });
  const query = params.q?.trim().toLocaleLowerCase('pt-BR') ?? '';
  const uf = params.uf ?? '';
  const supervisor = params.supervisor ?? '';
  const states = [...new Set(promoters.map((item) => item.state).filter((item): item is string => Boolean(item)))].sort();
  const supervisors = [...new Set(promoters.map((item) => item.supervisor.name))].sort();
  const filtered = promoters.filter((item) => (!query || item.name.toLocaleLowerCase('pt-BR').includes(query)) && (!uf || item.state === uf) && (!supervisor || item.supervisor.name === supervisor));
  const field = 'h-9 min-w-0 rounded-md border border-[#d9d9d4] bg-white px-3 text-xs text-[#393937] outline-none focus:border-[#999994]';

  return <main className="mx-auto w-full max-w-[1440px] min-w-0 space-y-6 px-4 py-7 sm:px-6 lg:px-8 lg:py-9"><PageHeader category="Cadastros" title="Promotores" subtitle="Equipe de campo e respectivas supervisões." />
    <section className="grid overflow-hidden rounded-md border border-[#deded9] bg-white sm:grid-cols-[180px_1fr]"><div className="border-b border-r border-[#e7e7e3] p-4 sm:border-b-0"><p className="text-[11px] text-[#73736f]">Total de promotores</p><p className="mt-2 text-2xl font-semibold text-[#20201f]">{promoters.length}</p></div><form className="grid min-w-0 gap-2 p-3 sm:grid-cols-[minmax(180px,1fr)_120px_180px_auto]"><div className="relative min-w-0"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#92928d]" /><input name="q" defaultValue={params.q} placeholder="Buscar promotor" className={`${field} w-full pl-9`} /></div><select name="uf" defaultValue={uf} className={field}><option value="">Todas as UFs</option>{states.map((item) => <option key={item}>{item}</option>)}</select><select name="supervisor" defaultValue={supervisor} className={field}><option value="">Todos os supervisores</option>{supervisors.map((item) => <option key={item}>{item}</option>)}</select><div className="flex gap-2"><button className="h-9 rounded-md bg-[#20201f] px-4 text-xs font-medium text-white">Filtrar</button><a href="/dashboard/promotores" className="flex h-9 items-center rounded-md border border-[#d9d9d4] px-3 text-xs text-[#62625e]">Limpar</a></div></form></section>
    {filtered.length === 0 ? <EmptyState title="Nenhum promotor encontrado" description="Ajuste os filtros ou aguarde novos cadastros." /> : <section className="min-w-0 overflow-hidden rounded-md border border-[#deded9] bg-white"><Table className="min-w-[680px]"><TableHeader><TableRow><TableHead className="px-4 text-xs text-[#74746f]">Nome</TableHead><TableHead className="text-xs text-[#74746f]">Cidade</TableHead><TableHead className="text-xs text-[#74746f]">UF</TableHead><TableHead className="text-xs text-[#74746f]">Supervisor</TableHead></TableRow></TableHeader><TableBody>{filtered.map((item) => <TableRow key={item.id}><TableCell className="max-w-[260px] truncate px-4 text-xs font-medium text-[#292928]">{item.name}</TableCell><TableCell className="text-xs text-[#666661]">{item.city ?? 'Não disponível'}</TableCell><TableCell className="text-xs text-[#666661]">{item.state ?? 'Não disponível'}</TableCell><TableCell className="text-xs text-[#666661]">{item.supervisor.name}</TableCell></TableRow>)}</TableBody></Table></section>}
  </main>;
}
