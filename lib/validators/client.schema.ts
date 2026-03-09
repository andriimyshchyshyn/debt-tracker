import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 chars"),
  phone: z.string().trim().optional().nullable(),
  note: z.string().trim().optional().nullable(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;