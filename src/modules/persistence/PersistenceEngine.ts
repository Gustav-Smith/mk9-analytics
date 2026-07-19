import { prisma as defaultPrisma } from '@/lib/prisma';
import type { PrismaClient } from '@prisma/client';
import type { PersistencePlan } from './PersistencePlan';
import type { PersistenceResult } from './PersistenceResult';
import { groupExistingVisits } from './utils/groupExistingVisits';

export class PersistenceEngine {
  static async persist(
    plan: PersistencePlan,
    operationId: string,
    prisma: PrismaClient = defaultPrisma as unknown as PrismaClient
  ): Promise<PersistenceResult> {
    const startTime = Date.now();

    return await prisma.$transaction(async (tx) => {
      // 1. Persistir Lojas
      for (const store of plan.storesToCreate) {
        await tx.store.create({
          data: {
            code: store.code,
            name: store.name,
            chain: store.chain,
            city: store.city,
            state: store.state,
          },
        });
      }

      for (const store of plan.storesToUpdate) {
        await tx.store.update({
          where: { code: store.code },
          data: {
            name: store.name,
            chain: store.chain,
            city: store.city,
            state: store.state,
          },
        });
      }

      // 2. Persistir Indústrias
      for (const ind of plan.industriesToCreate) {
        await tx.industry.create({
          data: {
            code: ind.code,
            name: ind.name,
          },
        });
      }

      for (const ind of plan.industriesToUpdate) {
        await tx.industry.update({
          where: { code: ind.code },
          data: {
            name: ind.name,
          },
        });
      }

      // 3. Persistir Promotores (resolvendo Supervisor em lote para evitar N+1)
      const uniqueSupervisorNames = Array.from(
        new Set([
          ...plan.promotersToCreate.map((p) => p.supervisor).filter(Boolean),
          ...plan.promotersToUpdate.map((p) => p.supervisor).filter(Boolean),
        ])
      ) as string[];

      if (!uniqueSupervisorNames.includes('SUPERVISOR PADRÃO')) {
        uniqueSupervisorNames.push('SUPERVISOR PADRÃO');
      }

      const dbSupervisors = await tx.supervisor.findMany({
        where: { name: { in: uniqueSupervisorNames } },
      });

      const supervisorMap = new Map<string, string>(
        dbSupervisors.map((s: any) => [s.name.toUpperCase(), s.id])
      );

      const missingSupervisors = uniqueSupervisorNames.filter(
        (name) => !supervisorMap.has(name.toUpperCase())
      );

      if (missingSupervisors.length > 0) {
        await tx.supervisor.createMany({
          data: missingSupervisors.map((name) => ({ name })),
        });
        const createdSupervisors = await tx.supervisor.findMany({
          where: { name: { in: missingSupervisors } },
        });
        for (const s of createdSupervisors) {
          supervisorMap.set(s.name.toUpperCase(), s.id);
        }
      }

      // Carregar os promotores existentes para atualização em lote
      const promoterNamesToUpdate = plan.promotersToUpdate.map((p) => p.name);
      const dbPromotersToUpdate = promoterNamesToUpdate.length > 0
        ? await tx.promoter.findMany({ where: { name: { in: promoterNamesToUpdate } } })
        : [];
      const dbPromotersToUpdateMap = new Map<string, string>(
        dbPromotersToUpdate.map((p: any) => [p.name.toUpperCase(), p.id])
      );

      for (const promoter of plan.promotersToCreate) {
        const supervisorName = promoter.supervisor || 'SUPERVISOR PADRÃO';
        const supervisorId = supervisorMap.get(supervisorName.toUpperCase()) || '';

        await tx.promoter.create({
          data: {
            name: promoter.name,
            supervisorId,
          },
        });
      }

      for (const promoter of plan.promotersToUpdate) {
        const supervisorName = promoter.supervisor || 'SUPERVISOR PADRÃO';
        const supervisorId = supervisorMap.get(supervisorName.toUpperCase()) || '';
        const promoterId = dbPromotersToUpdateMap.get(promoter.name.toUpperCase());

        if (promoterId) {
          await tx.promoter.update({
            where: { id: promoterId },
            data: { supervisorId },
          });
        }
      }

      // 4. Mapear IDs para visitas
      const allStoreCodes = Array.from(
        new Set([
          ...plan.visitsToCreate.map((v) => v.store.code),
          ...plan.visitsToUpdate.map((v) => v.store.code),
        ])
      );
      const allIndustryCodes = Array.from(
        new Set([
          ...plan.visitsToCreate.map((v) => v.industry.code),
          ...plan.visitsToUpdate.map((v) => v.industry.code),
        ])
      );
      const allPromoterNames = Array.from(
        new Set([
          ...plan.visitsToCreate.map((v) => v.promoter?.name).filter(Boolean),
          ...plan.visitsToUpdate.map((v) => v.promoter?.name).filter(Boolean),
        ])
      ) as string[];

      const [dbStores, dbIndustries, dbPromoters, operation] = await Promise.all([
        allStoreCodes.length > 0
          ? tx.store.findMany({ where: { code: { in: allStoreCodes } } })
          : Promise.resolve([]),
        allIndustryCodes.length > 0
          ? tx.industry.findMany({ where: { code: { in: allIndustryCodes } } })
          : Promise.resolve([]),
        allPromoterNames.length > 0
          ? tx.promoter.findMany({ where: { name: { in: allPromoterNames } } })
          : Promise.resolve([]),
        tx.operation.findUnique({ where: { id: operationId } }),
      ]);

      if (!operation) {
        throw new Error(`Operação com ID ${operationId} não encontrada no banco.`);
      }

      const storeMap = new Map(dbStores.map((s: any) => [s.code, s.id]));
      const industryMap = new Map(dbIndustries.map((i: any) => [i.code, i.id]));
      const promoterMap = new Map(dbPromoters.map((p: any) => [p.name.toUpperCase(), p.id]));

      // Carregar/criar promotor padrão uma única vez se houver visitas sem promotor
      let defaultPromoterId = '';
      const hasVisitsWithoutPromoter =
        plan.visitsToCreate.some((v) => !v.promoter) || plan.visitsToUpdate.some((v) => !v.promoter);

      if (hasVisitsWithoutPromoter) {
        let defaultPromoter = await tx.promoter.findFirst({
          where: { name: 'PROMOTOR PADRÃO' },
        });
        if (!defaultPromoter) {
          const defaultSupId = supervisorMap.get('SUPERVISOR PADRÃO') || '';
          defaultPromoter = await tx.promoter.create({
            data: {
              name: 'PROMOTOR PADRÃO',
              supervisorId: defaultSupId,
            },
          });
        }
        defaultPromoterId = defaultPromoter.id;
      }

      // 5. Persistir Visitas Criadas
      for (const cv of plan.visitsToCreate) {
        const storeId = storeMap.get(cv.store.code);
        const industryId = industryMap.get(cv.industry.code);
        let promoterId = cv.promoter ? promoterMap.get(cv.promoter.name.toUpperCase()) : null;

        if (!storeId || !industryId) {
          throw new Error(
            `Erro de integridade: Loja (${cv.store.code}) ou Indústria (${cv.industry.code}) não cadastrada.`
          );
        }

        if (!promoterId) {
          promoterId = defaultPromoterId;
        }

        const scheduledDate = new Date(operation.startsAt);
        scheduledDate.setDate(scheduledDate.getDate() + (cv.plannedVisitIndex - 1));

        await tx.visit.create({
          data: {
            operationId,
            storeId,
            industryId,
            promoterId: promoterId || '',
            scheduledDate,
            status: 'PLANEJADA',
          },
        });
      }

      // 6. Persistir Visitas Atualizadas
      const existingVisits = await tx.visit.findMany({
        where: { operationId },
        include: { store: true, industry: true, promoter: true },
      });

      const existingVisitsGrouped = groupExistingVisits(existingVisits);

      for (const cv of plan.visitsToUpdate) {
        const storeCode = cv.store.code;
        const industryCode = cv.industry.code;
        const promoterName = cv.promoter?.name?.toUpperCase() || 'NO_PROMOTER';
        const key = `${storeCode}-${industryCode}-${promoterName}`;

        const list = existingVisitsGrouped.get(key) || [];
        const existingVisitIndex = cv.plannedVisitIndex - 1;

        if (existingVisitIndex < list.length) {
          const existingVisit = list[existingVisitIndex];
          let promoterId = cv.promoter ? promoterMap.get(cv.promoter.name.toUpperCase()) : null;

          if (!promoterId) {
            promoterId = defaultPromoterId;
          }

          await tx.visit.update({
            where: { id: existingVisit.id },
            data: {
              promoterId,
            },
          });
        }
      }

      const durationMs = Date.now() - startTime;

      return {
        createdStores: plan.storesToCreate.length,
        updatedStores: plan.storesToUpdate.length,
        createdIndustries: plan.industriesToCreate.length,
        updatedIndustries: plan.industriesToUpdate.length,
        createdPromoters: plan.promotersToCreate.length,
        updatedPromoters: plan.promotersToUpdate.length,
        createdVisits: plan.visitsToCreate.length,
        updatedVisits: plan.visitsToUpdate.length,
        durationMs,
      };
    });
  }
}
