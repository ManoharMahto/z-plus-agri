import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CATEGORIES, ALL_CATEGORY_OPTION } from '../data/categories';

export default function CategoryBar() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeCategory = searchParams.get('category');

  const allItems = [ALL_CATEGORY_OPTION, ...CATEGORIES];

  return (
    <div className="bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-2.5 sm:py-3.5 gap-4 sm:gap-8">
          {allItems.map((cat) => {
            const isAll = cat.id === 'all';
            const isActive = isAll ? !activeCategory && location.pathname === '/products' : activeCategory === cat.slug;
            const targetUrl = isAll ? '/products' : `/products?category=${cat.slug}`;

            return (
              <Link
                key={cat.id}
                to={targetUrl}
                className={`flex flex-col items-center min-w-[72px] sm:min-w-[88px] group transition-all shrink-0 ${
                  isActive ? 'text-green-700 font-bold' : 'text-gray-700 hover:text-green-600'
                }`}
              >
                <div
                  className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center text-xl sm:text-2xl mb-1.5 transition-transform duration-200 group-hover:scale-110 shadow-xs border ${
                    isActive
                      ? 'bg-green-100 border-green-500 ring-2 ring-green-400'
                      : 'bg-gray-50 border-gray-200 group-hover:bg-green-50 group-hover:border-green-300'
                  }`}
                >
                  <span>{cat.emoji}</span>
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-center leading-tight whitespace-nowrap">
                  {cat.name}
                </span>
                {cat.badge && (
                  <span className="hidden sm:inline-block text-[9px] bg-yellow-100 text-yellow-800 font-semibold px-1.5 py-0.2 rounded-full mt-0.5">
                    {cat.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
