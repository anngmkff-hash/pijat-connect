import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface OrderWithDetails {
  id: string;
  customer_id: string;
  mitra_id: string | null;
  service_id: string | null;
  status: string;
  total_price: number;
  address: string | null;
  scheduled_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  mitra_name?: string;
  service_name?: string;
}

export const useAdminOrders = () => {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      if (!ordersData || ordersData.length === 0) return [] as OrderWithDetails[];

      // Fetch related names
      const customerIds = [...new Set(ordersData.map((o) => o.customer_id))];
      const mitraIds = [...new Set(ordersData.filter((o) => o.mitra_id).map((o) => o.mitra_id!))];
      const serviceIds = [...new Set(ordersData.filter((o) => o.service_id).map((o) => o.service_id!))];

      const [profilesRes, servicesRes] = await Promise.all([
        supabase.from("profiles").select("user_id, full_name").in("user_id", [...customerIds, ...mitraIds]),
        serviceIds.length > 0 ? supabase.from("services").select("id, name").in("id", serviceIds) : { data: [] },
      ]);

      const profileMap = new Map((profilesRes.data || []).map((p) => [p.user_id, p.full_name]));
      const serviceMap = new Map(((servicesRes as any).data || []).map((s: any) => [s.id, s.name]));

      return ordersData.map((o) => ({
        ...o,
        customer_name: profileMap.get(o.customer_id) || "Unknown",
        mitra_name: o.mitra_id ? profileMap.get(o.mitra_id) || "Belum ditugaskan" : "Belum ditugaskan",
        service_name: o.service_id ? serviceMap.get(o.service_id) || "Unknown" : "-",
      })) as OrderWithDetails[];
    },
  });

  return { orders, isLoading };
};
