import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Settings, Globe, Bell, Shield, Palette, Save, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const AdminSettings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    appName: "PijatPro",
    tagline: "Layanan Pijat Profesional ke Rumah Anda",
    contactEmail: "support@pijatpro.com",
    contactPhone: "+62 812-3456-7890",
    address: "Jl. Sudirman No. 123, Jakarta Pusat",
    currency: "IDR",
    timezone: "Asia/Jakarta",
  });

  const [notifSettings, setNotifSettings] = useState({
    emailNewOrder: true,
    emailCancelOrder: true,
    emailNewMitra: true,
    pushEnabled: false,
    dailyReport: true,
    weeklyReport: true,
  });

  const [bookingSettings, setBookingSettings] = useState({
    minBookingHours: "2",
    maxBookingDays: "14",
    autoCancelMinutes: "30",
    allowSameDay: true,
    requireAddress: true,
    operatingStart: "08:00",
    operatingEnd: "21:00",
  });

  const [securitySettings, setSecuritySettings] = useState({
    requireEmailVerification: true,
    requireKTPMitra: true,
    maxLoginAttempts: "5",
    sessionTimeout: "60",
    maintenanceMode: false,
  });

  const handleSave = (section: string) => {
    toast.success(`Pengaturan ${section} berhasil disimpan`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          Pengaturan Sistem
        </h1>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> Umum
            </TabsTrigger>
            <TabsTrigger value="booking" className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Booking
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifikasi
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Keamanan
            </TabsTrigger>
          </TabsList>

          {/* General */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Aplikasi</CardTitle>
                <CardDescription>Konfigurasi informasi dasar platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nama Aplikasi</Label>
                    <Input value={generalSettings.appName} onChange={(e) => setGeneralSettings({ ...generalSettings, appName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input value={generalSettings.tagline} onChange={(e) => setGeneralSettings({ ...generalSettings, tagline: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Kontak</Label>
                    <Input type="email" value={generalSettings.contactEmail} onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Telepon Kontak</Label>
                    <Input value={generalSettings.contactPhone} onChange={(e) => setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Alamat Kantor</Label>
                  <Textarea value={generalSettings.address} onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mata Uang</Label>
                    <Select value={generalSettings.currency} onValueChange={(v) => setGeneralSettings({ ...generalSettings, currency: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IDR">IDR - Rupiah</SelectItem>
                        <SelectItem value="USD">USD - Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select value={generalSettings.timezone} onValueChange={(v) => setGeneralSettings({ ...generalSettings, timezone: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Jakarta">WIB (Asia/Jakarta)</SelectItem>
                        <SelectItem value="Asia/Makassar">WITA (Asia/Makassar)</SelectItem>
                        <SelectItem value="Asia/Jayapura">WIT (Asia/Jayapura)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={() => handleSave("umum")} className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> Simpan Perubahan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Booking */}
          <TabsContent value="booking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Booking</CardTitle>
                <CardDescription>Atur aturan dan batasan pemesanan layanan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimal Booking (jam sebelum jadwal)</Label>
                    <Input type="number" value={bookingSettings.minBookingHours} onChange={(e) => setBookingSettings({ ...bookingSettings, minBookingHours: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Maksimal Booking (hari ke depan)</Label>
                    <Input type="number" value={bookingSettings.maxBookingDays} onChange={(e) => setBookingSettings({ ...bookingSettings, maxBookingDays: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Auto-cancel jika tidak dikonfirmasi (menit)</Label>
                    <Input type="number" value={bookingSettings.autoCancelMinutes} onChange={(e) => setBookingSettings({ ...bookingSettings, autoCancelMinutes: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Jam Operasional Mulai</Label>
                    <Input type="time" value={bookingSettings.operatingStart} onChange={(e) => setBookingSettings({ ...bookingSettings, operatingStart: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Jam Operasional Selesai</Label>
                    <Input type="time" value={bookingSettings.operatingEnd} onChange={(e) => setBookingSettings({ ...bookingSettings, operatingEnd: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">Izinkan Booking Hari Ini</p>
                      <p className="text-sm text-muted-foreground">Pelanggan bisa memesan untuk hari yang sama</p>
                    </div>
                    <Switch checked={bookingSettings.allowSameDay} onCheckedChange={(v) => setBookingSettings({ ...bookingSettings, allowSameDay: v })} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">Wajib Isi Alamat</p>
                      <p className="text-sm text-muted-foreground">Pelanggan harus mengisi alamat lengkap saat booking</p>
                    </div>
                    <Switch checked={bookingSettings.requireAddress} onCheckedChange={(v) => setBookingSettings({ ...bookingSettings, requireAddress: v })} />
                  </div>
                </div>
                <Button onClick={() => handleSave("booking")} className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> Simpan Perubahan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifikasi Email</CardTitle>
                <CardDescription>Atur kapan admin menerima notifikasi email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "emailNewOrder" as const, title: "Pesanan Baru", desc: "Kirim email saat ada pesanan masuk" },
                  { key: "emailCancelOrder" as const, title: "Pesanan Dibatalkan", desc: "Kirim email saat pesanan dibatalkan" },
                  { key: "emailNewMitra" as const, title: "Pendaftaran Mitra Baru", desc: "Kirim email saat ada mitra mendaftar" },
                  { key: "pushEnabled" as const, title: "Push Notification", desc: "Aktifkan push notification di browser" },
                  { key: "dailyReport" as const, title: "Laporan Harian", desc: "Kirim ringkasan harian via email" },
                  { key: "weeklyReport" as const, title: "Laporan Mingguan", desc: "Kirim ringkasan mingguan via email" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifSettings[item.key]}
                      onCheckedChange={(v) => setNotifSettings({ ...notifSettings, [item.key]: v })}
                    />
                  </div>
                ))}
                <Button onClick={() => handleSave("notifikasi")} className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> Simpan Perubahan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Keamanan & Akses</CardTitle>
                <CardDescription>Konfigurasi keamanan dan kebijakan akses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Maks. Percobaan Login</Label>
                    <Input type="number" value={securitySettings.maxLoginAttempts} onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Session Timeout (menit)</Label>
                    <Input type="number" value={securitySettings.sessionTimeout} onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-4 pt-2">
                  {[
                    { key: "requireEmailVerification" as const, title: "Wajib Verifikasi Email", desc: "User harus verifikasi email sebelum bisa login" },
                    { key: "requireKTPMitra" as const, title: "Wajib Upload KTP Mitra", desc: "Mitra harus upload KTP untuk verifikasi" },
                    { key: "maintenanceMode" as const, title: "Mode Maintenance", desc: "Nonaktifkan akses publik sementara untuk pemeliharaan" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={securitySettings[item.key]}
                        onCheckedChange={(v) => setSecuritySettings({ ...securitySettings, [item.key]: v })}
                      />
                    </div>
                  ))}
                </div>
                <Button onClick={() => handleSave("keamanan")} className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> Simpan Perubahan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
