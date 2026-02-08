import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AdminStats {
  totalUsers: number;
  totalMitra: number;
  totalCustomers: number;
  pendingVerifications: number;
  activeMitra: number;
  totalServices: number;
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async (): Promise<AdminStats> => {
      // Fetch total users by role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role");

      if (roleError) throw roleError;

      const totalMitra = roleData?.filter((r) => r.role === "mitra").length || 0;
      const totalCustomers = roleData?.filter((r) => r.role === "customer").length || 0;
      const totalAdmins = roleData?.filter((r) => r.role === "admin").length || 0;
      const totalUsers = totalMitra + totalCustomers + totalAdmins;

      // Fetch pending mitra verifications
      const { data: mitraData, error: mitraError } = await supabase
        .from("mitra_profiles")
        .select("verification_status, status");

      if (mitraError) throw mitraError;

      const pendingVerifications =
        mitraData?.filter((m) => m.verification_status === "pending").length || 0;
      const activeMitra =
        mitraData?.filter(
          (m) => m.verification_status === "approved" && m.status === "active"
        ).length || 0;

      // Fetch total services
      const { count: servicesCount, error: servicesError } = await supabase
        .from("services")
        .select("*", { count: "exact", head: true });

      if (servicesError) throw servicesError;

      return {
        totalUsers,
        totalMitra,
        totalCustomers,
        pendingVerifications,
        activeMitra,
        totalServices: servicesCount || 0,
      };
    },
  });
};
