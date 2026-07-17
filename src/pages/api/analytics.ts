import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, VisitStatus } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { operationId, startDate, endDate } = req.query;

    const where: any = {};

    if (operationId && typeof operationId === 'string') {
      where.operationId = operationId;
    }

    const dateFilters: any = {};
    if (startDate && typeof startDate === 'string') {
      dateFilters.gte = new Date(startDate);
    }
    if (endDate && typeof endDate === 'string') {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilters.lte = end;
    }
    if (Object.keys(dateFilters).length) {
      where.scheduledDate = dateFilters;
    }

    const visits = await prisma.visit.findMany({
      where,
      include: {
        promoter: true,
        store: true,
        industry: true,
        operation: true,
      },
      orderBy: {
        scheduledDate: 'desc',
      },
    });

    const total = visits.length;
    const statusCount: Record<string, number> = {};
    let realizedCount = 0;

    visits.forEach((visit) => {
      const status = visit.status ?? VisitStatus.PLANEJADA;
      statusCount[status] = (statusCount[status] || 0) + 1;
      if (visit.status === VisitStatus.REALIZADA) {
        realizedCount += 1;
      }
    });

    const realizedPercentage = total > 0 ? (realizedCount / total) * 100 : 0;

    const metrics = {
      totalVisits: total,
      visitsByStatus: statusCount,
      realizedPercentage: Number(realizedPercentage.toFixed(2)),
    };

    return res.status(200).json({ visits, metrics });
  } catch (error: any) {
    console.error('Erro ao buscar analytics:', error);
    return res
      .status(500)
      .json({ error: 'Erro interno do servidor', details: error.message });
  } finally {
    await prisma.$disconnect();
  }
}