import { NextResponse } from 'next/server';
import { confirmImportPreview, ImportConfirmationError } from '@/modules/imports/services/ImportConfirmationService';
import { ImportConfirmationPayloadSchema } from '@/modules/imports/types/ImportConfirmation';
import type { ImportConfirmationErrorResponse } from '@/modules/imports/types/ImportConfirmation';
import type { ImportConfirmationPayload, ImportConfirmationResponse } from '@/modules/imports/types/ImportConfirmation';

export const runtime = 'nodejs';

function errorResponse(code: ImportConfirmationErrorResponse['code'], error: string, status: number) {
  return NextResponse.json({ success: false, code, error }, { status });
}

type ConfirmFunction = (payload: ImportConfirmationPayload) => Promise<ImportConfirmationResponse>;

export async function handleImportConfirmation(request: Request, confirm: ConfirmFunction = confirmImportPreview) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('INVALID_PREVIEW_TOKEN', 'A requisição enviada é inválida.', 400);
  }
  const parsed = ImportConfirmationPayloadSchema.safeParse(body);
  if (!parsed.success) return errorResponse('INVALID_PREVIEW_TOKEN', parsed.error.issues[0]?.message ?? 'Payload de confirmação inválido.', 400);
  try {
    return NextResponse.json(await confirm(parsed.data));
  } catch (error: unknown) {
    if (error instanceof ImportConfirmationError) return errorResponse(error.code, error.message, error.httpStatus);
    return errorResponse('INVALID_PREVIEW_TOKEN', 'Não foi possível confirmar o preview.', 500);
  }
}

export async function POST(request: Request) {
  return handleImportConfirmation(request);
}
