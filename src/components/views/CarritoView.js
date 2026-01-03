// Resumen y gestión del carrito de compras.
import React, { useMemo, useState } from 'react';
import MainLayout from '../main_layout';
import Footer from '../footer';
import { CartContext } from '../../context/CartContext';
import { ProductsContext } from '../../context/ProductsContext';
import { AuthContext } from '../../context/AuthContext';
import { pedidosService } from '../../services/pedidosService';
import PageHeader from '../page_header';

function CarritoView() {
  // Acceso al carrito: items, totales y acciones CRUD.
  const { items, totalItems, totalPrecio, totals, updateQty, removeItem, clearCart, loading, error } = React.useContext(CartContext);
  const { products } = React.useContext(ProductsContext);
  const { user } = React.useContext(AuthContext);
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutOk, setCheckoutOk] = useState('');

  const productsMap = useMemo(() => {
    return new Map(products.map((p) => [p.code, p]));
  }, [products]);

  const normalizedItems = items.map((it) => {
    const product = productsMap.get(it.code) || {};
    return {
      code: it.code,
      qty: it.qty || 1,
      nombre: it.nombre || product.nombre || 'Producto',
      precio: it.precio ?? product.precio ?? 0,
      unidad: it.unidad || product.unidad || 'unidad',
      img: it.img || product.img || '/img-placeholder.svg',
      proveedorEmail: it.providerEmail || product.providerEmail || product.proveedorEmail || 'proveedor@redprivada.com',
    };
  });

  const handleCheckout = async () => {
    setCheckoutError('');
    setCheckoutOk('');
    if (!user) {
      setCheckoutError('Debes iniciar sesion para finalizar tu compra.');
      return;
    }
    if (normalizedItems.length === 0) return;
    try {
      const proveedorEmail = normalizedItems[0]?.proveedorEmail || 'proveedor@redprivada.com';
      const detalleJson = normalizedItems.map((it) => ({
        productId: it.code,
        nombre: it.nombre,
        qty: it.qty,
        precioCLP: it.precio,
      }));
      const payload = {
        proveedorEmail,
        compradorNombre: user.name || user.email,
        detalleJson,
        subtotalCLP: totals.subtotalCLP,
        ivaCLP: totals.ivaCLP,
        totalCLP: totals.totalCLP,
      };
      await pedidosService.create(payload);
      setCheckoutOk('Pedido creado. Revisalo en la seccion de pedidos.');
      await clearCart();
    } catch (err) {
      setCheckoutError(err?.response?.data?.error || 'No pudimos crear el pedido.');
    }
  };

  return (
    <>
      <MainLayout>
        <PageHeader
          titulo="Carrito"
          actions={
            normalizedItems.length > 0 ? (
              <button className="btn btn-outline-light btn-sm" onClick={clearCart}>Vaciar</button>
            ) : null
          }
        />
        <div className="my-4">

          {loading && <div className="alert alert-info">Cargando carrito...</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          {checkoutError && <div className="alert alert-danger">{checkoutError}</div>}
          {checkoutOk && <div className="alert alert-success">{checkoutOk}</div>}

          {normalizedItems.length === 0 ? (
            <div className="alert alert-info">Tu carrito esta vacio.</div>
          ) : (
            <div className="row g-4">
              <div className="col-12 col-lg-8">
                {normalizedItems.map((it) => (
                  <div key={it.code} className="card mb-3 shadow-sm">
                    <div className="row g-0 align-items-center">
                      <div className="col-4 col-md-3">
                        <img src={it.img} alt={it.nombre} className="img-fluid rounded-start" style={{ objectFit: 'cover', height: 120, width: '100%' }} />
                      </div>
                      <div className="col-8 col-md-9">
                        <div className="card-body">
                          <h5 className="card-title mb-1">{it.nombre}</h5>
                          <p className="card-text text-muted mb-2">
                            ${it.precio.toLocaleString('es-CL')} / {it.unidad}
                          </p>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQty(it.code, it.qty - 1)}>-</button>
                            <input
                              type="text"
                              className="form-control form-control-sm text-center"
                              style={{ width: 60 }}
                              value={it.qty}
                              onChange={(e) => updateQty(it.code, parseInt(e.target.value, 10) || 1)}
                            />
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQty(it.code, it.qty + 1)}>+</button>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <strong className="text-success">
                              ${(it.qty * it.precio).toLocaleString('es-CL')}
                            </strong>
                            <button className="btn btn-link text-danger text-decoration-none" onClick={() => removeItem(it.code)}>
                              Quitar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-12 col-lg-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Resumen</h5>
                    <p className="mb-1">Productos: {totalItems}</p>
                    <p className="mb-1">Subtotal: <strong>${totals.subtotalCLP.toLocaleString('es-CL')}</strong></p>
                    <p className="mb-1">IVA (19%): <strong>${totals.ivaCLP.toLocaleString('es-CL')}</strong></p>
                    <p className="mb-3">Total: <strong>${totalPrecio.toLocaleString('es-CL')}</strong></p>
                    <button className="btn btn-success w-100" onClick={handleCheckout}>
                      Crear pedido
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </MainLayout>
      <Footer />
    </>
  );
}

export default CarritoView;
