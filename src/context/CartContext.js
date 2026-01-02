// Contexto para el estado del carrito y sus operaciones.
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { cartService } from '../services/cartService';
import { AuthContext } from './AuthContext';

const CART_KEY = 'hh_cart';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, bootstrapped } = React.useContext(AuthContext);

  // Items persistidos del carrito en localStorage para modo offline.
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [totals, setTotals] = useState({ subtotalCLP: 0, totalCLP: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, user]);

  useEffect(() => {
    let active = true;
    async function loadCart() {
      if (!bootstrapped) return;
      if (!user) {
        setTotals({
          subtotalCLP: items.reduce((acc, it) => acc + it.qty * it.precio, 0),
          totalCLP: items.reduce((acc, it) => acc + it.qty * it.precio, 0),
        });
        return;
      }
      setLoading(true);
      setError('');
      try {
        const { data } = await cartService.getCart();
        if (!active) return;
        setItems((data.items || []).map((it) => ({ ...it, code: it.productId })));
        setTotals({
          subtotalCLP: data.subtotalCLP || 0,
          totalCLP: data.totalCLP || 0,
        });
      } catch (err) {
        if (!active) return;
        setError(err?.response?.data?.error || 'No pudimos cargar el carrito');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadCart();
    return () => {
      active = false;
    };
  }, [user, bootstrapped]);

  async function addToCart(producto, qty = 1) {
    if (!user) {
      setItems((prev) => {
        const existing = prev.find((it) => it.code === producto.code);
        if (existing) {
          return prev.map((it) =>
            it.code === producto.code ? { ...it, qty: Math.min(it.qty + qty, producto.stock || 99) } : it
          );
        }
        return [
          ...prev,
          { code: producto.code, nombre: producto.nombre, precio: producto.precio, unidad: producto.unidad, img: producto.img, qty }
        ];
      });
      return;
    }

    const productId = producto.code;
    const nextQty = Math.max(1, qty);
    const { data } = await cartService.upsertItem({ productId, qty: nextQty });
    setItems((data.items || []).map((it) => ({ ...it, code: it.productId })));
    setTotals({ subtotalCLP: data.subtotalCLP || 0, totalCLP: data.totalCLP || 0 });
  }

  async function updateQty(code, qty) {
    if (!user) {
      setItems((prev) =>
        prev
          .map((it) => (it.code === code ? { ...it, qty: Math.max(1, qty) } : it))
          .filter((it) => it.qty > 0)
      );
      return;
    }
    const nextQty = Math.max(1, qty);
    const { data } = await cartService.upsertItem({ productId: code, qty: nextQty });
    setItems((data.items || []).map((it) => ({ ...it, code: it.productId })));
    setTotals({ subtotalCLP: data.subtotalCLP || 0, totalCLP: data.totalCLP || 0 });
  }

  async function removeItem(code) {
    if (!user) {
      setItems((prev) => prev.filter((it) => it.code !== code));
      return;
    }
    const { data } = await cartService.deleteItem(code);
    setItems((data.items || []).map((it) => ({ ...it, code: it.productId })));
    setTotals({ subtotalCLP: data.subtotalCLP || 0, totalCLP: data.totalCLP || 0 });
  }

  async function clearCart() {
    if (!user) {
      setItems([]);
      return;
    }
    const { data } = await cartService.clearCart();
    setItems((data.items || []).map((it) => ({ ...it, code: it.productId })));
    setTotals({ subtotalCLP: data.subtotalCLP || 0, totalCLP: data.totalCLP || 0 });
  }

  const totalItems = items.reduce((acc, it) => acc + (it.qty || 0), 0);
  const totalPrecio = user ? totals.totalCLP : items.reduce((acc, it) => acc + it.qty * it.precio, 0);

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
