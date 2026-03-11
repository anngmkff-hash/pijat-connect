import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminFinance } from "@/hooks/useAdminFinance";
import { Wallet, TrendingUp, Clock, XCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const formatRp = (v: number) => `Rp ${v.toLocaleString("id-ID")}`;

const statusColors: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  pending: "bg-amber-500/10 text-amber-600 border-amber-200",
  confirmed: "bg-blue-500/10 text-blue-600 border-blue-200",
  in_progress: "bg-violet-500/10 text-violet-600 border-violet-200",
  cancelled: "bg-red-500/10 text-red-600 border-red-200",
};

const statusLabels: Record<string, string> = {
  completed: "Selesai",
  pending: "Pending",
  confirmed: "Dikonfirmasi",
  in_progress: "Berlangsung",
  cancelled: "Dibatalkan",
};

const AdminFinance = () => {
  const { stats, isLoading } = useAdminFinance();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">Memuat data keuangan...</div>
      </AdminLayout>
    );
  }

  const s = stats || {
    totalRevenue: 0,
    completedOrders: 0,
    pendingRevenue: 0,
    cancelledOrders: 0,
    revenueByMonth: [],
    recentTransactions: [],
  };

  const statCards = [
    { title: "Total Pendapatan", value: formatRp(s.totalRevenue), icon: TrendingUp, color: "text-emerald-600" },
    { title: "Pesanan Selesai", value: s.completedOrders.toString(), icon: CheckCircle, color: "text-blue-600" },
    { title: "Pendapatan Pending", value: formatRp(s.pendingRevenue), icon: Clock, color: "text-amber-600" },
    { title: "Pesanan Batal", value: s.cancelledOrders.toString(), icon: XCircle, color: "text-red-600" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Wallet className="h-8 w-8 text-primary" />
          Keuangan
        </h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((c) => (
            <Card key={c.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
                <c.icon className={`h-5 w-5 ${c.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{c.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue Chart */}
        {s.revenueByMonth.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pendapatan Bulanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={s.revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} className="fill-muted-foreground" />
                    <Tooltip
                      formatter={(value: number) => [formatRp(value), "Pendapatan"]}
                      contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Layanan</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {s.recentTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Belum ada transaksi
                    </TableCell>
                  </TableRow>
                ) : (
                  s.recentTransactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.customer_name}</TableCell>
                      <TableCell>{t.service_name}</TableCell>
                      <TableCell>{formatRp(t.total_price)}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[t.status] || ""}>
                          {statusLabels[t.status] || t.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(t.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminFinance;
