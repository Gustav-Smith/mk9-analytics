import assert from 'node:assert/strict';
import test from 'node:test';
import { PromoterMapper } from './PromoterMapper';

test('promotor válido', () => {
  const row = {
    PROMOTOR: 'Carlos Silva',
  };

  const result = PromoterMapper.map(row);
  assert.notEqual(result, null);
  assert.equal(result?.isValid, true);
  assert.equal(result?.name, 'CARLOS SILVA');
  assert.equal(result?.normalizedName, 'CARLOS SILVA');
  assert.equal(result?.active, true);
  assert.equal(result?.supervisor, null);
  assert.equal(result?.deduplicationKey, 'NAME:CARLOS SILVA');
});

test('sem promotor (retorna null)', () => {
  const row = {
    SUPERVISOR: 'Ana Supervisor',
  };

  const result = PromoterMapper.map(row);
  assert.equal(result, null);
});

test('com supervisor', () => {
  const row = {
    PROMOTOR: 'Carlos Silva',
    SUPERVISOR: 'Ana Supervisor',
  };

  const result = PromoterMapper.map(row);
  assert.notEqual(result, null);
  assert.equal(result?.supervisor, 'ANA SUPERVISOR');
});

test('sem supervisor', () => {
  const row = {
    PROMOTOR: 'Carlos Silva',
    SUPERVISOR: '',
  };

  const result = PromoterMapper.map(row);
  assert.notEqual(result, null);
  assert.equal(result?.supervisor, null);
});

test('Nestlé Promo', () => {
  const row = {
    PROMOTOR: 'Nestlé Promo',
  };

  const result = PromoterMapper.map(row);
  assert.notEqual(result, null);
  assert.equal(result?.name, 'NESTLÉ PROMO');
  assert.equal(result?.normalizedName, 'NESTLE PROMO');
});

test('espaços extras', () => {
  const row = {
    PROMOTOR: '   Carlos    Silva   ',
    SUPERVISOR: '   Ana    Supervisor   ',
  };

  const result = PromoterMapper.map(row);
  assert.notEqual(result, null);
  assert.equal(result?.name, 'CARLOS SILVA');
  assert.equal(result?.supervisor, 'ANA SUPERVISOR');
});

test('caixa alta/baixa', () => {
  const row = {
    PROMOTOR: 'cArLoS sIlVa',
    SUPERVISOR: 'aNa sUpErViSoR',
  };

  const result = PromoterMapper.map(row);
  assert.notEqual(result, null);
  assert.equal(result?.name, 'CARLOS SILVA');
  assert.equal(result?.supervisor, 'ANA SUPERVISOR');
});
