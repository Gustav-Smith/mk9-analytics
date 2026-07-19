import assert from 'node:assert/strict';
import test from 'node:test';
import {
  removeAccents,
  collapseSpaces,
  normalizeText,
  canonicalize,
  normalizeState,
} from './index';

test('removeAccents', () => {
  assert.equal(removeAccents('Ação e Reação'), 'Acao e Reacao');
  assert.equal(removeAccents(''), '');
  assert.equal(removeAccents(null), '');
  assert.equal(removeAccents(undefined), '');
});

test('collapseSpaces', () => {
  assert.equal(collapseSpaces('  a  b   c  '), 'a b c');
  assert.equal(collapseSpaces(''), '');
  assert.equal(collapseSpaces(null), '');
  assert.equal(collapseSpaces(undefined), '');
});

test('normalizeText', () => {
  assert.equal(normalizeText('  Ação   Diferenciada  '), 'AÇÃO DIFERENCIADA');
  assert.equal(normalizeText('  Ação   Diferenciada  ', { removeAccents: true }), 'ACAO DIFERENCIADA');
  assert.equal(normalizeText(''), '');
  assert.equal(normalizeText(null), '');
  assert.equal(normalizeText(undefined), '');
});

test('canonicalize', () => {
  assert.equal(canonicalize('  Supermercado   Silva   &   Filhos²   '), 'SUPERMERCADO SILVA FILHOS2');
  assert.equal(canonicalize(''), '');
  assert.equal(canonicalize(null), '');
  assert.equal(canonicalize(undefined), '');
});

test('normalizeState', () => {
  assert.equal(normalizeState('sp'), 'SP');
  assert.equal(normalizeState('  rj  '), 'RJ');
  assert.equal(normalizeState(''), '');
  assert.equal(normalizeState(null), '');
  assert.equal(normalizeState(undefined), '');
});
