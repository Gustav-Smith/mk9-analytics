import Link from 'next/link';
import { ImportsTable } from '@/components/imports/ImportsTable';
import { ImportStats } from '@/components/imports/ImportStats';
import { PageHeader } from '@/components/ui/PageHeader';
import { ImportsDashboardService } from '@/modules/imports/dashboard/ImportsDashboardService';

export const dynamic = 'force-dynamic';

export default async function ImportacoesPage() {
  const { imports, stats } = await ImportsDashboardService.getDashboardData();
  return (
    <main className="mx-auto w-full max-w-[1440px] min-w-0 space-y-6 px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
      <PageHeader category="Operação" title="Importações" subtitle="Envio de arquivos e histórico de processamento." actions={<Link href="/dashboard/imports" className="rounded-md bg-[#20201f] px-3.5 py-2 text-xs font-medium text-white">Nova importação</Link>} />
      <ImportStats stats={stats} />
      <ImportsTable imports={imports} />
    </main>
  );
}
