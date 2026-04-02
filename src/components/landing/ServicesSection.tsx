import { Flower2, Dumbbell, Baby, Heart, Zap, Leaf, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const services = [
  {
    icon: Leaf,
    title: "Pijat Tradisional",
    description: "Teknik pijat tradisional Indonesia untuk meredakan pegal dan melancarkan peredaran darah.",
    duration: "60-90 menit",
    price: "Mulai Rp 150.000",
    popular: false,
  },
  {
    icon: Flower2,
    title: "Aromatherapy",
    description: "Kombinasi pijat relaksasi dengan essential oil pilihan untuk ketenangan pikiran.",
    duration: "60-90 menit",
    price: "Mulai Rp 200.000",
    popular: true,
  },
  {
    icon: Dumbbell,
    title: "Sport Massage",
    description: "Pijat khusus untuk atlet dan aktifis olahraga, membantu pemulihan otot.",
    duration: "60-90 menit",
    price: "Mulai Rp 180.000",
    popular: false,
  },
  {
    icon: Baby,
    title: "Pijat Ibu Hamil",
    description: "Pijat lembut dan aman untuk ibu hamil, membantu mengurangi ketidaknyamanan.",
    duration: "45-60 menit",
    price: "Mulai Rp 175.000",
    popular: false,
  },
  {
    icon: Heart,
    title: "Refleksi",
    description: "Pijat titik-titik refleksi di kaki untuk kesehatan organ tubuh secara menyeluruh.",
    duration: "45-60 menit",
    price: "Mulai Rp 120.000",
    popular: false,
  },
  {
    icon: Zap,
    title: "Deep Tissue",
    description: "Pijat intensif untuk mengatasi ketegangan otot kronis dan nyeri punggung.",
    duration: "60-90 menit",
    price: "Mulai Rp 220.000",
    popular: true,
  },
];

const ServicesSection = () => {
  return (
    <section id="layanan" className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm font-medium">
            Layanan Profesional
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Layanan Kami
          </h2>
          <p className="text-lg text-muted-foreground">
            Pilih layanan pijat sesuai kebutuhan Anda. Semua terapis kami telah 
            tersertifikasi dan berpengalaman.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/30 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-0.5">
                    Populer
                  </Badge>
                </div>
              )}

              {/* Decorative gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardHeader className="pb-4 relative">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-primary/25">
                  <service.icon className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <CardTitle className="text-xl transition-colors duration-300 group-hover:text-primary">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative">
                <div className="flex items-center justify-between text-sm pt-4 border-t border-border/50">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {service.duration}
                  </span>
                  <span className="font-bold text-primary text-base">{service.price}</span>
                </div>

                {/* Hover CTA */}
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Pesan Sekarang
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
