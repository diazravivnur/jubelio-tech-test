import { create } from 'zustand';
import axios from 'axios';

const apiUrl = 'http://localhost:8080/api/v1/products';

const useProductStore = create((set) => ({
  products: [],
  selectedProduct: null,

  fetchProducts: async (page = 1) => {
    try {
      const response = await axios.get(`${apiUrl}?page=${page}&limit=8`);

      const newProducts = Array.isArray(response.data.data) ? response.data.data : [];

      set((state) => {
        return {
          products: page === 1 ? newProducts : [...(state.products || []), ...newProducts]
        };
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  },

  addProduct: async (newProduct) => {
    try {
      const response = await axios.post(apiUrl, newProduct);
      set((state) => ({ products: [...state.products, response.data] }));
    } catch (error) {
      console.error('Error adding product:', error);
    }
  },
  updateProduct: async (updatedProduct) => {
    try {
      await axios.put(`${apiUrl}/${updatedProduct.id}`, updatedProduct);
      set((state) => ({
        products: state.products.map((product) => (product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product))
      }));
    } catch (error) {
      console.error('Error updating product:', error);
    }
  },
  deleteProduct: async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      set((state) => ({
        products: state.products.filter((product) => product.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  },
  setSelectedProduct: (product) => set({ selectedProduct: product })
}));

export default useProductStore;
