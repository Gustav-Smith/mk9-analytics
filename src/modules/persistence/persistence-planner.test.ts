import assert from 'node:assert/strict';
import test from 'node:test';
import { PersistencePlanner } from './PersistencePlanner';
import type { OperationCandidate } from '../mapping/operation/OperationCandidate';
import type { StoreCandidate } from '../mapping/store/StoreCandidate';
import type { IndustryCandidate } from '../mapping/industry/IndustryCandidate';
import type { PromoterCandidate } from '../mapping/promoter/PromoterCandidate';
import type { VisitCandidate } from '../mapping/visit/VisitCandidate';

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

const createCandidate = (
  stores: StoreCandidate[],
  industries: IndustryCandidate[],
  promoters: PromoterCandidate[],
  visits: VisitCandidate[]
): OperationCandidate => ({
  stores,
  industries,
  promoters,
  visits,
  statistics: {
    totalStores: stores.length,
    newStores: stores.length,
    totalIndustries: industries.length,
    totalPromoters: promoters.length,
    totalVisits: visits.length,
    duplicatedStores: 0,
    duplicatedIndustries: 0,
    duplicatedPromoters: 0,
    duplicatedVisits: 0,
  },
});

interface MockPrismaArgs {
  stores?: Array<{ code: string }>;
  industries?: Array<{ code: string }>;
  promoters?: Array<{ name: string }>;
  visits?: Array<{
    scheduledDate: Date;
    store: { code: string } | null;
    industry: { code: string } | null;
    promoter: { name: string } | null;
  }>;
}

const createMockPrisma = (data: MockPrismaArgs) => {
  return {
    store: {
      findMany: async () => data.stores || [],
    },
    industry: {
      findMany: async () => data.industries || [],
    },
    promoter: {
      findMany: async () => data.promoters || [],
    },
    visit: {
      findMany: async () => data.visits || [],
    },
  };
};

test('operação totalmente nova', async () => {
  const candidate = createCandidate(
    [createStore('S1')],
    [createIndustry('I1')],
    [createPromoter('P1')],
    [createVisit('S1', 'I1', 'P1', 1)]
  );

  const mockPrisma = createMockPrisma({});
  const plan = await PersistencePlanner.plan(candidate, 'op-1', mockPrisma as any);

  assert.equal(plan.storesToCreate.length, 1);
  assert.equal(plan.storesToUpdate.length, 0);
  assert.equal(plan.industriesToCreate.length, 1);
  assert.equal(plan.industriesToUpdate.length, 0);
  assert.equal(plan.promotersToCreate.length, 1);
  assert.equal(plan.promotersToUpdate.length, 0);
  assert.equal(plan.visitsToCreate.length, 1);
  assert.equal(plan.visitsToUpdate.length, 0);
});

test('operação totalmente existente', async () => {
  const candidate = createCandidate(
    [createStore('S1')],
    [createIndustry('I1')],
    [createPromoter('P1')],
    [createVisit('S1', 'I1', 'P1', 1)]
  );

  const mockPrisma = createMockPrisma({
    stores: [{ code: 'S1' }],
    industries: [{ code: 'I1' }],
    promoters: [{ name: 'P1' }],
    visits: [{
      scheduledDate: new Date(),
      store: { code: 'S1' },
      industry: { code: 'I1' },
      promoter: { name: 'P1' },
    }],
  });
  const plan = await PersistencePlanner.plan(candidate, 'op-1', mockPrisma as any);

  assert.equal(plan.storesToCreate.length, 0);
  assert.equal(plan.storesToUpdate.length, 1);
  assert.equal(plan.industriesToCreate.length, 0);
  assert.equal(plan.industriesToUpdate.length, 1);
  assert.equal(plan.promotersToCreate.length, 0);
  assert.equal(plan.promotersToUpdate.length, 1);
  assert.equal(plan.visitsToCreate.length, 0);
  assert.equal(plan.visitsToUpdate.length, 1);
});

test('operação parcialmente existente', async () => {
  const candidate = createCandidate(
    [createStore('S1'), createStore('S2')],
    [createIndustry('I1')],
    [createPromoter('P1')],
    [createVisit('S1', 'I1', 'P1', 1), createVisit('S1', 'I1', 'P1', 2)]
  );

  const mockPrisma = createMockPrisma({
    stores: [{ code: 'S1' }],
    industries: [{ code: 'I1' }],
    promoters: [{ name: 'P1' }],
    visits: [{
      scheduledDate: new Date(),
      store: { code: 'S1' },
      industry: { code: 'I1' },
      promoter: { name: 'P1' },
    }],
  });
  const plan = await PersistencePlanner.plan(candidate, 'op-1', mockPrisma as any);

  assert.equal(plan.storesToCreate.length, 1); // S2
  assert.equal(plan.storesToUpdate.length, 1); // S1
  assert.equal(plan.visitsToCreate.length, 1); // 2ª visita
  assert.equal(plan.visitsToUpdate.length, 1); // 1ª visita
});

test('plano vazio', async () => {
  const candidate = createCandidate([], [], [], []);
  const mockPrisma = createMockPrisma({});
  const plan = await PersistencePlanner.plan(candidate, 'op-1', mockPrisma as any);

  assert.equal(plan.storesToCreate.length, 0);
  assert.equal(plan.visitsToCreate.length, 0);
});

test('consistência dos totais', async () => {
  const candidate = createCandidate(
    [createStore('S1'), createStore('S2')],
    [createIndustry('I1')],
    [createPromoter('P1')],
    [createVisit('S1', 'I1', 'P1', 1), createVisit('S1', 'I1', 'P1', 2)]
  );

  const mockPrisma = createMockPrisma({
    stores: [{ code: 'S1' }],
    industries: [],
    promoters: [{ name: 'P1' }],
    visits: [],
  });
  const plan = await PersistencePlanner.plan(candidate, 'op-1', mockPrisma as any);

  assert.equal(plan.storesToCreate.length + plan.storesToUpdate.length, candidate.stores.length);
  assert.equal(plan.industriesToCreate.length + plan.industriesToUpdate.length, candidate.industries.length);
  assert.equal(plan.promotersToCreate.length + plan.promotersToUpdate.length, candidate.promoters.length);
  assert.equal(plan.visitsToCreate.length + plan.visitsToUpdate.length, candidate.visits.length);
});
