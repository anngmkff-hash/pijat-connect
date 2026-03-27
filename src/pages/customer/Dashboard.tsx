import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/hooks/useBooking";
import { usePayment } from "@/hooks/usePayment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, LogOut, User, Calendar, History, Clock, Loader2, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Menunggu", variant: "outline" },
  confirmed: { label: "Dikonfirmasi", variant: "default" },
  on_the_way: { label: "Dalam Perjalanan", variant: "secondary" },
  completed: { label: "Selesai", variant: "default" },
  cancelled: { label: "Dibatalkan", variant: "destructive" },
};

const CustomerDashboard = () => {
  const { user, signOut } = useAuth();
  const { customerOrders, loadingOrders } = useBooking();

  const recentOrders = customerOrders.slice(0, 5);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">PijatPro</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" /> Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Selamat Datang! 👋</h1>
          <p className="text-muted-foreground">Siap untuk sesi pijat yang menyegarkan?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Booking Baru</CardTitle>
              <CardDescription>Pesan layanan pijat sekarang</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/booking">
                <Button className="w-full">Mulai Booking</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-2">
                <History className="h-6 w-6 text-secondary-foreground" />
              </div>
              <CardTitle className="text-lg">Riwayat Pesanan</CardTitle>
              <CardDescription>{customerOrders.length} pesanan total</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/orders">
                <Button variant="outline" className="w-full">Lihat Riwayat</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center mb-2">
                <User className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg">Profil Saya</CardTitle>
              <CardDescription>Kelola data akun Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>Edit Profil</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pesanan Terbaru</CardTitle>
            <CardDescription>
              {recentOrders.length > 0 ? "Daftar pesanan terbaru Anda" : "Anda belum memiliki pesanan"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingOrders ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Belum ada pesanan. Yuk, booking pijat pertama Anda!</p>
                <Link to="/booking">
                  <Button>Booking Sekarang</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => {
                  const svc = (order as any).services;
                  const status = statusMap[order.status] || { label: order.status, variant: "outline" as const };
                  return (
                    <div key={order.id} className="flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg shrink-0">
                        {svc?.icon || "💆"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">{svc?.name || "Layanan"}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {order.scheduled_at
                            ? format(new Date(order.scheduled_at), "dd MMM yyyy, HH:mm", { locale: idLocale })
                            : format(new Date(order.created_at), "dd MMM yyyy", { locale: idLocale })}
                        </div>
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <span className="text-sm font-semibold text-foreground shrink-0">
                        Rp {Number(order.total_price).toLocaleString("id-ID")}
                      </span>
                      {order.status === "pending" && (
                        <Link to={`/payment?order=${order.id}`}>
                          <Button size="sm" variant="outline" className="shrink-0">
                            <CreditCard className="h-3 w-3 mr-1" /> Bayar
                          </Button>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CustomerDashboard;
