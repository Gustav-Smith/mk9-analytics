import assert from 'node:assert/strict';
import test from 'node:test';
import { OperationMapper } from './OperationMapper';
import type { StoreCandidate } from '../store/StoreCandidate';
import type { IndustryCandidate } from '../industry/IndustryCandidate';
import type { PromoterCandidate } from '../promoter/PromoterCandidate';
import type { VisitCandidate } from '../visit/VisitCandidate';

const createStore = (code: string): StoreCandidate => ({
  code,
  name: `Store ${code}`,
  chain: null,
  city: 'SP',
  state: 'SP',
  neighborhood: null,
  isValid: true,
  errors: [],
  deduplicationKey: `CODE:${code}`,
  originalData: {},
});

const createIndustry = (code: string): IndustryCandidate => ({
  code,
  name: `Industry ${code}`,
  normalizedName: `INDUSTRY ${code}`,
  active: true,
  isValid: true,
  errors: [],
  deduplicationKey: `CODE:${code}`,
  originalData: {},
});

const createPromoter = (name: string): PromoterCandidate => ({
  name,
  normalizedName: name.toUpperCase(),
  supervisor: null,
  active: true,
  isValid: true,
  errors: [],
  deduplicationKey: `NAME:${name.toUpperCase()}`,
  originalData: {},
});

const createVisit = (storeCode: string, industryCode: string, promoterName: string, index: number): VisitCandidate => ({
  store: createStore(storeCode),
  industry: createIndustry(industryCode),
  promoter: createPromoter(promoterName),
  frequency: 4,
  frequencyType: 'WEEKLY',
  plannedVisitIndex: index,
  deduplicationKey: `VISIT:${storeCode}:${industryCode}:${promoterName.toUpperCase()}:${index}`,
  originalData: {},
});

test('operação completa', () => {
  const stores = [createStore('S1'), createStore('S2')];
  const industries = [createIndustry('I1')];
  const promoters = [createPromoter('P1')];
  const visits = [createVisit('S1', 'I1', 'P1', 1)];

  const result = OperationMapper.map(stores, industries, promoters, visits);
  assert.equal(result.stores.length, 2);
  assert.equal(result.industries.length, 1);
  assert.equal(result.promoters.length, 1);
  assert.equal(result.visits.length, 1);

  assert.equal(result.statistics.totalStores, 2);
  assert.equal(result.statistics.totalVisits, 1);
});

test('listas vazias', () => {
  const result = OperationMapper.map([], [], [], []);
  assert.equal(result.stores.length, 0);
  assert.equal(result.statistics.totalStores, 0);
  assert.equal(result.statistics.totalVisits, 0);
});

test('duplicidades e deduplicação', () => {
  const stores = [createStore('S1'), createStore('S1'), createStore('S2')];
  const industries = [createIndustry('I1'), createIndustry('I1')];
  const promoters = [createPromoter('P1'), createPromoter('P1')];
  const visits = [
    createVisit('S1', 'I1', 'P1', 1),
    createVisit('S1', 'I1', 'P1', 1),
    createVisit('S1', 'I1', 'P1', 2),
  ];

  const result = OperationMapper.map(stores, industries, promoters, visits);
  assert.equal(result.stores.length, 2);
  assert.equal(result.industries.length, 1);
  assert.equal(result.promoters.length, 1);
  assert.equal(result.visits.length, 2);

  assert.equal(result.statistics.duplicatedStores, 1);
  assert.equal(result.statistics.duplicatedIndustries, 1);
  assert.equal(result.statistics.duplicatedPromoters, 1);
  assert.equal(result.statistics.duplicatedVisits, 1);
});

test('estatísticas e consistência dos totais', () => {
  const stores = [createStore('S1'), createStore('S2')];
  const industries = [createIndustry('I1')];
  const promoters = [createPromoter('P1')];
  const visits = [createVisit('S1', 'I1', 'P1', 1)];

  const result = OperationMapper.map(stores, industries, promoters, visits);
  const stats = result.statistics;

  assert.equal(stats.totalStores, result.stores.length);
  assert.equal(stats.totalIndustries, result.industries.length);
  assert.equal(stats.totalPromoters, result.promoters.length);
  assert.equal(stats.totalVisits, result.visits.length);
});
