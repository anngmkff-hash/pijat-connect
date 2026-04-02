import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking } from "@/hooks/useBooking";
import { useReviews } from "@/hooks/useReviews";
import ReviewDialog from "@/components/customer/ReviewDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Leaf, ArrowLeft, Clock, MapPin, CreditCard, Search,
  Filter, CalendarIcon, Loader2, PackageOpen, StickyNote,
  CheckCircle2, XCircle, Truck, Timer, AlertCircle, Star,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode; color: string }> = {
  pending: { label: "Menunggu Mitra", variant: "outline", icon: <AlertCircle className="h-3.5 w-3.5" />, color: "text-amber-600" },
  confirmed: { label: "Dikonfirmasi", variant: "default", icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: "text-primary" },
  on_the_way: { label: "Dalam Perjalanan", variant: "secondary", icon: <Truck className="h-3.5 w-3.5" />, color: "text-blue-600" },
  in_progress: { label: "Berlangsung", variant: "secondary", icon: <Timer className="h-3.5 w-3.5" />, color: "text-violet-600" },
  completed: { label: "Selesai", variant: "default", icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: "text-emerald-600" },
  cancelled: { label: "Dibatalkan", variant: "destructive", icon: <XCircle className="h-3.5 w-3.5" />, color: "text-destructive" },
};

const OrderHistory = () => {
  const { user } = useAuth();
  const { customerOrders, loadingOrders } = useBooking();
  const { hasReview } = useReviews();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reviewOrder, setReviewOrder] = useState<any>(null);

  const filteredOrders = customerOrders.filter((order) => {
    const svc = (order as any).services;
    const matchSearch =
      !search ||
      svc?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.address?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalSpent = customerOrders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + Number(o.total_price), 0);

  const stats = {
    total: customerOrders.length,
    completed: customerOrders.filter((o) => o.status === "completed").length,
    active: customerOrders.filter((o) => ["pending", "confirmed", "on_the_way", "in_progress"].includes(o.status)).length,
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Kembali</span>
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Riwayat Pesanan</span>
          </div>
        </div>
      </header>

      <main className="container py-6 max-w-3xl">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Pesanan</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{stats.active}</p>
              <p className="text-xs text-muted-foreground mt-1">Aktif</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">
                {totalSpent > 0 ? `${(totalSpent / 1000).toFixed(0)}K` : "0"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total Belanja</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari layanan atau alamat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
              <SelectItem value="on_the_way">Dalam Perjalanan</SelectItem>
              <SelectItem value="in_progress">Berlangsung</SelectItem>
              <SelectItem value="completed">Selesai</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Order List */}
        {loadingOrders ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Memuat riwayat...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <PackageOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              {customerOrders.length === 0 ? "Belum ada pesanan" : "Tidak ada pesanan ditemukan"}
            </p>
            {customerOrders.length === 0 && (
              <Link to="/booking">
                <Button className="mt-2">Booking Sekarang</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const svc = (order as any).services;
              const status = statusConfig[order.status] || {
                label: order.status,
                variant: "outline" as const,
                icon: <AlertCircle className="h-3.5 w-3.5" />,
                color: "text-muted-foreground",
              };

              return (
                <Card
                  key={order.id}
                  className="overflow-hidden transition-all hover:shadow-md group"
                >
                  {/* Status bar */}
                  <div className={cn(
                    "h-1 w-full",
                    order.status === "completed" && "bg-emerald-500",
                    order.status === "cancelled" && "bg-destructive",
                    order.status === "pending" && "bg-amber-400",
                    order.status === "confirmed" && "bg-primary",
                    order.status === "on_the_way" && "bg-blue-500",
                    order.status === "in_progress" && "bg-violet-500",
                  )} />

                  <CardContent className="p-5">
                    {/* Top row: service + status */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                          {svc?.icon || "💆"}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{svc?.name || "Layanan"}</h3>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <Clock className="h-3 w-3" />
                            {svc?.duration_minutes ? `${svc.duration_minutes} menit` : "-"}
                          </div>
                        </div>
                      </div>
                      <Badge variant={status.variant} className="flex items-center gap-1 shrink-0">
                        {status.icon}
                        {status.label}
                      </Badge>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          {order.scheduled_at
                            ? format(new Date(order.scheduled_at), "EEEE, dd MMM yyyy · HH:mm", { locale: idLocale })
                            : format(new Date(order.created_at), "dd MMM yyyy", { locale: idLocale })}
                        </span>
                      </div>
                      {order.address && (
                        <div className="flex items-start gap-2 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{order.address}</span>
                        </div>
                      )}
                      {order.notes && (
                        <div className="flex items-start gap-2 text-muted-foreground">
                          <StickyNote className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{order.notes}</span>
                        </div>
                      )}
                    </div>

                    <Separator className="my-3" />

                    {/* Bottom row: price + action */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="font-bold text-foreground text-lg">
                          Rp {Number(order.total_price).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {order.status === "pending" && (
                          <Link to={`/payment?order=${order.id}`}>
                            <Button size="sm">
                              <CreditCard className="h-4 w-4 mr-1.5" />
                              Bayar
                            </Button>
                          </Link>
                        )}
                        {order.status === "completed" && !hasReview(order.id) && order.mitra_id && (
                          <Button size="sm" variant="secondary" onClick={() => setReviewOrder(order)}>
                            <Star className="h-4 w-4 mr-1.5" />
                            Beri Review
                          </Button>
                        )}
                        {order.status === "completed" && hasReview(order.id) && (
                          <Badge variant="outline" className="flex items-center gap-1 text-amber-600">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            Sudah Direview
                          </Badge>
                        )}
                        {order.status === "completed" && (
                          <Link to="/booking">
                            <Button size="sm" variant="outline">
                              Pesan Lagi
                            </Button>
                          </Link>
                        )}
                        </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderHistory;
