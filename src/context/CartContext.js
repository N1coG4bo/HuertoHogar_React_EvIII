// Contexto para el estado del carrito y sus operaciones.
import React, { createContext, useEffect, useMemo, useState } from 'react';

const CART_KEY = 'hh_cart';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  function addToCart(producto, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((it) => it.code === producto.code);
      if (existing) {
        return prev.map((it) =>
          it.code === producto.code ? { ...it, qty: Math.min(it.qty + qty, producto.stock || 99) } : it
        );
      }
      return [...prev, { code: producto.code, nombre: producto.nombre, precio: producto.precio, unidad: producto.unidad, img: producto.img, qty }];
    });
  }

  function updateQty(code, qty) {
    setItems((prev) =>
      prev
        .map((it) => (it.code === code ? { ...it, qty: Math.max(1, qty) } : it))
        .filter((it) => it.qty > 0)
    );
  }

  function removeItem(code) {
    setItems((prev) => prev.filter((it) => it.code !== code));
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((acc, it) => acc + it.qty, 0);
  const totalPrecio = items.reduce((acc, it) => acc + it.qty * it.precio, 0);

  const value = useMemo(
    () => ({
      items,
      totalItems,
      totalPrecio,
      addToCart,
      updateQty,
      removeItem,
      clearCart,
    }),
    [items, totalItems, totalPrecio]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
