import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useAiDetection() {
  const queryClient = useQueryClient();

  const detectObject = useMutation({
    mutationFn: async (image: string) => {
      const res = await fetch(api.ai.detectObject.path, {
        method: api.ai.detectObject.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      
      if (!res.ok) throw new Error("Failed to detect object");
      return api.ai.detectObject.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.logs.list.path] }),
  });

  const readText = useMutation({
    mutationFn: async (image: string) => {
      const res = await fetch(api.ai.readText.path, {
        method: api.ai.readText.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      
      if (!res.ok) throw new Error("Failed to read text");
      return api.ai.readText.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.logs.list.path] }),
  });

  const detectCurrency = useMutation({
    mutationFn: async (image: string) => {
      const res = await fetch(api.ai.detectCurrency.path, {
        method: api.ai.detectCurrency.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      
      if (!res.ok) throw new Error("Failed to detect currency");
      return api.ai.detectCurrency.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.logs.list.path] }),
  });

  return {
    detectObject,
    readText,
    detectCurrency
  };
}
