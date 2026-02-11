import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

export type Service = Tables<"services">;

export const useAdminServices = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Service[];
    },
  });

  const createService = useMutation({
    mutationFn: async (service: TablesInsert<"services">) => {
      const { error } = await supabase.from("services").insert(service);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast({ title: "Layanan berhasil ditambahkan" });
    },
    onError: (e: Error) => {
      toast({ title: "Gagal menambahkan layanan", description: e.message, variant: "destructive" });
    },
  });

  const updateService = useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"services"> & { id: string }) => {
      const { error } = await supabase.from("services").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast({ title: "Layanan berhasil diupdate" });
    },
    onError: (e: Error) => {
      toast({ title: "Gagal mengupdate layanan", description: e.message, variant: "destructive" });
    },
  });

  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast({ title: "Layanan berhasil dihapus" });
    },
    onError: (e: Error) => {
      toast({ title: "Gagal menghapus layanan", description: e.message, variant: "destructive" });
    },
  });

  return { services, isLoading, createService, updateService, deleteService };
};
