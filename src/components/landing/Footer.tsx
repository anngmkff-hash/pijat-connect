import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12 md:py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">PijatPro</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Platform pijat panggilan profesional terpercaya. Terapis terverifikasi, 
              booking mudah, layanan berkualitas.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-background transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-background transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-background transition-colors">Pijat Tradisional</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Aromatherapy</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Sport Massage</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Refleksi</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Deep Tissue</a></li>
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 className="font-semibold mb-4">Perusahaan</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-background transition-colors">Tentang Kami</Link></li>
              <li><Link to="/register-mitra" className="hover:text-background transition-colors">Jadi Mitra</Link></li>
              <li><Link to="/privacy" className="hover:text-background transition-colors">Kebijakan Privasi</Link></li>
              <li><Link to="/terms" className="hover:text-background transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link to="/help" className="hover:text-background transition-colors">Bantuan</Link></li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-semibold mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>hello@pijatpro.id</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>0812-3456-7890</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-muted-foreground/20 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PijatPro. Semua hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
