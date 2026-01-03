// Fondo de relámpagos inspirado en ReactBits.
import React from 'react';

function LightningBackground({ className }) {
  return (
    <div className={`lightning-background ${className ?? ''}`.trim()} aria-hidden="true">
      <span className="lightning-bolt bolt-1" />
      <span className="lightning-bolt bolt-2" />
      <span className="lightning-bolt bolt-3" />
      <span className="lightning-bolt bolt-4" />
    </div>
  );
}

export default LightningBackground;
