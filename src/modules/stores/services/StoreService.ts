import { prisma } from '@/lib/prisma';
import { validateStoreData, validateStoreUpdateData } from '../validators/store.validator';

const normalizeStoreInput = (data: Record<string, any>) => {
  const next = { ...data };
  // Convert empty strings to null for optional string fields
  if (next.chain === '') next.chain = null;
  if (next.city === '') next.city = null;
  if (next.state === '') next.state = null;
  return next;
};

export const storeService = {
  async getStores(options: { page?: number; limit?: number; search?: string; chain?: string; city?: string; state?: string } = {}) {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Record<string, any> = {};

    if (options.search) {
      where.name = { contains: options.search, mode: 'insensitive' };
    }

    if (options.chain) {
      where.chain = options.chain;
    }

    if (options.city) {
      where.city = options.city;
    }

    if (options.state) {
      where.state = options.state;
    }

    const [items, total] = await Promise.all([
      prisma.store.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.store.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  async getStoreById(id: string) {
    const store = await prisma.store.findUnique({ where: { id } });

    if (!store) {
      const error = new Error('Store not found');
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    return store;
  },

  async createStore(data: Record<string, any>) {
    const validated = validateStoreData(normalizeStoreInput(data));
    return prisma.store.create({ data: validated });
  },

  async updateStore(id: string, data: Record<string, any>) {
    const existing = await prisma.store.findUnique({ where: { id } });

    if (!existing) {
      const error = new Error('Store not found');
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    const validated = validateStoreUpdateData(normalizeStoreInput(data)) as Record<string, any>;
    return prisma.store.update({ where: { id }, data: validated });
  },

  async deleteStore(id: string) {
    const existing = await prisma.store.findUnique({ where: { id } });

    if (!existing) {
      const error = new Error('Store not found');
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    // Check if store has associated visits
    const visitCount = await prisma.visit.count({ where: { storeId: id } });
    if (visitCount > 0) {
      const error = new Error('Cannot delete store with associated visits');
      (error as Error & { status?: number }).status = 400;
      throw error;
    }

    await prisma.store.delete({ where: { id } });
    return { success: true };
  },
};

export default storeService;