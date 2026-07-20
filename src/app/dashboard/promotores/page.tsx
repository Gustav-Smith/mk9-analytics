import React from 'react';
import { Search, ArrowLeft, Users } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { EmptyState } from '@/components/ui/EmptyState';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ q?: string; uf?: string; supervisor?: string }>;
}

export const dynamic = 'force-dynamic';

export default async function PromotoresPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const promoters = await prisma.promoter.findMany({
    include: { supervisor: true },
    orderBy: { name: 'asc' },
  });

  const query = params.q?.trim().toLocaleLowerCase('pt-BR') ?? '';
  const uf = params.uf ?? '';
  const supervisor = params.supervisor ?? '';

  const states = [...new Set(promoters.map((item) => item.state).filter((item): item is string => Boolean(item)))].sort();
  const supervisors = [...new Set(promoters.map((item) => item.supervisor.name))].sort();

  const filtered = promoters.filter(
    (item) =>
      (!query || item.name.toLocaleLowerCase('pt-BR').includes(query)) &&
      (!uf || item.state === uf) &&
      (!supervisor || item.supervisor.name === supervisor)
  );

  const fieldStyle =
    'h-9 min-w-0 rounded-lg border border-[#E4E4E7] bg-white px-3 text-xs font-semibold text-[#09090B] outline-none focus:border-[#A1A1AA] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]';

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6 md:p-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#F4F4F5]">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="p-1 hover:bg-[#F4F4F5] rounded-lg text-[#71717A] transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-wider">MK9 Analytics</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#09090B] tracking-tight mt-1">Equipe de Promotores</h1>
            <p className="text-xs font-semibold text-[#71717A] mt-0.5">
              Gestão de equipe de campo, cidades de atuação e vinculação com supervisores.
            </p>
          </div>
        </div>

        {/* Metric Bar & Filter Controls */}
        <section className="bg-white border border-[#F4F4F5] rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.01),_0_1px_2px_rgba(0,0,0,0.005)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 px-2 py-1 border-r border-[#F4F4F5] pr-6 shrink-0">
            <div className="p-2 bg-[#F4F4F5] rounded-xl text-[#09090B]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Total Promotores</p>
              <p className="text-xl font-black text-[#09090B] tracking-tight font-mono tabular-nums">{promoters.length}</p>
            </div>
          </div>

          <form className="flex-1 grid min-w-0 gap-2.5 sm:grid-cols-[minmax(180px,1fr)_120px_180px_auto]">
            <div className="relative min-w-0">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#A1A1AA]" />
              <input
                name="q"
                defaultValue={params.q}
                placeholder="Buscar promotor..."
                className={`${fieldStyle} w-full pl-9 placeholder-[#A1A1AA]`}
              />
            </div>
            <select name="uf" defaultValue={uf} className={fieldStyle}>
              <option value="">Todas as UFs</option>
              {states.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select name="supervisor" defaultValue={supervisor} className={fieldStyle}>
              <option value="">Todos os supervisores</option>
              {supervisors.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                className="h-9 rounded-lg bg-[#09090B] hover:bg-[#1F1F23] px-4 text-[11px] font-bold uppercase tracking-wider text-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.1)] active:scale-[0.98]"
              >
                Filtrar
              </button>
              <a
                href="/dashboard/promotores"
                className="flex h-9 items-center justify-center rounded-lg border border-[#E4E4E7] bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-[#71717A] hover:text-[#09090B] hover:bg-[#FAFAFA] transition-all"
              >
                Limpar
              </a>
            </div>
          </form>
        </section>

        {/* Table Section */}
        {filtered.length === 0 ? (
          <EmptyState
            title="Nenhum promotor encontrado"
            description="Ajuste os filtros de busca ou aguarde novos cadastros."
          />
        ) : (
          <section className="bg-white border border-[#F4F4F5] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.01),_0_1px_2px_rgba(0,0,0,0.005)] overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-[#F4F4F5]">
                    <th className="px-5 py-3.5 text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Nome</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Cidade</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">UF</th>
                    <th className="px-5 py-3.5 text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Supervisor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4F4F5]">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FAFAFA] transition-colors duration-150">
                      <td className="px-5 py-4 text-xs font-bold text-[#09090B] whitespace-nowrap">{item.name}</td>
                      <td className="px-5 py-4 text-xs font-semibold text-[#71717A] whitespace-nowrap">{item.city ?? 'Não disponível'}</td>
                      <td className="px-5 py-4 text-xs font-bold text-[#3F3F46] font-mono whitespace-nowrap">{item.state ?? '—'}</td>
                      <td className="px-5 py-4 text-xs font-semibold text-[#71717A] whitespace-nowrap">{item.supervisor.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
