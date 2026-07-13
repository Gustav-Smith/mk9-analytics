import { File } from "lucide-react";

interface UploadListProps {
  files: FileList;
}

export const UploadList = ({ files }: UploadListProps) => {
  const fileArray = Array.from(files);

  return (
    <div className="space-y-4">
      {fileArray.map((file, index) => (
        <div key={index} className="border p-4 rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <File className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {Math.round(file.size / 1024)} KB • Modificado há {new Date(
                    file.lastModified
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className="px-2 py-1 bg-muted text-xs rounded">Pendente</span>
          </div>
        </div>
      ))}
    </div>
  );
};