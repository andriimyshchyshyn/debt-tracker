import { z } from "zod";

export const createSaleSchema = z.object({
  clientId: z.string().min(1),
  amountUAH: z.number().int().positive(),
  comment: z.string().trim().optional().nullable(),
  date: z.string().datetime().optional(), // ISO string
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;