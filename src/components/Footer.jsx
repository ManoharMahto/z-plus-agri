import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  HeartHandshake,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16 border-t-4 border-green-600">
      
      {/* Kisan Trust Badges Header */}
      <div className="bg-gray-800/80 border-b border-gray-700/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center sm:text-left">
            
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="p-2.5 rounded-lg bg-green-950 text-green-400 border border-green-800/60">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h5 className="text-white text-xs sm:text-sm font-bold">100% Certified Seeds</h5>
                <p className="text-[11px] text-gray-400">Tested germination & purity</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="p-2.5 rounded-lg bg-green-950 text-green-400 border border-green-800/60">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h5 className="text-white text-xs sm:text-sm font-bold">Pan-India Village Delivery</h5>
                <p className="text-[11px] text-gray-400">Doorstep drop via India Post & Couriers</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="p-2.5 rounded-lg bg-green-950 text-green-400 border border-green-800/60">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h5 className="text-white text-xs sm:text-sm font-bold">Easy Replacements</h5>
                <p className="text-[11px] text-gray-400">Damaged package replacement</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="p-2.5 rounded-lg bg-green-950 text-green-400 border border-green-800/60">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h5 className="text-white text-xs sm:text-sm font-bold">Agronomist Advisory</h5>
                <p className="text-[11px] text-gray-400">Free sowing & crop advisory</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: About Z+ Agri */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white">
                Z<span className="text-agriYellow-400">+</span> Agri
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
              Z+ Agri is India’s dedicated digital seed marketplace providing authentic, breeder-certified hybrid & open-pollinated seeds to empower farmers with superior crop yields, higher profits, and disease-free harvests.
            </p>
            <div className="flex items-center gap-3 pt-2 text-gray-400">
              <a href="#" className="p-2 rounded-full bg-gray-800 hover:text-white hover:bg-green-700 transition" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-800 hover:text-white hover:bg-green-700 transition" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-800 hover:text-white hover:bg-green-700 transition" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-gray-800 hover:text-white hover:bg-green-700 transition" aria-label="Youtube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-green-500 pl-2">
              Seed Categories
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/products?category=vegetable-seeds" className="hover:text-agriYellow-400 transition">
                  🥦 Vegetable Seeds
                </Link>
              </li>
              <li>
                <Link to="/products?category=cereal-seeds" className="hover:text-agriYellow-400 transition">
                  🌾 Cereal & Paddy Seeds
                </Link>
              </li>
              <li>
                <Link to="/products?category=oil-seeds" className="hover:text-agriYellow-400 transition">
                  🌻 High-Oil Mustard & Til
                </Link>
              </li>
              <li>
                <Link to="/products?category=spice-seeds" className="hover:text-agriYellow-400 transition">
                  🌶️ Jeera, Methi & Dhaniya
                </Link>
              </li>
              <li>
                <Link to="/products?category=hybrid-seeds" className="hover:text-agriYellow-400 transition">
                  🧬 High Yield Hybrid F1
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-green-500 pl-2">
              Farmer Helpdesk
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/profile#orders" className="hover:text-agriYellow-400 transition">
                  Track My Seed Order
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-agriYellow-400 transition">
                  View My Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-agriYellow-400 transition">
                  Saved Seeds (Wishlist)
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-agriYellow-400 transition">
                  Kisan Account Settings
                </Link>
              </li>
              <li>
                <a href="#helpline" className="hover:text-agriYellow-400 transition">
                  Agronomy Sowing Guides
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-green-500 pl-2">
              Contact & Mandi Office
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <span>Z+ Agri Tech Hub, Sector 18, Kisan Bhawan, New Delhi - 110001, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-green-500 shrink-0" />
                <span className="text-white font-semibold">1800-889-AGRI (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-green-500 shrink-0" />
                <span>support@zplusagri.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/60 border-t border-gray-800 py-4 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Z+ Agri Technologies Private Limited. All Rights Reserved.</p>
          <p className="text-agriYellow-400 font-medium">
            Dedicated with gratitude to the hardworking Annadatas of Bharat 🌾
          </p>
        </div>
      </div>

    </footer>
  );
}
