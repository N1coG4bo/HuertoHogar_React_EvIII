// Cabecera reutilizable para páginas internas.
import React from 'react';
import BeamsBackground from './BeamsBackground';

function PageHeader({ titulo, bajada, actions, eyebrow, className }) {
  return (
    <header className={`page-header-beams ${className ?? ''}`.trim()}>
      <BeamsBackground />
      <div className="page-header-beams__content">
        {eyebrow && <div className="page-header-eyebrow">{eyebrow}</div>}
        <div className="page-header-row">
          <div>
            <h1 className="page-header-title">{titulo}</h1>
            {/* Muestra la bajada solo si se provee, para subtitulos opcionales */}
            {bajada && <p className="page-header-subtitle">{bajada}</p>}
          </div>
          {actions && <div className="page-header-actions">{actions}</div>}
        </div>
      </div>
    </header>
  );
}

export default PageHeader;
