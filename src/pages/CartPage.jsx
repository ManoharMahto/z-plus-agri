import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Trash2, 
  Tag, 
  CheckCircle2 
} from 'lucide-react';
import CartItem from '../components/CartItem';
import EmptyState from '../components/EmptyState';
import Breadcrumb from '../components/Breadcrumb';
import { useCartStore } from '../store/cartStore';

export default function CartPage() {
  const { 
    items, 
    getTotalItems, 
    getSubtotal, 
    getOriginalTotal, 
    getTotalDiscount, 
    getDeliveryFee, 
    getFinalTotal, 
    clearCart 
  } = useCartStore();

  const navigate = useNavigate();

  const totalItems = getTotalItems();
  const subtotal = getSubtotal();
  const originalTotal = getOriginalTotal();
  const totalDiscount = getTotalDiscount();
  const deliveryFee = getDeliveryFee();
  const finalTotal = getFinalTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: 'My Cart' }]} />
        <EmptyState
          icon={ShoppingBag}
          title="Your Agri Cart is Empty"
          description="You haven't added any certified seed packets yet. Browse our high-germination vegetables, cereals, and hybrid seeds to boost your harvest."
          actionText="Explore All Seeds"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'My Cart' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-extrabold text-gray-900">
                  Cart Items ({totalItems} {totalItems === 1 ? 'pack' : 'packs'})
                </h1>
                <p className="text-xs text-gray-500">
                  Shipped in protective moisture-proof agricultural grade packaging
                </p>
              </div>

              <button
                onClick={clearCart}
                className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>

            {/* Delivery threshold indicator */}
            <div className="bg-green-50 px-4 py-2.5 border-b border-green-100 flex items-center justify-between text-xs text-green-900">
              <span className="flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-green-700 shrink-0" />
                {deliveryFee === 0 ? (
                  <span className="font-bold text-green-800">
                    Congratulations! You unlocked FREE Delivery across India.
                  </span>
                ) : (
                  <span>
                    Add ₹{500 - subtotal} more of seeds to get <strong className="text-green-800">FREE Delivery</strong>!
                  </span>
                )}
              </span>
              <span className="text-[11px] font-bold uppercase text-green-800 hidden sm:inline">
                Kisan Savings
              </span>
            </div>

            {/* Cart Items List */}
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Bottom Place Order Bar */}
            <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="text-xs text-gray-500 block">Total Payable:</span>
                <span className="text-2xl font-black text-gray-900">₹{finalTotal}</span>
              </div>

                <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/919508365119?text=${encodeURIComponent(
                      `Namaste Z+ Agri! Mujhe ye cart items order karne hain:\n` +
                      items.map((i, idx) => `${idx + 1}. ${i.product.name} (${i.selectedQtyOption || 'Pack'}) × ${i.quantity} = ₹${i.product.price * i.quantity}`).join('\n') +
                      `\n\n💰 Kul Daam (Total): ₹${finalTotal}\nKripya delivery details batayein.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black px-5 py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 text-xs sm:text-sm active:scale-95"
                  >
                    <span>💬 WhatsApp Order (9508365119)</span>
                  </a>

                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-extrabold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <span>PLACE ORDER</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
            </div>
          </div>
        </div>

        {/* Right Side: Price Details (Flipkart Style) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                PRICE DETAILS
              </h2>
            </div>

            <div className="p-4 space-y-3.5 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Price ({totalItems} items)</span>
                <span>₹{originalTotal}</span>
              </div>

              <div className="flex justify-between text-green-600 font-medium">
                <span>Special Discount</span>
                <span>- ₹{totalDiscount}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-bold uppercase text-xs">FREE</span>
                  ) : (
                    <span>₹{deliveryFee}</span>
                  )}
                </span>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-baseline font-bold text-gray-900 text-base">
                <span>Total Amount</span>
                <span className="text-lg">₹{finalTotal}</span>
              </div>
            </div>

            {totalDiscount > 0 && (
              <div className="bg-green-50 p-3 text-center border-t border-green-100">
                <p className="text-xs font-bold text-green-700 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  You will save ₹{totalDiscount} on this order!
                </p>
              </div>
            )}
          </div>

          {/* Kisan Guarantee Safe Checkout */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-xs text-xs text-gray-600 space-y-2">
            <div className="flex items-center gap-2 font-bold text-gray-800">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              Safe and Secure Checkout
            </div>
            <p className="text-gray-500 leading-relaxed">
              Govt. Certified Breeder Seeds. Cash On Delivery available at checkout. 7-day seed germination replacement policy.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
