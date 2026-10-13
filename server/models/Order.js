import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      address: { type: String, required: true },
      village: { type: String },
      district: { type: String },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    },
    items: [
      {
        id: Number,
        name: String,
        brand: String,
        image: String,
        quantity: Number,
        packSize: String,
        price: Number
      }
    ],
    pricing: {
      subtotal: Number,
      discount: Number,
      deliveryCharge: Number,
      total: { type: Number, required: true }
    },
    payment: {
      method: {
        type: String,
        enum: ['COD', 'UPI', 'CARD', 'NETBANKING', 'ONLINE'],
        default: 'COD'
      },
      status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'PENDING'
      },
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String
    },
    orderStatus: {
      type: String,
      enum: ['PLACED', 'CONFIRMED', 'DISPATCHED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'],
      default: 'PLACED'
    }
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
