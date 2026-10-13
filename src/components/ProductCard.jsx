import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, CheckCircle, Zap } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useToastStore } from '../store/toastStore';

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const addToast = useToastStore((state) => state.addToast);

  const isFavorite = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    addToast(`Added "${product.name}" to Cart!`, 'success');
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    if (added) {
      addToast(`Added to your Wishlist!`, 'success');
    } else {
      addToast(`Removed from your Wishlist`, 'info');
    }
  };

  return (
    <div className="group bg-white rounded-lg border border-gray-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      
      {/* Top badges & Wishlist Button */}
      <div className="relative pt-[70%] sm:pt-[75%] bg-gray-50 overflow-hidden">
        {/* Wishlist button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full shadow-sm transition-all duration-200 ${
            isFavorite
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/80 hover:bg-white text-gray-400 hover:text-rose-500'
          }`}
          title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          aria-label="Wishlist toggle"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Bestseller or Deal Tag */}
        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
            {product.tags.includes('Bestseller') && (
              <span className="bg-amber-500 text-white font-extrabold text-[10px] uppercase px-2 py-0.5 rounded shadow-xs tracking-wider">
                Bestseller
              </span>
            )}
            {product.tags.includes('Deals of the Day') && (
              <span className="bg-green-700 text-agriYellow-300 font-extrabold text-[10px] uppercase px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5 fill-current" /> Hot Deal
              </span>
            )}
          </div>
        )}

        {/* Product Image */}
        <Link to={`/product/${product.id}`} className="absolute inset-0 block">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* Card Content */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
            <span className="font-semibold text-green-700 uppercase tracking-wider truncate max-w-[150px]">
              {product.brand}
            </span>
            <span className="text-gray-400 truncate">{product.category}</span>
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.id}`}
            className="block text-sm font-semibold text-gray-800 hover:text-green-700 line-clamp-2 leading-snug mb-2 group-hover:underline"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Flipkart-Style Rating Badge */}
          <div className="flex items-center gap-2 mb-2.5">
            <span className="inline-flex items-center gap-1 bg-green-700 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
              {product.rating.toFixed(1)}
              <Star className="w-3 h-3 fill-white text-white" />
            </span>
            <span className="text-xs text-gray-500">
              ({product.reviewCount?.toLocaleString('en-IN')})
            </span>
            <span className="hidden sm:inline-flex items-center text-[11px] text-green-700 font-medium ml-auto">
              <CheckCircle className="w-3 h-3 mr-0.5" /> Assured
            </span>
          </div>

          {/* Price Row */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-bold text-gray-900">
              ₹{product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
                <span className="text-xs font-bold text-green-600">
                  {product.discount}% off
                </span>
              </>
            )}
          </div>
        </div>

        {/* Card Footer: Stock & Add To Cart Button */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="text-[11px] text-gray-500">
            {product.quantityOptions?.[0] ? (
              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium">
                Pack: {product.quantityOptions[0]}
              </span>
            ) : (
              <span className="text-green-600 font-medium">In Stock</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shadow-xs ml-auto"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

      </div>
    </div>
  );
}
