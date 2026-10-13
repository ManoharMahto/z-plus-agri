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
        const imagesList = Array.isArray(product.images) && product.images.length > 0
          ? product.images.filter(Boolean)
          : [product.image || `https://picsum.photos/seed/seed-${newId}/400/300`];

        const newProduct = {
          ...product,
          id: newId,
          brand: 'Z+ Agri',
          category: 'Vegetable Seeds',
          rating: product.rating || 4.8,
          reviewCount: product.reviewCount || 1,
          inStock: product.inStock !== false,
          image: imagesList[0],
          images: imagesList,
          quantityOptions: product.quantityOptions || ['100g', '250g', '500g', '1kg']
        };
        set({ products: [newProduct, ...current] });
        return newProduct;
      },

      updateProduct: (id, updatedFields) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== Number(id)) return p;
            const imagesList = Array.isArray(updatedFields.images) && updatedFields.images.length > 0
              ? updatedFields.images.filter(Boolean)
              : [updatedFields.image || p.image];

            return {
              ...p,
              ...updatedFields,
              brand: 'Z+ Agri',
              category: 'Vegetable Seeds',
              image: imagesList[0] || p.image,
              images: imagesList
            };
          })
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
      name: 'zplus_products_storage_v4'
    }
  )
);
