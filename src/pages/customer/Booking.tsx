import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useBooking, BookingData } from "@/hooks/useBooking";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Leaf, ArrowLeft, CalendarIcon, Clock, MapPin, CheckCircle2,
  ChevronRight, Loader2, StickyNote,
} from "lucide-react";

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00",
];

const STEPS = ["Pilih Layanan", "Jadwal", "Lokasi", "Konfirmasi"];

const Booking = () => {
  const { user } = useAuth();
  const { step, setStep, nextStep, prevStep, services, loadingServices, createOrder } = useBooking();

  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const service = services.find((s) => s.id === selectedService);

  const canNext = () => {
    if (step === 0) return !!selectedService;
    if (step === 1) return !!selectedDate && !!selectedTime;
    if (step === 2) return address.trim().length >= 10;
    return true;
  };

  const handleSubmit = () => {
    if (!selectedDate) return;
    createOrder.mutate({
      serviceId: selectedService,
      scheduledAt: selectedDate,
      timeSlot: selectedTime,
      address: address.trim(),
      notes: notes.trim(),
    });
  };

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
            <span className="font-bold text-foreground">Booking Pijat</span>
          </div>
        </div>
      </header>

      <main className="container py-6 max-w-2xl">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <button
                onClick={() => i < step && setStep(i)}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  i <= step ? "text-primary" : "text-muted-foreground",
                  i < step && "cursor-pointer hover:text-primary/80"
                )}
              >
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
                  i < step && "bg-primary border-primary text-primary-foreground",
                  i === step && "border-primary text-primary",
                  i > step && "border-muted-foreground/30 text-muted-foreground"
                )}>
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className="hidden sm:inline">{label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground/50 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: Service Selection */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Pilih Layanan</h2>
              <p className="text-muted-foreground">Pilih jenis pijat yang Anda inginkan</p>
            </div>
            {loadingServices ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-3">
                {services.map((s) => (
                  <Card
                    key={s.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      selectedService === s.id && "ring-2 ring-primary border-primary"
                    )}
                    onClick={() => setSelectedService(s.id)}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                        {s.icon || "💆"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">{s.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{s.description}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {s.duration_minutes} menit
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-primary text-lg">
                          Rp {Number(s.base_price).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {services.length === 0 && (
                  <p className="text-center py-8 text-muted-foreground">Belum ada layanan tersedia.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 1: Schedule */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Pilih Jadwal</h2>
              <p className="text-muted-foreground">Tentukan tanggal dan waktu sesi pijat Anda</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" /> Tanggal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "EEEE, dd MMMM yyyy", { locale: idLocale }) : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Waktu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {TIME_SLOTS.map((t) => (
                    <Button
                      key={t}
                      variant={selectedTime === t ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(t)}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Lokasi Anda</h2>
              <p className="text-muted-foreground">Masukkan alamat lengkap untuk layanan pijat di rumah</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Alamat Lengkap
                </CardTitle>
                <CardDescription>Sertakan nama jalan, nomor rumah, RT/RW, kelurahan, dan kota</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Contoh: Jl. Sudirman No. 123, RT 01/RW 02, Kel. Menteng, Jakarta Pusat"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">{address.length}/500 karakter (min. 10)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <StickyNote className="h-4 w-4" /> Catatan (Opsional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Contoh: Lantai 2, bell tidak berfungsi, hubungi via WA saat tiba"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  maxLength={300}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && service && selectedDate && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Konfirmasi Pesanan</h2>
              <p className="text-muted-foreground">Periksa detail pesanan Anda sebelum mengirim</p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                    {service.icon || "💆"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">{service.duration_minutes} menit</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">
                        {format(selectedDate, "EEEE, dd MMMM yyyy", { locale: idLocale })}
                      </p>
                      <p className="text-muted-foreground">Pukul {selectedTime} WIB</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-foreground">{address}</p>
                  </div>
                  {notes && (
                    <div className="flex items-start gap-3">
                      <StickyNote className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-foreground">{notes}</p>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground text-lg">Total</span>
                  <span className="font-bold text-primary text-xl">
                    Rp {Number(service.base_price).toLocaleString("id-ID")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={prevStep} disabled={step === 0}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
          </Button>
          {step < 3 ? (
            <Button onClick={nextStep} disabled={!canNext()}>
              Lanjut <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={createOrder.isPending}>
              {createOrder.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Konfirmasi Pesanan
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Booking;
