// Muestra un subset de productos destacados en el home.
import React from 'react';
import ProductoCard from './producto_card';
import { ProductsContext } from '../context/ProductsContext';

function ProductosDestacados() {
  const { products, loading, error } = React.useContext(ProductsContext);
  // Toma los primeros 3 productos como destacados para el home.
  const destacados = products.slice(0, 3);

  if (loading) {
    return (
      <main className="container mb-5">
        <h2 className="text-success fw-bold mb-4 text-center">Productos destacados</h2>
        <div className="alert alert-info text-center">Cargando productos destacados...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mb-5">
        <h2 className="text-success fw-bold mb-4 text-center">Productos destacados</h2>
        <div className="alert alert-danger text-center">No pudimos cargar los productos: {error}</div>
      </main>
    );
  }

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
