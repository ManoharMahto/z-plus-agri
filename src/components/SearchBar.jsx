import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sprout } from 'lucide-react';
import { PRODUCTS } from '../data/products';

export default function SearchBar({ onSearchSubmit = null, placeholder = "Search for seeds, crops, brands (e.g. Tomato, Pusa Basmati, Syngenta)..." }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const q = query.toLowerCase();
    const matched = PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q))
    ).slice(0, 5);

    setSuggestions(matched);
  }, [query]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    if (onSearchSubmit) {
      onSearchSubmit(query.trim());
    } else {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectProduct = (productId) => {
    setIsOpen(false);
    navigate(`/product/${productId}`);
  };

  return (
    <div ref={searchContainerRef} className="relative w-full">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-24 py-2.5 rounded bg-white text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-agriYellow-400 shadow-inner border border-transparent"
        />
        <Search className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            className="absolute right-16 p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-1 top-1 bottom-1 px-4 bg-agriYellow-400 hover:bg-agriYellow-500 text-green-950 font-bold text-xs uppercase rounded flex items-center gap-1 transition-colors shadow-sm"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {/* Suggestion Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-xl border border-gray-100 py-2 z-50 overflow-hidden divide-y divide-gray-50">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
            <span>Matching Seed Products</span>
            <span className="text-green-600">{suggestions.length} results</span>
          </div>

          {suggestions.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectProduct(item.id)}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-green-50/70 cursor-pointer transition-colors group"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-10 h-10 object-cover rounded bg-gray-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-green-700 truncate">
                  {item.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">{item.category}</span>
                  <span className="font-semibold text-green-700">₹{item.price}</span>
                  <span className="line-through text-gray-400">₹{item.originalPrice}</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-green-600 shrink-0" />
            </div>
          ))}

          <div
            onClick={handleSearch}
            className="px-3 py-2 bg-gray-50 hover:bg-green-100/60 cursor-pointer text-center text-xs font-semibold text-green-800 flex items-center justify-center gap-1"
          >
            View all results for "{query}"
          </div>
        </div>
      )}
    </div>
  );
}
