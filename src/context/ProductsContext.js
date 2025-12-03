// Contexto centralizado para compartir los productos cargados via axios.
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

export const ProductsContext = createContext({
  products: [],
  loading: true,
  error: null,
  refresh: () => {},
});

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/data/productos.json');
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Error al cargar productos';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      refresh: fetchProducts,
    }),
    [products, loading, error, fetchProducts]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}
