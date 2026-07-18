// src/modules/imports/components/PreviewTable.tsx
import type { NormalizedImportRow } from '../types/ImportPreview';

interface PreviewTableProps {
  columns: string[];
  data: NormalizedImportRow[];
}

export const PreviewTable = ({ columns, data }: PreviewTableProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Nenhum dado para exibir
      </div>
    );
  }

  // Use first row to get columns if not provided
  const displayColumns = columns.length > 0 ? columns : Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-muted-foreground">
        <thead>
          <tr>
            {displayColumns.map((col) => (
              <th key={col} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {displayColumns.map((col) => (
                <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row[col] !== null && row[col] !== undefined ? String(row[col]) : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
