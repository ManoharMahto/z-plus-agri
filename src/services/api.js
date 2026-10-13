// API Client for Z+ Agri Backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

export const api = {
  // --- PRODUCTS ---
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/products?${query}`);
      if (!res.ok) throw new Error('Failed to fetch products from backend');
      return await res.json();
    } catch (err) {
      console.warn('API error, falling back to local dataset:', err.message);
      return null;
    }
  },

  async getProductById(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!res.ok) throw new Error('Failed to fetch product');
      return await res.json();
    } catch (err) {
      console.warn('API error:', err.message);
      return null;
    }
  },

  // --- ORDERS ---
  async createOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error('Order creation failed');
      return await res.json();
    } catch (err) {
      console.warn('Backend order placement failed, falling back:', err.message);
      return null;
    }
  },

  async getOrders() {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      return await res.json();
    } catch (err) {
      console.warn('API error:', err.message);
      return null;
    }
  },

  async getOrderById(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${id}`);
      if (!res.ok) throw new Error('Failed to fetch order');
      return await res.json();
    } catch (err) {
      console.warn('API error:', err.message);
      return null;
    }
  },

  // --- PAYMENTS ---
  async createPaymentOrder(amount, receipt) {
    try {
      const res = await fetch(`${API_BASE_URL}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, receipt })
      });
      if (!res.ok) throw new Error('Payment order initialization failed');
      return await res.json();
    } catch (err) {
      console.warn('Payment API error:', err.message);
      return null;
    }
  },

  async verifyPayment(paymentData) {
    try {
      const res = await fetch(`${API_BASE_URL}/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      if (!res.ok) throw new Error('Payment verification failed');
      return await res.json();
    } catch (err) {
      console.warn('Payment verification error:', err.message);
      return null;
    }
  },

  // --- ADMIN STATS ---
  async getAdminStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stats`);
      if (!res.ok) throw new Error('Failed to fetch admin stats');
      return await res.json();
    } catch (err) {
      console.warn('Admin stats error:', err.message);
      return null;
    }
  }
};
