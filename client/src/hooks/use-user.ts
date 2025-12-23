import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type insertUserSchema } from "@shared/routes";
import { z } from "zod";

type InsertUser = z.infer<typeof insertUserSchema>;

export function useUser() {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: [api.user.get.path],
    queryFn: async () => {
      const res = await fetch(api.user.get.path);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch profile");
      return api.user.get.responses[200].parse(await res.json());
    },
    retry: false,
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const validated = api.user.update.input.parse(data);
      const res = await fetch(api.user.update.path, {
        method: api.user.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.user.update.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to update profile");
      }
      return api.user.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.user.get.path] });
    },
  });

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    updateUser: updateUserMutation.mutate,
    isUpdating: updateUserMutation.isPending,
  };
}
