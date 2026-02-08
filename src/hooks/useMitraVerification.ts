import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type VerificationStatus = Database["public"]["Enums"]["verification_status"];

interface MitraWithProfile {
  id: string;
  user_id: string;
  verification_status: VerificationStatus;
  status: Database["public"]["Enums"]["mitra_status"];
  ktp_url: string | null;
  certificate_url: string | null;
  bio: string | null;
  specializations: string[] | null;
  created_at: string;
  profile: {
    full_name: string;
    phone: string | null;
    avatar_url: string | null;
    city: string | null;
  } | null;
}

export const useMitraVerification = () => {
  const queryClient = useQueryClient();

  const { data: pendingMitra, isLoading } = useQuery({
    queryKey: ["pending-mitra"],
    queryFn: async (): Promise<MitraWithProfile[]> => {
      // First get mitra profiles
      const { data: mitraData, error: mitraError } = await supabase
        .from("mitra_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (mitraError) throw mitraError;

      // Then get profiles for each mitra
      const mitraWithProfiles: MitraWithProfile[] = [];

      for (const mitra of mitraData || []) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, phone, avatar_url, city")
          .eq("user_id", mitra.user_id)
          .maybeSingle();

        mitraWithProfiles.push({
          ...mitra,
          profile: profileData,
        });
      }

      return mitraWithProfiles;
    },
  });

  const updateVerificationMutation = useMutation({
    mutationFn: async ({
      mitraId,
      status,
    }: {
      mitraId: string;
      status: VerificationStatus;
    }) => {
      const updateData: { verification_status: VerificationStatus; verified_at?: string } = {
        verification_status: status,
      };

      if (status === "approved") {
        updateData.verified_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("mitra_profiles")
        .update(updateData)
        .eq("id", mitraId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pending-mitra"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success(
        variables.status === "approved"
          ? "Mitra berhasil diverifikasi"
          : "Mitra ditolak"
      );
    },
    onError: (error) => {
      console.error("Error updating verification:", error);
      toast.error("Gagal mengupdate status verifikasi");
    },
  });

  return {
    pendingMitra,
    isLoading,
    approveMitra: (mitraId: string) =>
      updateVerificationMutation.mutate({ mitraId, status: "approved" }),
    rejectMitra: (mitraId: string) =>
      updateVerificationMutation.mutate({ mitraId, status: "rejected" }),
    isUpdating: updateVerificationMutation.isPending,
  };
};
