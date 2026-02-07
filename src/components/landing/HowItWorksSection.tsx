import { CalendarCheck, MapPin, Star } from "lucide-react";

const steps = [
  {
    icon: CalendarCheck,
    step: "1",
    title: "Pilih Layanan & Waktu",
    description: "Pilih jenis pijat yang Anda inginkan dan tentukan jadwal yang sesuai dengan Anda.",
  },
  {
    icon: MapPin,
    step: "2",
    title: "Tentukan Lokasi",
    description: "Masukkan alamat lengkap Anda. Terapis terdekat akan disiapkan untuk melayani.",
  },
  {
    icon: Star,
    step: "3",
    title: "Nikmati Layanan",
    description: "Terapis datang tepat waktu. Nikmati pijat berkualitas di kenyamanan rumah Anda.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="cara-kerja" className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Cara Kerja
          </h2>
          <p className="text-lg text-muted-foreground">
            Booking pijat profesional hanya dalam 3 langkah mudah
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((item, index) => (
            <div key={item.step} className="relative text-center">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              
              {/* Icon */}
              <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-primary/10" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <item.icon className="h-8 w-8" />
                </div>
                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold text-sm">
                  {item.step}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
