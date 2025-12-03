// Contexto centralizado para compartir los productos cargados via axios.
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { productsService } from '../services/productsService';

export const ProductsContext = createContext({
  products: [],
  loading: true,
  error: null,
  refresh: () => {},
});

export function ProductsProvider({ children }) {
  // Estado compartido de productos con flags de carga/error.
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Consulta el backend (axios) y actualiza estado; expuesto como refresh.
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await productsService.list();
      setProducts(Array.isArray(data) ? data : []);
    } catch (remoteErr) {
      try {
        const { data } = await api.get('/data/productos.json');
        setProducts(Array.isArray(data) ? data : []);
      } catch (localErr) {
        const message =
          localErr?.response?.data?.message || localErr?.message || remoteErr?.message || 'Error al cargar productos';
        setError(message);
      }
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
