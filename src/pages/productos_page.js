import React from 'react';
import Navbar from '../components/navbar';
import PageHeader from '../components/page_header';
import Catalogo from '../components/catalogo';
import Footer from '../components/footer';

function ProductosPage() {
  return (
    <div>
      <Navbar />
      <PageHeader 
        titulo="Catálogo de productos" 
        bajada="Explora nuestras frutas, verduras y productos orgánicos." 
      />
      <Catalogo />
      <Footer />
    </div>
  );
}

export default ProductosPage;