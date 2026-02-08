import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMitraVerification } from "@/hooks/useMitraVerification";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";
import {
  Check,
  X,
  Eye,
  FileText,
  User,
  Phone,
  MapPin,
  Calendar,
  Award,
} from "lucide-react";

const MitraVerification = () => {
  const { pendingMitra, isLoading, approveMitra, rejectMitra, isUpdating } =
    useMitraVerification();
  const [selectedMitra, setSelectedMitra] = useState<typeof pendingMitra extends (infer T)[] ? T : never | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewDetails = (mitra: NonNullable<typeof pendingMitra>[0]) => {
    setSelectedMitra(mitra);
    setDialogOpen(true);
  };

  const handleApprove = (mitraId: string) => {
    approveMitra(mitraId);
    setDialogOpen(false);
  };

  const handleReject = (mitraId: string) => {
    rejectMitra(mitraId);
    setDialogOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Verifikasi Mitra</h1>
          <p className="text-muted-foreground mt-1">
            Approve atau reject pendaftaran mitra baru
          </p>
        </div>

        {/* Pending Count */}
        <div className="flex gap-4">
          <Card className="flex-1">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {pendingMitra?.filter((m) => m.verification_status === "pending").length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Menunggu Verifikasi</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {pendingMitra?.filter((m) => m.verification_status === "approved").length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Sudah Diverifikasi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mitra Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Mitra</CardTitle>
            <CardDescription>
              Semua mitra yang terdaftar di platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : pendingMitra?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada mitra terdaftar</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kota</TableHead>
                    <TableHead>Tanggal Daftar</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingMitra?.map((mitra) => (
                    <TableRow key={mitra.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {mitra.profile?.full_name || "Tanpa Nama"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {mitra.profile?.phone || "No phone"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{mitra.profile?.city || "-"}</TableCell>
                      <TableCell>
                        {format(new Date(mitra.created_at), "dd MMM yyyy", {
                          locale: id,
                        })}
                      </TableCell>
                      <TableCell>{getStatusBadge(mitra.verification_status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(mitra)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {mitra.verification_status === "pending" && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleApprove(mitra.id)}
                                disabled={isUpdating}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleReject(mitra.id)}
                                disabled={isUpdating}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detail Mitra</DialogTitle>
              <DialogDescription>
                Informasi lengkap pendaftaran mitra
              </DialogDescription>
            </DialogHeader>
            {selectedMitra && (
              <div className="space-y-6">
                {/* Profile Info */}
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {selectedMitra.profile?.full_name || "Tanpa Nama"}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      {selectedMitra.profile?.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {selectedMitra.profile.phone}
                        </span>
                      )}
                      {selectedMitra.profile?.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {selectedMitra.profile.city}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(selectedMitra.created_at), "dd MMMM yyyy", {
                          locale: id,
                        })}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(selectedMitra.verification_status)}
                </div>

                {/* Bio */}
                {selectedMitra.bio && (
                  <div>
                    <h4 className="font-medium mb-2">Bio</h4>
                    <p className="text-sm text-muted-foreground">{selectedMitra.bio}</p>
                  </div>
                )}

                {/* Specializations */}
                {selectedMitra.specializations && selectedMitra.specializations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Spesialisasi
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMitra.specializations.map((spec, i) => (
                        <Badge key={i} variant="secondary">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Dokumen
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm font-medium mb-1">KTP</p>
                      {selectedMitra.ktp_url ? (
                        <a
                          href={selectedMitra.ktp_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Lihat Dokumen
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">Belum diupload</p>
                      )}
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm font-medium mb-1">Sertifikat</p>
                      {selectedMitra.certificate_url ? (
                        <a
                          href={selectedMitra.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Lihat Dokumen
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">Belum diupload</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              {selectedMitra?.verification_status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedMitra.id)}
                    disabled={isUpdating}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Tolak
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedMitra.id)}
                    disabled={isUpdating}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </>
              )}
              {selectedMitra?.verification_status !== "pending" && (
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Tutup
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default MitraVerification;
