import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useMitraDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["mitra-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mitra_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const userProfileQuery = useQuery({
    queryKey: ["mitra-user-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const ordersQuery = useQuery({
    queryKey: ["mitra-orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, services(name, base_price, duration_minutes)")
        .eq("mitra_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user?.id,
  });

  const toggleAvailability = useMutation({
    mutationFn: async (newStatus: "active" | "inactive") => {
      const { error } = await supabase
        .from("mitra_profiles")
        .update({ status: newStatus })
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: (_, newStatus) => {
      queryClient.invalidateQueries({ queryKey: ["mitra-profile"] });
      toast({
        title: newStatus === "active" ? "Anda sekarang Aktif" : "Anda sekarang Nonaktif",
        description: newStatus === "active"
          ? "Anda akan menerima pesanan baru"
          : "Anda tidak akan menerima pesanan baru",
      });
    },
    onError: () => {
      toast({ title: "Gagal mengubah status", variant: "destructive" });
    },
  });

  const updateWorkingHours = useMutation({
    mutationFn: async (hours: { start: string; end: string }) => {
      const { error } = await supabase
        .from("mitra_profiles")
        .update({ working_hours: hours })
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mitra-profile"] });
      toast({ title: "Jam kerja berhasil diperbarui" });
    },
    onError: () => {
      toast({ title: "Gagal memperbarui jam kerja", variant: "destructive" });
    },
  });

  const updateOffDays = useMutation({
    mutationFn: async (days: string[]) => {
      const { error } = await supabase
        .from("mitra_profiles")
        .update({ off_days: days })
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mitra-profile"] });
      toast({ title: "Hari libur berhasil diperbarui" });
    },
    onError: () => {
      toast({ title: "Gagal memperbarui hari libur", variant: "destructive" });
    },
  });

  const updateServiceRadius = useMutation({
    mutationFn: async (radius: number) => {
      const { error } = await supabase
        .from("mitra_profiles")
        .update({ service_radius_km: radius })
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mitra-profile"] });
      toast({ title: "Radius layanan berhasil diperbarui" });
    },
    onError: () => {
      toast({ title: "Gagal memperbarui radius", variant: "destructive" });
    },
  });

  // Computed stats
  const orders = ordersQuery.data ?? [];
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + Number(o.total_price), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const inProgressOrders = orders.filter((o) => o.status === "in_progress").length;

  // Monthly revenue (last 6 months)
  const monthlyRevenue = (() => {
    const months: { month: string; revenue: number; orders: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
      const monthOrders = orders.filter((o) => {
        const od = new Date(o.created_at);
        return (
          od.getFullYear() === d.getFullYear() &&
          od.getMonth() === d.getMonth() &&
          o.status === "completed"
        );
      });
      months.push({
        month: label,
        revenue: monthOrders.reduce((s, o) => s + Number(o.total_price), 0),
        orders: monthOrders.length,
      });
    }
    return months;
  })();

  return {
    profile: profileQuery.data,
    userProfile: userProfileQuery.data,
    orders,
    totalOrders,
    completedOrders,
    totalRevenue,
    pendingOrders,
    inProgressOrders,
    monthlyRevenue,
    isLoading: profileQuery.isLoading || ordersQuery.isLoading,
    toggleAvailability,
    updateWorkingHours,
    updateOffDays,
    updateServiceRadius,
  };
};
