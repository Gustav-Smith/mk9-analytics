// src/modules/imports/schemas/fileSchema.ts
import { z } from "zod";

export const ExcelFileSchema = z.object({
  file: z.instanceof(File),
  name: z.string().min(1),
  size: z.number().positive(),
  lastModified: z.number().positive(),
  type: z.string(),
  preview: z.unknown().optional(),
  status: z.enum(["pending", "loading", "validating", "error", "imported"]),
  error: z.string().optional(),
});

export type ExcelFileSchemaType = z.infer<typeof ExcelFileSchema>;

export const ImportUploadSchema = z.object({
  fileName: z.string().trim().min(1, 'Informe o nome do arquivo.'),
  fileContent: z.string().min(1, 'O arquivo está vazio.').regex(/^[A-Za-z0-9+/]*={0,2}$/, 'O conteúdo do arquivo é inválido.'),
  fileType: z.string().optional(),
});

export type ImportUploadInput = z.infer<typeof ImportUploadSchema>;
