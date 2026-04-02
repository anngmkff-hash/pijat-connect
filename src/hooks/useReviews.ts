import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useReviews = () => {
  const { user } = useAuth();

  const { data: userReviews = [], isLoading } = useQuery({
    queryKey: ["order-reviews", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("reviews" as any)
        .select("*")
        .eq("customer_id", user.id);
      if (error) throw error;
      return (data as any[]) || [];
    },
    enabled: !!user,
  });

  const hasReview = (orderId: string) =>
    userReviews.some((r: any) => r.order_id === orderId);

  return { userReviews, isLoading, hasReview };
};
