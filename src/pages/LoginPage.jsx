import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sprout, ShieldCheck, ArrowRight, Phone, Mail, Lock, User, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

export default function LoginPage() {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [loginIdentifier, setLoginIdentifier] = useState('9876543210');
  const [loginPassword, setLoginPassword] = useState('kisan123');

  // Register form state
  const [regData, setRegData] = useState({
    name: 'Balvinder Singh',
    phone: '9812345678',
    email: 'balvinder.farmer@kisan.in',
    state: 'Punjab',
    password: 'password123'
  });

  const { login, register } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/profile';

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginIdentifier) {
      addToast('Please enter your mobile number or email', 'error');
      return;
    }
    login(loginIdentifier, loginPassword);
    addToast('Welcome back, Kisan Sathi! Logged in successfully.', 'success');
    navigate(redirectPath);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regData.name || !regData.phone) {
      addToast('Please provide your name and phone number', 'error');
      return;
    }
    register(regData);
    addToast('Account created successfully! Welcome to Z+ Agri.', 'success');
    navigate(redirectPath);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
        
        {/* Left Green Banner (Flipkart Style) */}
        <div className="md:col-span-5 bg-gradient-to-br from-green-700 to-green-900 text-white p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white text-green-700 flex items-center justify-center">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">
                Z<span className="text-agriYellow-400">+</span> Agri
              </span>
            </Link>

            <h2 className="text-2xl sm:text-3xl font-black leading-tight pt-4">
              {isLoginTab ? "Welcome to India's Seed Network" : "Join 10 Lakh+ Kisan Partners"}
            </h2>

            <p className="text-xs sm:text-sm text-green-100 leading-relaxed">
              {isLoginTab
                ? "Get access to your saved seed varieties, live mandi dispatch tracking, and certified seed discounts."
                : "Sign up today and get direct factory prices, doorstep delivery in all states, and free agronomy consultation."}
            </p>
          </div>

          <div className="space-y-2 pt-6 border-t border-green-600/50 text-xs text-green-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-agriYellow-400" />
              <span>100% Breeder Certified Seed Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-agriYellow-400" />
              <span>Free Delivery on Orders Over ₹500</span>
            </div>
          </div>
        </div>

        {/* Right Form Container */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Tabs Selector */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                type="button"
                onClick={() => setIsLoginTab(true)}
                className={`flex-1 py-3 text-center text-sm font-bold border-b-2 transition ${
                  isLoginTab
                    ? 'border-green-600 text-green-700'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLoginTab(false)}
                className={`flex-1 py-3 text-center text-sm font-bold border-b-2 transition ${
                  !isLoginTab
                    ? 'border-green-600 text-green-700'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                Register New Kisan
              </button>
            </div>

            {/* LOGIN FORM */}
            {isLoginTab ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mobile Number / Kisan Email ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. 9876543210 or ramesh@kisan.in"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-gray-700">
                      Password / OTP PIN
                    </label>
                    <a href="#forgot" className="text-xs text-green-700 hover:underline">
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-md shadow-xs transition flex items-center justify-center gap-2 mt-2"
                >
                  <span>Login Securely</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* 1-Click Quick Demo Login */}
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginIdentifier('9876543210');
                      setLoginPassword('kisan123');
                      login('9876543210', 'kisan123');
                      addToast('Logged in with Demo Farmer Account!', 'success');
                      navigate(redirectPath);
                    }}
                    className="text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 py-1.5 px-3 rounded-full border border-green-200 transition"
                  >
                    ✦ Click for Instant 1-Click Demo Login
                  </button>
                </div>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Farmer Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={regData.name}
                      onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={regData.phone}
                      onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                      placeholder="9876543210"
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={regData.state}
                      onChange={(e) => setRegData({ ...regData, state: e.target.value })}
                      placeholder="e.g. Maharashtra"
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    placeholder="farmer@kisan.in"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Create Password
                  </label>
                  <input
                    type="password"
                    required
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-md shadow-xs transition flex items-center justify-center gap-2 mt-2"
                >
                  <span>Create Kisan Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          <p className="text-[11px] text-gray-400 text-center mt-6">
            By proceeding, you agree to Z+ Agri's Terms of Use & Agronomy Seed Policy.
          </p>
        </div>

      </div>
    </div>
  );
}
