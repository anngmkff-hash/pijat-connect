import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminReports } from "@/hooks/useAdminReports";
import { BarChart3, TrendingUp, ShoppingCart, Percent, DollarSign, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

const formatRp = (v: number) => `Rp ${v.toLocaleString("id-ID")}`;

const PIE_COLORS = [
  "hsl(142, 71%, 45%)",  // emerald
  "hsl(38, 92%, 50%)",   // amber
  "hsl(217, 91%, 60%)",  // blue
  "hsl(263, 70%, 50%)",  // violet
  "hsl(0, 72%, 51%)",    // red
];

const statusColors: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  pending: "bg-amber-500/10 text-amber-600 border-amber-200",
  confirmed: "bg-blue-500/10 text-blue-600 border-blue-200",
  in_progress: "bg-violet-500/10 text-violet-600 border-violet-200",
  cancelled: "bg-red-500/10 text-red-600 border-red-200",
};

const AdminReports = () => {
  const { data: stats, isLoading } = useAdminReports();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Memuat data laporan...
        </div>
      </AdminLayout>
    );
  }

  const s = stats || {
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    completionRate: 0,
    ordersByStatus: [],
    revenueByMonth: [],
    ordersByMonth: [],
    topServices: [],
    mitraPerformance: [],
  };

  const summaryCards = [
    { title: "Total Pesanan", value: s.totalOrders.toString(), icon: ShoppingCart, color: "text-primary" },
    { title: "Total Pendapatan", value: formatRp(s.totalRevenue), icon: TrendingUp, color: "text-emerald-600" },
    { title: "Rata-rata Nilai Order", value: formatRp(s.avgOrderValue), icon: DollarSign, color: "text-blue-600" },
    { title: "Tingkat Penyelesaian", value: `${s.completionRate.toFixed(1)}%`, icon: Percent, color: "text-amber-600" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          Laporan
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((c) => (
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Tren Pendapatan & Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              {s.revenueByMonth.length > 0 ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={s.revenueByMonth}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                      <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                        className="fill-muted-foreground"
                      />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          name === "revenue" ? formatRp(value) : value,
                          name === "revenue" ? "Pendapatan" : "Pesanan",
                        ]}
                        contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                      />
                      <Legend formatter={(v) => (v === "revenue" ? "Pendapatan" : "Pesanan")} />
                      <Bar yAxisId="left" dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="orders" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ r: 3 }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-12">Belum ada data pendapatan</p>
              )}
            </CardContent>
          </Card>

          {/* Orders by Status Pie */}
          <Card>
            <CardHeader>
              <CardTitle>Pesanan per Status</CardTitle>
            </CardHeader>
            <CardContent>
              {s.ordersByStatus.length > 0 ? (
                <div className="h-72 flex flex-col items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={s.ordersByStatus}
                        dataKey="count"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        paddingAngle={3}
                        label={({ label, count }) => `${label}: ${count}`}
                      >
                        {s.ordersByStatus.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-12">Belum ada data</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row: Top Services & Mitra Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Services */}
          <Card>
            <CardHeader>
              <CardTitle>Layanan Terpopuler</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Layanan</TableHead>
                    <TableHead className="text-right">Pesanan</TableHead>
                    <TableHead className="text-right">Pendapatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {s.topServices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        Belum ada data layanan
                      </TableCell>
                    </TableRow>
                  ) : (
                    s.topServices.map((svc, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{svc.name}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">{svc.orders}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatRp(svc.revenue)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Mitra Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Performa Mitra
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead className="text-right">Pesanan</TableHead>
                    <TableHead className="text-right">Selesai</TableHead>
                    <TableHead className="text-right">Rating</TableHead>
                    <TableHead className="text-right">Pendapatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {s.mitraPerformance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Belum ada data mitra
                      </TableCell>
                    </TableRow>
                  ) : (
                    s.mitraPerformance.map((m, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{m.name}</TableCell>
                        <TableCell className="text-right">{m.totalOrders}</TableCell>
                        <TableCell className="text-right">
                          <Badge className={statusColors.completed}>{m.completedOrders}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="flex items-center justify-end gap-1">
                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                            {m.rating.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{formatRp(m.revenue)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
