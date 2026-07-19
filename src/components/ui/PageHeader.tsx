import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  category?: string;
  actions?: React.ReactNode;
}

export const PageHeader = ({ title, subtitle, category = 'MK9 Analytics', actions }: PageHeaderProps) => {
  return (
    <header className="flex flex-col justify-between gap-4 border-b border-[#deded9] pb-6 md:flex-row md:items-end">
      <div>
        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#73736f]">{category}</span>
        <h1 className="text-2xl font-semibold tracking-[-0.025em] text-[#171716]">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-3xl text-sm text-[#6b6b66]">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
};
