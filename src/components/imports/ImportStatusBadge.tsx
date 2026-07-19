import { importStatusLabels } from '@/lib/formatters';
import type { ImportStatus } from '@/modules/imports/dashboard/imports-dashboard.types';

export function ImportStatusBadge({ status }: { status: ImportStatus }) {
  const success = status === 'SUCCESS' || status === 'CONFIRMED';
  const problem = status === 'FAILED' || status === 'EXPIRED';
  return <span className={`inline-flex rounded-sm border px-2 py-0.5 text-[10px] font-medium ${success ? 'border-[#cde2d3] bg-[#f7fcf8] text-[#2f7445]' : problem ? 'border-[#ead0d0] bg-[#fff8f8] text-[#a53737]' : 'border-[#cddbeb] bg-[#f7fbff] text-[#356694]'}`}>{importStatusLabels[status] ?? status}</span>;
}
export default ImportStatusBadge;
