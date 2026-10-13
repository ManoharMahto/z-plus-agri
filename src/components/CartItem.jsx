import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Heart, Plus, Minus, CheckCircle } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useToastStore } from '../store/toastStore';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const addToast = useToastStore((state) => state.addToast);

  const product = item.product;
  const inWishlist = isInWishlist(product.id);

  const handleQtyChange = (delta) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      removeFromCart(item.id);
      addToast(`Removed "${product.name}" from Cart`, 'info');
    } else {
      updateQuantity(item.id, newQty);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
    addToast(`Removed "${product.name}" from Cart`, 'info');
  };

  const handleSaveForLater = () => {
    if (!inWishlist) {
      toggleWishlist(product);
      addToast(`Saved "${product.name}" to Wishlist!`, 'success');
    }
    removeFromCart(item.id);
  };

  return (
    <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 border-b border-gray-100 last:border-b-0 bg-white">
      {/* Product Image */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 mx-auto sm:mx-0">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-md border border-gray-100 hover:opacity-90"
          />
        </Link>
      </div>

      {/* Main Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">
                {product.brand}
              </span>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 hover:text-green-700 leading-snug">
                <Link to={`/product/${product.id}`}>{product.name}</Link>
              </h4>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs text-gray-500 block">Delivery in 3-4 days</span>
              <span className="text-[11px] text-green-600 font-bold flex items-center justify-end gap-1">
                <CheckCircle className="w-3 h-3" /> Assured Kisan Safe
              </span>
            </div>
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
            <span className="bg-gray-100 px-2 py-0.5 rounded font-medium text-gray-700">
              Pack Size: {item.selectedQtyOption || 'Standard'}
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500">Category: {product.category}</span>
          </div>

          {/* Pricing */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price * item.quantity}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice * item.quantity}
                </span>
                <span className="text-xs font-bold text-green-600">
                  {product.discount}% off
                </span>
              </>
            )}
            <span className="text-xs text-gray-400">
              (₹{product.price} / pack)
            </span>
          </div>
        </div>

        {/* Quantity Controls & Remove */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Quantity:</span>
            <div className="inline-flex items-center border border-gray-300 rounded shadow-xs">
              <button
                onClick={() => handleQtyChange(-1)}
                className="p-1.5 hover:bg-gray-100 text-gray-600 transition"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-gray-800">
                {item.quantity}
              </span>
              <button
                onClick={() => handleQtyChange(1)}
                className="p-1.5 hover:bg-gray-100 text-gray-600 transition"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={handleSaveForLater}
              className="text-gray-600 hover:text-green-700 flex items-center gap-1 transition"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Save for Later</span>
            </button>
            <button
              onClick={handleRemove}
              className="text-red-600 hover:text-red-700 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
