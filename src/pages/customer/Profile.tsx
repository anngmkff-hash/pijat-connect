import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Leaf, ArrowLeft, User, Phone, MapPin, Building2,
  Save, Loader2, Mail, Camera,
} from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
        setCity(data.city || "");
        setAvatarUrl(data.avatar_url || "");
      }
      if (error) console.error("Error fetching profile:", error);
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    if (!fullName.trim()) {
      toast({ title: "Nama lengkap wajib diisi", variant: "destructive" });
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        address: address.trim() || null,
        city: city.trim() || null,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Gagal menyimpan profil", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profil berhasil diperbarui ✅" });
    }
    setSaving(false);
  };

  const initials = fullName
    ? fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Kembali</span>
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">Edit Profil</span>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-xl">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={avatarUrl} alt={fullName} />
              <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <h2 className="mt-4 text-xl font-bold text-foreground">{fullName || "Pengguna"}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informasi Pribadi
            </CardTitle>
            <CardDescription>Perbarui data diri Anda agar terapis dapat menghubungi Anda dengan mudah</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Nama Lengkap <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="Masukkan nama lengkap"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={100}
              />
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <Input value={user?.email || ""} disabled className="bg-muted/50" />
              <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Nomor Telepon
              </Label>
              <Input
                id="phone"
                placeholder="08xxxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={20}
              />
            </div>

            <Separator />

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Alamat
              </Label>
              <Textarea
                id="address"
                placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                maxLength={500}
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Kota
              </Label>
              <Input
                id="city"
                placeholder="Jakarta, Bandung, Surabaya..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                maxLength={100}
              />
            </div>

            {/* Save Button */}
            <Button onClick={handleSave} disabled={saving} className="w-full mt-4">
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Simpan Perubahan
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
