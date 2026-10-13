import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  LogOut, 
  CheckCircle, 
  Clock, 
  Download, 
  RefreshCw, 
  ShieldCheck,
  Edit2
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import EmptyState from '../components/EmptyState';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import { PRODUCTS } from '../data/products';

export default function ProfilePage() {
  const { user, orders, logout, updateProfile } = useAuthStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile'
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || ''
  });

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    navigate('/');
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    addToast('Profile updated successfully!', 'success');
  };

  const handleReorder = (item) => {
    const prod = PRODUCTS.find((p) => p.name === item.name) || PRODUCTS[0];
    addToCart(prod, item.quantity || 1, item.selectedQtyOption);
    addToast(`Added "${item.name}" back to cart!`, 'success');
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      <Breadcrumb items={[{ label: 'My Kisan Account' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Profile Sidebar Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-800 rounded-full flex items-center justify-center font-black text-2xl mx-auto mb-3 ring-4 ring-green-50">
              {user?.name?.charAt(0).toUpperCase() || 'K'}
            </div>

            <h2 className="text-lg font-extrabold text-gray-900">{user?.name || 'Kisan Mitr'}</h2>
            <p className="text-xs text-green-700 font-semibold bg-green-50 inline-block px-2.5 py-0.5 rounded-full mt-1">
              ✦ Verified Seed Buyer
            </p>

            <div className="mt-4 pt-4 border-t border-gray-100 text-left text-xs text-gray-600 space-y-2.5">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-green-600 shrink-0" />
                <span>+91 {user?.phone || '9876543210'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-green-600 shrink-0" />
                <span className="truncate">{user?.email || 'farmer@kisan.in'}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {user?.address ? `${user.address}, ${user.city}, ${user.state} - ${user.pincode}` : 'Kisan Seva Kendra, India'}
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs flex items-center gap-2 transition ${
                  activeTab === 'orders'
                    ? 'bg-green-600 text-white shadow-xs'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>My Seed Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs flex items-center gap-2 transition ${
                  activeTab === 'profile'
                    ? 'bg-green-600 text-white shadow-xs'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Account & Delivery Address</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full py-2 px-4 rounded-lg font-semibold text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition mt-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Tab Contents */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* TAB 1: ORDERS LIST */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">Order History & Dispatches</h3>
                  <p className="text-xs text-gray-500">Track and manage your agricultural seed deliveries</p>
                </div>
                <Link
                  to="/products"
                  className="bg-green-50 text-green-800 text-xs font-bold px-3 py-1.5 rounded hover:bg-green-100 transition"
                >
                  Order More Seeds
                </Link>
              </div>

              {orders.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="No Orders Found"
                  description="You have not placed any seed orders yet. Sowing season is here, explore top varieties now!"
                  actionText="Shop Seeds"
                  actionLink="/products"
                />
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden"
                    >
                      {/* Order Header */}
                      <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-bold">Order ID</span>
                            <span className="font-bold text-gray-900 font-mono">{order.id}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-bold">Placed On</span>
                            <span className="font-semibold text-gray-700">{order.date}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Amount</span>
                            <span className="font-extrabold text-gray-900">₹{order.totalAmount}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] flex items-center gap-1 ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            <CheckCircle className="w-3 h-3" /> {order.status || 'Confirmed'}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="p-4 divide-y divide-gray-100">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 rounded object-cover border border-gray-100 shrink-0"
                                />
                              )}
                              <div>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                                  {item.name}
                                </h4>
                                <p className="text-[11px] text-gray-500">
                                  Pack: {item.selectedQtyOption || 'Standard'} • Quantity: {item.quantity}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 sm:justify-end">
                              <span className="font-bold text-sm text-gray-900">
                                ₹{item.price * item.quantity}
                              </span>
                              <button
                                onClick={() => handleReorder(item)}
                                className="text-xs font-semibold text-green-700 hover:text-green-800 bg-green-50 px-2.5 py-1 rounded border border-green-200 flex items-center gap-1"
                              >
                                <RefreshCw className="w-3 h-3" /> Re-Order
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer */}
                      <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                        <span>Payment: <strong>{order.paymentMethod}</strong></span>
                        <button
                          onClick={() => addToast(`Downloaded invoice for ${order.id}!`, 'info')}
                          className="text-green-700 hover:underline font-semibold flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" /> Download Tax Invoice (PDF)
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE & ADDRESS SETTINGS */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">Farmer Profile & Farm Address</h3>
                  <p className="text-xs text-gray-500">This address will be auto-filled for seed order deliveries</p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded border border-green-200 flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Details
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Email ID</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Farm / Village Address</label>
                    <textarea
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">City / Mandi</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">PIN Code</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full border border-gray-300 rounded p-2 text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded text-gray-700 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-gray-50 p-3 rounded border border-gray-100">
                    <span className="text-gray-400 block mb-0.5">Farmer Name</span>
                    <span className="font-bold text-gray-800 text-sm">{user?.name}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-100">
                    <span className="text-gray-400 block mb-0.5">Mobile Contact</span>
                    <span className="font-bold text-gray-800 text-sm">+91 {user?.phone}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-100">
                    <span className="text-gray-400 block mb-0.5">Registered Email</span>
                    <span className="font-bold text-gray-800 text-sm">{user?.email}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border border-gray-100">
                    <span className="text-gray-400 block mb-0.5">Default Delivery PIN Code</span>
                    <span className="font-bold text-gray-800 text-sm">{user?.pincode}</span>
                  </div>
                  <div className="sm:col-span-2 bg-gray-50 p-3 rounded border border-gray-100">
                    <span className="text-gray-400 block mb-0.5">Full Sowing Village & Mandi Address</span>
                    <span className="font-semibold text-gray-800 text-sm">
                      {user?.address}, {user?.city}, {user?.state} - {user?.pincode}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
