import React from 'react';
import { Star, RotateCcw, X, Check, Leaf } from 'lucide-react';

export default function FilterSidebar({
  priceRange = [0, 2000],
  onPriceChange,
  minRating = 0,
  onRatingChange,
  onResetFilters,
  onCloseMobile = null
}) {
  return (
    <aside className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 sm:p-5 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="text-base font-bold text-gray-900 tracking-tight">Filters</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onResetFilters}
            className="text-xs text-green-700 hover:text-green-800 font-semibold flex items-center gap-1 hover:underline"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 text-gray-500 hover:text-gray-800"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Brand & Category Info */}
      <div className="bg-green-50 p-3 rounded-xl border border-green-200 space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-black text-green-900">
          <Leaf className="w-3.5 h-3.5 text-green-700" />
          <span>Brand: Z+ Agri</span>
        </div>
        <p className="text-[11px] text-green-800">
          Pure research-certified <strong>Vegetable Seeds</strong> directly from company depot.
        </p>
      </div>

      {/* Price Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Price Range
          </h4>
          <span className="text-xs font-bold text-green-700">
            Upto ₹{priceRange[1]}
          </span>
        </div>
        <input
          type="range"
          min={100}
          max={1500}
          step={50}
          value={priceRange[1]}
          onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
        <div className="flex justify-between text-[11px] text-gray-400 mt-2 font-medium">
          <span>₹100</span>
          <span>₹750</span>
          <span>₹1500+</span>
        </div>
      </div>

      {/* Customer Rating Filter */}
      <div className="border-t border-gray-100 pt-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Customer Rating
        </h4>
        <div className="space-y-1.5">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() => onRatingChange(minRating === stars ? 0 : stars)}
              type="button"
              className={`w-full flex items-center justify-between text-xs px-2.5 py-1.5 rounded transition ${
                minRating === stars
                  ? 'bg-green-100 text-green-800 font-bold border border-green-300'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">{stars}★ & above</span>
                <div className="flex text-yellow-400">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
              {minRating === stars && <Check className="w-3.5 h-3.5 text-green-700" />}
            </button>
          ))}
        </div>
      </div>

    </aside>
  );
}
