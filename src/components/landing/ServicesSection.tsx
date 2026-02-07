import { Flower2, Dumbbell, Baby, Heart, Sparkles, Leaf } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: Leaf,
    title: "Pijat Tradisional",
    description: "Teknik pijat tradisional Indonesia untuk meredakan pegal dan melancarkan peredaran darah.",
    duration: "60-90 menit",
    price: "Mulai Rp 150.000",
  },
  {
    icon: Flower2,
    title: "Aromatherapy",
    description: "Kombinasi pijat relaksasi dengan essential oil pilihan untuk ketenangan pikiran.",
    duration: "60-90 menit",
    price: "Mulai Rp 200.000",
  },
  {
    icon: Dumbbell,
    title: "Sport Massage",
    description: "Pijat khusus untuk atlet dan aktifis olahraga, membantu pemulihan otot.",
    duration: "60-90 menit",
    price: "Mulai Rp 180.000",
  },
  {
    icon: Baby,
    title: "Pijat Ibu Hamil",
    description: "Pijat lembut dan aman untuk ibu hamil, membantu mengurangi ketidaknyamanan.",
    duration: "45-60 menit",
    price: "Mulai Rp 175.000",
  },
  {
    icon: Heart,
    title: "Refleksi",
    description: "Pijat titik-titik refleksi di kaki untuk kesehatan organ tubuh secara menyeluruh.",
    duration: "45-60 menit",
    price: "Mulai Rp 120.000",
  },
  {
    icon: Sparkles,
    title: "Deep Tissue",
    description: "Pijat intensif untuk mengatasi ketegangan otot kronis dan nyeri punggung.",
    duration: "60-90 menit",
    price: "Mulai Rp 220.000",
  },
];

const ServicesSection = () => {
  return (
    <section id="layanan" className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
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
              className="group relative overflow-hidden border-border/50 bg-card transition-all hover:shadow-soft hover:border-primary/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-primary">
                  <service.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{service.duration}</span>
                  <span className="font-semibold text-primary">{service.price}</span>
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
