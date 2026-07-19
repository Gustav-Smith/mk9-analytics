import assert from 'node:assert/strict';
import test from 'node:test';
import { StoreMapper } from './StoreMapper';

test('loja completa', () => {
  const row = {
    CODIGO: '123',
    NOME: 'Supermercado Silva',
    REDE: 'Silva Supermercados',
    CIDADE: 'São Paulo',
    UF: 'SP',
    BAIRRO: 'Centro',
  };

  const result = StoreMapper.map(row);
  assert.equal(result.isValid, true);
  assert.equal(result.code, '123');
  assert.equal(result.name, 'SUPERMERCADO SILVA');
  assert.equal(result.chain, 'SILVA SUPERMERCADOS');
  assert.equal(result.city, 'SÃO PAULO');
  assert.equal(result.state, 'SP');
  assert.equal(result.neighborhood, 'CENTRO');
  assert.equal(result.errors.length, 0);
  assert.equal(result.deduplicationKey, 'CODE:123');
});

test('sem bairro', () => {
  const row = {
    CODIGO: '124',
    NOME: 'Mini Mercado Sol',
    REDE: 'Sol',
    CIDADE: 'Guarulhos',
    UF: 'SP',
  };

  const result = StoreMapper.map(row);
  assert.equal(result.isValid, true);
  assert.equal(result.neighborhood, null);
});

test('sem bandeira', () => {
  const row = {
    CODIGO: '125',
    NOME: 'Loja Solteira',
    CIDADE: 'Campinas',
    UF: 'SP',
    BAIRRO: 'Cambuí',
  };

  const result = StoreMapper.map(row);
  assert.equal(result.isValid, true);
  assert.equal(result.chain, null);
});

test('espaços extras', () => {
  const row = {
    CODIGO: ' 126  ',
    NOME: '  Mercado   Estrela   Dourada  ',
    REDE: '  Rede   Estrela  ',
    CIDADE: '   São   Bernardo   do   Campo   ',
    UF: '  SP  ',
    BAIRRO: '   Planalto   ',
  };

  const result = StoreMapper.map(row);
  assert.equal(result.isValid, true);
  assert.equal(result.code, '126');
  assert.equal(result.name, 'MERCADO ESTRELA DOURADA');
  assert.equal(result.chain, 'REDE ESTRELA');
  assert.equal(result.city, 'SÃO BERNARDO DO CAMPO');
  assert.equal(result.state, 'SP');
  assert.equal(result.neighborhood, 'PLANALTO');
});

test('caixa alta/baixa', () => {
  const row = {
    CODIGO: 'AbCdE',
    NOME: 'mErCaDo dO bArRo',
    REDE: 'bAnDeIrA a',
    CIDADE: 'rIo dE jAnEiRo',
    UF: 'rj',
    BAIRRO: 'CoPaCaBaNa',
  };

  const result = StoreMapper.map(row);
  assert.equal(result.isValid, true);
  assert.equal(result.code, 'ABCDE');
  assert.equal(result.name, 'MERCADO DO BARRO');
  assert.equal(result.chain, 'BANDEIRA A');
  assert.equal(result.city, 'RIO DE JANEIRO');
  assert.equal(result.state, 'RJ');
  assert.equal(result.neighborhood, 'COPACABANA');
});

test('UF inválida (entrada já validada pela importação, mapper preserva o valor normalizado)', () => {
  const row = {
    CODIGO: '127',
    NOME: 'Loja Teste',
    CIDADE: 'São Paulo',
    UF: 'XX',
    BAIRRO: 'Centro',
  };

  const result = StoreMapper.map(row);
  assert.equal(result.isValid, true);
  assert.equal(result.state, 'XX');
  assert.equal(result.errors.length, 0);
});

test('cidade vazia (entrada já validada pela importação, mapper normaliza o valor)', () => {
  const row = {
    CODIGO: '128',
    NOME: 'Loja Teste',
    CIDADE: '',
    UF: 'SP',
    BAIRRO: 'Centro',
  };

  const result = StoreMapper.map(row);
  assert.equal(result.isValid, true);
  assert.equal(result.city, '');
  assert.equal(result.errors.length, 0);
});
