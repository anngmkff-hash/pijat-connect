import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export interface AdminUser {
  user_id: string;
  full_name: string;
  phone: string | null;
  city: string | null;
  avatar_url: string | null;
  created_at: string;
  role: AppRole;
}

export const useAdminUsers = () => {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // Fetch profiles and roles separately, then join client-side
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("user_id, full_name, phone, city, avatar_url, created_at"),
        supabase.from("user_roles").select("user_id, role"),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (rolesRes.error) throw rolesRes.error;

      const rolesMap = new Map(rolesRes.data.map((r) => [r.user_id, r.role as AppRole]));

      const merged: AdminUser[] = (profilesRes.data || []).map((p) => ({
        user_id: p.user_id,
        full_name: p.full_name,
        phone: p.phone,
        city: p.city,
        avatar_url: p.avatar_url,
        created_at: p.created_at,
        role: rolesMap.get(p.user_id) || "customer",
      }));

      return merged;
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: AppRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Role berhasil diupdate");
    },
    onError: (error) => {
      toast.error("Gagal update role: " + error.message);
    },
  });

  return {
    users,
    isLoading,
    updateRole: updateRoleMutation.mutate,
    isUpdatingRole: updateRoleMutation.isPending,
  };
};
