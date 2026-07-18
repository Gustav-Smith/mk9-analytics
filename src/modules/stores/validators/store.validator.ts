import { z } from 'zod';

/**
 * Zod schema for store validation
 */
export const storeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  code: z.string().min(1, 'Code is required').max(50),
  chain: z.string().max(100).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
});

/**
 * Zod schema for store update (partial)
 */
export const storeUpdateSchema = storeSchema.partial();

/**
 * Validate store data
 * @param data - Data to validate
 * @returns Validated data or throws Zod error
 */
export function validateStoreData(data: unknown) {
  return storeSchema.parse(data);
}

/**
 * Validate store update data
 * @param data - Data to validate
 * @returns Validated data or throws Zod error
 */
export function validateStoreUpdateData(data: unknown) {
  return storeUpdateSchema.parse(data);
}

export type StoreFormValues = z.infer<typeof storeSchema>;