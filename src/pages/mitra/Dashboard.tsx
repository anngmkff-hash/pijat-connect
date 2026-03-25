import { useAuth } from "@/contexts/AuthContext";
import { useMitraDashboard } from "@/hooks/useMitraDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, LogOut, Loader2, TrendingUp, DollarSign, ClipboardList, Clock, Star, MapPin, Calendar, CheckCircle, XCircle, Navigation, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const DAYS_OF_WEEK = [
  { id: "senin", label: "Senin" },
  { id: "selasa", label: "Selasa" },
  { id: "rabu", label: "Rabu" },
  { id: "kamis", label: "Kamis" },
  { id: "jumat", label: "Jumat" },
  { id: "sabtu", label: "Sabtu" },
  { id: "minggu", label: "Minggu" },
];

const statusLabel: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Menunggu", variant: "outline" },
  confirmed: { label: "Dikonfirmasi", variant: "secondary" },
  in_progress: { label: "Berlangsung", variant: "default" },
  completed: { label: "Selesai", variant: "default" },
  cancelled: { label: "Dibatalkan", variant: "destructive" },
};

const MitraDashboard = () => {
  const { user, signOut } = useAuth();
  const {
    profile,
    userProfile,
    orders,
    incomingOrders,
    totalOrders,
    completedOrders,
    totalRevenue,
    pendingOrders,
    inProgressOrders,
    monthlyRevenue,
    isLoading,
    toggleAvailability,
    updateWorkingHours,
    updateOffDays,
    updateServiceRadius,
    acceptOrder,
    rejectOrder,
    updateOrderStatus,
  } = useMitraDashboard();

  const [workStart, setWorkStart] = useState("");
  const [workEnd, setWorkEnd] = useState("");
  const [selectedOffDays, setSelectedOffDays] = useState<string[]>([]);
  const [radius, setRadius] = useState<number[]>([10]);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Load settings from profile once
  if (profile && !settingsLoaded) {
    const wh = profile.working_hours as { start?: string; end?: string } | null;
    setWorkStart(wh?.start ?? "08:00");
    setWorkEnd(wh?.end ?? "20:00");
    setSelectedOffDays(profile.off_days ?? []);
    setRadius([profile.service_radius_km ?? 10]);
    setSettingsLoaded(true);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isVerified = profile?.verification_status === "approved";
  const isActive = profile?.status === "active";

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(v);

  const handleToggleOffDay = (day: string) => {
    const next = selectedOffDays.includes(day)
      ? selectedOffDays.filter((d) => d !== day)
      : [...selectedOffDays, day];
    setSelectedOffDays(next);
    updateOffDays.mutate(next);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">PijatPro</span>
          </Link>
          <div className="flex items-center gap-4">
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Aktif" : "Nonaktif"}
            </Badge>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {userProfile?.full_name ?? user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Verification Banner */}
        {!isVerified && (
          <Card className="border-secondary bg-secondary/10">
            <CardContent className="flex items-center gap-4 py-4">
              <Clock className="h-6 w-6 text-secondary-foreground shrink-0" />
              <div>
                <p className="font-semibold text-foreground">
                  {profile?.verification_status === "pending"
                    ? "Akun Anda sedang dalam proses verifikasi"
                    : "Verifikasi ditolak"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {profile?.verification_status === "pending"
                    ? "Admin sedang memeriksa dokumen Anda. Anda akan mendapat notifikasi setelah diverifikasi."
                    : "Silakan hubungi admin untuk informasi lebih lanjut."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Greeting + Availability Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Dashboard Mitra 👋
            </h1>
            <p className="text-muted-foreground">
              {userProfile?.full_name ? `Halo, ${userProfile.full_name}!` : "Selamat datang!"}
            </p>
          </div>
          {isVerified && (
            <div className="flex items-center gap-3 bg-card rounded-lg border border-border px-4 py-3">
              <span className="text-sm font-medium text-foreground">Terima Pesanan</span>
              <Switch
                checked={isActive}
                onCheckedChange={(checked) =>
                  toggleAvailability.mutate(checked ? "active" : "inactive")
                }
                disabled={toggleAvailability.isPending}
              />
            </div>
          )}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalOrders}</p>
                  <p className="text-xs text-muted-foreground">Total Pesanan</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{completedOrders}</p>
                  <p className="text-xs text-muted-foreground">Selesai</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
                  <p className="text-xs text-muted-foreground">Pendapatan</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                  <Star className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {Number(profile?.rating_average ?? 0).toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Rating ({profile?.total_reviews ?? 0} ulasan)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="orders">Pesanan ({pendingOrders + inProgressOrders})</TabsTrigger>
            <TabsTrigger value="settings">Ketersediaan</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pendapatan 6 Bulan Terakhir</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} className="text-xs" />
                      <Tooltip
                        formatter={(value: number) => [formatCurrency(value), "Pendapatan"]}
                        contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
                      />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Orders Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Jumlah Pesanan Selesai</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        formatter={(value: number) => [value, "Pesanan"]}
                        contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="hsl(var(--secondary))"
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--secondary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pesanan Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">Belum ada pesanan</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Layanan</TableHead>
                          <TableHead>Harga</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.slice(0, 5).map((order) => {
                          const s = statusLabel[order.status] ?? { label: order.status, variant: "outline" as const };
                          return (
                            <TableRow key={order.id}>
                              <TableCell className="text-sm">
                                {new Date(order.created_at).toLocaleDateString("id-ID")}
                              </TableCell>
                              <TableCell className="text-sm">
                                {(order as any).services?.name ?? "-"}
                              </TableCell>
                              <TableCell className="text-sm font-medium">
                                {formatCurrency(Number(order.total_price))}
                              </TableCell>
                              <TableCell>
                                <Badge variant={s.variant}>{s.label}</Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Semua Pesanan</CardTitle>
                <CardDescription>Daftar seluruh pesanan Anda</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">Belum ada pesanan</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tanggal</TableHead>
                          <TableHead>Layanan</TableHead>
                          <TableHead>Jadwal</TableHead>
                          <TableHead>Alamat</TableHead>
                          <TableHead>Harga</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => {
                          const s = statusLabel[order.status] ?? { label: order.status, variant: "outline" as const };
                          return (
                            <TableRow key={order.id}>
                              <TableCell className="text-sm">
                                {new Date(order.created_at).toLocaleDateString("id-ID")}
                              </TableCell>
                              <TableCell className="text-sm">
                                {(order as any).services?.name ?? "-"}
                              </TableCell>
                              <TableCell className="text-sm">
                                {order.scheduled_at
                                  ? new Date(order.scheduled_at).toLocaleString("id-ID", {
                                      dateStyle: "short",
                                      timeStyle: "short",
                                    })
                                  : "-"}
                              </TableCell>
                              <TableCell className="text-sm max-w-[200px] truncate">
                                {order.address ?? "-"}
                              </TableCell>
                              <TableCell className="text-sm font-medium">
                                {formatCurrency(Number(order.total_price))}
                              </TableCell>
                              <TableCell>
                                <Badge variant={s.variant}>{s.label}</Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings/Availability Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Working Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" /> Jam Kerja
                  </CardTitle>
                  <CardDescription>Atur jam operasional Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Mulai</label>
                      <Select value={workStart} onValueChange={setWorkStart}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const t = `${String(i).padStart(2, "0")}:00`;
                            return <SelectItem key={t} value={t}>{t}</SelectItem>;
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Selesai</label>
                      <Select value={workEnd} onValueChange={setWorkEnd}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const t = `${String(i).padStart(2, "0")}:00`;
                            return <SelectItem key={t} value={t}>{t}</SelectItem>;
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => updateWorkingHours.mutate({ start: workStart, end: workEnd })}
                    disabled={updateWorkingHours.isPending}
                  >
                    {updateWorkingHours.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Simpan Jam Kerja
                  </Button>
                </CardContent>
              </Card>

              {/* Off Days */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" /> Hari Libur
                  </CardTitle>
                  <CardDescription>Pilih hari dimana Anda tidak tersedia</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {DAYS_OF_WEEK.map((day) => (
                      <label
                        key={day.id}
                        className="flex items-center gap-2 cursor-pointer rounded-lg border border-border px-3 py-2 hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          checked={selectedOffDays.includes(day.id)}
                          onCheckedChange={() => handleToggleOffDay(day.id)}
                        />
                        <span className="text-sm text-foreground">{day.label}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Service Radius */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" /> Radius Layanan
                  </CardTitle>
                  <CardDescription>
                    Atur jarak maksimal Anda menerima pesanan: <strong>{radius[0]} km</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Slider
                    value={radius}
                    onValueChange={setRadius}
                    min={1}
                    max={50}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 km</span>
                    <span>50 km</span>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => updateServiceRadius.mutate(radius[0])}
                    disabled={updateServiceRadius.isPending}
                  >
                    {updateServiceRadius.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Simpan Radius
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MitraDashboard;
