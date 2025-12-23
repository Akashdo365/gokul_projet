import { useMutation } from "@tanstack/react-query";
import { api, type insertEmergencyLogSchema } from "@shared/routes";
import { z } from "zod";

type EmergencyInput = z.infer<typeof insertEmergencyLogSchema>;

export function useEmergency() {
  return useMutation({
    mutationFn: async (data: EmergencyInput) => {
      const res = await fetch(api.emergency.trigger.path, {
        method: api.emergency.trigger.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to trigger emergency alert");
      return api.emergency.trigger.responses[200].parse(await res.json());
    },
  });
}
