// Vista de catálogo con filtros y sidebar.
import React from 'react';
import Navbar from '../components/navbar';
import PageHeader from '../components/page_header';
import Catalogo from '../components/catalogo';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';

function ProductosPage() {
  return (
    <>
      <Navbar />
      <div className="container-fluid main-content">
        <div className="row">
          <div className="col-12 col-lg-3 col-xl-2 mb-4">
            <Sidebar />
          </div>
          <div className="col-12 col-lg-9 col-xl-10">
            <PageHeader
              titulo="Catalogo de productos"
              bajada="Explora nuestras frutas, verduras y productos organicos."
            />
            <Catalogo />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductosPage;
