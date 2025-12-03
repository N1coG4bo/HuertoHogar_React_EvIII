// Contenido del detalle de producto con recomendados.
import React from 'react';
import { useParams } from 'react-router-dom';
import ProductoCard from './producto_card';
import { CartContext } from '../context/CartContext';
import { ProductsContext } from '../context/ProductsContext';

function DetalleContenido() {
  const { code } = useParams();
  const { addToCart } = React.useContext(CartContext);
  const { products, loading, error } = React.useContext(ProductsContext);
  const [cantidad, setCantidad] = React.useState(1);

  const producto = React.useMemo(
    () => products.find((p) => p.code === code),
    [products, code]
  );

  const relacionados = React.useMemo(() => {
    if (!producto) return [];
    const prefijo = producto.code.substring(0, 2);
    return products.filter((p) => p.code.startsWith(prefijo) && p.code !== producto.code).slice(0, 3);
  }, [producto, products]);

  if (loading) {
    return <div className="container my-5">Cargando producto...</div>;
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">No pudimos cargar el producto: {error}</div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">Producto no encontrado.</div>
      </div>
    );
  }

  const sinStock = producto.stock <= 0;

  function formatPrecio(precio) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(precio);
  }

  const decrementar = () => setCantidad((prev) => Math.max(1, prev - 1));
  const incrementar = () => setCantidad((prev) => Math.min(producto.stock, prev + 1));

  return (
    <div className="container my-5">
      <div className="row g-4 align-items-start">
        <div className="col-12 col-lg-6">
          <div className="ratio ratio-4x3 bg-white border rounded overflow-hidden">
            <img
              src={producto.img}
              alt={producto.nombre}
              className="w-100 h-100"
              style={{ objectFit: 'cover' }}
              onError={(e) => { e.target.onerror = null; e.target.src = '/img-placeholder.svg'; }}
            />
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <span className="badge bg-warning text-dark mb-2">{producto.code}</span>
          <h1 className="h3 text-success fw-bold">{producto.nombre}</h1>
          <p className="text-muted mb-2 fs-4">
            {formatPrecio(producto.precio)} / {producto.unidad}
          </p>

          <div className="d-flex align-items-center gap-2 mb-4 mt-4">
            <label className="form-label mb-0 me-2">Cantidad:</label>
            <div className="input-group" style={{ maxWidth: '140px' }}>
              <button className="btn btn-outline-secondary" onClick={decrementar}>-</button>
              <input type="text" className="form-control text-center" value={cantidad} readOnly />
              <button className="btn btn-outline-secondary" onClick={incrementar}>+</button>
            </div>
          </div>

          <button
            className="btn btn-success btn-lg w-100"
            disabled={sinStock}
            onClick={() => addToCart(producto, cantidad)}
          >
            Anadir al carrito
          </button>

          <hr className="my-4" />
          <p><strong>Descripcion:</strong> {producto.descripcion}</p>
        </div>
      </div>

      {relacionados.length > 0 && (
        <div className="mt-5 pt-4 border-top">
          <h2 className="h4 text-success fw-bold mb-4">Tambien podria interesarte</h2>
          <div className="row g-4">
            {relacionados.map((rel) => <ProductoCard key={rel.code} producto={rel} />)}
          </div>
        </div>
      )}
    </div>
  );
}

export default DetalleContenido;
