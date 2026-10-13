import React from 'react';
import { Star, RotateCcw, X, Check } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { BRANDS } from '../data/products';

export default function FilterSidebar({
  selectedCategory = 'all',
  onCategoryChange,
  priceRange = [0, 2000],
  onPriceChange,
  minRating = 0,
  onRatingChange,
  selectedBrands = [],
  onBrandToggle,
  onResetFilters,
  onCloseMobile = null
}) {
  return (
    <aside className="bg-white rounded-lg border border-gray-200 shadow-xs p-4 sm:p-5 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="text-base font-bold text-gray-900 tracking-tight">Filters</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onResetFilters}
            className="text-xs text-green-700 hover:text-green-800 font-semibold flex items-center gap-1 hover:underline"
          >
            <RotateCcw className="w-3 h-3" /> Clear All
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

      {/* Category Section */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Categories
        </h4>
        <div className="space-y-1.5 text-sm">
          <label className="flex items-center gap-2.5 cursor-pointer py-1 px-1 rounded hover:bg-gray-50">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === 'all'}
              onChange={() => onCategoryChange('all')}
              className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <span className={selectedCategory === 'all' ? 'font-bold text-green-700' : 'text-gray-700'}>
              All Categories
            </span>
          </label>

          {CATEGORIES.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2.5 cursor-pointer py-1 px-1 rounded hover:bg-gray-50"
            >
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat.slug}
                onChange={() => onCategoryChange(cat.slug)}
                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="text-base leading-none">{cat.emoji}</span>
              <span className={selectedCategory === cat.slug ? 'font-bold text-green-700' : 'text-gray-700'}>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="border-t border-gray-100 pt-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Price Range
          </h4>
          <span className="text-xs font-bold text-green-700">
            Up to ₹{priceRange[1]}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="2000"
          step="50"
          value={priceRange[1]}
          onChange={(e) => onPriceChange([0, Number(e.target.value)])}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
        <div className="flex justify-between text-[11px] text-gray-400 mt-2 font-medium">
          <span>₹100</span>
          <span>₹1000</span>
          <span>₹2000+</span>
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

      {/* Brand Filter */}
      <div className="border-t border-gray-100 pt-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Popular Seed Brands
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
          {BRANDS.map((brand) => {
            const isChecked = selectedBrands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-green-700"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onBrandToggle(brand)}
                  className="w-3.5 h-3.5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                />
                <span className={isChecked ? 'font-bold text-green-800' : ''}>
                  {brand}
                </span>
              </label>
            );
          })}
        </div>
      </div>

    </aside>
  );
}
