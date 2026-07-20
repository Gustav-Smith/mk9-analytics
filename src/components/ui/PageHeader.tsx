import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  category?: string;
  actions?: React.ReactNode;
}

export const PageHeader = ({ title, subtitle, category = 'MK9 Analytics', actions }: PageHeaderProps) => {
  return (
    <header className="flex flex-col justify-between gap-4 border-b border-[#F4F4F5] pb-6 md:flex-row md:items-end">
      <div>
        <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-wider block">{category}</span>
        <h1 className="text-2xl font-extrabold text-[#09090B] tracking-tight mt-1">{title}</h1>
        {subtitle && <p className="text-xs font-semibold text-[#71717A] mt-0.5 max-w-3xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </header>
  );
};

export default PageHeader;
