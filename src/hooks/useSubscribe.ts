import { useMutation } from "@tanstack/react-query";
import type { SubscribeInput } from "../modules/subscribers/subscribers.schemas";
import type { ApiEnvelope } from "../lib/api";
import apiClient from "../lib/axios";

type SubscribeResult = { ok: boolean; email: string };

export function useSubscribe(onSuccess?: (email: string) => void) {
  return useMutation<SubscribeResult, Error, SubscribeInput>({
    mutationFn: async (input) => {
      try {
        const response = await apiClient.post<ApiEnvelope<{ email: string; id: string; active: boolean }>>(
          "/v1/subscriptions",
          input
        );
        
        return { ok: true, email: input.email };
      } catch (error: any) {
        const errorMessage = error.response?.data?.error?.message || error.message || "Failed to subscribe";
        throw new Error(errorMessage);
      }
    },
    onSuccess: (res) => {
      if (res.ok) onSuccess?.(res.email);
    },
  });
}
