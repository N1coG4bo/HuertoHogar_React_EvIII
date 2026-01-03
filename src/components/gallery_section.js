// Galería sincronizada con Vercel Blob + Edge Config.
import React, { useEffect, useState } from 'react';
import { galleryService } from '../services/galleryService';
import { AuthContext } from '../context/AuthContext';

function GallerySection() {
  const { user, isAdmin } = React.useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const loadGallery = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await galleryService.list();
      setItems(data.items || []);
    } catch (err) {
      setError(err?.response?.data?.error || 'No pudimos cargar la galería.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      await galleryService.upload(file);
      setFile(null);
      await loadGallery();
    } catch (err) {
      setError(err?.response?.data?.error || 'No pudimos subir la imagen.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="gallery-section my-5">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h2 className="gallery-title mb-1">Galería de la red</h2>
          <p className="gallery-subtitle">Fotos compartidas entre la app móvil y la web.</p>
        </div>
        {isAdmin && (
          <form className="gallery-upload" onSubmit={handleUpload}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={uploading}
            />
            <button className="btn btn-success btn-sm" type="submit" disabled={!file || uploading}>
              {uploading ? 'Subiendo...' : 'Subir foto'}
            </button>
          </form>
        )}
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="alert alert-info">Cargando galería...</div>
      ) : items.length === 0 ? (
        <div className="alert alert-light border">Aún no hay fotos en la galería.</div>
      ) : (
        <div className="gallery-grid">
          {items.map((item) => (
            <figure className="gallery-card" key={item.id || item.url}>
              <img src={item.url} alt={item.title || 'Foto de galería'} loading="lazy" />
            </figure>
          ))}
        </div>
      )}
      {!user && <div className="alert alert-warning mt-3">Inicia sesión para subir fotos.</div>}
    </section>
  );
}

export default GallerySection;
