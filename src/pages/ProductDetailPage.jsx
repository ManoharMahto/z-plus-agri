import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  MapPin, 
  Check, 
  Share2, 
  Zap, 
  Leaf,
  Sprout,
  Calendar,
  AlertCircle
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import { PRODUCTS } from '../data/products';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useToastStore } from '../store/toastStore';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = PRODUCTS.find((p) => p.id === Number(id)) || PRODUCTS[0];
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  // Gallery state
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedQtyOption, setSelectedQtyOption] = useState(
    product.quantityOptions?.[0] || '1 Unit'
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [pincode, setPincode] = useState('452001');
  const [pincodeStatus, setPincodeStatus] = useState('Available for delivery by Thursday');

  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const addToast = useToastStore((state) => state.addToast);

  const isFavorite = isInWishlist(product.id);

  // Sync state if product changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImage(product.image);
    setSelectedQtyOption(product.quantityOptions?.[0] || '1 Unit');
    setQuantity(1);
  }, [id, product]);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedQtyOption);
    addToast(`Added ${quantity} pack(s) of "${product.name}" to cart!`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedQtyOption);
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    const added = toggleWishlist(product);
    if (added) {
      addToast('Added to Wishlist!', 'success');
    } else {
      addToast('Removed from Wishlist', 'info');
    }
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeStatus(`Fast Delivery Available to Pincode ${pincode} in 3 business days!`);
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code');
    }
  };

  const imagesList = product.images || [product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Products', path: '/products' },
          { label: product.category, path: `/products?category=${product.category.toLowerCase().replace(/ /g, '-')}` },
          { label: product.name }
        ]}
      />

      {/* Main Product Layout */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-5 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-[440px] shrink-0 no-scrollbar">
              {imagesList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === imgUrl
                      ? 'border-green-600 ring-2 ring-green-200'
                      : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image Stage */}
            <div className="flex-1 relative bg-gray-50 rounded-xl overflow-hidden border border-gray-100 min-h-[320px] sm:min-h-[420px] flex items-center justify-center">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain max-h-[420px] p-2 hover:scale-105 transition-transform duration-300"
              />

              {/* Wishlist Icon */}
              <button
                onClick={handleWishlistToggle}
                className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md transition ${
                  isFavorite
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-white/90 text-gray-500 hover:text-rose-500'
                }`}
                title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              {/* Certification Tag */}
              <div className="absolute bottom-3 left-3 bg-green-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-agriYellow-400" />
                Certified Germination
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              {/* Brand & Category badges */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2.5 py-0.5 rounded border border-green-200">
                  {product.brand}
                </span>
                <span className="text-xs text-gray-500">
                  Category: <strong className="text-gray-700">{product.category}</strong>
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Ratings and Reviews */}
              <div className="mt-2.5 flex items-center gap-3">
                <span className="inline-flex items-center gap-1 bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                  {product.rating.toFixed(1)} <Star className="w-3 h-3 fill-white inline" />
                </span>
                <span className="text-xs sm:text-sm text-gray-500 font-medium">
                  {product.reviewCount?.toLocaleString('en-IN')} Ratings & Verified Kisan Reviews
                </span>
              </div>

              {/* Pricing Section (Flipkart style) */}
              <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-gray-950">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-base text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                      <span className="text-base font-extrabold text-green-600">
                        {product.discount}% off
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Inclusive of all taxes & free protective agronomy packaging.
                </p>
                {product.originalPrice && (
                  <p className="text-xs font-semibold text-green-700 mt-1">
                    You save ₹{product.originalPrice - product.price} on this seed pack!
                  </p>
                )}
              </div>

              {/* Pack Size / Quantity Option Selector */}
              {product.quantityOptions && product.quantityOptions.length > 0 && (
                <div className="mt-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                    Select Pack Size / Quantity:
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.quantityOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedQtyOption(opt)}
                        className={`px-3.5 py-1.5 rounded-md text-xs font-bold border transition ${
                          selectedQtyOption === opt
                            ? 'bg-green-600 text-white border-green-600 shadow-xs'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Number of Packs Selector */}
              <div className="mt-5 flex items-center gap-4">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  Number of Packs:
                </label>
                <div className="inline-flex items-center border border-gray-300 rounded shadow-xs bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-sm font-extrabold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Cart + Buy Now */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-agriYellow-400 hover:bg-agriYellow-500 text-green-950 font-black py-3 px-6 rounded-lg text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition transform active:scale-98"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>ADD TO CART</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-3 px-6 rounded-lg text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition transform active:scale-98"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  <span>BUY NOW</span>
                </button>
              </div>

              {/* Delivery & Pincode Checker */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-green-700" /> Check Delivery to Your Village / Mandi
                </h4>
                <form onSubmit={handlePincodeCheck} className="flex gap-2 max-w-sm">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit PIN"
                    className="border border-gray-300 rounded px-3 py-1.5 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-green-600 font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold px-4 py-1.5 rounded transition"
                  >
                    Check
                  </button>
                </form>
                {pincodeStatus && (
                  <p className="text-xs text-green-700 font-medium mt-1.5 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {pincodeStatus}
                  </p>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Detailed Tabs: Specifications, Description, Reviews */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('specs')}
              className={`py-3 px-6 font-bold text-sm border-b-2 transition ${
                activeTab === 'specs'
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Specifications & Agronomy
            </button>
            <button
              onClick={() => setActiveTab('desc')}
              className={`py-3 px-6 font-bold text-sm border-b-2 transition ${
                activeTab === 'desc'
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Description & Sowing
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3 px-6 font-bold text-sm border-b-2 transition ${
                activeTab === 'reviews'
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Kisan Reviews ({product.reviewCount || 120})
            </button>
          </div>

          <div className="py-6">
            {activeTab === 'specs' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-base font-bold text-gray-900">Crop Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="text-xs text-gray-500 block">Brand / Seed Breeder</span>
                    <span className="font-semibold text-gray-800">{product.brand}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="text-xs text-gray-500 block">Category</span>
                    <span className="font-semibold text-gray-800">{product.category}</span>
                  </div>
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <span className="text-xs text-gray-500 block capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="font-semibold text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'desc' && (
              <div className="space-y-4 max-w-3xl text-sm text-gray-700 leading-relaxed">
                <h3 className="text-base font-bold text-gray-900">Variety Overview</h3>
                <p>{product.description}</p>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 mt-4">
                  <h4 className="font-bold text-green-800 text-sm mb-1">Expert Agronomy Tips:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-green-900">
                    <li>Treat seeds with Trichoderma or recommended fungicide prior to sowing.</li>
                    <li>Maintain optimum soil moisture; avoid water-logging in germination phase.</li>
                    <li>Apply balanced N:P:K basal dose according to soil health card.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6 max-w-3xl">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center pr-4 border-r border-gray-200">
                    <div className="text-3xl font-black text-gray-900">{product.rating}</div>
                    <StarRating rating={product.rating} size="sm" />
                    <span className="text-[11px] text-gray-500 mt-1 block">Verified Farmers</span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p className="font-semibold text-gray-800">96% of farmers recommend this seed variety</p>
                    <p>High germination rate, uniform seedlings, and top market rate at regional Mandis.</p>
                  </div>
                </div>

                {/* Sample Verified Reviews */}
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-green-700 text-white text-[11px] font-bold px-1.5 py-0.2 rounded">5 ★</span>
                      <h5 className="font-bold text-sm text-gray-900">Superb germination, above 90% in 5 days!</h5>
                    </div>
                    <p className="text-xs text-gray-600">
                      Sowed in Kharif season across 3 acres. Strong branching and zero viral leaf curl attack. Packed freshly with proper batch number.
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1.5">
                      <span className="font-medium text-gray-700">Balvinder Singh (Ludhiana, Punjab)</span>
                      <span>• Certified Buyer • 2 weeks ago</span>
                    </div>
                  </div>

                  <div className="border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-green-700 text-white text-[11px] font-bold px-1.5 py-0.2 rounded">5 ★</span>
                      <h5 className="font-bold text-sm text-gray-900">Original brand seeds at best price</h5>
                    </div>
                    <p className="text-xs text-gray-600">
                      Local mandi was asking ₹150 more per packet. Delivered directly to our village post office without any hassle.
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1.5">
                      <span className="font-medium text-gray-700">Dhananjay Patil (Nashik, Maharashtra)</span>
                      <span>• Certified Buyer • 1 month ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Related Products Recommendation */}
      {relatedProducts.length > 0 && (
        <section className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Similar Recommended Seeds</h3>
              <p className="text-xs text-gray-500">Other high-yield varieties in {product.category}</p>
            </div>
            <Link
              to={`/products?category=${product.category.toLowerCase().replace(/ /g, '-')}`}
              className="text-xs font-bold text-green-700 hover:underline"
            >
              View More in Category →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
