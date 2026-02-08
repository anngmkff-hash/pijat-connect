import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Briefcase,
  ShoppingBag,
  Wallet,
  Tag,
  BarChart3,
  Settings,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Manajemen Users", href: "/admin/users" },
  { icon: UserCheck, label: "Verifikasi Mitra", href: "/admin/mitra-verification" },
  { icon: Briefcase, label: "Layanan", href: "/admin/services" },
  { icon: ShoppingBag, label: "Orders", href: "/admin/orders" },
  { icon: Wallet, label: "Keuangan", href: "/admin/finance" },
  { icon: Tag, label: "Promo", href: "/admin/promos" },
  { icon: BarChart3, label: "Laporan", href: "/admin/reports" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border/50 bg-card">
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
