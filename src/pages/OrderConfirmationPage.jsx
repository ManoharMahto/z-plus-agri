import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Package, 
  MapPin, 
  Calendar, 
  PhoneCall, 
  ArrowRight, 
  ShoppingBag,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const orders = useAuthStore((state) => state.orders);

  // Retrieve order either from location state or authStore orders list
  const currentOrder =
    location.state?.order ||
    orders.find((o) => o.id === orderId) ||
    orders[0] || {
      id: orderId || "ORD-58291",
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      totalAmount: 1250,
      paymentMethod: "Cash on Delivery",
      items: [],
      deliveryAddress: {
        name: "Rameshwar Patel",
        phone: "9876543210",
        formatted: "Plot 42, Kisan Seva Kendra, Near Mandi Gate, Indore, Madhya Pradesh - 452001"
      }
    };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Success Hero Header */}
      <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-6 sm:p-10 text-center relative overflow-hidden">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4 ring-8 ring-green-50 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <span className="bg-green-100 text-green-800 text-xs font-black uppercase px-3 py-1 rounded-full">
          Order Confirmed
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3">
          Dhanyawad! Your Seed Order has been Placed
        </h1>

        <p className="text-sm text-gray-600 max-w-lg mx-auto mt-2 leading-relaxed">
          Your order ID is <span className="font-bold text-green-800 font-mono">{currentOrder.id}</span>. We are preparing high-germination certified seed packets with moisture-protective sealing.
        </p>

        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 bg-green-50 px-4 py-2.5 rounded-lg border border-green-200 text-xs text-green-900 font-medium">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-green-700" />
            Estimated Delivery: <strong>Within 3 to 5 Days</strong>
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="flex items-center gap-1.5">
            <Package className="w-4 h-4 text-green-700" />
            Payment Mode: <strong>{currentOrder.paymentMethod}</strong>
          </span>
        </div>
      </div>

      {/* Order Summary & Address Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 space-y-6">
        
        {/* Delivery Address & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-green-600" /> Delivery Address
            </h3>
            <p className="text-sm font-bold text-gray-900">{currentOrder.deliveryAddress?.name}</p>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
              {currentOrder.deliveryAddress?.formatted ||
               `${currentOrder.deliveryAddress?.addressLine || ''}, ${currentOrder.deliveryAddress?.city || ''}, ${currentOrder.deliveryAddress?.state || ''} - ${currentOrder.deliveryAddress?.pincode || ''}`}
            </p>
            <p className="text-xs text-gray-600 mt-1">Phone: +91 {currentOrder.deliveryAddress?.phone}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-green-600" /> Order Info
            </h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Order Date: <span className="font-semibold text-gray-800">{currentOrder.date}</span></p>
              <p>Status: <span className="font-semibold text-green-700">Confirmed (Dispatched shortly)</span></p>
              <p>Total Paid / Due: <span className="font-bold text-gray-900 text-sm">₹{currentOrder.totalAmount}</span></p>
            </div>
          </div>
        </div>

        {/* Ordered Seed Items */}
        {currentOrder.items && currentOrder.items.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Items in this Package:</h3>
            <div className="divide-y divide-gray-100">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-md border border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500">
                      Pack Size: {item.selectedQtyOption} • Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Toll-Free Help notice */}
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-green-600 shrink-0" />
            <span>Need agronomy advice or changes to your delivery? Call Toll-Free <strong>1800-889-AGRI</strong></span>
          </div>
          <span className="text-green-700 font-bold">24x7 Kisan Helpline</span>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/products"
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg shadow-sm transition text-center flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>

        <Link
          to="/profile#orders"
          className="w-full sm:w-auto bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold px-8 py-3 rounded-lg shadow-xs transition text-center flex items-center justify-center gap-2"
        >
          <span>View All Orders in Profile</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
