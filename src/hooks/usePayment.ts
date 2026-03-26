import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type PaymentMethod = "transfer_bank" | "qris" | "ewallet" | "cash";

export const PAYMENT_METHODS: { value: PaymentMethod; label: string; description: string; icon: string }[] = [
  { value: "transfer_bank", label: "Transfer Bank", description: "BCA, BNI, Mandiri, BRI", icon: "🏦" },
  { value: "qris", label: "QRIS", description: "Scan QR untuk bayar", icon: "📱" },
  { value: "ewallet", label: "E-Wallet", description: "GoPay, OVO, Dana, ShopeePay", icon: "💳" },
  { value: "cash", label: "Bayar Tunai", description: "Bayar langsung ke terapis", icon: "💵" },
];

export const BANK_ACCOUNTS = [
  { bank: "BCA", account: "1234567890", name: "PT PijatPro Indonesia" },
  { bank: "BNI", account: "0987654321", name: "PT PijatPro Indonesia" },
  { bank: "Mandiri", account: "1122334455", name: "PT PijatPro Indonesia" },
];

export const usePayment = (orderId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: payment, isLoading } = useQuery({
    queryKey: ["payment", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("order_id", orderId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });

  const createPayment = useMutation({
    mutationFn: async ({ orderId, amount, paymentMethod }: { orderId: string; amount: number; paymentMethod: PaymentMethod }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("payments")
        .insert({
          order_id: orderId,
          customer_id: user.id,
          amount,
          payment_method: paymentMethod,
          payment_status: paymentMethod === "cash" ? "confirmed" : "pending",
          confirmed_at: paymentMethod === "cash" ? new Date().toISOString() : null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["payment"] });
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
      toast({
        title: data.payment_status === "confirmed" ? "Pembayaran Dikonfirmasi ✅" : "Pembayaran Diproses 🔄",
        description: data.payment_status === "confirmed"
          ? "Pembayaran tunai akan dilakukan saat sesi."
          : "Silakan lakukan transfer dan tunggu konfirmasi admin.",
      });
    },
    onError: (error: Error) => {
      toast({ title: "Gagal membuat pembayaran", description: error.message, variant: "destructive" });
    },
  });

  return { payment, isLoading, createPayment };
};

export const useAdminPayments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*, orders(*, services(name, icon))")
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Fetch customer profiles
      const customerIds = [...new Set((data || []).map((p: any) => p.customer_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, phone")
        .in("user_id", customerIds);

      const profileMap = Object.fromEntries((profiles || []).map((p) => [p.user_id, p]));

      return (data || []).map((p: any) => ({
        ...p,
        customer_name: profileMap[p.customer_id]?.full_name || "Unknown",
        customer_phone: profileMap[p.customer_id]?.phone || "-",
      }));
    },
  });

  const confirmPayment = useMutation({
    mutationFn: async ({ paymentId, adminNotes }: { paymentId: string; adminNotes?: string }) => {
      const { error } = await supabase
        .from("payments")
        .update({
          payment_status: "confirmed",
          confirmed_at: new Date().toISOString(),
          admin_notes: adminNotes || null,
        })
        .eq("id", paymentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
      toast({ title: "Pembayaran Dikonfirmasi ✅" });
    },
    onError: (error: Error) => {
      toast({ title: "Gagal konfirmasi", description: error.message, variant: "destructive" });
    },
  });

  const rejectPayment = useMutation({
    mutationFn: async ({ paymentId, adminNotes }: { paymentId: string; adminNotes?: string }) => {
      const { error } = await supabase
        .from("payments")
        .update({
          payment_status: "rejected",
          admin_notes: adminNotes || "Pembayaran ditolak",
        })
        .eq("id", paymentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
      toast({ title: "Pembayaran Ditolak", variant: "destructive" });
    },
    onError: (error: Error) => {
      toast({ title: "Gagal menolak", description: error.message, variant: "destructive" });
    },
  });

  return { payments, isLoading, confirmPayment, rejectPayment };
};
