import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface OrdersByStatus {
  status: string;
  count: number;
  label: string;
}

export interface RevenueByMonth {
  month: string;
  revenue: number;
  orders: number;
}

export interface TopService {
  name: string;
  orders: number;
  revenue: number;
}

export interface MitraPerformance {
  name: string;
  totalOrders: number;
  completedOrders: number;
  rating: number;
  revenue: number;
}

export interface ReportStats {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  completionRate: number;
  ordersByStatus: OrdersByStatus[];
  revenueByMonth: RevenueByMonth[];
  ordersByMonth: { month: string; count: number }[];
  topServices: TopService[];
  mitraPerformance: MitraPerformance[];
}

const statusLabels: Record<string, string> = {
  completed: "Selesai",
  pending: "Pending",
  confirmed: "Dikonfirmasi",
  in_progress: "Berlangsung",
  cancelled: "Dibatalkan",
};

export const useAdminReports = () => {
  return useQuery({
    queryKey: ["admin-reports"],
    queryFn: async (): Promise<ReportStats> => {
      // Fetch all orders
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (ordersError) throw ordersError;

      const allOrders = orders || [];
      const completed = allOrders.filter((o) => o.status === "completed");

      // Orders by status
      const statusCounts = new Map<string, number>();
      allOrders.forEach((o) => {
        statusCounts.set(o.status, (statusCounts.get(o.status) || 0) + 1);
      });
      const ordersByStatus: OrdersByStatus[] = Array.from(statusCounts.entries()).map(
        ([status, count]) => ({
          status,
          count,
          label: statusLabels[status] || status,
        })
      );

      // Revenue & orders by month (last 12 months)
      const monthRevenueMap = new Map<string, { revenue: number; orders: number }>();
      allOrders.forEach((o) => {
        const d = new Date(o.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const existing = monthRevenueMap.get(key) || { revenue: 0, orders: 0 };
        monthRevenueMap.set(key, {
          revenue:
            o.status === "completed"
              ? existing.revenue + Number(o.total_price)
              : existing.revenue,
          orders: existing.orders + 1,
        });
      });

      const sortedMonths = Array.from(monthRevenueMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-12);

      const revenueByMonth: RevenueByMonth[] = sortedMonths.map(([month, data]) => ({
        month: formatMonthLabel(month),
        revenue: data.revenue,
        orders: data.orders,
      }));

      const ordersByMonth = sortedMonths.map(([month, data]) => ({
        month: formatMonthLabel(month),
        count: data.orders,
      }));

      // Top services
      const serviceIds = [...new Set(allOrders.filter((o) => o.service_id).map((o) => o.service_id!))];
      const { data: services } = serviceIds.length > 0
        ? await supabase.from("services").select("id, name").in("id", serviceIds)
        : { data: [] };
      const serviceMap = new Map((services || []).map((s) => [s.id, s.name]));

      const serviceStats = new Map<string, { name: string; orders: number; revenue: number }>();
      allOrders.forEach((o) => {
        if (!o.service_id) return;
        const name = serviceMap.get(o.service_id) || "Unknown";
        const existing = serviceStats.get(o.service_id) || { name, orders: 0, revenue: 0 };
        serviceStats.set(o.service_id, {
          name,
          orders: existing.orders + 1,
          revenue:
            o.status === "completed"
              ? existing.revenue + Number(o.total_price)
              : existing.revenue,
        });
      });
      const topServices = Array.from(serviceStats.values())
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 5);

      // Mitra performance
      const mitraIds = [...new Set(allOrders.filter((o) => o.mitra_id).map((o) => o.mitra_id!))];
      const [profilesRes, mitraProfilesRes] = await Promise.all([
        mitraIds.length > 0
          ? supabase.from("profiles").select("user_id, full_name").in("user_id", mitraIds)
          : { data: [] },
        mitraIds.length > 0
          ? supabase.from("mitra_profiles").select("user_id, rating_average, total_orders").in("user_id", mitraIds)
          : { data: [] },
      ]);

      const profileMap = new Map(((profilesRes as any).data || []).map((p: any) => [p.user_id, p.full_name]));
      const mitraMap = new Map(
        ((mitraProfilesRes as any).data || []).map((m: any) => [
          m.user_id,
          { rating: Number(m.rating_average) || 0 },
        ])
      );

      const mitraStatsMap = new Map<
        string,
        { totalOrders: number; completedOrders: number; revenue: number }
      >();
      allOrders.forEach((o) => {
        if (!o.mitra_id) return;
        const existing = mitraStatsMap.get(o.mitra_id) || {
          totalOrders: 0,
          completedOrders: 0,
          revenue: 0,
        };
        mitraStatsMap.set(o.mitra_id, {
          totalOrders: existing.totalOrders + 1,
          completedOrders:
            o.status === "completed"
              ? existing.completedOrders + 1
              : existing.completedOrders,
          revenue:
            o.status === "completed"
              ? existing.revenue + Number(o.total_price)
              : existing.revenue,
        });
      });

      const mitraPerformance: MitraPerformance[] = Array.from(mitraStatsMap.entries())
        .map(([id, data]) => ({
          name: profileMap.get(id) || "Unknown",
          totalOrders: data.totalOrders,
          completedOrders: data.completedOrders,
          rating: mitraMap.get(id)?.rating || 0,
          revenue: data.revenue,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      const totalRevenue = completed.reduce((sum, o) => sum + Number(o.total_price), 0);
      const completionRate =
        allOrders.length > 0 ? (completed.length / allOrders.length) * 100 : 0;

      return {
        totalOrders: allOrders.length,
        totalRevenue,
        avgOrderValue: completed.length > 0 ? totalRevenue / completed.length : 0,
        completionRate,
        ordersByStatus,
        revenueByMonth,
        ordersByMonth,
        topServices,
        mitraPerformance,
      };
    },
  });
};

function formatMonthLabel(key: string): string {
  const [year, month] = key.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${months[parseInt(month) - 1]} ${year.slice(2)}`;
}
