import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminPayments } from "@/hooks/usePayment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle, XCircle, Clock, Loader2, Banknote } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const statusConfig: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  pending: { label: "Menunggu", className: "bg-amber-500/10 text-amber-600 border-amber-200", icon: Clock },
  confirmed: { label: "Dikonfirmasi", className: "bg-emerald-500/10 text-emerald-600 border-emerald-200", icon: CheckCircle },
  rejected: { label: "Ditolak", className: "bg-red-500/10 text-red-600 border-red-200", icon: XCircle },
};

const methodLabels: Record<string, string> = {
  transfer_bank: "Transfer Bank",
  qris: "QRIS",
  ewallet: "E-Wallet",
  cash: "Tunai",
};

const AdminPayments = () => {
  const { payments, isLoading, confirmPayment, rejectPayment } = useAdminPayments();

  const pendingCount = payments.filter((p: any) => p.payment_status === "pending").length;
  const confirmedTotal = payments
    .filter((p: any) => p.payment_status === "confirmed")
    .reduce((sum: number, p: any) => sum + Number(p.amount), 0);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Memuat data pembayaran...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-primary" />
          Pembayaran
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Menunggu Konfirmasi</CardTitle>
              <Clock className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Dikonfirmasi</CardTitle>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Rp {confirmedTotal.toLocaleString("id-ID")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Transaksi</CardTitle>
              <Banknote className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{payments.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Layanan</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Belum ada pembayaran
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((p: any) => {
                    const cfg = statusConfig[p.payment_status] || statusConfig.pending;
                    const order = p.orders;
                    return (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{p.customer_name}</p>
                            <p className="text-xs text-muted-foreground">{p.customer_phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>{order?.services?.name || "-"}</TableCell>
                        <TableCell>{methodLabels[p.payment_method] || p.payment_method}</TableCell>
                        <TableCell className="font-semibold">Rp {Number(p.amount).toLocaleString("id-ID")}</TableCell>
                        <TableCell>
                          <Badge className={cfg.className}>{cfg.label}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {format(new Date(p.created_at), "dd MMM yyyy, HH:mm", { locale: idLocale })}
                        </TableCell>
                        <TableCell>
                          {p.payment_status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => confirmPayment.mutate({ paymentId: p.id })}
                                disabled={confirmPayment.isPending}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" /> Konfirmasi
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => rejectPayment.mutate({ paymentId: p.id, adminNotes: "Bukti tidak valid" })}
                                disabled={rejectPayment.isPending}
                              >
                                <XCircle className="h-3 w-3 mr-1" /> Tolak
                              </Button>
                            </div>
                          )}
                          {p.payment_status !== "pending" && (
                            <span className="text-xs text-muted-foreground">
                              {p.confirmed_at ? format(new Date(p.confirmed_at), "dd MMM, HH:mm", { locale: idLocale }) : "-"}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
