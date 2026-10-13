import express from 'express';
import { store } from '../services/store.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const products = await store.getProducts({});
    const orders = await store.getOrders();

    const totalRevenue = orders.reduce((sum, o) => {
      // count completed or COD placed orders
      if (o.orderStatus !== 'CANCELLED') {
        return sum + (o.pricing?.total || 0);
      }
      return sum;
    }, 0);

    const pendingOrders = orders.filter((o) => o.orderStatus === 'PLACED').length;
    const confirmedOrders = orders.filter((o) => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'DISPATCHED').length;
    const deliveredOrders = orders.filter((o) => o.orderStatus === 'DELIVERED').length;

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders: orders.length,
        pendingOrders,
        confirmedOrders,
        deliveredOrders,
        totalProducts: products.length,
        recentOrders: orders.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
