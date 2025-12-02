// src/pages/productos_page.js
import React, { useState } from 'react';
import ProductoCard from '../components/producto_card'; // Importamos el componente
import { PRODUCTOS } from '../data/productos'; // Importamos los datos

function ProductosPage() {
  // Aquí podríamos poner filtros más adelante
  const [listaProductos] = useState(PRODUCTOS); 

  return (
    <main className="container my-4">
      <header className="bg-white border-bottom mb-4">
        <div className="py-4">
          <h1 className="h3 text-success fw-bold mb-0">Catálogo de productos</h1>
          <p className="text-muted mb-0">Explora nuestras frutas, verduras y productos orgánicos.</p>
        </div>
      </header>

      <div className="row g-4">
        {/* Aquí ocurre la magia: recorremos la lista y creamos una tarjeta por cada uno */}
        {listaProductos.map(function(prod) {
          return (
            <ProductoCard key={prod.code} producto={prod} />
          );
        })}
      </div>
    </main>
  );
}

export default ProductosPage;