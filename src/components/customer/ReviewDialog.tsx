import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  customerId: string;
  mitraId: string;
  serviceName?: string;
}

const ReviewDialog = ({
  open,
  onOpenChange,
  orderId,
  customerId,
  mitraId,
  serviceName,
}: ReviewDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitReview = useMutation({
    mutationFn: async () => {
      if (rating === 0) throw new Error("Pilih rating terlebih dahulu");

      const { error } = await supabase.from("reviews" as any).insert({
        order_id: orderId,
        customer_id: customerId,
        mitra_id: mitraId,
        rating,
        comment: comment.trim() || null,
      } as any);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-reviews"] });
      toast({
        title: "Terima kasih! ⭐",
        description: "Review Anda berhasil dikirim.",
      });
      setRating(0);
      setComment("");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Gagal mengirim review",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const displayRating = hoveredRating || rating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Beri Rating & Review</DialogTitle>
          <DialogDescription>
            {serviceName
              ? `Bagaimana pengalaman Anda dengan layanan ${serviceName}?`
              : "Bagaimana pengalaman Anda?"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Star Rating */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      star <= displayRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {displayRating === 0 && "Ketuk bintang untuk memberi rating"}
              {displayRating === 1 && "Sangat Buruk"}
              {displayRating === 2 && "Buruk"}
              {displayRating === 3 && "Cukup"}
              {displayRating === 4 && "Baik"}
              {displayRating === 5 && "Sangat Baik"}
            </p>
          </div>

          {/* Comment */}
          <Textarea
            placeholder="Tulis komentar Anda (opsional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />

          {/* Submit */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitReview.isPending}
            >
              Batal
            </Button>
            <Button
              onClick={() => submitReview.mutate()}
              disabled={rating === 0 || submitReview.isPending}
            >
              {submitReview.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : (
                <Star className="h-4 w-4 mr-1.5" />
              )}
              Kirim Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
