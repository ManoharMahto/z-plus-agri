import { create } from 'zustand';

const getInitialCart = () => {
  try {
    const saved = localStorage.getItem('z_plus_agri_cart');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem('z_plus_agri_cart', JSON.stringify(items));
  } catch (e) {
    console.error("Failed to persist cart", e);
  }
};

export const useCartStore = create((set, get) => ({
  items: getInitialCart(),

  addToCart: (product, quantity = 1, selectedQtyOption = null) => {
    const qtyOption = selectedQtyOption || product.quantityOptions?.[0] || '1 Unit';
    const items = get().items;
    const existingIndex = items.findIndex(
      (item) => item.product.id === product.id && item.selectedQtyOption === qtyOption
    );

    let updatedItems;
    if (existingIndex > -1) {
      updatedItems = items.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedItems = [
        ...items,
        {
          id: `${product.id}-${qtyOption}`,
          product,
          quantity,
          selectedQtyOption: qtyOption
        }
      ];
    }

    saveCart(updatedItems);
    set({ items: updatedItems });
  },

  removeFromCart: (itemId) => {
    const updatedItems = get().items.filter((item) => item.id !== itemId);
    saveCart(updatedItems);
    set({ items: updatedItems });
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(itemId);
      return;
    }
    const updatedItems = get().items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    saveCart(updatedItems);
    set({ items: updatedItems });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce((total, item) => {
      const price = item.product.price || 0;
      return total + price * item.quantity;
    }, 0);
  },

  getOriginalTotal: () => {
    return get().items.reduce((total, item) => {
      const orig = item.product.originalPrice || item.product.price || 0;
      return total + orig * item.quantity;
    }, 0);
  },

  getTotalDiscount: () => {
    const original = get().getOriginalTotal();
    const subtotal = get().getSubtotal();
    return Math.max(0, original - subtotal);
  },

  getDeliveryFee: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    // Free delivery above ₹500 (Flipkart style)
    return subtotal >= 500 ? 0 : 50;
  },

  getFinalTotal: () => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) return 0;
    const delivery = get().getDeliveryFee();
    return subtotal + delivery;
  }
}));
