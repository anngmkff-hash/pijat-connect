import AdminLayout from "@/components/admin/AdminLayout";
import StatCard from "@/components/admin/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdminStats } from "@/hooks/useAdminStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserPlus,
  Briefcase,
  Clock,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useAdminStats();

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Admin</h1>
          <p className="text-muted-foreground mt-1">
            Kelola platform PijatPro dari sini
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <StatCard
                title="Total Users"
                value={stats?.totalUsers || 0}
                description={`${stats?.totalMitra || 0} mitra, ${stats?.totalCustomers || 0} pelanggan`}
                icon={Users}
                iconClassName="bg-primary/10 text-primary"
              />
              <StatCard
                title="Mitra Aktif"
                value={stats?.activeMitra || 0}
                description="Terapis siap melayani"
                icon={UserCheck}
                iconClassName="bg-green-500/10 text-green-600"
              />
              <StatCard
                title="Pending Verifikasi"
                value={stats?.pendingVerifications || 0}
                description="Menunggu approval"
                icon={Clock}
                iconClassName="bg-amber-500/10 text-amber-600"
              />
              <StatCard
                title="Total Layanan"
                value={stats?.totalServices || 0}
                description="Jenis layanan tersedia"
                icon={Briefcase}
                iconClassName="bg-secondary/20 text-secondary-foreground"
              />
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Verifications Alert */}
          {stats?.pendingVerifications ? (
            <Card className="border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <AlertCircle className="h-5 w-5" />
                  Perlu Perhatian
                </CardTitle>
                <CardDescription>
                  Ada {stats.pendingVerifications} mitra menunggu verifikasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/admin/mitra-verification">
                  <Button variant="outline" className="gap-2">
                    Lihat Daftar Mitra
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : null}

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
              <CardDescription>Kelola platform dengan mudah</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/mitra-verification" className="block">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <UserCheck className="h-4 w-4" />
                  Verifikasi Mitra Baru
                </Button>
              </Link>
              <Link to="/admin/users" className="block">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Users className="h-4 w-4" />
                  Kelola Users
                </Button>
              </Link>
              <Link to="/admin/services" className="block">
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Briefcase className="h-4 w-4" />
                  Kelola Layanan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Log aktivitas platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Belum ada aktivitas tercatat</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
