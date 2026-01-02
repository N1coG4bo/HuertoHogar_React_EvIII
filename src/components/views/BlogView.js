// Listado simple de posts del blog.
import React from 'react';
import MainLayout from '../main_layout';
import Footer from '../footer';

// Posts estaticos de ejemplo para el blog.
const POSTS = [
  {
    id: 1,
    title: 'Empaques discretos: como cuidamos tu privacidad',
    excerpt: 'Nuestro proceso de embalaje neutro y seguimiento seguro de pedidos.',
    date: '2025-12-01',
  },
  {
    id: 2,
    title: 'Como seleccionamos productos de calidad',
    excerpt: 'Curacion, pruebas internas y proveedores verificados.',
    date: '2025-11-21',
  },
  {
    id: 3,
    title: 'Envios rapidos y discretos en todo Chile',
    excerpt: 'Plazos, zonas de cobertura y opciones de retiro seguro.',
    date: '2025-11-10',
  },
];

function BlogView() {
  return (
    <>
      <MainLayout>
        <div className="my-4">
          <h1 className="h3 text-success fw-bold mb-4">Blog Red Privada</h1>
          <div className="row g-4">
            {POSTS.map((post) => (
              <div className="col-12 col-md-6 col-lg-4" key={post.id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <span className="badge bg-light text-secondary mb-2">{post.date}</span>
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text text-muted">{post.excerpt}</p>
                    <button className="btn btn-outline-success btn-sm" disabled>Leer mas (proximo)</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
      <Footer />
    </>
  );
}

export default BlogView;
