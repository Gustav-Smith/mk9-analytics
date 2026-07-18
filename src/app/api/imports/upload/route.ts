import { NextResponse } from 'next/server';
import {
  ImportService,
  InvalidImportFileError,
  UnsupportedImportFileError,
} from '@/modules/imports/services/ImportService';
import { ImportUploadSchema } from '@/modules/imports/schemas/fileSchema';

export const runtime = 'nodejs';

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Não foi possível processar o arquivo.';
}

export async function POST(request: Request) {
  try {
    const parsedInput = ImportUploadSchema.safeParse(await request.json());
    if (!parsedInput.success) {
      return NextResponse.json(
        { success: false, error: parsedInput.error.issues[0]?.message ?? 'Dados do arquivo inválidos.' },
        { status: 400 },
      );
    }

    const { fileName, fileContent, fileType } = parsedInput.data;
    const buffer = Buffer.from(fileContent, 'base64');
    if (buffer.length === 0) {
      return NextResponse.json(
        { success: false, error: 'O arquivo está vazio.' },
        { status: 400 },
      );
    }

    const file = new File([buffer], fileName, {
      type: fileType || 'application/octet-stream',
    });

    const importService = new ImportService();
    const previewResult = await importService.processFileForPreview(file);

    return NextResponse.json(previewResult);
  } catch (error: unknown) {
    console.error('Error processing file upload:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'A requisição enviada é inválida.' },
        { status: 400 },
      );
    }
    if (error instanceof UnsupportedImportFileError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 415 },
      );
    }
    if (error instanceof InvalidImportFileError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 422 },
      );
    }

    return NextResponse.json(
      { success: false, error: errorMessage(error) },
      { status: 500 }
    );
  }
}
