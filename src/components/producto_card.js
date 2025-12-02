// Tarjeta individual de producto en listados.
import React from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function ProductoCard({ producto }) {
  const sinStock = producto.stock <= 0;
  const { addToCart } = React.useContext(CartContext);

  function formatPrecio(precio) {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(precio);
  }

  return (
    <div className="col-12 col-sm-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm">
        <img
          src={producto.img}
          className="card-img-top"
          alt={producto.nombre}
          loading="lazy"
          onError={(e) => { e.target.onerror = null; e.target.src = '/img-placeholder.svg'; }}
          style={{ height: '200px', objectFit: 'cover' }}
        />

        <div className="card-body d-flex flex-column">
          <span className="badge bg-warning text-dark align-self-start mb-2">
            {producto.code}
          </span>

          <h5 className="card-title mb-1">{producto.nombre}</h5>

          <p className="card-text text-muted mb-1">
            {formatPrecio(producto.precio)} / {producto.unidad}
          </p>

          <p className={`card-text ${sinStock ? 'text-danger' : 'text-body-secondary'}`}>
            {sinStock ? 'Sin stock' : `Stock: ${producto.stock}`}
          </p>

          <div className="mt-auto d-flex gap-2">
            <Link to={`/producto/${producto.code}`} className="btn btn-outline-success w-50">
              Ver
            </Link>
            <button
              className="btn btn-success w-50"
              disabled={sinStock}
              onClick={() => addToCart(producto, 1)}
            >
              Anadir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductoCard;
