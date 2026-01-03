// Fondo de beams inspirado en ReactBits.
import React from 'react';

function BeamsBackground({ className }) {
  return (
    <div className={`beams-background ${className ?? ''}`.trim()} aria-hidden="true">
      <span className="beam beam-1" />
      <span className="beam beam-2" />
      <span className="beam beam-3" />
      <span className="beam beam-4" />
    </div>
  );
}

export default BeamsBackground;
