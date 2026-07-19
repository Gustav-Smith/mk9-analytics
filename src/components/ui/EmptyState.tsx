import React from 'react';
import { Database } from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

export const EmptyState = ({
  title,
  description,
  action,
  icon = <Database className="h-5 w-5 text-[#8c8c87]" />,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 rounded-md border border-[#deded9] bg-white p-10 text-center">
      <div className="rounded-md bg-[#f1f1ee] p-2.5">{icon}</div>
      <div className="max-w-md space-y-1">
        <h4 className="text-sm font-medium text-[#292928]">{title}</h4>
        <p className="text-xs leading-5 text-[#7c7c77]">{description}</p>
      </div>
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};
