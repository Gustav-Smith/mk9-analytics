// src/modules/imports/components/PreviewTable.tsx
import type { NormalizedImportRow } from '../types/ImportPreview';

interface PreviewTableProps {
  columns: string[];
  data: NormalizedImportRow[];
}

export const PreviewTable = ({ columns, data }: PreviewTableProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-[#858580]">
        Nenhum dado para exibir
      </div>
    );
  }

  // Use first row to get columns if not provided
  const displayColumns = columns.length > 0 ? columns : Object.keys(data[0]);

  return (
    <div className="w-full max-w-full overflow-x-auto">
      <table className="min-w-max text-left text-xs text-[#666661]">
        <thead>
          <tr>
            {displayColumns.map((col) => (
              <th key={col} scope="col" className="px-3 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-[#74746f]">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#ecece8] bg-white">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-[#fafaf8]">
              {displayColumns.map((col) => (
                <td key={col} className="max-w-[260px] truncate whitespace-nowrap px-3 py-3 text-xs text-[#393937]">
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
