import { useMutation } from "@tanstack/react-query";
import type { SubscribeInput } from "../modules/subscribers/subscribers.schemas";
import type { ApiEnvelope } from "../lib/api/api";
import apiClient from "../lib/api/axios";

type SubscribeResult = { ok: boolean; email: string };

export function useSubscribe(onSuccess?: (email: string) => void) {
  return useMutation<SubscribeResult, Error, SubscribeInput>({
    mutationFn: async (input) => {
      try {
        await apiClient.post<ApiEnvelope<{ email: string; id: string; active: boolean }>>(
          "/v1/subscriptions",
          input
        );
        
        return { ok: true, email: input.email };
      } catch (error: unknown) {
        throw new Error((error as { response: { data: { error: { message: string } } } }).response?.data?.error?.message || (error as { message: string }).message || "Failed to subscribe");  
      }
    },
    onSuccess: (res) => {
      if (res.ok) onSuccess?.(res.email);
    },
  });
}
