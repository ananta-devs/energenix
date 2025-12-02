import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api'; // Import api

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products function (reusable + callable from components)
  const fetchProducts = async (signal) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get('/products', { signal }); // Use api.get

      const data = res.data; // Axios puts data in res.data

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format: expected an array");
      }

      setProducts(data);
    } catch (err) {
      if (err.name !== 'CanceledError') { // Axios abort errors are 'CanceledError'
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);

    return () => controller.abort(); // Prevents memory leaks
  }, []);

  return (
    <ProductContext.Provider value={{ 
      products, 
      loading, 
      error,
      refreshProducts: () => fetchProducts() // allow manual reload
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
