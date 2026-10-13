import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  CheckCircle, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  Lock,
  QrCode,
  Banknote,
  Landmark
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, getTotalDiscount, getDeliveryFee, getFinalTotal, clearCart } = useCartStore();
  const { user, addOrder } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  const [step, setStep] = useState(1);

  // Address state
  const [address, setAddress] = useState({
    name: user?.name || "Rameshwar Patel",
    phone: user?.phone || "9876543210",
    pincode: user?.pincode || "452001",
    addressLine: user?.address || "Plot 42, Kisan Seva Kendra, Near Mandi Gate",
    city: user?.city || "Indore",
    state: user?.state || "Madhya Pradesh",
    landmark: "Behind Central Fertilizer Depot",
    addressType: "Farm / Warehouse"
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod, upi, card, netbanking
  const [upiId, setUpiId] = useState("kisan@upi");
  const [cardDetails, setCardDetails] = useState({
    number: "4532 •••• •••• 8821",
    expiry: "08/28",
    cvv: "321",
    nameOnCard: "Rameshwar Patel"
  });
  const [selectedBank, setSelectedBank] = useState("State Bank of India (SBI)");

  const subtotal = getSubtotal();
  const totalDiscount = getTotalDiscount();
  const deliveryFee = getDeliveryFee();
  const finalTotal = getFinalTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Items in Checkout</h2>
        <p className="text-gray-500 mb-6 text-sm">Please add seeds to your cart before proceeding to checkout.</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-green-600 text-white font-bold px-6 py-2.5 rounded-md hover:bg-green-700"
        >
          Browse Seed Catalog
        </button>
      </div>
    );
  }

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.name || !address.phone || !address.pincode || !address.addressLine) {
      addToast("Please fill in all mandatory delivery fields", "error");
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = () => {
    const paymentLabel = 
      paymentMethod === 'cod' ? 'Cash on Delivery (Pay at village drop)' :
      paymentMethod === 'upi' ? `UPI Payment (${upiId})` :
      paymentMethod === 'card' ? 'Credit / Debit Card' : `Net Banking (${selectedBank})`;

    const orderData = {
      items: items.map((i) => ({
        id: i.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        selectedQtyOption: i.selectedQtyOption,
        image: i.product.image
      })),
      totalAmount: finalTotal,
      subtotal,
      deliveryFee,
      discount: totalDiscount,
      paymentMethod: paymentLabel,
      deliveryAddress: {
        ...address,
        formatted: `${address.addressLine}, ${address.city}, ${address.state} - ${address.pincode}`
      }
    };

    const newOrder = addOrder(orderData);
    clearCart();
    addToast("Order placed successfully! Bumper yield ahead!", "success");
    navigate(`/order-confirmation/${newOrder.id}`, { state: { order: newOrder } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      <Breadcrumb
        items={[
          { label: 'My Cart', path: '/cart' },
          { label: 'Checkout & Delivery' }
        ]}
      />

      {/* Checkout Progress Stepper */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {/* Step 1 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 1 ? 'bg-green-600 text-white ring-4 ring-green-100' : 'bg-gray-200 text-gray-500'
              }`}
            >
              1
            </div>
            <span className={`text-xs sm:text-sm font-bold ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
              Delivery Address
            </span>
          </div>

          <div className={`flex-1 h-0.5 mx-3 sm:mx-6 ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`} />

          {/* Step 2 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 2 ? 'bg-green-600 text-white ring-4 ring-green-100' : 'bg-gray-200 text-gray-500'
              }`}
            >
              2
            </div>
            <span className={`text-xs sm:text-sm font-bold ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
              Order Summary
            </span>
          </div>

          <div className={`flex-1 h-0.5 mx-3 sm:mx-6 ${step >= 3 ? 'bg-green-600' : 'bg-gray-200'}`} />

          {/* Step 3 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 3 ? 'bg-green-600 text-white ring-4 ring-green-100' : 'bg-gray-200 text-gray-500'
              }`}
            >
              3
            </div>
            <span className={`text-xs sm:text-sm font-bold ${step >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>
              Payment
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Step Content */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* STEP 1: Delivery Address Form */}
          {step === 1 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 sm:p-7">
              <h2 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" /> 1. Enter Village / Delivery Address
              </h2>
              <p className="text-xs text-gray-500 mb-6">
                Seeds will be dispatched in tamper-evident sealed packaging to this address.
              </p>

              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name of Farmer / Recipient *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.name}
                      onChange={(e) => setAddress({ ...address, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-green-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      10-Digit Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, '') })}
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-green-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '') })}
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-green-600 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      City / Mandi / Tehsil *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-green-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-green-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Village Name, Post Office & Plot / Farm Number *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={address.addressLine}
                    onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-green-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nearby Landmark / Mandi Gate (Optional)
                  </label>
                  <input
                    type="text"
                    value={address.landmark}
                    onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-green-600 focus:outline-none"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-lg shadow-sm transition flex items-center gap-1.5"
                  >
                    <span>Deliver Here & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: Order Summary */}
          {step === 2 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 sm:p-7 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-green-600" /> 2. Review Your Seed Order
                  </h2>
                  <p className="text-xs text-gray-500">
                    Delivering to: <span className="font-semibold text-gray-800">{address.name}</span> ({address.pincode})
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-green-700 hover:underline font-semibold"
                >
                  Change Address
                </button>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-md border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        Pack: {item.selectedQtyOption} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm text-gray-900">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-600 hover:text-gray-900 font-semibold"
                >
                  ← Back to Address
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method Selection */}
          {step === 3 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 sm:p-7 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-green-600" /> 3. Select Payment Option
                  </h2>
                  <p className="text-xs text-gray-500">
                    All payment modes are 100% encrypted & protected by RBI guidelines.
                  </p>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-green-700 hover:underline font-semibold"
                >
                  Review Order
                </button>
              </div>

              <div className="space-y-3">
                {/* 1. Cash on Delivery (COD) */}
                <label className={`block border rounded-xl p-4 cursor-pointer transition ${
                  paymentMethod === 'cod' ? 'border-green-600 bg-green-50/40 ring-1 ring-green-600' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-green-700" />
                        <span className="font-bold text-gray-900 text-sm">Cash on Delivery (COD)</span>
                        <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.2 rounded-full">
                          Most Popular for Farmers
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Pay cash directly to delivery personnel upon opening and inspecting seed packets at your doorstep. No advance required.
                      </p>
                    </div>
                  </div>
                </label>

                {/* 2. UPI */}
                <label className={`block border rounded-xl p-4 cursor-pointer transition ${
                  paymentMethod === 'upi' ? 'border-green-600 bg-green-50/40 ring-1 ring-green-600' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-green-700" />
                        <span className="font-bold text-gray-900 text-sm">UPI (Google Pay / PhonePe / Paytm / BHIM)</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Instant payment confirmation via any UPI App.
                      </p>
                      {paymentMethod === 'upi' && (
                        <div className="mt-3 max-w-xs flex gap-2">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="Enter your UPI ID (e.g. mobile@upi)"
                            className="border border-gray-300 rounded px-3 py-1.5 text-xs flex-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </label>

                {/* 3. Debit / Credit Card */}
                <label className={`block border rounded-xl p-4 cursor-pointer transition ${
                  paymentMethod === 'card' ? 'border-green-600 bg-green-50/40 ring-1 ring-green-600' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-green-700" />
                        <span className="font-bold text-gray-900 text-sm">Credit / Debit Card (Visa, RuPay, MasterCard)</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Supports RuPay Kisan Cards and all major banks.
                      </p>
                    </div>
                  </div>
                </label>

                {/* 4. Net Banking */}
                <label className={`block border rounded-xl p-4 cursor-pointer transition ${
                  paymentMethod === 'netbanking' ? 'border-green-600 bg-green-50/40 ring-1 ring-green-600' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="netbanking"
                      checked={paymentMethod === 'netbanking'}
                      onChange={() => setPaymentMethod('netbanking')}
                      className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-green-700" />
                        <span className="font-bold text-gray-900 text-sm">Net Banking</span>
                      </div>
                      {paymentMethod === 'netbanking' && (
                        <div className="mt-2 max-w-xs">
                          <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="border border-gray-300 rounded px-2.5 py-1 text-xs w-full"
                          >
                            <option>State Bank of India (SBI)</option>
                            <option>Punjab National Bank (PNB)</option>
                            <option>Bank of Baroda</option>
                            <option>HDFC Bank</option>
                            <option>ICICI Bank</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </label>
              </div>

              {/* Confirm / Place Order Button */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-gray-600 hover:text-gray-900 font-semibold"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="bg-green-600 hover:bg-green-700 text-white font-extrabold px-8 py-3 rounded-lg shadow-md transition flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>CONFIRM & PLACE SEED ORDER (₹{finalTotal})</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Right Side: Order Summary Side Card */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
              PAYMENT BREAKUP
            </h3>

            <div className="text-sm text-gray-700 space-y-2.5">
              <div className="flex justify-between">
                <span>Total Items</span>
                <span className="font-semibold">{items.length} Varieties</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span>Applied Seed Subsidy / Discount</span>
                <span>- ₹{totalDiscount}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>{deliveryFee === 0 ? <strong className="text-green-600">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between items-baseline font-bold text-gray-900 text-base">
                <span>Amount Payable</span>
                <span className="text-lg">₹{finalTotal}</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl border border-green-200 p-4 text-xs text-green-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-green-700" />
              100% Genuine Seed Promise
            </div>
            <p className="text-[11px] text-green-800 leading-relaxed">
              Every packet carries breeder lot tracking code and lab germination seal. Zero risk purchase with doorstep checking.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
