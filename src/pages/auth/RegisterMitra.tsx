import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Leaf, Loader2, Upload, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const RegisterMitra = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password tidak cocok",
        description: "Pastikan password dan konfirmasi password sama.",
      });
      return;
    }

    if (!agreeTerms) {
      toast({
        variant: "destructive",
        title: "Syarat & Ketentuan",
        description: "Anda harus menyetujui syarat dan ketentuan untuk mendaftar.",
      });
      return;
    }

    if (!ktpFile) {
      toast({
        variant: "destructive",
        title: "Dokumen KTP diperlukan",
        description: "Silakan upload foto KTP Anda untuk verifikasi.",
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Update user role to mitra (will be done after email verification)
        // For now, we just show success message
        
        toast({
          title: "Pendaftaran mitra berhasil!",
          description: "Silakan cek email Anda untuk verifikasi. Setelah itu, tim kami akan memverifikasi dokumen Anda.",
        });
        
        navigate("/login");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Terjadi kesalahan. Silakan coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1 text-center">
          <Link to="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">PijatPro</span>
          </Link>
          <CardTitle className="text-2xl">Daftar Sebagai Mitra Terapis</CardTitle>
          <CardDescription>
            Bergabung sebagai terapis profesional dan dapatkan penghasilan tambahan
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap (sesuai KTP)</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Nama lengkap Anda"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor WhatsApp</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="08xx-xxxx-xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Tentang Anda</Label>
              <Textarea
                id="bio"
                placeholder="Ceritakan pengalaman dan keahlian pijat Anda..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Foto KTP (Wajib)</Label>
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="ktp-upload"
                    onChange={(e) => setKtpFile(e.target.files?.[0] || null)}
                  />
                  <Label
                    htmlFor="ktp-upload"
                    className="flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-input bg-background cursor-pointer hover:bg-accent transition-colors"
                  >
                    {ktpFile ? (
                      <>
                        <FileCheck className="h-4 w-4 text-success" />
                        <span className="text-sm truncate">{ktpFile.name}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        <span className="text-sm">Upload KTP</span>
                      </>
                    )}
                  </Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sertifikat Pijat (Opsional)</Label>
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    id="cert-upload"
                    onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                  />
                  <Label
                    htmlFor="cert-upload"
                    className="flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-input bg-background cursor-pointer hover:bg-accent transition-colors"
                  >
                    {certificateFile ? (
                      <>
                        <FileCheck className="h-4 w-4 text-success" />
                        <span className="text-sm truncate">{certificateFile.name}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        <span className="text-sm">Upload Sertifikat</span>
                      </>
                    )}
                  </Label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                Saya menyetujui{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Syarat & Ketentuan Mitra
                </Link>{" "}
                dan{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Kebijakan Privasi
                </Link>
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Daftar Sebagai Mitra"
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Masuk di sini
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RegisterMitra;
