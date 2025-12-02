// Cabecera reutilizable para páginas internas.
import React from 'react';

function PageHeader({ titulo, bajada }) {
  return (
    <header className="bg-white border-bottom mb-4">
      <div className="py-3">
        <h1 className="h3 text-success fw-bold mb-0">{titulo}</h1>
        {bajada && <p className="text-muted mb-0">{bajada}</p>}
      </div>
    </header>
  );
}

export default PageHeader;
