// Contenedor general que agrega el sidebar y el espacio para cada página.
import React from 'react';
import Sidebar from './sidebar';

function MainLayout({ children }) {
  return (
    // Layout base: sidebar fijo a la izquierda y contenido dinamico a la derecha.
    <div className="container-fluid main-content">
      <div className="row">
        <div className="col-12 col-lg-3 col-xl-2 mb-4">
          <Sidebar />
        </div>
        <div className="col-12 col-lg-9 col-xl-10">
          {children}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
