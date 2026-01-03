// Contexto para el estado del carrito y sus operaciones.
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';

const CART_KEY = 'hh_cart';
const IVA_RATE = 0.19;

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, bootstrapped } = React.useContext(AuthContext);

  const getCartKey = React.useCallback(
    () => (user?.email ? `${CART_KEY}_${user.email.toLowerCase()}` : CART_KEY),
    [user]
  );

  const loadFromStorage = React.useCallback(() => {
    const saved = localStorage.getItem(getCartKey());
    return saved ? JSON.parse(saved) : [];
  }, [getCartKey]);

  // Items persistidos del carrito en localStorage.
  const [items, setItems] = useState(() => loadFromStorage());
  const [totals, setTotals] = useState({ subtotalCLP: 0, ivaCLP: 0, totalCLP: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem(getCartKey(), JSON.stringify(items));
  }, [items, getCartKey]);

  useEffect(() => {
    if (!bootstrapped) return;
    setItems(loadFromStorage());
  }, [bootstrapped, loadFromStorage]);

  useEffect(() => {
    const subtotalCLP = items.reduce((acc, it) => acc + it.qty * it.precio, 0);
    const ivaCLP = Math.round(subtotalCLP * IVA_RATE);
    const totalCLP = subtotalCLP + ivaCLP;
    setTotals({ subtotalCLP, ivaCLP, totalCLP });
  }, [items]);

  async function addToCart(producto, qty = 1) {
    setError('');
    setItems((prev) => {
      const providerEmail = producto.providerEmail || producto.proveedorEmail || '';
      const hasOtherProvider = prev.some(
        (it) => it.providerEmail && providerEmail && it.providerEmail !== providerEmail
      );
      if (hasOtherProvider) {
        setError('El carrito solo permite productos de un mismo proveedor. Se reemplazo el carrito anterior.');
      }
      const base = hasOtherProvider ? [] : prev;
      const existing = base.find((it) => it.code === producto.code);
      if (existing) {
        return base.map((it) =>
          it.code === producto.code
            ? { ...it, qty: Math.min(it.qty + qty, producto.stock || 99) }
            : it
        );
      }
      return [
        ...base,
        {
          code: producto.code,
          nombre: producto.nombre,
          precio: producto.precio,
          unidad: producto.unidad,
          img: producto.img,
          qty,
          providerEmail,
        },
      ];
    });
  }

  async function updateQty(code, qty) {
    setItems((prev) =>
      prev
        .map((it) => (it.code === code ? { ...it, qty: Math.max(0, qty) } : it))
        .filter((it) => it.qty > 0)
    );
  }

  async function removeItem(code) {
    setItems((prev) => prev.filter((it) => it.code !== code));
  }

  async function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((acc, it) => acc + (it.qty || 0), 0);
  const totalPrecio = totals.totalCLP;

  const value = useMemo(
    () => ({
      items,
      totalItems,
      totalPrecio,
      totals,
      loading,
      error,
      addToCart,
      updateQty,
      removeItem,
      clearCart,
    }),
    [items, totalItems, totalPrecio, totals, loading, error]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
