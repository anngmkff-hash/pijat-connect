import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FinanceStats {
  totalRevenue: number;
  completedOrders: number;
  pendingRevenue: number;
  cancelledOrders: number;
  revenueByMonth: { month: string; revenue: number; orders: number }[];
  recentTransactions: {
    id: string;
    customer_name: string;
    service_name: string;
    total_price: number;
    status: string;
    created_at: string;
  }[];
}

export const useAdminFinance = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-finance"],
    queryFn: async (): Promise<FinanceStats> => {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;

      const allOrders = orders || [];

      const completed = allOrders.filter((o) => o.status === "completed");
      const pending = allOrders.filter((o) => ["pending", "confirmed", "in_progress"].includes(o.status));
      const cancelled = allOrders.filter((o) => o.status === "cancelled");

      const totalRevenue = completed.reduce((sum, o) => sum + Number(o.total_price), 0);
      const pendingRevenue = pending.reduce((sum, o) => sum + Number(o.total_price), 0);

      // Revenue by month
      const monthMap = new Map<string, { revenue: number; orders: number }>();
      completed.forEach((o) => {
        const month = new Date(o.created_at).toISOString().slice(0, 7);
        const existing = monthMap.get(month) || { revenue: 0, orders: 0 };
        monthMap.set(month, {
          revenue: existing.revenue + Number(o.total_price),
          orders: existing.orders + 1,
        });
      });
      const revenueByMonth = Array.from(monthMap.entries())
        .map(([month, data]) => ({ month, ...data }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-12);

      // Recent transactions with names
      const recentOrders = allOrders.slice(0, 10);
      const customerIds = [...new Set(recentOrders.map((o) => o.customer_id))];
      const serviceIds = [...new Set(recentOrders.filter((o) => o.service_id).map((o) => o.service_id!))];

      const [profilesRes, servicesRes] = await Promise.all([
        supabase.from("profiles").select("user_id, full_name").in("user_id", customerIds),
        serviceIds.length > 0
          ? supabase.from("services").select("id, name").in("id", serviceIds)
          : { data: [] },
      ]);

      const profileMap = new Map((profilesRes.data || []).map((p) => [p.user_id, p.full_name]));
      const serviceMap = new Map(((servicesRes as any).data || []).map((s: any) => [s.id, s.name]));

      const recentTransactions = recentOrders.map((o) => ({
        id: o.id,
        customer_name: profileMap.get(o.customer_id) || "Unknown",
        service_name: o.service_id ? (serviceMap.get(o.service_id) as string) || "-" : "-",
        total_price: Number(o.total_price),
        status: o.status,
        created_at: o.created_at,
      }));

      return {
        totalRevenue,
        completedOrders: completed.length,
        pendingRevenue,
        cancelledOrders: cancelled.length,
        revenueByMonth,
        recentTransactions,
      };
    },
  });

  return { stats, isLoading };
};
