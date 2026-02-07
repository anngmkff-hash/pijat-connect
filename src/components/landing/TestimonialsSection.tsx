import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sari Dewi",
    location: "Jakarta Selatan",
    rating: 5,
    text: "Pelayanan sangat profesional! Terapis datang tepat waktu dan teknik pijatnya luar biasa. Saya merasa jauh lebih rileks setelah sesi.",
    initials: "SD",
  },
  {
    name: "Budi Santoso",
    location: "Bandung",
    rating: 5,
    text: "Sebagai pekerja kantoran, saya sering mengalami pegal di punggung. Layanan pijat sport massage di sini benar-benar membantu!",
    initials: "BS",
  },
  {
    name: "Rina Kartika",
    location: "Surabaya",
    rating: 5,
    text: "Booking mudah dan cepat. Terapis yang datang sangat ramah dan profesional. Highly recommended!",
    initials: "RK",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimoni" className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Apa Kata Pelanggan Kami
          </h2>
          <p className="text-lg text-muted-foreground">
            Ribuan pelanggan telah merasakan manfaat layanan pijat profesional kami
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="relative border-border/50 bg-card"
            >
              <CardContent className="pt-6">
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-foreground mb-6">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 bg-accent">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
