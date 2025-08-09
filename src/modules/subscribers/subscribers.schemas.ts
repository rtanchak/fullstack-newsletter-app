import { z } from "zod";

export const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email().min(1, "Email is required"),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
