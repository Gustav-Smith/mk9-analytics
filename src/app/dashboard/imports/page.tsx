import { prisma } from '@/lib/prisma';
import ImportCard from '@/modules/imports/components/ImportCard';

export default async function ImportsPage() {
  const imports = await prisma.import.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      createdAt: true,
      files: {
        select: {
          fileName: true,
          fileHash: true,
        },
      },
    },
  });

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Gerenciamento de Importações</h1>

      {/* Upload Card */}
      <div className="bg-white rounded-lg shadow p-4">
        <ImportCard />
      </div>

      {/* Imports Table */}
      <div className="bg-white rounded-lg shadow">
        <h2 className="px-4 pt-4 pb-2 font-semibold text-lg">Histórico de Importações</h2>
        {imports.length === 0 ? (
          <p className="px-4 py-4 text-center text-gray-500">Nenhuma importação encontrada.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Arquivo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hash
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Envio
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {imports.map((imp) => {
                const file = imp.files?.[0];
                const hash = file?.fileHash ?? '';
                const shortHash =
                  hash.length > 10 ? `${hash.slice(0, 6)}…${hash.slice(-4)}` : hash;
                const status = imp.status ?? 'UNKNOWN';
                const getBadgeProps = (status: string) => {
                  switch (status.toUpperCase()) {
                    case 'PENDING':
                      return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
                    case 'PROCESSING':
                      return { bg: 'bg-blue-100', text: 'text-blue-800' };
                    case 'SUCCESS':
                      return { bg: 'bg-green-100', text: 'text-green-800' };
                    case 'FAILED':
                      return { bg: 'bg-red-100', text: 'text-red-800' };
                    default:
                      return { bg: 'bg-gray-100', text: 'text-gray-800' };
                  }
                };
                const { bg, text } = getBadgeProps(status);
                return (
                  <tr key={imp.id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {file?.fileName ?? 'N/A'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{shortHash}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(imp.createdAt).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${bg} ${text}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}