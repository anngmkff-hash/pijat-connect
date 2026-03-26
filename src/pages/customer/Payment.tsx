import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePayment, PAYMENT_METHODS, BANK_ACCOUNTS, PaymentMethod } from "@/hooks/usePayment";
import { useBooking } from "@/hooks/useBooking";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Leaf, ArrowLeft, CreditCard, CheckCircle2, Copy, Loader2, Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CustomerPayment = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { customerOrders } = useBooking();
  const { payment, isLoading, createPayment } = usePayment(orderId || undefined);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("transfer_bank");

  const order = customerOrders.find((o) => o.id === orderId);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Disalin!", description: "Nomor rekening berhasil disalin" });
  };

  if (!orderId || !order) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Pesanan tidak ditemukan</p>
            <Link to="/dashboard"><Button>Kembali ke Dashboard</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Already paid
  if (payment) {
    return (
      <div className="min-h-screen bg-muted/30">
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Leaf className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Status Pembayaran</span>
            </div>
          </div>
        </header>
        <main className="container py-8 max-w-lg">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              {payment.payment_status === "confirmed" ? (
                <>
                  <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
                  <h2 className="text-2xl font-bold text-foreground">Pembayaran Dikonfirmasi</h2>
                  <p className="text-muted-foreground">Pembayaran Anda telah diterima dan dikonfirmasi.</p>
                </>
              ) : payment.payment_status === "rejected" ? (
                <>
                  <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                    <CreditCard className="h-8 w-8 text-destructive" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Pembayaran Ditolak</h2>
                  <p className="text-muted-foreground">{payment.admin_notes || "Silakan hubungi admin."}</p>
                </>
              ) : (
                <>
                  <Clock className="h-16 w-16 text-amber-500 mx-auto animate-pulse" />
                  <h2 className="text-2xl font-bold text-foreground">Menunggu Konfirmasi</h2>
                  <p className="text-muted-foreground">Pembayaran Anda sedang diverifikasi oleh admin.</p>
                </>
              )}
              <Badge className="text-sm">
                Rp {Number(payment.amount).toLocaleString("id-ID")}
              </Badge>
              <div className="pt-4">
                <Link to="/dashboard"><Button variant="outline">Kembali ke Dashboard</Button></Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const svc = (order as any).services;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Pembayaran</span>
          </div>
        </div>
      </header>

      <main className="container py-6 max-w-lg space-y-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ringkasan Pesanan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg">
                {svc?.icon || "💆"}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{svc?.name || "Layanan"}</p>
                <p className="text-sm text-muted-foreground">{svc?.duration_minutes || 60} menit</p>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-medium text-foreground">Total Bayar</span>
              <span className="text-xl font-bold text-primary">
                Rp {Number(order.total_price).toLocaleString("id-ID")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pilih Metode Pembayaran</CardTitle>
            <CardDescription>Pilih cara pembayaran yang Anda inginkan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {PAYMENT_METHODS.map((m) => (
              <div
                key={m.value}
                onClick={() => setSelectedMethod(m.value)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                  selectedMethod === m.value
                    ? "ring-2 ring-primary border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <span className="text-2xl">{m.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{m.label}</p>
                  <p className="text-sm text-muted-foreground">{m.description}</p>
                </div>
                <div className={cn(
                  "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                  selectedMethod === m.value ? "border-primary" : "border-muted-foreground/30"
                )}>
                  {selectedMethod === m.value && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bank Transfer Details */}
        {selectedMethod === "transfer_bank" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rekening Tujuan</CardTitle>
              <CardDescription>Transfer ke salah satu rekening berikut</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {BANK_ACCOUNTS.map((b) => (
                <div key={b.bank} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-bold text-foreground">{b.bank}</p>
                    <p className="text-sm font-mono text-foreground">{b.account}</p>
                    <p className="text-xs text-muted-foreground">a/n {b.name}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(b.account)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* QRIS */}
        {selectedMethod === "qris" && (
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <div className="h-48 w-48 mx-auto bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-border">
                <p className="text-muted-foreground text-sm">QR Code<br />(Simulasi)</p>
              </div>
              <p className="text-sm text-muted-foreground">Scan QR code di atas menggunakan aplikasi e-wallet Anda</p>
            </CardContent>
          </Card>
        )}

        {/* Confirm Button */}
        <Button
          className="w-full h-12 text-base"
          onClick={() => {
            createPayment.mutate(
              { orderId: order.id, amount: Number(order.total_price), paymentMethod: selectedMethod },
              { onSuccess: () => navigate(`/payment?order=${order.id}`) }
            );
          }}
          disabled={createPayment.isPending}
        >
          {createPayment.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {selectedMethod === "cash" ? "Konfirmasi Bayar Tunai" : "Saya Sudah Bayar"}
        </Button>
      </main>
    </div>
  );
};

export default CustomerPayment;
