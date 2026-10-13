import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { PRODUCTS } from '../data/seedProducts.js';

// In-memory store fallback when MongoDB Atlas is not yet connected
class MemoryStore {
  constructor() {
    this.products = [...PRODUCTS];
    this.orders = [];
    this.users = [];
  }

  isMongoConnected() {
    return mongoose.connection.readyState === 1;
  }

  // --- PRODUCTS ---
  async getProducts({ category, search, sort, minPrice, maxPrice }) {
    if (this.isMongoConnected()) {
      const query = {};
      if (category && category !== 'All') query.category = category;
      if (search) query.name = { $regex: search, $options: 'i' };
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      return await Product.find(query);
    }

    // In-memory filter
    let results = [...this.products];
    if (category && category !== 'All') {
      results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (minPrice) results = results.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) results = results.filter((p) => p.price <= Number(maxPrice));

    if (sort === 'price-low') results.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') results.sort((a, b) => b.price - a.price);
    if (sort === 'rating') results.sort((a, b) => b.rating - a.rating);

    return results;
  }

  async getProductById(id) {
    if (this.isMongoConnected()) {
      return await Product.findOne({ id: Number(id) });
    }
    return this.products.find((p) => p.id === Number(id));
  }

  async createProduct(data) {
    if (this.isMongoConnected()) {
      return await Product.create(data);
    }
    const newProduct = {
      ...data,
      id: this.products.length ? Math.max(...this.products.map((p) => p.id)) + 1 : 1,
      createdAt: new Date().toISOString()
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  async updateProduct(id, updates) {
    if (this.isMongoConnected()) {
      return await Product.findOneAndUpdate({ id: Number(id) }, updates, { new: true });
    }
    const index = this.products.findIndex((p) => p.id === Number(id));
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  }

  async deleteProduct(id) {
    if (this.isMongoConnected()) {
      return await Product.findOneAndDelete({ id: Number(id) });
    }
    const index = this.products.findIndex((p) => p.id === Number(id));
    if (index === -1) return null;
    const removed = this.products.splice(index, 1);
    return removed[0];
  }

  // --- ORDERS ---
  async createOrder(orderData) {
    if (this.isMongoConnected()) {
      return await Order.create(orderData);
    }
    const order = {
      ...orderData,
      _id: 'ord_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    this.orders.unshift(order);
    return order;
  }

  async getOrders() {
    if (this.isMongoConnected()) {
      return await Order.find().sort({ createdAt: -1 });
    }
    return this.orders;
  }

  async getOrderById(orderId) {
    if (this.isMongoConnected()) {
      return await Order.findOne({ orderId });
    }
    return this.orders.find((o) => o.orderId === orderId);
  }

  async updateOrderStatus(orderId, status, paymentUpdates = {}) {
    if (this.isMongoConnected()) {
      return await Order.findOneAndUpdate(
        { orderId },
        { orderStatus: status, ...paymentUpdates },
        { new: true }
      );
    }
    const order = this.orders.find((o) => o.orderId === orderId);
    if (!order) return null;
    order.orderStatus = status;
    if (paymentUpdates.payment) {
      order.payment = { ...order.payment, ...paymentUpdates.payment };
    }
    return order;
  }

  // --- USERS ---
  async findUserByEmail(email) {
    if (this.isMongoConnected()) {
      return await User.findOne({ email });
    }
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  async createUser(userData) {
    if (this.isMongoConnected()) {
      return await User.create(userData);
    }
    const user = {
      ...userData,
      _id: 'usr_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    this.users.push(user);
    return user;
  }
}

export const store = new MemoryStore();
