import React, { useState } from 'react';
import { PRODUCTOS } from '../data/productos';
import ProductoCard from './producto_card';

function Catalogo() {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [orden, setOrden] = useState("");

  const productosFiltrados = PRODUCTOS.filter((p) => {
    const termino = busqueda.toLowerCase();
    const matchSearch = p.nombre.toLowerCase().includes(termino) || p.code.toLowerCase().includes(termino);
    
    let matchCat = true;
    if (categoria === 'Frutas Frescas') matchCat = p.code.startsWith('FR');
    else if (categoria === 'Verduras Orgánicas') matchCat = p.code.startsWith('VR');
    else if (categoria === 'Productos Orgánicos') matchCat = p.code.startsWith('PO');
    else if (categoria === 'Productos Lácteos') matchCat = p.code.startsWith('PL');

    return matchSearch && matchCat;
  }).sort((a, b) => {
    if (orden === 'precio_asc') return a.precio - b.precio;
    if (orden === 'precio_desc') return b.precio - a.precio;
    if (orden === 'nombre_asc') return a.nombre.localeCompare(b.nombre);
    if (orden === 'nombre_desc') return b.nombre.localeCompare(a.nombre);
    return 0;
  });

  return (
    <div className="container my-4">
      <form className="row g-3 align-items-end mb-4">
        <div className="col-12 col-md-6">
          <label htmlFor="q" className="form-label">Buscar</label>
          <input 
            id="q" type="search" className="form-control" placeholder="Ej: manzana..." 
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-6 col-md-3">
          <label htmlFor="cat" className="form-label">Categoría</label>
          <select id="cat" className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
             <option value="">Todas</option>
             <option value="Frutas Frescas">Frutas Frescas</option>
             <option value="Verduras Orgánicas">Verduras Orgánicas</option>
             <option value="Productos Orgánicos">Productos Orgánicos</option>
             <option value="Productos Lácteos">Productos Lácteos</option>
          </select>
        </div>
        <div className="col-6 col-md-3">
           <label htmlFor="ord" className="form-label">Ordenar</label>
           <select id="ord" className="form-select" value={orden} onChange={(e) => setOrden(e.target.value)}>
             <option value="">Relevancia</option>
             <option value="precio_asc">Precio: menor a mayor</option>
             <option value="precio_desc">Precio: mayor a menor</option>
             <option value="nombre_asc">Nombre A–Z</option>
             <option value="nombre_desc">Nombre Z–A</option>
           </select>
        </div>
      </form>

      <div className="row g-4">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((prod) => <ProductoCard key={prod.code} producto={prod} />)
        ) : (
          <div className="alert alert-warning text-center">No se encontraron productos.</div>
        )}
      </div>
    </div>
  );
}

export default Catalogo;