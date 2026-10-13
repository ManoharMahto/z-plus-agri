import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShieldCheck, Truck, Award } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: "Kharif Season Mega Seed Mela",
    subtitle: "Up to 35% OFF on Certified High-Yield Hybrid Seeds",
    description: "Empowering 10+ Lakh farmers across India with drought-tolerant, high-production vegetable & cereal seeds.",
    badge: "Limited Time Kisan Offer",
    buttonText: "Shop Kharif Deals",
    buttonLink: "/products?category=hybrid-seeds",
    bgGradient: "from-green-800 via-green-700 to-emerald-900",
    image: "https://picsum.photos/seed/agriculture-harvest-field/800/400",
    highlights: ["90%+ Germination", "Fast Delivery to Village", "Cash On Delivery Available"]
  },
  {
    id: 2,
    title: "Pusa Basmati 1121 & Gold Cereals",
    subtitle: "Record Yields Guaranteed for 2026 Season",
    description: "Export grade Basmati paddy and Sharbati wheat certified grains directly from trusted agricultural institutes.",
    badge: "ICAR & Breeder Certified",
    buttonText: "Explore Cereal Seeds",
    buttonLink: "/products?category=cereal-seeds",
    bgGradient: "from-yellow-700 via-amber-700 to-green-900",
    image: "https://picsum.photos/seed/golden-wheat-farmer/800/400",
    highlights: ["Direct Factory Rates", "Treated Against Wilt", "Full Agronomy Support"]
  },
  {
    id: 3,
    title: "Commercial Vegetable Seed Superpacks",
    subtitle: "Earn More Per Acre with Disease-Tolerant Hybrids",
    description: "Top-rated Tomato NS-585, Mahyco Radhika Bhindi, and US-720 Chilli seeds with high market price realization.",
    badge: "Farmer's First Choice",
    buttonText: "Browse Vegetable Seeds",
    buttonLink: "/products?category=vegetable-seeds",
    bgGradient: "from-emerald-800 via-teal-800 to-green-900",
    image: "https://picsum.photos/seed/tomato-vegetable-farm/800/400",
    highlights: ["Virus Resistant", "Multi-Picking Harvest", "Uniform Fruit Size"]
  },
  {
    id: 4,
    title: "High Oil Content Mustard & Oilseeds",
    subtitle: "Up to 42% Oil Recovery in Every Grain",
    description: "Advanta Coral 4370 mustard, hybrid sunflower, and bold groundnut seeds suited for all major soil conditions.",
    badge: "Maximum Profit Crop",
    buttonText: "Order Oil Seeds",
    buttonLink: "/products?category=oil-seeds",
    bgGradient: "from-amber-800 via-yellow-800 to-green-900",
    image: "https://picsum.photos/seed/mustard-yellow-field-sunny/800/400",
    highlights: ["Frost Resistant", "Bold Heavy Seeds", "Pan-India Shipping"]
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const slide = SLIDES[currentSlide];

  return (
    <div
      className="relative w-full overflow-hidden bg-gray-900"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`w-full min-h-[300px] sm:min-h-[380px] md:min-h-[420px] bg-gradient-to-r ${slide.bgGradient} transition-all duration-700 ease-in-out flex items-center relative`}
      >
        {/* Background decorative image with overlay */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Content */}
            <div className="md:col-span-7 text-white space-y-3 sm:space-y-4">
              <span className="inline-block bg-agriYellow-400 text-green-950 font-black text-xs uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
                {slide.badge}
              </span>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
                {slide.title}
              </h1>

              <p className="text-sm sm:text-lg md:text-xl text-yellow-200 font-semibold">
                {slide.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-gray-200 max-w-xl hidden sm:block leading-relaxed">
                {slide.description}
              </p>

              {/* Highlights badge row */}
              <div className="flex flex-wrap gap-2 pt-1">
                {slide.highlights.map((h, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[11px] sm:text-xs bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded text-white border border-white/20"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-agriYellow-400" />
                    {h}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 sm:pt-4 flex items-center gap-3">
                <Link
                  to={slide.buttonLink}
                  className="bg-agriYellow-400 hover:bg-agriYellow-500 text-green-950 font-extrabold px-6 py-3 rounded-md text-sm sm:text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 inline-block"
                >
                  {slide.buttonText} →
                </Link>

                <Link
                  to="/products"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 rounded-md text-sm sm:text-base border border-white/30 transition-all inline-block"
                >
                  View All Seeds
                </Link>
              </div>
            </div>

            {/* Right Card / Visual */}
            <div className="md:col-span-5 hidden md:flex justify-center items-center">
              <div className="relative group p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl max-w-sm">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="rounded-xl w-full h-64 object-cover shadow-inner group-hover:scale-102 transition duration-300"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-green-950/85 backdrop-blur-md rounded-lg p-3 text-white border border-green-700/50">
                  <div className="flex items-center justify-between text-xs font-semibold text-agriYellow-400 mb-1">
                    <span>Z+ AGRI CERTIFIED</span>
                    <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> High Germination</span>
                  </div>
                  <p className="text-xs text-gray-200">Fresh Stock Packed & Tested for 2026 Sowing Season</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition focus:outline-none z-20 backdrop-blur-xs"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white transition focus:outline-none z-20 backdrop-blur-xs"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel indicator dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? 'w-8 bg-agriYellow-400' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
