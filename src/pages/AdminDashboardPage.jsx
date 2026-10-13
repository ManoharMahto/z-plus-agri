import React, { useState, useEffect } from 'react';
import { ShoppingBag, TrendingUp, Users, CheckCircle, Clock, Truck, RefreshCw, Phone, MapPin, Package } from 'lucide-react';
import { api } from '../services/api';
import Breadcrumb from '../components/Breadcrumb';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    deliveredOrders: 0
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.getAdminStats();
      if (statsRes && statsRes.data) {
        setStats(statsRes.data);
      }

      const ordersRes = await api.getOrders();
      if (ordersRes && ordersRes.data) {
        setOrders(ordersRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await fetch(`http://127.0.0.1:5000/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === 'ALL') return true;
    return o.orderStatus === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Admin Order Management' }]} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            🌱 Z+ Agri Admin Order Manager
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time orders, customer farmer details, and order dispatch tracking.
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition shadow-sm active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Orders
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-green-700 flex items-center justify-center font-bold text-xl">
            ₹
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Sales</div>
            <div className="text-2xl font-black text-gray-900">₹{stats.totalRevenue?.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Orders</div>
            <div className="text-2xl font-black text-gray-900">{stats.totalOrders || orders.length}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">New / Pending</div>
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
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dispatched / Delivered</div>
            <div className="text-2xl font-black text-green-700">
              {orders.filter((o) => ['CONFIRMED', 'DISPATCHED', 'DELIVERED'].includes(o.orderStatus)).length}
            </div>
          </div>
        </div>
      </div>

      {/* Orders Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto text-xs font-bold">
        {['ALL', 'PLACED', 'CONFIRMED', 'DISPATCHED', 'DELIVERED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              filter === tab ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List Table / Cards */}
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
                  <div className="text-xs text-gray-500">Order Amount</div>
                  <div className="text-base font-black text-green-700">₹{order.pricing?.total?.toLocaleString()}</div>
                </div>
              </div>

              {/* Customer & Address Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-gray-700 flex items-center gap-1.5">
                    <span>👤 Farmer:</span>
                    <span className="text-gray-900 font-semibold">{order.customer?.name}</span>
                  </div>
                  <div className="text-gray-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <a href={`tel:${order.customer?.phone}`} className="text-green-700 font-bold hover:underline">
                      {order.customer?.phone}
                    </a>
                  </div>
                  <div className="text-gray-500 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span>
                      {order.customer?.address}, {order.customer?.city || ''} {order.customer?.state} - {order.customer?.pincode}
                    </span>
                  </div>
                </div>

                {/* Items & Payment */}
                <div className="space-y-1 bg-gray-50 p-3 rounded-xl">
                  <div className="font-bold text-gray-700">Ordered Seed Items:</div>
                  <div className="space-y-1 text-gray-600">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="truncate max-w-[220px]">
                          🌾 {item.name} ({item.packSize || 'Packet'}) × {item.quantity}
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

              {/* Status Action Buttons */}
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
  );
}
