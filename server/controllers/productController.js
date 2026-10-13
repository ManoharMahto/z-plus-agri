import { store } from '../services/store.js';

export const getProducts = async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice } = req.query;
    const products = await store.getProducts({ category, search, sort, minPrice, maxPrice });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await store.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Seed product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await store.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await store.updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Seed product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const removed = await store.deleteProduct(req.params.id);
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Seed product not found' });
    }
    res.json({ success: true, message: 'Seed product removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
