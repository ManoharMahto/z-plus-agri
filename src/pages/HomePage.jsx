import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  Clock, 
  ArrowRight, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  Percent, 
  TrendingUp, 
  Truck,
  Leaf
} from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import { useProductStore } from '../store/productStore';
import { CATEGORIES } from '../data/categories';

export default function HomePage() {
  const PRODUCTS = useProductStore((state) => state.products);
  // Timer for "Deals of the Day"
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 36,
    seconds: 48
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter products for various sections
  const dealsOfTheDay = PRODUCTS.filter((p) => p.tags.includes('Deals of the Day')).slice(0, 4);
  const bestSellers = PRODUCTS.filter((p) => p.tags.includes('Bestseller')).slice(0, 4);
  const featuredProducts = PRODUCTS.filter((p) => p.tags.includes('Featured')).slice(0, 4);
  const hybridSpecials = PRODUCTS.filter((p) => p.category === 'Hybrid Seeds').slice(0, 4);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* 1. Hero Banner Slider */}
      <HeroBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 2. Category Cards Grid */}
        <section className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" /> Browse by Seed Category
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">Pick from our research-certified crop collections</p>
            </div>
            <Link
              to="/products"
              className="text-xs sm:text-sm font-bold text-green-700 hover:text-green-800 flex items-center gap-1 hover:underline"
            >
              All Categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group bg-gradient-to-b from-gray-50 to-green-50/40 hover:to-green-100/50 p-4 rounded-lg border border-gray-100 hover:border-green-300 transition-all text-center flex flex-col items-center justify-between hover:shadow-md"
              >
                <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-3xl mb-2.5 group-hover:scale-110 transition-transform">
                  {cat.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-green-700 text-sm">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                    {cat.itemCount}+ High-Yield Varieties
                  </p>
                </div>
                <span className="mt-3 text-[11px] font-bold text-green-600 bg-white px-2.5 py-0.5 rounded-full border border-green-200">
                  Shop Now
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Flipkart-Style Deals of the Day with Countdown Timer */}
        <section className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-5 bg-gradient-to-r from-green-700 via-green-600 to-emerald-700 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-agriYellow-400 text-green-950 rounded-lg">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black tracking-tight">
                    Deals of the Day
                  </h2>
                  <span className="bg-agriYellow-400 text-green-950 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                    Flash Sale
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-100 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Ends in:</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-white bg-green-900/60 px-2 py-0.5 rounded">
                    <span>{String(timeLeft.hours).padStart(2, '0')}h</span> :
                    <span>{String(timeLeft.minutes).padStart(2, '0')}m</span> :
                    <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/products"
              className="bg-white hover:bg-green-50 text-green-800 text-xs sm:text-sm font-bold px-4 py-2 rounded-md shadow transition"
            >
              VIEW ALL DEALS
            </Link>
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {dealsOfTheDay.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 4. Promotional Banner Ads for Seasonal Seeds */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Promo 1 */}
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-amber-700 to-amber-900 text-white p-6 sm:p-8 flex items-center justify-between shadow-sm">
            <div className="relative z-10 max-w-xs space-y-2">
              <span className="bg-agriYellow-400 text-green-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded">
                Kharif Bumper Package
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                Pusa 1121 & Basmati Paddy Special
              </h3>
              <p className="text-xs text-amber-100">
                Guaranteed 90%+ germination rate with free fungicide seed treatment sachet.
              </p>
              <Link
                to="/products?category=cereal-seeds"
                className="inline-block mt-2 bg-white text-green-900 font-bold text-xs uppercase px-4 py-2 rounded shadow hover:bg-amber-100 transition"
              >
                Order Paddy Seeds →
              </Link>
            </div>
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden border-2 border-white/20 shrink-0 hidden sm:block">
              <img
                src="https://picsum.photos/seed/basmati-paddy-rice/300/300"
                alt="Paddy Promo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Promo 2 */}
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-emerald-800 to-green-900 text-white p-6 sm:p-8 flex items-center justify-between shadow-sm">
            <div className="relative z-10 max-w-xs space-y-2">
              <span className="bg-agriYellow-400 text-green-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded">
                Kitchen & Commercial Farm
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                High-Yield Hybrid Vegetable Combo
              </h3>
              <p className="text-xs text-emerald-100">
                Tomato NS-585, US-720 Chilli & Radhika Okra together at 30% combo discount!
              </p>
              <Link
                to="/products?category=vegetable-seeds"
                className="inline-block mt-2 bg-agriYellow-400 text-green-950 font-extrabold text-xs uppercase px-4 py-2 rounded shadow hover:bg-yellow-400 transition"
              >
                Grab Veg Combo →
              </Link>
            </div>
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl overflow-hidden border-2 border-white/20 shrink-0 hidden sm:block">
              <img
                src="https://picsum.photos/seed/tomato-seeds-585/300/300"
                alt="Vegetable Promo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* 5. Best Sellers Section */}
        <section className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" /> Kisan Best Sellers
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">Most planted varieties trusted by leading farmers</p>
            </div>
            <Link
              to="/products"
              className="text-xs sm:text-sm font-bold text-green-700 hover:text-green-800 flex items-center gap-1 hover:underline"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 6. Featured Hybrid Seeds Section */}
        <section className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                  Featured High-Tech Hybrid Seeds
                </h2>
                <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  F1 Premium
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">Drought-tolerant, virus-resistant, maximum market price yield</p>
            </div>
            <Link
              to="/products?category=hybrid-seeds"
              className="text-xs sm:text-sm font-bold text-green-700 hover:text-green-800 flex items-center gap-1 hover:underline"
            >
              Browse Hybrids <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {hybridSpecials.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 7. Why Indian Farmers Trust Z+ Agri */}
        <section className="bg-green-900 text-white rounded-2xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
            <span className="inline-block bg-agriYellow-400 text-green-950 font-black text-xs uppercase px-3 py-1 rounded-full">
              Kisan Seva Promise
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why 10,00,000+ Indian Farmers Rely on Z+ Agri Seeds
            </h2>
            <p className="text-sm sm:text-base text-green-100 max-w-2xl mx-auto">
              We bridge the gap between world-class agricultural research scientists and your farm soil. No adulteration, no expired stocks, just pure bumper harvest potential.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-left">
              <div className="bg-green-800/80 backdrop-blur-sm p-4 rounded-xl border border-green-700/80">
                <div className="text-agriYellow-400 font-black text-2xl mb-1">92.4%</div>
                <h4 className="font-bold text-sm text-white">Lab Tested Germination</h4>
                <p className="text-xs text-green-200 mt-1">Every lot is moisture and sprout tested before shipping to your village.</p>
              </div>

              <div className="bg-green-800/80 backdrop-blur-sm p-4 rounded-xl border border-green-700/80">
                <div className="text-agriYellow-400 font-black text-2xl mb-1">₹0 Advance</div>
                <h4 className="font-bold text-sm text-white">Cash on Delivery (COD)</h4>
                <p className="text-xs text-green-200 mt-1">Inspect your seed packet before paying the delivery agent right at your doorstep.</p>
              </div>

              <div className="bg-green-800/80 backdrop-blur-sm p-4 rounded-xl border border-green-700/80">
                <div className="text-agriYellow-400 font-black text-2xl mb-1">24x7</div>
                <h4 className="font-bold text-sm text-white">Toll-Free Agronomist Help</h4>
                <p className="text-xs text-green-200 mt-1">Free phone guidance on fertilizer dose, pest prevention and harvesting schedule.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
