import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import Breadcrumb from '../components/Breadcrumb';
import EmptyState from '../components/EmptyState';
import { useProductStore } from '../store/productStore';
import { CATEGORIES } from '../data/categories';

export default function ProductsPage() {
  const products = useProductStore((state) => state.products);
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const categoryParam = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [minRating, setMinRating] = useState(0);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category param with URL if changed
  useEffect(() => {
    setSelectedCategory(categoryParam);
    setCurrentPage(1);
  }, [categoryParam]);

  const handleCategoryChange = (catSlug) => {
    setSelectedCategory(catSlug);
    setCurrentPage(1);
    if (catSlug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catSlug);
    }
    setSearchParams(searchParams);
  };

  const handleBrandToggle = (brand) => {
    setCurrentPage(1);
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 2000]);
    setMinRating(0);
    setSelectedBrands([]);
    setSortBy('featured');
    setCurrentPage(1);
    searchParams.delete('category');
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
          product.category.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all') {
        const catObj = CATEGORIES.find((c) => c.slug === selectedCategory);
        if (catObj && product.category.toLowerCase() !== catObj.name.toLowerCase()) {
          return false;
        }
      }

      // 3. Price filter
      if (product.price > priceRange[1]) {
        return false;
      }

      // 4. Rating filter
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      // 5. Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return b.discount - a.discount;
      // Default: featured (ID order or priority tags)
      return b.rating * b.reviewCount - a.rating * a.reviewCount;
    });
  }, [products, searchQuery, selectedCategory, priceRange, minRating, selectedBrands, sortBy]);

  // Pagination Logic
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Current category name for header
  const categoryHeaderTitle = useMemo(() => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (selectedCategory === 'all') return 'All Certified Seed Products';
    const cat = CATEGORIES.find((c) => c.slug === selectedCategory);
    return cat ? `${cat.name} (${cat.emoji})` : 'Certified Seeds';
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Seeds & Crops', path: '/products' },
          { label: categoryHeaderTitle }
        ]}
      />

      {/* Main Grid Layout: Left Sidebar + Right Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            minRating={minRating}
            onRatingChange={setMinRating}
            selectedBrands={selectedBrands}
            onBrandToggle={handleBrandToggle}
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
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                minRating={minRating}
                onRatingChange={setMinRating}
                selectedBrands={selectedBrands}
                onBrandToggle={handleBrandToggle}
                onResetFilters={handleResetFilters}
                onCloseMobile={() => setMobileFilterOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Right Listing Section */}
        <div className="lg:col-span-3 space-y-4">
          {/* Top Bar: Title, Count, Mobile Filter Trigger, Sort Dropdown */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                {categoryHeaderTitle}
              </h1>
              <p className="text-xs text-gray-500">
                Showing {filteredProducts.length} high-germination seed varieties
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
              {/* Mobile Filter Trigger Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-green-700" />
                <span>Filters</span>
                {(selectedBrands.length > 0 || minRating > 0 || selectedCategory !== 'all') && (
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
                  className="text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-800 font-medium focus:ring-1 focus:ring-green-600 focus:outline-none"
                >
                  <option value="featured">Popularity & Rating</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="discount">Highest Discount</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(selectedCategory !== 'all' || selectedBrands.length > 0 || minRating > 0 || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-400 font-medium">Applied:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-800 px-2.5 py-1 rounded-full border border-green-200">
                  {selectedCategory}
                  <button onClick={() => handleCategoryChange('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-800 px-2.5 py-1 rounded-full border border-green-200">
                  "{searchQuery}"
                  <button onClick={() => {
                    searchParams.delete('search');
                    setSearchParams(searchParams);
                  }}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedBrands.map((b) => (
                <span key={b} className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full">
                  {b}
                  <button onClick={() => handleBrandToggle(b)}><X className="w-3 h-3" /></button>
                </span>
              ))}
              {minRating > 0 && (
                <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-800 px-2.5 py-1 rounded-full border border-yellow-200">
                  {minRating}★ & above
                  <button onClick={() => setMinRating(0)}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-red-600 hover:underline font-medium ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Cards Grid or Empty State */}
          {currentProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Seeds Match Your Filters"
              description="Try resetting your price range, selected seed brands or search keyword to see available stocks."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Page <span className="font-bold text-gray-800">{currentPage}</span> of{' '}
                <span className="font-bold text-gray-800">{totalPages}</span>
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 sm:px-3 sm:py-1.5 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded text-xs font-bold transition ${
                        currentPage === pageNum
                          ? 'bg-green-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 sm:px-3 sm:py-1.5 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
