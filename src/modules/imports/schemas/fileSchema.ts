// src/modules/imports/schemas/fileSchema.ts
import { z } from "zod";

export const ExcelFileSchema = z.object({
  file: z.instanceof(File),
  name: z.string().min(1),
  size: z.number().positive(),
  lastModified: z.number().positive(),
  type: z.string(),
  preview: z.any().optional(),
  status: z.enum(["pending", "loading", "validating", "error", "imported"]),
  error: z.string().optional(),
});

export type ExcelFileSchemaType = z.infer<typeof ExcelFileSchema>;