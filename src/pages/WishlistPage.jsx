import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import EmptyState from '../components/EmptyState';
import { useWishlistStore } from '../store/wishlistStore';

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
      <Breadcrumb items={[{ label: 'My Saved Seeds' }]} />

      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-gray-900">
              My Saved Seeds ({items.length})
            </h1>
            <p className="text-xs text-gray-500">
              Keep track of seed varieties you want to plant next season
            </p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Save high-yield seeds to your wishlist while exploring. Easily add them to your cart when you are ready to order."
          actionText="Explore Seed Varieties"
          actionLink="/products"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
