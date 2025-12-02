import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const POSTS = [
  { id: 1, title: '5 recetas rapidas con verduras organicas', excerpt: 'Ideas para cenar en 20 minutos usando productos frescos.', date: '2025-12-01' },
  { id: 2, title: 'Como elegir frutas de estacion', excerpt: 'Tips para identificar frutas en su punto y aprovechar precios.', date: '2025-11-21' },
  { id: 3, title: 'Por que comprar local', excerpt: 'Impacto en la comunidad y la huella de carbono al preferir productores cercanos.', date: '2025-11-10' },
];

function Blog() {
  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h1 className="h3 text-success fw-bold mb-4">Blog HuertoHogar</h1>
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
      <Footer />
    </>
  );
}

export default Blog;
