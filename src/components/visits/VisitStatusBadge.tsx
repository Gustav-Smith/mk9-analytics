import React from 'react';
import type { VisitStatus } from '@prisma/client';

interface VisitStatusBadgeProps {
  status: VisitStatus;
}

export const VisitStatusBadge = ({ status }: VisitStatusBadgeProps) => {
  const styles: Record<VisitStatus, { bg: string; border: string; text: string; label: string }> = {
    PLANEJADA: {
      bg: 'bg-[#f7fbff]', border: 'border-[#cddbeb]', text: 'text-[#356694]',
      label: 'Planejada',
    },
    REALIZADA: {
      bg: 'bg-[#f7fcf8]', border: 'border-[#cde2d3]', text: 'text-[#2f7445]',
      label: 'Realizada',
    },
    CANCELADA: {
      bg: 'bg-[#fff8f8]', border: 'border-[#ead0d0]', text: 'text-[#a53737]',
      label: 'Cancelada',
    },
  };

  const current = styles[status] || {
    bg: 'bg-[#F4F4F5]',
    border: 'border-[#E4E4E7]',
    text: 'text-[#71717A]',
    label: String(status),
  };

  return (
    <span className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-medium ${current.bg} ${current.border} ${current.text}`}>
      {current.label}
    </span>
  );
};

export default VisitStatusBadge;
