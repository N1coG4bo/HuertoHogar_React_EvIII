// Resumen y gestión del carrito de compras.
import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { CartContext } from '../context/CartContext';

function Carrito() {
  const { items, totalItems, totalPrecio, updateQty, removeItem, clearCart } = React.useContext(CartContext);

  return (
    <>
      <Navbar />
      <div className="container my-5 main-content">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="h4 text-success fw-bold mb-0">Carrito</h1>
          {items.length > 0 && (
            <button className="btn btn-outline-danger btn-sm" onClick={clearCart}>Vaciar</button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="alert alert-info">Tu carrito esta vacio.</div>
        ) : (
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              {items.map((it) => (
                <div key={it.code} className="card mb-3 shadow-sm">
                  <div className="row g-0 align-items-center">
                    <div className="col-4 col-md-3">
                      <img src={it.img} alt={it.nombre} className="img-fluid rounded-start" style={{ objectFit: 'cover', height: 120, width: '100%' }} />
                    </div>
                    <div className="col-8 col-md-9">
                      <div className="card-body">
                        <h5 className="card-title mb-1">{it.nombre}</h5>
                        <p className="card-text text-muted mb-2">${it.precio.toLocaleString('es-CL')} / {it.unidad}</p>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQty(it.code, it.qty - 1)}>-</button>
                          <input type="text" className="form-control form-control-sm text-center" style={{ width: 60 }} value={it.qty} onChange={(e) => updateQty(it.code, parseInt(e.target.value, 10) || 1)} />
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
                  <p className="mb-3">Total: <strong>${totalPrecio.toLocaleString('es-CL')}</strong></p>
                  <button className="btn btn-success w-100" onClick={() => alert('Checkout simulado')}>
                    Continuar al pago
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Carrito;
