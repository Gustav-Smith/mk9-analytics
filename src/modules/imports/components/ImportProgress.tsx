import { Progress } from "@/components/ui/progress";

export const ImportProgress = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <span className="mr-2">Importação em progresso</span>
        <span className="ml-2">0%</span>
      </div>
      <Progress value={0} className="h-2.5" />
    </div>
  );
};