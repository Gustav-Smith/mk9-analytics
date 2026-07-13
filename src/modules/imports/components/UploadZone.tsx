import { useState } from "react";
import { Button } from "@/components/ui/button";

export const UploadZone = ({ onFileChange }: { onFileChange: (files: FileList) => void }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileChange(e.target.files);
    }
  };

  return (
    <div
      className={`border-dashed border-2 p-6 text-center relative ${isDragActive ? "border-primary bg-primary/5" : "border-border"}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input type="file" multiple className="hidden" onChange={handleFileSelect} />
      <div className="pointer-events-none">
        <p className="text-sm">
          Arraste e solte os arquivos aqui ou clique para selecionar
        </p>
        <Button variant="outline" size="sm" className="mt-4">
          Selecionar Arquivos
        </Button>
      </div>
    </div>
  );
};