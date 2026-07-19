import assert from 'node:assert/strict';
import test from 'node:test';
import { IndustryMapper } from './IndustryMapper';

test('indústria simples', () => {
  const row = {
    CODIGO: '1',
    NOME: 'Industria A',
  };

  const result = IndustryMapper.map(row);
  assert.equal(result.isValid, true);
  assert.equal(result.code, '1');
  assert.equal(result.name, 'INDUSTRIA A');
  assert.equal(result.normalizedName, 'INDUSTRIA A');
  assert.equal(result.active, true);
  assert.equal(result.errors.length, 0);
  assert.equal(result.deduplicationKey, 'CODE:1');
});

test('Nestlé', () => {
  const row = {
    CODIGO: '2',
    NOME: 'Nestlé',
  };

  const result = IndustryMapper.map(row);
  assert.equal(result.name, 'NESTLÉ');
  assert.equal(result.normalizedName, 'NESTLE'); // canonicalize remove acentos
});

test('AO²', () => {
  const row = {
    CODIGO: '3',
    NOME: 'AO²',
  };

  const result = IndustryMapper.map(row);
  assert.equal(result.name, 'AO²');
  assert.equal(result.normalizedName, 'AO2'); // canonicalize substitui ² por 2
});

test('P&G', () => {
  const row = {
    CODIGO: '4',
    NOME: 'P&G',
  };

  const result = IndustryMapper.map(row);
  assert.equal(result.name, 'P&G');
  assert.equal(result.normalizedName, 'PG'); // canonicalize remove pontuação e caracteres especiais
});

test('espaços extras', () => {
  const row = {
    CODIGO: ' 5 ',
    NOME: '  Industria   B  ',
  };

  const result = IndustryMapper.map(row);
  assert.equal(result.code, '5');
  assert.equal(result.name, 'INDUSTRIA B');
  assert.equal(result.normalizedName, 'INDUSTRIA B');
});

test('caixa alta/baixa', () => {
  const row = {
    CODIGO: 'AbC',
    NOME: 'iNdUsTrIa C',
  };

  const result = IndustryMapper.map(row);
  assert.equal(result.code, 'ABC');
  assert.equal(result.name, 'INDUSTRIA C');
  assert.equal(result.normalizedName, 'INDUSTRIA C');
});
