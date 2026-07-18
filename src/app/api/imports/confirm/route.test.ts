import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import test from 'node:test';
import { handleImportConfirmation } from './route';

const validBody = {
  previewToken: randomBytes(32).toString('base64url'),
  idempotencyKey: '550e8400-e29b-41d4-a716-446655440000',
};

test('retorna 400 para payload com campos extras', async () => {
  const request = new Request('http://localhost/api/imports/confirm', {
    method: 'POST',
    body: JSON.stringify({ ...validBody, rows: [] }),
  });
  assert.equal((await handleImportConfirmation(request)).status, 400);
});

test('retorna 400 para UUID inválido', async () => {
  const request = new Request('http://localhost/api/imports/confirm', {
    method: 'POST',
    body: JSON.stringify({ ...validBody, idempotencyKey: 'invalida' }),
  });
  assert.equal((await handleImportConfirmation(request)).status, 400);
});
