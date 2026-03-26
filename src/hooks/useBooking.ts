import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export interface BookingData {
  serviceId: string;
  scheduledAt: Date;
  timeSlot: string;
  address: string;
  notes: string;
}

export const useBooking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);

  const { data: services = [], isLoading: loadingServices } = useQuery({
    queryKey: ["active-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: customerOrders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ["customer-orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("orders")
        .select("*, services(name, icon, duration_minutes)")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createOrder = useMutation({
    mutationFn: async (booking: BookingData) => {
      if (!user) throw new Error("Not authenticated");

      const service = services.find((s) => s.id === booking.serviceId);
      if (!service) throw new Error("Service not found");

      const scheduledDate = new Date(booking.scheduledAt);
      const [hours, minutes] = booking.timeSlot.split(":").map(Number);
      scheduledDate.setHours(hours, minutes, 0, 0);

      const { data, error } = await supabase
        .from("orders")
        .insert({
          customer_id: user.id,
          service_id: booking.serviceId,
          total_price: service.base_price,
          scheduled_at: scheduledDate.toISOString(),
          address: booking.address,
          notes: booking.notes || null,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
      toast({
        title: "Pesanan Berhasil! 🎉",
        description: "Lanjutkan ke pembayaran.",
      });
      navigate(`/payment?order=${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal membuat pesanan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  return {
    step,
    setStep,
    nextStep,
    prevStep,
    services,
    loadingServices,
    customerOrders,
    loadingOrders,
    createOrder,
  };
};
