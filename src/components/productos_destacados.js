// Muestra un subset de productos destacados en el home.
import React from 'react';
import { PRODUCTOS } from '../data/productos';
import ProductoCard from './producto_card';

function ProductosDestacados() {
  const destacados = PRODUCTOS.slice(0, 3);

  return (
    <main className="container mb-5">
      <h2 className="text-success fw-bold mb-4 text-center">Productos destacados</h2>
      <div className="row g-4">
        {destacados.map((prod) => (
          <ProductoCard key={prod.code} producto={prod} />
        ))}
      </div>
    </main>
  );
}

export default ProductosDestacados;
