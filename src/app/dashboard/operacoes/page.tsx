import { OperationCard } from '@/components/operations/OperationCard';
import { OperationFilters } from '@/components/operations/OperationFilters';
import { OperationsTable } from '@/components/operations/OperationsTable';
import { PageHeader } from '@/components/ui/PageHeader';
import { OperationsDashboardService } from '@/modules/operations/dashboard/OperationsDashboardService';

export const dynamic = 'force-dynamic';

interface PageProps { searchParams: Promise<{ status?: string; cliente?: string; q?: string }> }

export default async function OperacoesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params?.status || '';
  const cliente = params?.cliente || '';
  const search = params?.q || '';
  const { operations, stats, uniqueClients } = await OperationsDashboardService.getDashboardData({ status, cliente, search });

  return (
    <main className="mx-auto w-full max-w-[1440px] min-w-0 space-y-6 px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
      <PageHeader category="Operação" title="Operações" subtitle="Cobertura de visitas, execução e equipes por operação." />
      <OperationCard stats={stats} />
      <OperationFilters status={status} cliente={cliente} search={search} uniqueClients={uniqueClients} />
      <OperationsTable operations={operations} />
    </main>
  );
}
