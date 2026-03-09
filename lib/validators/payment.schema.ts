import { z } from "zod";

export const createPaymentSchema = z.object({
  clientId: z.string().min(1),
  amountUAH: z.number().int().positive(),
  comment: z.string().trim().optional().nullable(),
  date: z.string().datetime().optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;