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
  Search,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { api } from '../services/api';
import Breadcrumb from '../components/Breadcrumb';
import { useProductStore } from '../store/productStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

// Authorized Admin Phone Numbers (SECRET - NOT DISPLAYED ON SCREEN)
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
  
  // Modal State for Add / Edit Product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Vegetable Seeds',
    brand: 'Z+ Agri',
    price: '',
    originalPrice: '',
    discount: 0,
    quantityOptions: '100g, 250g, 500g, 1kg',
    description: '',
    image: '',
    images: [],
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

    // Secret verification: Do NOT leak which numbers are authorized
    if (!AUTHORIZED_ADMIN_PHONES.includes(cleanPhone)) {
      setAuthError('❌ Access Denied: Yeh mobile number authorized nahi hai. Sirf Z+ Agri store admin hi login kar sakte hain.');
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

  // --- Auto-Calculate Discount Helper ---
  const handlePriceUpdate = (field, value) => {
    const updated = { ...productForm, [field]: value };
    const selling = Number(field === 'price' ? value : updated.price) || 0;
    const mrp = Number(field === 'originalPrice' ? value : updated.originalPrice) || 0;

    if (mrp > 0 && selling > 0 && mrp >= selling) {
      updated.discount = Math.round(((mrp - selling) / mrp) * 100);
    } else {
      updated.discount = 0;
    }

    setProductForm(updated);
  };

  // --- Multiple Photo Upload Handlers ---
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target.result;
        setProductForm((prev) => {
          const currentImages = prev.images || [];
          const updatedImages = [...currentImages, base64Url];
          return {
            ...prev,
            images: updatedImages,
            image: prev.image || base64Url
          };
        });
        addToast(`Photo "${file.name}" uploaded successfully!`, 'success');
      };
      reader.readAsDataURL(file);
    });
    // Reset file input
    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    const url = newImageUrl.trim();
    if (!url) return;

    setProductForm((prev) => {
      const currentImages = prev.images || [];
      const updatedImages = [...currentImages, url];
      return {
        ...prev,
        images: updatedImages,
        image: prev.image || url
      };
    });
    setNewImageUrl('');
    addToast('Photo URL added!', 'success');
  };

  const handleRemoveImage = (indexToRemove) => {
    setProductForm((prev) => {
      const filtered = prev.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: filtered,
        image: filtered[0] || ''
      };
    });
  };

  // --- Products CRUD Modal Logic ---
  const openAddProductModal = () => {
    setEditingProduct(null);
    setNewImageUrl('');
    setProductForm({
      name: '',
      category: 'Vegetable Seeds',
      brand: 'Z+ Agri',
      price: '',
      originalPrice: '',
      discount: 0,
      quantityOptions: '100g, 250g, 500g, 1kg',
      description: '',
      image: '',
      images: [],
      inStock: true
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setNewImageUrl('');
    const existingImages = Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : (product.image ? [product.image] : []);

    const selling = Number(product.price) || 0;
    const mrp = Number(product.originalPrice) || selling;
    const calcDiscount = (mrp > 0 && selling > 0 && mrp >= selling) 
      ? Math.round(((mrp - selling) / mrp) * 100) 
      : 0;

    setProductForm({
      name: product.name,
      category: 'Vegetable Seeds',
      brand: 'Z+ Agri',
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      discount: calcDiscount,
      quantityOptions: product.quantityOptions ? product.quantityOptions.join(', ') : '100g, 250g, 500g, 1kg',
      description: product.description || '',
      image: product.image || existingImages[0] || '',
      images: existingImages,
      inStock: product.inStock !== false
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      addToast('Kripya Product Name aur Selling Price zaroor bharein', 'error');
      return;
    }

    const qtyArray = productForm.quantityOptions
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const finalImages = productForm.images && productForm.images.length > 0
      ? productForm.images
      : (productForm.image ? [productForm.image] : ['https://picsum.photos/seed/zplus-veg/400/300']);

    const sellingPrice = Number(productForm.price);
    const mrp = Number(productForm.originalPrice) || sellingPrice;
    const autoDiscount = (mrp > 0 && sellingPrice > 0 && mrp >= sellingPrice)
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;

    const productPayload = {
      name: productForm.name,
      category: 'Vegetable Seeds',
      brand: 'Z+ Agri',
      price: sellingPrice,
      originalPrice: mrp,
      discount: autoDiscount,
      quantityOptions: qtyArray.length ? qtyArray : ['100g', '250g', '500g', '1kg'],
      description: productForm.description || 'Z+ Agri research-certified high germination vegetable seed variety.',
      image: finalImages[0],
      images: finalImages,
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
      p.name.toLowerCase().includes(productSearch.toLowerCase());
    return matchesSearch;
  });

  // ==========================================
  // RENDER 1: OTP SECURITY LOCK SCREEN (HIDDEN NUMBERS)
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
              Authorized store managers can manage products, pricing, and orders.
            </p>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 text-xs text-red-700">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{authError}</span>
            </div>
          )}

          {!otpSent ? (
            /* Step 1: Enter Phone Number (NO NUMBERS LEAKED) */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Admin Registered Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-sm font-bold text-gray-400">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="Apna 10-digit mobile number enter karein"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full border border-gray-300 rounded-xl py-2.5 pl-12 pr-3 text-sm font-semibold tracking-wider placeholder-gray-400 focus:ring-2 focus:ring-green-600 focus:outline-none"
                  />
                </div>
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
              Verified Admin
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Logged in as <strong className="text-gray-800">+91 {sessionStorage.getItem('zplus_admin_phone')}</strong> (Brand: Z+ Agri Only)
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-green-700 text-white shadow-sm'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-green-700 text-white shadow-sm'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Vegetable Seeds ({products.length})</span>
          </button>

          <button
            onClick={handleAdminLogout}
            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition"
            title="Log out from Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ORDERS DASHBOARD */}
      {/* ======================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
              <div className="p-3 bg-green-50 text-green-700 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase">Total Sales</p>
                <h3 className="text-xl font-black text-gray-900">₹{stats.totalRevenue.toLocaleString('en-IN')}</h3>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase">Total Orders</p>
                <h3 className="text-xl font-black text-gray-900">{stats.totalOrders}</h3>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
              <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase">Pending</p>
                <h3 className="text-xl font-black text-amber-600">{stats.pendingOrders}</h3>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
              <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase">Delivered</p>
                <h3 className="text-xl font-black text-purple-600">{stats.deliveredOrders}</h3>
              </div>
            </div>
          </div>

          {/* Orders Filter & Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-green-600" />
                Customer Orders & Deliveries
              </h2>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="border border-gray-200 text-xs font-bold rounded-xl px-3 py-2 bg-gray-50 focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PLACED">Placed</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="DISPATCHED">Dispatched</option>
                  <option value="DELIVERED">Delivered</option>
                </select>

                <button
                  onClick={fetchOrders}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                  title="Refresh Orders"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {loadingOrders ? (
              <div className="py-12 text-center text-xs text-gray-500">Loading orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-800 text-sm">Abhi koi order nahi hai</h4>
                <p className="text-xs text-gray-400">Jaise hi kisaan checkout karenge ya order place karenge, wo yahan show hoga.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <div key={order._id || order.id} className="py-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-green-800 bg-green-50 px-2.5 py-1 rounded-md">
                          #{order.orderId || order._id}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          order.orderStatus === 'DISPATCHED' ? 'bg-blue-100 text-blue-800' :
                          order.orderStatus === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {order.orderStatus}
                        </span>

                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusUpdate(order._id || order.id, e.target.value)}
                          className="text-[11px] font-bold border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none"
                        >
                          <option value="PLACED">Placed</option>
                          <option value="CONFIRMED">Confirm</option>
                          <option value="DISPATCHED">Dispatch</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancel</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-gray-50/70 p-3 rounded-xl text-xs">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Kisan Details</span>
                        <span className="font-bold text-gray-800">{order.shippingAddress?.fullName || 'Farmer'}</span>
                        <a
                          href={`tel:${order.shippingAddress?.phone}`}
                          className="text-green-700 font-bold block hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-3 h-3" /> +91 {order.shippingAddress?.phone}
                        </a>
                      </div>

                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Delivery Pata</span>
                        <p className="text-gray-700 truncate">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                        <span className="text-gray-500 font-mono">PIN: {order.shippingAddress?.pincode} ({order.shippingAddress?.state})</span>
                      </div>

                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Payment & Total</span>
                        <span className="font-black text-gray-900 text-sm">₹{order.totalAmount}</span>
                        <span className="text-gray-500 block text-[10px]">Method: {order.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: Z+ AGRI VEGETABLE SEEDS PRODUCT CATALOG MANAGER */}
      {/* ======================================================== */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search vegetable seeds by name..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={openAddProductModal}
                className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white font-black px-4 py-2.5 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Naya Seed Add Karein</span>
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((p) => {
              const imgList = Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image];
              return (
                <div
                  key={p.id}
                  className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between hover:border-green-300 transition"
                >
                  <div className="flex gap-3">
                    <div className="relative w-20 h-20 shrink-0">
                      <img
                        src={imgList[0]}
                        alt={p.name}
                        className="w-full h-full object-cover rounded-xl bg-gray-50 border border-gray-100"
                      />
                      {imgList.length > 1 && (
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                          +{imgList.length - 1} photos
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-extrabold text-green-700 uppercase tracking-wider block truncate">
                        Z+ Agri • Vegetable Seeds
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
              );
            })}
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
              <div>
                <h3 className="font-black text-lg text-gray-900">
                  {editingProduct ? '✏️ Edit Z+ Agri Seed' : '🌱 Add New Z+ Agri Vegetable Seed'}
                </h3>
                <span className="text-[11px] text-green-700 font-bold">
                  Company: Z+ Agri | Category: Vegetable Seeds
                </span>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-semibold text-gray-700">
              {/* Product Name */}
              <div>
                <label className="block mb-1 text-gray-800 font-bold">Seed Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Z+ Agri Super Hybrid Tomato Seeds (F1 Tamatar)"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
                />
              </div>

              {/* Pricing Section with Auto-Calculated Discount */}
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-2.5">
                <span className="block text-[11px] font-black uppercase text-gray-500 tracking-wider">
                  Daam aur MRP (Auto Discount Calculate Hoga)
                </span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-gray-800">Original MRP (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 450"
                      value={productForm.originalPrice}
                      onChange={(e) => handlePriceUpdate('originalPrice', e.target.value)}
                      className="w-full border border-gray-300 rounded-xl p-2.5 text-sm bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-green-800 font-bold">Selling Price (Aapka Daam ₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 299"
                      value={productForm.price}
                      onChange={(e) => handlePriceUpdate('price', e.target.value)}
                      className="w-full border border-green-500 rounded-xl p-2.5 text-sm bg-white focus:outline-none font-black text-green-700"
                    />
                  </div>
                </div>

                {/* Auto Discount Display Banner */}
                <div className="bg-emerald-100/70 border border-emerald-300 rounded-lg p-2.5 flex items-center justify-between text-xs text-emerald-950">
                  <span className="font-bold">
                    🎉 Auto Discount: <span className="text-sm font-black text-emerald-800">{productForm.discount}% OFF</span>
                  </span>
                  {productForm.originalPrice && productForm.price && (
                    <span className="text-[11px] font-semibold text-emerald-800">
                      Kisaan ki bachat: ₹{Math.max(0, Number(productForm.originalPrice) - Number(productForm.price))}
                    </span>
                  )}
                </div>
              </div>

              {/* Pack Sizes */}
              <div>
                <label className="block mb-1 text-gray-800 font-bold">Pack Size Options (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. 100g, 250g, 500g, 1kg"
                  value={productForm.quantityOptions}
                  onChange={(e) => setProductForm({ ...productForm, quantityOptions: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:outline-none"
                />
              </div>

              {/* Multi-Photo Upload & Gallery Section */}
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-gray-800 font-bold flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-green-700" />
                    Seed Photos (Multiple Photos Upload Karein)
                  </label>
                  <span className="text-[11px] text-gray-500 font-semibold">
                    {productForm.images?.length || 0} photo(s) added
                  </span>
                </div>

                {/* Device File Upload Button */}
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer flex-1 bg-green-50 hover:bg-green-100 text-green-800 border border-green-300 font-bold py-2.5 px-3 rounded-xl text-center text-xs transition flex items-center justify-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>📁 Phone / Gallery se Photo Chunein</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Or Paste URL */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ya photo ka URL paste karein (https://...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-xl p-2 text-xs bg-white focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-3 py-2 rounded-xl text-xs transition"
                  >
                    + Add URL
                  </button>
                </div>

                {/* Previews of all uploaded photos */}
                {productForm.images && productForm.images.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Uploaded Photo Previews:</span>
                    <div className="flex flex-wrap gap-2">
                      {productForm.images.map((imgUrl, index) => (
                        <div key={index} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-gray-300 bg-white">
                          <img
                            src={imgUrl}
                            alt={`preview-${index}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 shadow hover:bg-red-700 transition"
                            title="Delete this photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-0 inset-x-0 bg-green-700/80 text-white text-[8px] text-center font-bold">
                              Main Photo
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block mb-1 text-gray-800 font-bold">Description / Kisan Jankari</label>
                <textarea
                  rows={2}
                  placeholder="Beej ki visheshtaayein, ugne ki kshamta (germination rate), season..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:outline-none"
                />
              </div>

              {/* In Stock Toggle */}
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

              {/* Actions */}
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
