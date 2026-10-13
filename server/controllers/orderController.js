import { store } from '../services/store.js';

export const createOrder = async (req, res) => {
  try {
    const { customer, items, pricing, payment } = req.body;

    if (!customer || !customer.name || !customer.phone || !customer.address) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, phone, and complete delivery address are required'
      });
    }

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one seed pack'
      });
    }

    // Generate unique Indian Farmer Order ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `ZAGRI-${randomSuffix}`;

    const orderData = {
      orderId,
      customer,
      items,
      pricing: {
        subtotal: pricing?.subtotal || items.reduce((s, i) => s + (i.price * i.quantity), 0),
        discount: pricing?.discount || 0,
        deliveryCharge: pricing?.deliveryCharge || 0,
        total: pricing?.total || items.reduce((s, i) => s + (i.price * i.quantity), 0)
      },
      payment: {
        method: payment?.method || 'COD',
        status: payment?.method === 'COD' ? 'PENDING' : (payment?.status || 'PENDING'),
        razorpayOrderId: payment?.razorpayOrderId || null,
        razorpayPaymentId: payment?.razorpayPaymentId || null
      },
      orderStatus: 'PLACED'
    };

    const order = await store.createOrder(orderData);

    console.log(`🌾 [New Order Placed] ${orderId} by ${customer.name} (${customer.phone}) - Total: ₹${orderData.pricing.total}`);

    res.status(201).json({
      success: true,
      message: 'Kisan order placed successfully!',
      orderId: order.orderId,
      data: order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await store.getOrders();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await store.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const paymentUpdates = paymentStatus ? { payment: { status: paymentStatus } } : {};
    const updated = await store.updateOrderStatus(req.params.id, status, paymentUpdates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
