// src/pages/inicio.js
import React from 'react';
import { PRODUCTOS } from '../data/productos'; // Importamos los datos
import ProductoCard from '../components/producto_card'; // Importamos la tarjeta

function Inicio() {
  // Filtramos o seleccionamos los productos destacados (por ejemplo, los primeros 3)
  const destacados = PRODUCTOS.slice(0, 3);

  return (
    <div>
      {/* Hero Section (Banner Verde) */}
      <header className="bg-success py-5 mb-5">
        <div className="container text-center">
          <div className="text-white">
            <h1 className="display-4 fw-bold">Frescura del campo a tu mesa</h1>
            <p className="lead mb-4">
              Productos locales, saludables y sustentables. Conecta con el origen de tus alimentos.
            </p>
            <div className="d-flex justify-content-center gap-2">
              <a href="/productos" className="btn btn-warning btn-lg text-brown">
                Explorar productos
              </a>
              <a href="/nosotros" className="btn btn-light btn-lg text-success">
                Conócenos
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Sección de Productos Destacados */}
      <main className="container mb-5">
        <h2 className="text-success fw-bold mb-4 text-center">Productos destacados</h2>
        <div className="row g-4">
          {destacados.map((prod) => (
            <ProductoCard key={prod.code} producto={prod} />
          ))}
        </div>
      </main>

      {/* Footer simple para el inicio */}
      <footer className="bg-white border-top py-4 mt-auto">
        <div className="container text-center">
          <small className="text-muted">
            © {new Date().getFullYear()} HuertoHogar. Todos los derechos reservados.
          </small>
        </div>
      </footer>
    </div>
  );
}

export default Inicio;