import { create } from 'zustand';

const loadWishlist = () => {
  try {
    const saved = localStorage.getItem('z_plus_agri_wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const saveWishlist = (items) => {
  try {
    localStorage.setItem('z_plus_agri_wishlist', JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save wishlist', e);
  }
};

export const useWishlistStore = create((set, get) => ({
  items: loadWishlist(),

  isInWishlist: (productId) => {
    return get().items.some((item) => item.id === productId);
  },

  toggleWishlist: (product) => {
    const current = get().items;
    const exists = current.some((item) => item.id === product.id);
    let updated;
    if (exists) {
      updated = current.filter((item) => item.id !== product.id);
    } else {
      updated = [...current, product];
    }
    saveWishlist(updated);
    set({ items: updated });
    return !exists; // returns true if added, false if removed
  },

  removeFromWishlist: (productId) => {
    const updated = get().items.filter((item) => item.id !== productId);
    saveWishlist(updated);
    set({ items: updated });
  }
}));
