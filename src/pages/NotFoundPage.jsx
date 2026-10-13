import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Home, ShoppingCart } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center">
      <div className="w-24 h-24 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50 shadow-inner">
        <Sprout className="w-12 h-12" />
      </div>

      <span className="text-sm font-black text-green-700 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">
        Error 404
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4 mb-2">
        This Field Hasn't Sprouted Yet!
      </h1>

      <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
        The page you are looking for might have been moved, renamed, or is currently fallow. Let's get you back on fertile ground.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/"
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-sm"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Link
          to="/products"
          className="w-full sm:w-auto bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold px-6 py-2.5 rounded-lg shadow-xs transition flex items-center justify-center gap-2 text-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Browse All Seeds</span>
        </Link>
      </div>
    </div>
  );
}
