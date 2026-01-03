// Fondo con efecto dither inspirado en ReactBits.
import React from 'react';

function DitherBackground({ className }) {
  return <div className={`dither-background ${className ?? ''}`.trim()} aria-hidden="true" />;
}

export default DitherBackground;
