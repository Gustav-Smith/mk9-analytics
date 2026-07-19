import assert from 'node:assert/strict';
import test from 'node:test';
import { VisitMapper } from './VisitMapper';

test('visita semanal', () => {
  const row = {
    LOJA: 'Supermercado Centro',
    CODIGO_LOJA: 'SMC001',
    CIDADE: 'São Paulo',
    UF: 'SP',
    INDUSTRIA: 'Bebidas X',
    CODIGO_INDUSTRIA: 'BEB001',
    PROMOTOR: 'Carlos Silva',
    VISITA_SEMANAL: 1, // 1 por semana -> 4 por mês
  };

  const result = VisitMapper.map(row);
  assert.equal(result.length, 4);
  assert.equal(result[0].frequency, 4);
  assert.equal(result[0].frequencyType, 'WEEKLY');
  assert.equal(result[0].plannedVisitIndex, 1);
  assert.equal(result[3].plannedVisitIndex, 4);
  assert.equal(result[0].store.name, 'SUPERMERCADO CENTRO');
  assert.equal(result[0].industry.name, 'BEBIDAS X');
  assert.notEqual(result[0].promoter, null);
  assert.equal(result[0].promoter?.name, 'CARLOS SILVA');
});

test('visita mensal', () => {
  const row = {
    LOJA: 'Supermercado Centro',
    CODIGO_LOJA: 'SMC001',
    CIDADE: 'São Paulo',
    UF: 'SP',
    INDUSTRIA: 'Bebidas X',
    CODIGO_INDUSTRIA: 'BEB001',
    PROMOTOR: 'Carlos Silva',
    VISITA_MENSAL: 2,
  };

  const result = VisitMapper.map(row);
  assert.equal(result.length, 2);
  assert.equal(result[0].frequency, 2);
  assert.equal(result[0].frequencyType, 'MONTHLY');
  assert.equal(result[0].plannedVisitIndex, 1);
  assert.equal(result[1].plannedVisitIndex, 2);
});

test('sem frequência', () => {
  const row = {
    LOJA: 'Supermercado Centro',
    CODIGO_LOJA: 'SMC001',
    CIDADE: 'São Paulo',
    UF: 'SP',
    INDUSTRIA: 'Bebidas X',
    PROMOTOR: 'Carlos Silva',
  };

  const result = VisitMapper.map(row);
  assert.equal(result.length, 0);
});

test('frequência inválida', () => {
  const row = {
    LOJA: 'Supermercado Centro',
    CODIGO_LOJA: 'SMC001',
    CIDADE: 'São Paulo',
    UF: 'SP',
    INDUSTRIA: 'Bebidas X',
    PROMOTOR: 'Carlos Silva',
    VISITA_SEMANAL: 'duas',
    VISITA_MENSAL: -5,
  };

  const result = VisitMapper.map(row);
  assert.equal(result.length, 0);
});

test('com promotor', () => {
  const row = {
    LOJA: 'Supermercado Centro',
    CODIGO_LOJA: 'SMC001',
    CIDADE: 'São Paulo',
    UF: 'SP',
    INDUSTRIA: 'Bebidas X',
    PROMOTOR: 'Carlos Silva',
    VISITA_SEMANAL: 1,
  };

  const result = VisitMapper.map(row);
  assert.notEqual(result[0].promoter, null);
  assert.equal(result[0].promoter?.name, 'CARLOS SILVA');
});

test('sem promotor', () => {
  const row = {
    LOJA: 'Supermercado Centro',
    CODIGO_LOJA: 'SMC001',
    CIDADE: 'São Paulo',
    UF: 'SP',
    INDUSTRIA: 'Bebidas X',
    VISITA_SEMANAL: 1,
  };

  const result = VisitMapper.map(row);
  assert.equal(result[0].promoter, null);
});

test('deduplicationKey', () => {
  const row = {
    LOJA: 'Supermercado Centro',
    CODIGO_LOJA: 'SMC001',
    CIDADE: 'São Paulo',
    UF: 'SP',
    INDUSTRIA: 'Bebidas X',
    CODIGO_INDUSTRIA: 'BEB001',
    PROMOTOR: 'Carlos Silva',
    VISITA_SEMANAL: 1,
  };

  const result = VisitMapper.map(row);
  assert.equal(result[0].deduplicationKey, 'VISIT:SMC001:BEB001:CARLOS SILVA:1');
  assert.equal(result[1].deduplicationKey, 'VISIT:SMC001:BEB001:CARLOS SILVA:2');
  assert.equal(result[3].deduplicationKey, 'VISIT:SMC001:BEB001:CARLOS SILVA:4');
});
