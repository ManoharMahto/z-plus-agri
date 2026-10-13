import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Search,
  SlidersHorizontal,
  ShieldCheck, 
  Truck,
  PhoneCall,
  CheckCircle2,
  Leaf
} from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import { useProductStore } from '../store/productStore';

export default function HomePage() {
  const PRODUCTS = useProductStore((state) => state.products);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
    });

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }
    return list;
  }, [PRODUCTS, searchQuery, sortBy]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* 1. Hero Banner */}
      <HeroBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* 2. Direct Product Catalog Header & Controls (Without Split Sections) */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                Z+ Agri Vegetable Seeds Catalog
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Direct company certified seeds • High germination rate • Cash on Delivery & WhatsApp Order available
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Beej ka naam search karein..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:outline-none bg-gray-50"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto text-xs font-bold border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none"
            >
              <option value="featured">Featured (Sabse Badiya)</option>
              <option value="price-low">Price: Kam se Jyada (₹ Low to High)</option>
              <option value="price-high">Price: Jyada se Kam (₹ High to Low)</option>
              <option value="discount">Biggest Discount (%)</option>
            </select>
          </div>
        </div>

        {/* 3. Direct Products Grid (No category clutter, all products directly visible) */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
            <p className="text-sm font-bold text-gray-700">Koi seed match nahi hua "{searchQuery}" ke saath.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-green-700 font-bold underline"
            >
              Sabhi seeds dekhein
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* 4. Why Indian Farmers Trust Z+ Agri Seeds */}
        <section className="bg-green-900 text-white rounded-2xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
            <span className="inline-block bg-agriYellow-400 text-green-950 font-black text-xs uppercase px-3 py-1 rounded-full">
              Kisan Seva Promise
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why Indian Farmers Rely on Z+ Agri Seeds
            </h2>
            <p className="text-sm sm:text-base text-green-100 max-w-2xl mx-auto">
              Direct company supply — no middlemen, no adulteration, pure high-germination seed varieties packed directly at our warehouse.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-left">
              <div className="bg-green-800/80 backdrop-blur-sm p-4 rounded-xl border border-green-700/80">
                <div className="text-agriYellow-400 font-black text-2xl mb-1">90%+</div>
                <h4 className="font-bold text-sm text-white">Lab Tested Germination</h4>
                <p className="text-xs text-green-200 mt-1">Har packet lab-tested hai taaki khet mein 90% se adhik beej ug skein.</p>
              </div>

              <div className="bg-green-800/80 backdrop-blur-sm p-4 rounded-xl border border-green-700/80">
                <div className="text-agriYellow-400 font-black text-2xl mb-1">WhatsApp & Call</div>
                <h4 className="font-bold text-sm text-white">Instant Order</h4>
                <p className="text-xs text-green-200 mt-1">Bina kisi jhanjhat ke WhatsApp (9508365119) ya Call (9508901585) par seedhe order karein.</p>
              </div>

              <div className="bg-green-800/80 backdrop-blur-sm p-4 rounded-xl border border-green-700/80">
                <div className="text-agriYellow-400 font-black text-2xl mb-1">Doorstep COD</div>
                <h4 className="font-bold text-sm text-white">Cash on Delivery</h4>
                <p className="text-xs text-green-200 mt-1">Gaon mein parcel haath mein aane ke baad hi paise dein.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
