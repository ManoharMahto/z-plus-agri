import Razorpay from 'razorpay';
import crypto from 'crypto';
import { store } from '../services/store.js';

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (key_id && key_secret && !key_id.includes('placeholder')) {
    return new Razorpay({ key_id, key_secret });
  }
  return null;
};

// 1. Create Razorpay Order
export const createPaymentOrder = async (req, res) => {
  try {
    const { amount, receipt, notes } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const rzp = getRazorpayInstance();

    // If real Razorpay credentials are provided
    if (rzp) {
      const options = {
        amount: Math.round(amount * 100), // Amount in paise (e.g. ₹500 = 50000 paise)
        currency: 'INR',
        receipt: receipt || `rcpt_${Date.now()}`,
        notes: notes || { business: 'Z+ Agri Seeds' }
      };

      const order = await rzp.orders.create(options);
      return res.json({
        success: true,
        isLive: true,
        key: process.env.RAZORPAY_KEY_ID,
        order
      });
    }

    // Demo Mode simulation when real Razorpay keys are not yet added
    const demoOrder = {
      id: `order_demo_${Date.now()}`,
      entity: 'order',
      amount: Math.round(amount * 100),
      amount_paid: 0,
      amount_due: Math.round(amount * 100),
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      status: 'created',
      attempts: 0,
      created_at: Math.floor(Date.now() / 1000)
    };

    return res.json({
      success: true,
      isLive: false,
      message: 'Running in Razorpay Demo/Test Mode. Add real keys in server/.env for production.',
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      order: demoOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Verify Razorpay Payment Signature
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // In demo mode or if keys are placeholder
    if (!key_secret || key_secret.includes('placeholder')) {
      if (orderId) {
        await store.updateOrderStatus(orderId, 'CONFIRMED', {
          payment: {
            status: 'COMPLETED',
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id || `pay_demo_${Date.now()}`
          }
        });
      }

      return res.json({
        success: true,
        verified: true,
        message: 'Payment verified (Demo Mode)'
      });
    }

    // Real HMAC SHA256 Signature Verification
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      if (orderId) {
        await store.updateOrderStatus(orderId, 'CONFIRMED', {
          payment: {
            status: 'COMPLETED',
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature
          }
        });
      }

      return res.json({
        success: true,
        verified: true,
        message: 'Payment successfully verified and order confirmed!'
      });
    } else {
      return res.status(400).json({
        success: false,
        verified: false,
        message: 'Invalid payment signature. Verification failed.'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
