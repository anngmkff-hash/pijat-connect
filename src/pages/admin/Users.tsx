import { useState, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminUsers, type AdminUser } from "@/hooks/useAdminUsers";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Users, Search, Shield, UserCheck, UserX, Eye, Edit, Phone, MapPin, Calendar,
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const ROLE_OPTIONS: { value: AppRole | "all"; label: string }[] = [
  { value: "all", label: "Semua Role" },
  { value: "admin", label: "Admin" },
  { value: "mitra", label: "Mitra" },
  { value: "customer", label: "Customer" },
];

const getRoleBadge = (role: AppRole) => {
  switch (role) {
    case "admin":
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20"><Shield className="h-3 w-3 mr-1" />Admin</Badge>;
    case "mitra":
      return <Badge className="bg-primary/10 text-primary border-primary/20"><UserCheck className="h-3 w-3 mr-1" />Mitra</Badge>;
    case "customer":
      return <Badge variant="secondary"><UserX className="h-3 w-3 mr-1" />Customer</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const AdminUsers = () => {
  const { users, isLoading, updateRole, isUpdatingRole } = useAdminUsers();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<AppRole | "all">("all");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRoleOpen, setEditRoleOpen] = useState(false);
  const [newRole, setNewRole] = useState<AppRole>("customer");

  const filtered = useMemo(() => {
    if (!users) return [];
    return users.filter((u) => {
      const matchSearch =
        u.full_name.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.toLowerCase().includes(search.toLowerCase()) ||
        u.city?.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const stats = useMemo(() => {
    if (!users) return { total: 0, admin: 0, mitra: 0, customer: 0 };
    return {
      total: users.length,
      admin: users.filter((u) => u.role === "admin").length,
      mitra: users.filter((u) => u.role === "mitra").length,
      customer: users.filter((u) => u.role === "customer").length,
    };
  }, [users]);

  const handleEditRole = (user: AdminUser) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setEditRoleOpen(true);
  };

  const handleSaveRole = () => {
    if (selectedUser && newRole !== selectedUser.role) {
      updateRole({ userId: selectedUser.user_id, newRole });
    }
    setEditRoleOpen(false);
  };

  const handleViewDetail = (user: AdminUser) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Manajemen Users
          </h1>
          <p className="text-muted-foreground mt-1">Kelola semua pengguna platform</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: stats.total, icon: Users, color: "text-primary" },
            { label: "Admin", value: stats.admin, icon: Shield, color: "text-destructive" },
            { label: "Mitra", value: stats.mitra, icon: UserCheck, color: "text-primary" },
            { label: "Customer", value: stats.customer, icon: UserX, color: "text-muted-foreground" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Users</CardTitle>
            <CardDescription>Cari dan filter pengguna berdasarkan nama, kota, atau role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama, telepon, atau kota..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as AppRole | "all")}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter Role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Tidak ada user ditemukan</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">Kota</TableHead>
                    <TableHead className="hidden md:table-cell">Bergabung</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback className="text-xs">{getInitials(user.full_name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.full_name}</p>
                            <p className="text-xs text-muted-foreground">{user.phone || "-"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{user.city || "-"}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {format(new Date(user.created_at), "dd MMM yyyy", { locale: localeId })}
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleViewDetail(user)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditRole(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {!isLoading && filtered.length > 0 && (
              <p className="text-xs text-muted-foreground text-right">
                Menampilkan {filtered.length} dari {users?.length || 0} user
              </p>
            )}
          </CardContent>
        </Card>

        {/* View Detail Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detail User</DialogTitle>
              <DialogDescription>Informasi lengkap pengguna</DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedUser.avatar_url || undefined} />
                    <AvatarFallback>{getInitials(selectedUser.full_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedUser.full_name}</h3>
                    {getRoleBadge(selectedUser.role)}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" /> {selectedUser.phone || "Tidak ada"}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {selectedUser.city || "Tidak ada"}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" /> Bergabung {format(new Date(selectedUser.created_at), "dd MMMM yyyy", { locale: localeId })}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Tutup</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Role Dialog */}
        <Dialog open={editRoleOpen} onOpenChange={setEditRoleOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ubah Role</DialogTitle>
              <DialogDescription>
                Ubah role untuk <strong>{selectedUser?.full_name}</strong>
              </DialogDescription>
            </DialogHeader>
            <Select value={newRole} onValueChange={(v) => setNewRole(v as AppRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="mitra">Mitra</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditRoleOpen(false)}>Batal</Button>
              <Button onClick={handleSaveRole} disabled={isUpdatingRole}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
