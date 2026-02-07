import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, LogOut, User, Calendar, History } from "lucide-react";
import { Link } from "react-router-dom";

const CustomerDashboard = () => {
  const { user, signOut } = useAuth();

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
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Selamat Datang! 👋
          </h1>
          <p className="text-muted-foreground">
            Siap untuk sesi pijat yang menyegarkan?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-soft transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Booking Baru</CardTitle>
              <CardDescription>
                Pesan layanan pijat sekarang
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/booking">
                <Button className="w-full">Mulai Booking</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-soft transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-2">
                <History className="h-6 w-6 text-secondary-foreground" />
              </div>
              <CardTitle className="text-lg">Riwayat Pesanan</CardTitle>
              <CardDescription>
                Lihat pesanan sebelumnya
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/orders">
                <Button variant="outline" className="w-full">Lihat Riwayat</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-soft transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center mb-2">
                <User className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-lg">Profil Saya</CardTitle>
              <CardDescription>
                Kelola data akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/profile">
                <Button variant="outline" className="w-full">Edit Profil</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Pesanan Terbaru</CardTitle>
            <CardDescription>
              Anda belum memiliki pesanan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Belum ada pesanan. Yuk, booking pijat pertama Anda!
              </p>
              <Link to="/booking">
                <Button>Booking Sekarang</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CustomerDashboard;
