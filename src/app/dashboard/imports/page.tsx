import ImportCard from '@/modules/imports/components/ImportCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { prisma } from '@/lib/prisma';
import { formatDatePtBr, importStatusLabels } from '@/lib/formatters';

export default async function ImportsPage() {
  const imports = await prisma.import.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { _count: { select: { files: true } } } });
  return <main className="mx-auto w-full max-w-[1440px] min-w-0 space-y-6 px-4 py-7 sm:px-6 lg:px-8 lg:py-9"><PageHeader category="Operação" title="Nova importação" subtitle="Envie arquivos CSV ou Excel para validação e preview." /><section className="rounded-md border border-[#deded9] bg-white p-5"><ImportCard /></section><section className="rounded-md border border-[#deded9] bg-white"><header className="border-b border-[#e7e7e3] px-5 py-4"><h2 className="text-sm font-semibold text-[#292928]">Importações recentes</h2><p className="mt-0.5 text-xs text-[#858580]">Últimos registros criados pelo fluxo de upload</p></header>{imports.length === 0 ? <p className="px-5 py-8 text-center text-sm text-[#858580]">Nenhuma importação registrada.</p> : <ul className="divide-y divide-[#ecece8] px-5">{imports.map((item) => <li key={item.id} className="flex items-center justify-between gap-4 py-3.5"><div className="min-w-0"><p className="truncate text-sm font-medium text-[#292928]">{item._count.files > 0 ? `${item._count.files} arquivo${item._count.files === 1 ? '' : 's'}` : 'Arquivo não identificado'}</p><p className="mt-1 text-xs text-[#858580]">{formatDatePtBr(item.createdAt, true)}</p></div><span className="text-xs text-[#666661]">{importStatusLabels[item.status] ?? item.status}</span></li>)}</ul>}</section></main>;
}
