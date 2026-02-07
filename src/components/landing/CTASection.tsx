import { Link } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 bg-primary">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl mb-4">
            Siap Merasakan Pijat Profesional?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Daftar sekarang dan nikmati diskon 20% untuk booking pertama Anda. 
            Atau bergabung menjadi mitra terapis dan dapatkan penghasilan tambahan.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button 
                size="lg" 
                variant="secondary"
                className="w-full sm:w-auto gap-2"
              >
                Daftar Sebagai Pelanggan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/register-mitra">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto gap-2 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Users className="h-4 w-4" />
                Jadi Mitra Terapis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
