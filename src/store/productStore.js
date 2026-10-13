import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PRODUCTS } from '../data/products';

export const useProductStore = create(
  persist(
    (set, get) => ({
      products: PRODUCTS,

      addProduct: (product) => {
        const current = get().products;
        const newId = current.length ? Math.max(...current.map((p) => p.id || 0)) + 1 : 1;
        const newProduct = {
          ...product,
          id: newId,
          rating: product.rating || 4.5,
          reviewCount: product.reviewCount || 1,
          inStock: product.inStock !== false,
          image: product.image || `https://picsum.photos/seed/seed-${newId}/400/300`,
          images: product.images || [product.image || `https://picsum.photos/seed/seed-${newId}/400/300`],
          quantityOptions: product.quantityOptions || ['100g', '500g', '1kg']
        };
        set({ products: [newProduct, ...current] });
        return newProduct;
      },

      updateProduct: (id, updatedFields) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === Number(id) ? { ...p, ...updatedFields } : p
          )
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== Number(id))
        }));
      },

      resetToDefault: () => {
        set({ products: PRODUCTS });
      }
    }),
    {
      name: 'zplus_products_storage'
    }
  )
);
