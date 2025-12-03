// Pie de página con derechos reservados.
import React from 'react';

function Footer() {
  return (
    <footer className="bg-white border-top py-4 mt-5">
      <div className="container text-center">
        {/* Muestra el año actual dinamicamente y el texto legal */}
        <small className="text-muted">
          (c) {new Date().getFullYear()} HuertoHogar. Todos los derechos reservados.
        </small>
      </div>
    </footer>
  );
}

export default Footer;
