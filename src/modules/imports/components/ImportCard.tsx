import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadZone } from "./UploadZone";
import { UploadList } from "./UploadList";
import { PreviewTable } from "./PreviewTable";
import { ImportProgress } from "./ImportProgress";

export const ImportCard = () => {
  const [files, setFiles] = useState<FileList | null>(null);

  const handleFileChange = (fileList: FileList) => {
    setFiles(fileList);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Importar Planilha</CardTitle>
        <CardDescription>
          Faça upload de arquivos XLSX ou CSV para processar dados de promotores, lojas e visitas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <UploadZone onFileChange={handleFileChange} />
        {files && <UploadList files={files} />}
        <PreviewTable />
        <ImportProgress />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" size="sm" disabled={!files}>
          Importar
        </Button>
      </CardFooter>
    </Card>
  );
};