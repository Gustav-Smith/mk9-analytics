import type { NextApiRequest, NextApiResponse } from 'next';
import { generateFileHash, checkDuplicateFile } from '@/modules/imports/services/validate-import';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileName, fileContent } = req.body as { fileName?: string; fileContent?: string };

    if (!fileName || !fileContent) {
      return res.status(400).json({ error: 'fileName and fileContent are required' });
    }

    // Decode Base64 to Buffer
    const buffer = Buffer.from(fileContent, 'base64');

    // Generate hash
    const fileHash = generateFileHash(buffer);

    // Check duplicate
    const isDuplicate = await checkDuplicateFile(fileHash);
    if (isDuplicate) {
      return res.status(400).json({ error: 'Este arquivo já foi importado anteriormente.' });
    }

    // Create import and importFile in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const importRecord = await tx.import.create({
        data: {
          status: 'PENDING',
          files: {
            create: {
              fileName,
              fileHash,
            }
          }
        },
        include: {
          files: true,
        }
      });

      const importFile = importRecord.files[0];

      return { import: importRecord, importFile };
    });

    // Dispara webhook para o n8n (não bloqueia a resposta ao usuário)
    try {
      await fetch('http://localhost:5678/webhook-test/imports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          importId: result.import.id,
          fileName: result.importFile.fileName,
          status: result.import.status,
        }),
      });
      console.log('�� Gatilho disparado para o n8n para o importId:', result.import.id);
    } catch (webhookError) {
      console.error('Falha ao disparar webhook para o n8n:', webhookError);
    }

    return res.status(201).json(result);
  } catch (error: any) {
    console.error('Error in import upload:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}