import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminPromos, Promo, PromoForm } from "@/hooks/useAdminPromos";
import { Tag, Plus, Search, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const defaultForm: PromoForm = {
  code: "",
  description: "",
  discount_type: "percentage",
  discount_value: 0,
  min_order_amount: 0,
  max_discount: null,
  usage_limit: null,
  is_active: true,
  starts_at: new Date().toISOString().slice(0, 16),
  expires_at: "",
};

const AdminPromos = () => {
  const { promos, isLoading, createPromo, updatePromo, deletePromo } = useAdminPromos();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [form, setForm] = useState<PromoForm>(defaultForm);

  const filtered = promos.filter(
    (p) =>
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingPromo(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const openEdit = (promo: Promo) => {
    setEditingPromo(promo);
    setForm({
      code: promo.code,
      description: promo.description || "",
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      min_order_amount: promo.min_order_amount || 0,
      max_discount: promo.max_discount,
      usage_limit: promo.usage_limit,
      is_active: promo.is_active,
      starts_at: promo.starts_at ? new Date(promo.starts_at).toISOString().slice(0, 16) : "",
      expires_at: promo.expires_at ? new Date(promo.expires_at).toISOString().slice(0, 16) : "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    const payload: any = {
      code: form.code.toUpperCase(),
      description: form.description || null,
      discount_type: form.discount_type,
      discount_value: form.discount_value,
      min_order_amount: form.min_order_amount || 0,
      max_discount: form.max_discount || null,
      usage_limit: form.usage_limit || null,
      is_active: form.is_active,
      starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : new Date().toISOString(),
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    };

    if (editingPromo) {
      updatePromo.mutate({ id: editingPromo.id, ...payload }, { onSuccess: () => setDialogOpen(false) });
    } else {
      createPromo.mutate(payload, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Yakin ingin menghapus promo ini?")) {
      deletePromo.mutate(id);
    }
  };

  const formatDiscount = (p: Promo) =>
    p.discount_type === "percentage" ? `${p.discount_value}%` : `Rp ${p.discount_value.toLocaleString("id-ID")}`;

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-";

  const isExpired = (p: Promo) => p.expires_at && new Date(p.expires_at) < new Date();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Tag className="h-8 w-8 text-primary" />
            Manajemen Promo
          </h1>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Tambah Promo
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari kode atau deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Diskon</TableHead>
                <TableHead>Min. Order</TableHead>
                <TableHead>Penggunaan</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Belum ada promo
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono font-bold">{p.code}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{formatDiscount(p)}</Badge>
                      {p.max_discount && p.discount_type === "percentage" && (
                        <span className="text-xs text-muted-foreground ml-1">
                          (maks Rp {p.max_discount.toLocaleString("id-ID")})
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {p.min_order_amount ? `Rp ${p.min_order_amount.toLocaleString("id-ID")}` : "-"}
                    </TableCell>
                    <TableCell>
                      {p.used_count}{p.usage_limit ? `/${p.usage_limit}` : ""}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{formatDate(p.starts_at)}</div>
                      <div className="text-muted-foreground">s/d {formatDate(p.expires_at)}</div>
                    </TableCell>
                    <TableCell>
                      {isExpired(p) ? (
                        <Badge variant="destructive">Expired</Badge>
                      ) : p.is_active ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Aktif</Badge>
                      ) : (
                        <Badge variant="outline">Nonaktif</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPromo ? "Edit Promo" : "Tambah Promo Baru"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Kode Promo</Label>
                <Input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="DISKON50"
                  className="uppercase"
                />
              </div>
              <div>
                <Label>Deskripsi</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Deskripsi promo..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipe Diskon</Label>
                  <Select value={form.discount_type} onValueChange={(v) => setForm({ ...form, discount_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Persentase (%)</SelectItem>
                      <SelectItem value="fixed">Nominal (Rp)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Nilai Diskon</Label>
                  <Input
                    type="number"
                    value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Min. Order (Rp)</Label>
                  <Input
                    type="number"
                    value={form.min_order_amount}
                    onChange={(e) => setForm({ ...form, min_order_amount: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Maks. Diskon (Rp)</Label>
                  <Input
                    type="number"
                    value={form.max_discount ?? ""}
                    onChange={(e) => setForm({ ...form, max_discount: e.target.value ? Number(e.target.value) : null })}
                    placeholder="Opsional"
                  />
                </div>
              </div>
              <div>
                <Label>Batas Penggunaan</Label>
                <Input
                  type="number"
                  value={form.usage_limit ?? ""}
                  onChange={(e) => setForm({ ...form, usage_limit: e.target.value ? Number(e.target.value) : null })}
                  placeholder="Tanpa batas"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Mulai</Label>
                  <Input
                    type="datetime-local"
                    value={form.starts_at}
                    onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Berakhir</Label>
                  <Input
                    type="datetime-local"
                    value={form.expires_at}
                    onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(v) => setForm({ ...form, is_active: v })}
                />
                <Label>Aktif</Label>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!form.code || form.discount_value <= 0 || createPromo.isPending || updatePromo.isPending}
                className="w-full"
              >
                {editingPromo ? "Simpan Perubahan" : "Tambah Promo"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminPromos;
