import { z } from "zod";

export const updateClientSchema = z.object({
  name: z.string().trim().min(2).optional(),
  phone: z.string().trim().optional().nullable(),
  note: z.string().trim().optional().nullable(),
});