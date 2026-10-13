import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, X, Leaf } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import Breadcrumb from '../components/Breadcrumb';
import EmptyState from '../components/EmptyState';
import { useProductStore } from '../store/productStore';

export default function ProductsPage() {
  const products = useProductStore((state) => state.products);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('search') || '';

  // Local filter states
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleResetFilters = () => {
    setPriceRange([0, 2000]);
    setMinRating(0);
    setSortBy('featured');
    setCurrentPage(1);
    searchParams.delete('search');
    setSearchParams(searchParams);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(q) ||
          (product.description && product.description.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      // 2. Price filter
      if (product.price > priceRange[1]) {
        return false;
      }

      // 3. Rating filter
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return (b.discount || 0) - (a.discount || 0);
      return b.rating * b.reviewCount - a.rating * a.reviewCount;
    });
  }, [products, searchQuery, priceRange, minRating, sortBy]);

  // Pagination Logic
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const categoryHeaderTitle = useMemo(() => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    return 'Z+ Agri Vegetable Seeds';
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Home', path: '/' },
          { label: 'Vegetable Seeds' }
        ]}
      />

      {/* Main Grid Layout: Left Sidebar + Right Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterSidebar
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            minRating={minRating}
            onRatingChange={setMinRating}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-4 overflow-y-auto z-10">
              <FilterSidebar
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                minRating={minRating}
                onRatingChange={setMinRating}
                onResetFilters={handleResetFilters}
                onCloseMobile={() => setMobileFilterOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Right Listing Section */}
        <div className="lg:col-span-3 space-y-4">
          {/* Top Bar: Title, Count, Mobile Filter Trigger, Sort Dropdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                {categoryHeaderTitle}
              </h1>
              <p className="text-xs text-gray-500">
                Showing {filteredProducts.length} certified vegetable seed varieties (Brand: Z+ Agri)
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
              {/* Mobile Filter Trigger Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition"
              >
                <SlidersHorizontal className="w-4 h-4 text-green-700" />
                <span>Filters</span>
                {(minRating > 0 || priceRange[1] < 2000) && (
                  <span className="w-2 h-2 rounded-full bg-green-600"></span>
                )}
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium whitespace-nowrap hidden sm:inline">
                  Sort By:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-800 font-medium focus:ring-1 focus:ring-green-600 focus:outline-none"
                >
                  <option value="featured">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="discount">Highest Discount</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(minRating > 0 || searchQuery || priceRange[1] < 2000) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-400 font-medium">Applied:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-800 px-2.5 py-1 rounded-full border border-green-200">
                  "{searchQuery}"
                  <button onClick={() => {
                    searchParams.delete('search');
                    setSearchParams(searchParams);
                  }}><X className="w-3 h-3" /></button>
                </span>
              )}
              {priceRange[1] < 2000 && (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full">
                  Under ₹{priceRange[1]}
                  <button onClick={() => setPriceRange([0, 2000])}><X className="w-3 h-3" /></button>
                </span>
              )}
              {minRating > 0 && (
                <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-800 px-2.5 py-1 rounded-full border border-yellow-200">
                  {minRating}★ & above
                  <button onClick={() => setMinRating(0)}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-green-700 hover:text-green-800 font-bold ml-1 text-xs underline"
              >
                Reset All
              </button>
            </div>
          )}

          {/* Product Grid / Empty State */}
          {currentProducts.length === 0 ? (
            <EmptyState
              title="Koi Seed Match Nahi Hua"
              description="Aapke filter criteria ke anusar koi seed nahi mila. Kripya filter reset karke dekhein."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-xs mt-6">
              <div className="hidden sm:block">
                <p className="text-xs text-gray-700">
                  Showing page <span className="font-bold">{currentPage}</span> of{' '}
                  <span className="font-bold">{totalPages}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 mx-auto sm:mx-0">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-3 py-1.5 text-xs font-bold rounded ${
                      currentPage === idx + 1
                        ? 'bg-green-700 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
