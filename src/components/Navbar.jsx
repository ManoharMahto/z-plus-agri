import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X, 
  Sprout, 
  PhoneCall, 
  Package, 
  LogOut, 
  LogIn, 
  ChevronDown,
  ShieldCheck,
  Search
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const wishlistItems = useWishlistStore((state) => state.items);
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-green-600 text-white shadow-md">
      {/* Top micro bar for Indian Farmers */}
      <div className="bg-green-700 text-xs py-1 px-4 border-b border-green-500/40 text-green-100 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-300" /> 100% Certified High-Yield Seeds
            </span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">Free Delivery on Orders Over ₹500 across India</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-semibold text-yellow-300">
              <PhoneCall className="w-3.5 h-3.5" /> Kisan Helpline: 1800-889-AGRI (Toll Free)
            </span>
            <span>Hindi / English</span>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md hover:bg-green-700 text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-inner text-green-700 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center leading-none">
                  Z<span className="text-agriYellow-400 font-black text-2xl sm:text-3xl">+</span>&nbsp;Agri
                </span>
                <span className="text-[10px] text-green-100 font-medium tracking-wider uppercase italic">
                  Explore <span className="text-agriYellow-400 font-bold">Plus ✦</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar - Center */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-4">
            <SearchBar />
          </div>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* User Account / Login */}
            <div className="relative">
              {isAuthenticated && user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded hover:bg-green-700 transition font-medium text-sm text-white"
                  >
                    <div className="w-7 h-7 rounded-full bg-agriYellow-400 text-green-900 font-bold flex items-center justify-center text-xs">
                      {user.name?.charAt(0).toUpperCase() || 'K'}
                    </div>
                    <span className="hidden md:inline max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                  </button>

                  {userDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-xl py-1.5 text-gray-800 z-50 border border-gray-100"
                      onMouseLeave={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-gray-100 bg-green-50/50">
                        <p className="text-xs text-gray-500">Namaste,</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        <User className="w-4 h-4 text-green-600" /> My Profile
                      </Link>
                      <Link
                        to="/profile#orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        <Package className="w-4 h-4 text-green-600" /> My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        <Heart className="w-4 h-4 text-rose-500" /> Wishlist ({wishlistItems.length})
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-white hover:bg-green-50 text-green-700 font-bold px-4 py-1.5 rounded text-sm transition-all shadow-sm flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-1.5 rounded hover:bg-green-700 transition hidden sm:flex items-center text-white"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 text-yellow-300" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Link with Badge */}
            <Link
              to="/cart"
              className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-green-700 transition font-bold text-sm bg-green-700/60 sm:bg-transparent"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-white" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-agriYellow-400 text-green-950 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-green-600">
                    {totalCartItems}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">Cart</span>
            </Link>

            {/* Admin Dashboard Pill */}
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center gap-1 bg-yellow-400 hover:bg-yellow-300 text-green-950 font-bold text-xs px-2.5 py-1.5 rounded-md transition shadow-xs"
              title="Store Owner Dashboard"
            >
              <span>⚙️ Admin</span>
            </Link>
          </div>

        </div>

        {/* Mobile Search Bar below navbar */}
        <div className="lg:hidden pb-3 pt-1">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-green-800 border-t border-green-700 px-4 py-4 space-y-3 animate-fadeIn">
          <div className="text-sm font-semibold text-green-200 uppercase tracking-wider pb-1 border-b border-green-700">
            Quick Navigation
          </div>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-white font-medium hover:text-agriYellow-400"
          >
            🌱 All Seed Products
          </Link>
          <Link
            to="/products?category=vegetable-seeds"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-green-100 hover:text-white"
          >
            🥦 Vegetable Seeds
          </Link>
          <Link
            to="/products?category=cereal-seeds"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-green-100 hover:text-white"
          >
            🌾 Cereal Seeds (Paddy, Wheat, Maize)
          </Link>
          <Link
            to="/products?category=oil-seeds"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-green-100 hover:text-white"
          >
            🌻 Oil Seeds (Mustard, Groundnut)
          </Link>
          <Link
            to="/products?category=spice-seeds"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-green-100 hover:text-white"
          >
            🌶️ Spice Seeds (Jeera, Dhaniya)
          </Link>
          <Link
            to="/products?category=hybrid-seeds"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-green-100 hover:text-white"
          >
            🧬 Hybrid & BT Seeds
          </Link>

          <div className="pt-2 border-t border-green-700 flex flex-col gap-2">
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-1 text-yellow-300 font-medium"
            >
              <Heart className="w-4 h-4" /> Wishlist ({wishlistItems.length})
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-1 text-white font-medium"
                >
                  <User className="w-4 h-4" /> My Profile & Orders
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 py-1 text-red-300 font-medium text-left"
                >
                  <LogOut className="w-4 h-4" /> Logout ({user?.name})
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 bg-agriYellow-400 text-green-950 font-bold px-3 rounded justify-center"
              >
                <LogIn className="w-4 h-4" /> Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
