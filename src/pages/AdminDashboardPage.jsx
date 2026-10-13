import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock, 
  Truck, 
  RefreshCw, 
  Phone, 
  MapPin, 
  Package, 
  ShieldCheck, 
  Plus, 
  Edit, 
  Trash2, 
  Lock, 
  X, 
  Check, 
  AlertTriangle,
  LogOut,
  SlidersHorizontal,
  Search
} from 'lucide-react';
import { api } from '../services/api';
import Breadcrumb from '../components/Breadcrumb';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { CATEGORIES } from '../data/categories';

// Authorized Admin Phone Numbers
const AUTHORIZED_ADMIN_PHONES = ['9508365119', '9508901585'];

export default function AdminDashboardPage() {
  // Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    const saved = sessionStorage.getItem('zplus_admin_authenticated');
    return saved === 'true';
  });

  const [adminPhone, setAdminPhone] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [authError, setAuthError] = useState('');

  // Dashboard Tabs: 'orders' | 'products'
  const [activeTab, setActiveTab] = useState('orders');

  // Orders State
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    deliveredOrders: 0
  });
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderFilter, setOrderFilter] = useState('ALL');

  // Product Store State
  const { products, addProduct, updateProduct, deleteProduct, resetToDefault } = useProductStore();
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  
  // Modal State for Add / Edit Product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Vegetable Seeds',
    brand: 'Namdhari Seeds',
    price: '',
    originalPrice: '',
    discount: '',
    quantityOptions: '100g, 500g, 1kg',
    description: '',
    image: '',
    inStock: true
  });

  const addToast = useToastStore((state) => state.addToast);
  const { setUser } = useAuthStore();

  // --- OTP Verification Logic ---
  const handleSendOtp = (e) => {
    e.preventDefault();
    const cleanPhone = adminPhone.trim().replace(/\D/g, '');

    if (!cleanPhone || cleanPhone.length !== 10) {
      setAuthError('Kripya 10-digit ka valid mobile number dalein.');
      return;
    }

    if (!AUTHORIZED_ADMIN_PHONES.includes(cleanPhone)) {
      setAuthError(`❌ Ye number (${cleanPhone}) Admin authorization list me nahi hai! Sirf 9508365119 aur 9508901585 se login ho sakta hai.`);
      return;
    }

    setAuthError('');
    // Generate secure 4-digit OTP
    const mockOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(mockOtp);
    setOtpSent(true);
    addToast(`OTP generated for Admin +91 ${cleanPhone}`, 'info');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (enteredOtp.trim() === generatedOtp) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('zplus_admin_authenticated', 'true');
      sessionStorage.setItem('zplus_admin_phone', adminPhone);

      // Also set in authStore so navbar reflects admin status
      setUser({
        name: `Admin (${adminPhone})`,
        phone: adminPhone,
        isAdmin: true,
        email: 'admin@genzera.in'
      });

      addToast('Admin successfully verified! Welcome to Z+ Agri Portal.', 'success');
    } else {
      setAuthError('Galat OTP! Kripya sahi 4-digit OTP enter karein.');
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('zplus_admin_authenticated');
    sessionStorage.removeItem('zplus_admin_phone');
    setIsAdminAuthenticated(false);
    setOtpSent(false);
    setEnteredOtp('');
    setAdminPhone('');
    addToast('Admin logged out successfully', 'info');
  };

  // --- Orders Logic ---
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const statsRes = await api.getAdminStats();
      if (statsRes?.data) setStats(statsRes.data);

      const ordersRes = await api.getOrders();
      if (ordersRes?.data) setOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchOrders();
    }
  }, [isAdminAuthenticated]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await fetch(`http://127.0.0.1:5000/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchOrders();
      addToast(`Order ${orderId} marked as ${newStatus}`, 'success');
    } catch (err) {
      console.error(err);
    }
  };

  // --- Products CRUD Modal Logic ---
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Vegetable Seeds',
      brand: 'Namdhari Seeds',
      price: '',
      originalPrice: '',
      discount: '',
      quantityOptions: '100g, 500g, 1kg',
      description: '',
      image: 'https://picsum.photos/seed/seeds-farm/400/300',
      inStock: true
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      discount: product.discount || 0,
      quantityOptions: product.quantityOptions ? product.quantityOptions.join(', ') : '100g, 500g, 1kg',
      description: product.description || '',
      image: product.image || 'https://picsum.photos/seed/seeds-farm/400/300',
      inStock: product.inStock !== false
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      addToast('Kripya Product Name aur Price zaroor bharein', 'error');
      return;
    }

    const qtyArray = productForm.quantityOptions
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const productPayload = {
      name: productForm.name,
      category: productForm.category,
      brand: productForm.brand,
      price: Number(productForm.price),
      originalPrice: Number(productForm.originalPrice) || Number(productForm.price),
      discount: Number(productForm.discount) || 0,
      quantityOptions: qtyArray.length ? qtyArray : ['100g', '500g', '1kg'],
      description: productForm.description || 'Breeder certified high germination agricultural seed.',
      image: productForm.image || `https://picsum.photos/seed/seed-${Date.now()}/400/300`,
      inStock: productForm.inStock
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
      addToast(`Seed "${productForm.name}" updated successfully!`, 'success');
    } else {
      addProduct(productPayload);
      addToast(`New seed "${productForm.name}" added to store!`, 'success');
    }

    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`Kya aap sach me "${name}" ko store se delete karna chahte hain?`)) {
      deleteProduct(id);
      addToast(`"${name}" has been removed from catalog.`, 'info');
    }
  };

  // Filtered lists
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'ALL') return true;
    return o.orderStatus === orderFilter;
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch = productSearch.trim() === '' || 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase());
    
    const matchesCategory = productCategoryFilter === 'ALL' ||
      p.category.toLowerCase() === productCategoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // ==========================================
  // RENDER 1: OTP SECURITY LOCK SCREEN
  // ==========================================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white max-w-md w-full rounded-2xl border border-gray-200 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Z+ Agri Admin Portal
            </h2>
            <p className="text-xs text-gray-500">
              Only authorized store managers can access customer orders, phone numbers, and revenue.
            </p>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 text-xs text-red-700">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{authError}</span>
            </div>
          )}

          {!otpSent ? (
            /* Step 1: Enter Phone Number */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Authorized Admin Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-sm font-bold text-gray-400">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="e.g. 9508365119 ya 9508901585"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full border border-gray-300 rounded-xl py-2.5 pl-12 pr-3 text-sm font-semibold tracking-wider placeholder-gray-400 focus:ring-2 focus:ring-green-600 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Authorized numbers: <strong>9508365119</strong> & <strong>9508901585</strong>
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-xl shadow-md transition active:scale-95 text-sm flex items-center justify-center gap-2"
              >
                <span>Send Login OTP 📲</span>
              </button>
            </form>
          ) : (
            /* Step 2: Enter OTP */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {/* Simulated SMS Alert Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <span>💬 [SMS Alert] OTP sent to +91 {adminPhone}</span>
                </div>
                <div className="text-emerald-700">
                  Aapka Secret OTP hai: <strong className="font-mono text-base bg-emerald-200 px-2 py-0.5 rounded text-emerald-950 font-black">{generatedOtp}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Enter 4-Digit OTP
                </label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  placeholder="Enter 4-digit code"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full border border-gray-300 rounded-xl py-2.5 px-3 text-center text-lg font-mono font-black tracking-widest placeholder-gray-400 focus:ring-2 focus:ring-green-600 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs transition"
                >
                  Change Number
                </button>
                <button
                  type="submit"
                  className="flex-2 bg-green-600 hover:bg-green-700 text-white font-black py-2.5 rounded-xl shadow-md transition text-xs flex items-center justify-center gap-1"
                >
                  <span>Verify OTP & Open</span>
                </button>
              </div>
            </form>
          )}

          <div className="border-t border-gray-100 pt-4 text-center">
            <span className="text-[11px] text-gray-400">
              🔒 End-to-end encrypted admin authentication for Z+ Agri
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER 2: FULL ADMIN DASHBOARD PORTAL
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Admin Portal' }]} />

      {/* Top Header with Active Admin Phone and Logout */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              🌱 Z+ Agri Admin Control Center
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
              Verified
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Logged in as Store Admin: <strong className="text-gray-800">+91 {sessionStorage.getItem('zplus_admin_phone') || '9508365119'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-1.5 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 px-3.5 py-2 rounded-xl text-xs font-bold transition border border-gray-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Admin</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation: Orders vs Products */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 py-3 px-5 font-bold text-sm border-b-2 transition ${
            activeTab === 'orders'
              ? 'border-green-600 text-green-700 bg-green-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>📦 Kisan Orders & Revenue</span>
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full ml-1">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 py-3 px-5 font-bold text-sm border-b-2 transition ${
            activeTab === 'products'
              ? 'border-green-600 text-green-700 bg-green-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>🌾 Seed Products Catalog Manager</span>
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full ml-1">
            {products.length}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: KISAN ORDERS & REVENUE */}
      {/* ======================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-green-700 flex items-center justify-center font-bold text-xl">
                ₹
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Revenue</div>
                <div className="text-2xl font-black text-gray-900">₹{stats.totalRevenue?.toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Orders</div>
                <div className="text-2xl font-black text-gray-900">{orders.length}</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Orders</div>
                <div className="text-2xl font-black text-amber-600">
                  {orders.filter((o) => o.orderStatus === 'PLACED').length}
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivered Orders</div>
                <div className="text-2xl font-black text-green-700">
                  {orders.filter((o) => o.orderStatus === 'DELIVERED').length}
                </div>
              </div>
            </div>
          </div>

          {/* Orders Filter Tabs */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-2 overflow-x-auto text-xs font-bold">
              {['ALL', 'PLACED', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setOrderFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                    orderFilter === tab ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={fetchOrders}
              disabled={loadingOrders}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-1.5 rounded-xl text-xs font-bold transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-800">No Orders in this category</h3>
                <p className="text-xs text-gray-500 mt-1">New farmer orders placed on the website will appear here.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.orderId || order._id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-green-300 transition"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-900 text-sm">{order.orderId}</span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            order.orderStatus === 'DELIVERED'
                              ? 'bg-green-100 text-green-800'
                              : order.orderStatus === 'CONFIRMED' || order.orderStatus === 'DISPATCHED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                        <span className="text-xs text-gray-400">
                          • {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Total Order Amount</div>
                      <div className="text-base font-black text-green-700">₹{order.pricing?.total?.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Customer details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 text-xs">
                    <div className="space-y-1.5">
                      <div className="font-bold text-gray-700 flex items-center gap-1.5">
                        <span>👤 Farmer:</span>
                        <span className="text-gray-900 font-semibold">{order.customer?.name}</span>
                      </div>
                      <div className="text-gray-600 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-green-600" />
                        <a href={`tel:${order.customer?.phone}`} className="text-green-700 font-bold hover:underline">
                          +91 {order.customer?.phone} (Click to Call)
                        </a>
                      </div>
                      <div className="text-gray-500 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                        <span>
                          {order.customer?.address}, {order.customer?.city || ''} {order.customer?.state} - {order.customer?.pincode}
                        </span>
                      </div>
                    </div>

                    {/* Ordered Items */}
                    <div className="space-y-1.5 bg-gray-50 p-3 rounded-xl">
                      <div className="font-bold text-gray-700">Ordered Seeds:</div>
                      <div className="space-y-1 text-gray-600">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="truncate max-w-[220px]">
                              🌾 {item.name} ({item.packSize || 'Pack'}) × {item.quantity}
                            </span>
                            <span className="font-bold text-gray-800">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-1.5 border-t border-gray-200 flex justify-between text-gray-500 text-[11px]">
                        <span>Payment Method: <strong className="text-gray-700">{order.payment?.method}</strong></span>
                        <span>Status: <strong className={order.payment?.status === 'COMPLETED' ? 'text-green-600' : 'text-amber-600'}>{order.payment?.status}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-gray-100 text-xs">
                    {order.orderStatus === 'PLACED' && (
                      <button
                        onClick={() => handleStatusUpdate(order.orderId, 'CONFIRMED')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg transition"
                      >
                        Confirm Order
                      </button>
                    )}
                    {['PLACED', 'CONFIRMED'].includes(order.orderStatus) && (
                      <button
                        onClick={() => handleStatusUpdate(order.orderId, 'DISPATCHED')}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded-lg transition"
                      >
                        Mark Dispatched 🚚
                      </button>
                    )}
                    {order.orderStatus === 'DISPATCHED' && (
                      <button
                        onClick={() => handleStatusUpdate(order.orderId, 'DELIVERED')}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded-lg transition"
                      >
                        Mark Delivered ✓
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SEED PRODUCTS CATALOG (ADD / EDIT / DELETE) */}
      {/* ======================================================== */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Top Actions: Search, Category Filter, and Add Product Button */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search seeds by name or brand..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-1 focus:ring-green-600 focus:outline-none"
                />
              </div>

              {/* Category Filter */}
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-xl px-3 py-2 text-xs bg-white text-gray-700 font-semibold focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={openAddProductModal}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Seed Product</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Reset all products back to initial 30 verified seeds?')) {
                    resetToDefault();
                    addToast('Products reset to defaults.', 'info');
                  }
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-xl text-xs font-semibold"
                title="Reset to 30 default seeds"
              >
                Reset Default
              </button>
            </div>
          </div>

          {/* Products Table / Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between hover:border-green-300 transition"
              >
                <div className="flex gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-20 h-20 object-cover rounded-xl bg-gray-50 border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-extrabold text-green-700 uppercase tracking-wider block truncate">
                      {p.brand} • {p.category}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-tight mt-0.5">
                      {p.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="text-base font-black text-green-700">₹{p.price}</span>
                      {p.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">₹{p.originalPrice}</span>
                      )}
                      {p.discount > 0 && (
                        <span className="text-[10px] font-black text-red-600 bg-red-50 px-1.5 py-0.2 rounded">
                          {p.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    p.inStock !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {p.inStock !== false ? 'In Stock ✓' : 'Out of Stock ✗'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditProductModal(p)}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition"
                      title="Edit Seed Details"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 transition"
                      title="Delete Seed Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT SEED PRODUCT FORM */}
      {/* ======================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-lg text-gray-900">
                {editingProduct ? '✏️ Edit Seed Product Details' : '🌱 Add New Seed Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-semibold text-gray-700">
              <div>
                <label className="block mb-1">Seed Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahyco Hybrid Maize Seeds (Makka)"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs bg-white focus:outline-none"
                  >
                    <option value="Vegetable Seeds">Vegetable Seeds</option>
                    <option value="Cereal Seeds">Cereal Seeds</option>
                    <option value="Oil Seeds">Oil Seeds</option>
                    <option value="Spice Seeds">Spice Seeds</option>
                    <option value="Hybrid Seeds">Hybrid Seeds</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Namdhari, Syngenta"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 299"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:outline-none font-bold text-green-700"
                  />
                </div>

                <div>
                  <label className="block mb-1">Original MRP (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 450"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">Discount %</label>
                  <input
                    type="number"
                    placeholder="e.g. 30"
                    value={productForm.discount}
                    onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Pack Size Options (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. 100g, 500g, 1kg, 5kg"
                  value={productForm.quantityOptions}
                  onChange={(e) => setProductForm({ ...productForm, quantityOptions: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block mb-1">Description / Farmer Agronomy Info</label>
                <textarea
                  rows={2}
                  placeholder="Seed germination rate, season, high yield attributes..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="stockToggle"
                  checked={productForm.inStock}
                  onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                  className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                />
                <label htmlFor="stockToggle" className="cursor-pointer font-bold text-gray-800">
                  Currently In Stock & Available for Order
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md transition"
                >
                  Save Seed Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
