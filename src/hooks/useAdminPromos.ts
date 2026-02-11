import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Promo {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  min_order_amount: number | null;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  starts_at: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PromoForm {
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  min_order_amount: number;
  max_discount: number | null;
  usage_limit: number | null;
  is_active: boolean;
  starts_at: string;
  expires_at: string;
}

export const useAdminPromos = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: promos = [], isLoading } = useQuery({
    queryKey: ["admin-promos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promos")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Promo[];
    },
  });

  const createPromo = useMutation({
    mutationFn: async (promo: Partial<PromoForm>) => {
      const { error } = await supabase.from("promos").insert(promo as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-promos"] });
      toast({ title: "Promo berhasil ditambahkan" });
    },
    onError: (e: Error) => {
      toast({ title: "Gagal menambahkan promo", description: e.message, variant: "destructive" });
    },
  });

  const updatePromo = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PromoForm> & { id: string }) => {
      const { error } = await supabase.from("promos").update(updates as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-promos"] });
      toast({ title: "Promo berhasil diupdate" });
    },
    onError: (e: Error) => {
      toast({ title: "Gagal mengupdate promo", description: e.message, variant: "destructive" });
    },
  });

  const deletePromo = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("promos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-promos"] });
      toast({ title: "Promo berhasil dihapus" });
    },
    onError: (e: Error) => {
      toast({ title: "Gagal menghapus promo", description: e.message, variant: "destructive" });
    },
  });

  return { promos, isLoading, createPromo, updatePromo, deletePromo };
};
