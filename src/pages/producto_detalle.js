// src/pages/producto_detalle.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // <--- Importante: Importamos el hook
import { PRODUCTOS } from '../data/productos';
import ProductoCard from '../components/producto_card';

function ProductoDetalle() {
  // 1. Obtenemos el parámetro "code" definido en App.js
  const { code } = useParams(); 
  
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  
  useEffect(() => {
    // Buscamos el producto usando el código de la URL
    const encontrado = PRODUCTOS.find(p => p.code === code);
    setProducto(encontrado); 
  }, [code]); // <-- Se vuelve a ejecutar si cambia el código

  // ... (El resto del código del componente sigue igual: if (!producto), return, etc.)
  // Si aún no carga el producto, no mostramos nada
  if (!producto) return <div className="container my-5">Cargando...</div>;

  const sinStock = producto.stock <= 0;

  // Lógica de relacionados (Mismo prefijo: FR, VR, etc.)
  const prefijo = producto.code.substring(0, 2);
  const relacionados = PRODUCTOS.filter(p => 
    p.code.startsWith(prefijo) && p.code !== producto.code
  ).slice(0, 3);

  // Helper de precio
  function formatPrecio(precio) {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(precio);
  }

  // Controladores de cantidad
  const decrementar = () => setCantidad(prev => Math.max(1, prev - 1));
  const incrementar = () => setCantidad(prev => Math.min(producto.stock, prev + 1));

  return (
    <div className="container my-5">
      {/* Sección Principal */}
      <div className="row g-4 align-items-start">
        {/* Imagen */}
        <div className="col-12 col-lg-6">
          <div className="ratio ratio-4x3 bg-white border rounded overflow-hidden">
            <img 
              src={producto.img} 
              alt={producto.nombre} 
              className="w-100 h-100 object-fit-cover" 
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Información */}
        <div className="col-12 col-lg-6">
          <span className="badge bg-warning text-dark mb-2">{producto.code}</span>
          <h1 className="h3 text-success fw-bold">{producto.nombre}</h1>
          <p className="text-muted mb-2 fs-4">
            {formatPrecio(producto.precio)} <span className="fs-6">/ {producto.unidad}</span>
          </p>
          <p className="text-muted small">Stock disponible: {producto.stock}</p>

          {/* Controles de Compra */}
          <div className="d-flex align-items-center gap-2 mb-4 mt-4">
            <label className="form-label mb-0 me-2">Cantidad:</label>
            <div className="input-group" style={{ maxWidth: '140px' }}>
              <button className="btn btn-outline-secondary" type="button" onClick={decrementar}>−</button>
              <input 
                type="text" 
                className="form-control text-center bg-white" 
                value={cantidad} 
                readOnly 
              />
              <button className="btn btn-outline-secondary" type="button" onClick={incrementar}>+</button>
            </div>
          </div>

          <div className="d-grid gap-2 d-md-flex">
            <button 
              className="btn btn-success btn-lg px-5" 
              disabled={sinStock}
              onClick={() => alert(`Añadido al carrito: ${cantidad} x ${producto.nombre}`)}
            >
              Añadir al carrito
            </button>
            <a href="/carrito" className="btn btn-outline-success btn-lg">
              Ver carrito
            </a>
          </div>

          <hr className="my-4" />

          <div className="text-muted">
            <p><strong>Descripción:</strong> {producto.descripcion}</p>
            <p><strong>Origen:</strong> {producto.origen}</p>
          </div>
        </div>
      </div>

      {/* Sección Relacionados */}
      {relacionados.length > 0 && (
        <div className="mt-5 pt-4 border-top">
          <h2 className="h4 text-success fw-bold mb-4">También podría interesarte</h2>
          <div className="row g-4">
            {relacionados.map(rel => (
              <ProductoCard key={rel.code} producto={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductoDetalle;