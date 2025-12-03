// Listado filtrable y ordenable de productos.
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductoCard from './producto_card';
import { ProductsContext } from '../context/ProductsContext';

const CATEGORIAS = {
  frutas: { label: 'Frutas Frescas', prefix: 'FR' },
  verduras: { label: 'Verduras Organicas', prefix: 'VR' },
  organicos: { label: 'Productos Organicos', prefix: 'PO' },
  lacteos: { label: 'Productos Lacteos', prefix: 'PL' },
};

function Catalogo() {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [orden, setOrden] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { products, loading, error } = React.useContext(ProductsContext);

  // Leer query params para sincronizar categoria/vista con el sidebar
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const catParam = params.get('cat');
    if (catParam && CATEGORIAS[catParam]) {
      setCategoria(CATEGORIAS[catParam].label);
    } else {
      setCategoria('');
    }
  }, [location.search]);

  const productosFiltrados = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const view = params.get('view');

    let base = products;
    if (view === 'destacados') {
      base = products.slice(0, 3);
    } else if (view === 'ofertas') {
      base = products.filter((p) => p.precio <= 1000);
    }

    const termino = busqueda.toLowerCase();

    const filtrados = base.filter((p) => {
      const matchSearch =
        p.nombre.toLowerCase().includes(termino) || p.code.toLowerCase().includes(termino);

      let matchCat = true;
      if (categoria) {
        const entry = Object.values(CATEGORIAS).find((c) => c.label === categoria);
        if (entry) matchCat = p.code.startsWith(entry.prefix);
      }

      return matchSearch && matchCat;
    });

    return filtrados.sort((a, b) => {
      if (orden === 'precio_asc') return a.precio - b.precio;
      if (orden === 'precio_desc') return b.precio - a.precio;
      if (orden === 'nombre_asc') return a.nombre.localeCompare(b.nombre);
      if (orden === 'nombre_desc') return b.nombre.localeCompare(a.nombre);
      return 0;
    });
  }, [busqueda, categoria, orden, location.search, products]);

  const handleCategoria = (value) => {
    setCategoria(value);
    const params = new URLSearchParams(location.search);
    const slug = Object.entries(CATEGORIAS).find(([, info]) => info.label === value)?.[0];
    if (slug) {
      params.set('cat', slug);
    } else {
      params.delete('cat');
    }
    navigate({ pathname: '/productos', search: params.toString() ? `?${params}` : '' });
  };

  if (loading) {
    return (
      <div className="container my-4">
        <div className="alert alert-info">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-4">
        <div className="alert alert-danger">No pudimos cargar los productos: {error}</div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <form className="row g-3 align-items-end mb-4">
        <div className="col-12 col-md-6">
          <label htmlFor="q" className="form-label">Buscar</label>
          <input
            id="q"
            type="search"
            className="form-control"
            placeholder="Ej: manzana..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-6 col-md-3">
          <label htmlFor="cat" className="form-label">Categoria</label>
          <select
            id="cat"
            className="form-select"
            value={categoria}
            onChange={(e) => handleCategoria(e.target.value)}
          >
            <option value="">Todas</option>
            {Object.values(CATEGORIAS).map((c) => (
              <option key={c.prefix} value={c.label}>{c.label}</option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md-3">
          <label htmlFor="ord" className="form-label">Ordenar</label>
          <select id="ord" className="form-select" value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option value="">Relevancia</option>
            <option value="precio_asc">Precio: menor a mayor</option>
            <option value="precio_desc">Precio: mayor a menor</option>
            <option value="nombre_asc">Nombre A-Z</option>
            <option value="nombre_desc">Nombre Z-A</option>
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
