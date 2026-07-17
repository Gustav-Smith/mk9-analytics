import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export function generateFileHash(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export async function checkDuplicateFile(fileHash: string): Promise<boolean> {
  const existingFile = await prisma.importFile.findFirst({
    where: {
      fileHash,
    },
  });
  return !!existingFile;
}