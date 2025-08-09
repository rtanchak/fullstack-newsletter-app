import { z } from "zod";

export const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
