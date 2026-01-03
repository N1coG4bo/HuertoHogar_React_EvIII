// Listado simple de posts del blog.
import React from 'react';
import MainLayout from '../main_layout';
import Footer from '../footer';
import PageHeader from '../page_header';

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
        <PageHeader titulo="Blog Red Privada" />
        <div className="my-4">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="h5 text-success fw-bold mb-3">Reglas oficiales de la red</h2>
              <div className="mb-3">
                <div className="fw-bold">Regla #1: Acceso a la Distribucion 🔒</div>
                <div>Solo los Administradores pueden crear y vender productos.</div>
                <div>La activacion de esta funcion tiene un costo asociado.</div>
                <div>Garantiza exclusividad y seriedad de la red.</div>
              </div>
              <div className="mb-3">
                <div className="fw-bold">Regla #2: Verificacion de Usuario ✅</div>
                <div>Los usuarios deben completar un registro riguroso.</div>
                <div>Es obligatorio agregar a la lista de contactos a quien te compartio la aplicacion.</div>
                <div>Requisito para mantener acceso y seguridad.</div>
              </div>
              <div className="mb-3">
                <div className="fw-bold">Regla #3: Protocolo de Discrecion (Camuflaje) 👁️</div>
                <div>Prohibido publicar contenido de manera explicita.</div>
                <div>Uso obligatorio de codigos y terminologia discreta.</div>
                <div>Ejemplos: "aselga", "salcita", "el rosita".</div>
              </div>
              <div className="mb-3">
                <div className="fw-bold">Regla #4: Red Cerrada 🚫</div>
                <div>No se aceptan usuarios fuera de la red comun conocida por Admins y Root.</div>
                <div>Violaciones resultan en:</div>
                <div>Baneo inmediato.</div>
                <div>Eliminacion de cuenta.</div>
                <div>Bloqueo permanente del dispositivo.</div>
              </div>
              <div>
                <div className="fw-bold">Regla #5: Sistema de Seguridad 🛡️</div>
                <div>Base de datos de seguridad avanzada.</div>
                <div>Monitoreo de posibles infiltrados.</div>
                <div>Consecuencias para quienes sean identificados.</div>
              </div>
            </div>
          </div>
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
