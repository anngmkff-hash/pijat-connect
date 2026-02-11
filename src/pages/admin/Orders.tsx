import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminOrders, OrderWithDetails } from "@/hooks/useAdminOrders";
import { ShoppingBag, Search, Eye, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
  pending: { label: "Menunggu", variant: "outline", icon: <Clock className="h-3 w-3" /> },
  confirmed: { label: "Dikonfirmasi", variant: "secondary", icon: <CheckCircle className="h-3 w-3" /> },
  in_progress: { label: "Berlangsung", variant: "default", icon: <Loader2 className="h-3 w-3" /> },
  completed: { label: "Selesai", variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
  cancelled: { label: "Dibatalkan", variant: "destructive", icon: <XCircle className="h-3 w-3" /> },
};

const AdminOrders = () => {
  const { orders, isLoading } = useAdminOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.service_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const formatDate = (date: string) => format(new Date(date), "dd MMM yyyy, HH:mm", { locale: localeId });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    in_progress: orders.filter((o) => o.status === "in_progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <ShoppingBag className="h-8 w-8 text-primary" />
          Manajemen Pesanan
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Pesanan", value: stats.total },
            { label: "Menunggu", value: stats.pending },
            { label: "Berlangsung", value: stats.in_progress },
            { label: "Selesai", value: stats.completed },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari pesanan..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
              <SelectItem value="in_progress">Berlangsung</SelectItem>
              <SelectItem value="completed">Selesai</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Layanan</TableHead>
                <TableHead>Mitra</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Memuat...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Tidak ada pesanan ditemukan</TableCell></TableRow>
              ) : (
                filtered.map((o) => {
                  const cfg = statusConfig[o.status] || statusConfig.pending;
                  return (
                    <TableRow key={o.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{o.id.slice(0, 8)}...</TableCell>
                      <TableCell className="text-foreground">{o.customer_name}</TableCell>
                      <TableCell className="text-foreground">{o.service_name}</TableCell>
                      <TableCell className="text-foreground">{o.mitra_name}</TableCell>
                      <TableCell className="text-foreground">{formatPrice(o.total_price)}</TableCell>
                      <TableCell>
                        <Badge variant={cfg.variant} className="gap-1">{cfg.icon}{cfg.label}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{formatDate(o.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(o)}><Eye className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Pesanan</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">ID Pesanan</p><p className="font-mono text-foreground">{selectedOrder.id.slice(0, 12)}...</p></div>
                <div><p className="text-muted-foreground">Status</p><Badge variant={statusConfig[selectedOrder.status]?.variant || "outline"} className="gap-1">{statusConfig[selectedOrder.status]?.icon}{statusConfig[selectedOrder.status]?.label}</Badge></div>
                <div><p className="text-muted-foreground">Pelanggan</p><p className="text-foreground">{selectedOrder.customer_name}</p></div>
                <div><p className="text-muted-foreground">Mitra</p><p className="text-foreground">{selectedOrder.mitra_name}</p></div>
                <div><p className="text-muted-foreground">Layanan</p><p className="text-foreground">{selectedOrder.service_name}</p></div>
                <div><p className="text-muted-foreground">Total</p><p className="font-semibold text-foreground">{formatPrice(selectedOrder.total_price)}</p></div>
                <div><p className="text-muted-foreground">Jadwal</p><p className="text-foreground">{selectedOrder.scheduled_at ? formatDate(selectedOrder.scheduled_at) : "-"}</p></div>
                <div><p className="text-muted-foreground">Dibuat</p><p className="text-foreground">{formatDate(selectedOrder.created_at)}</p></div>
              </div>
              {selectedOrder.address && (
                <div className="text-sm"><p className="text-muted-foreground">Alamat</p><p className="text-foreground">{selectedOrder.address}</p></div>
              )}
              {selectedOrder.notes && (
                <div className="text-sm"><p className="text-muted-foreground">Catatan</p><p className="text-foreground">{selectedOrder.notes}</p></div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOrders;
