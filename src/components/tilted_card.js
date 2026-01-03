// Tilted card wrapper inspired by ReactBits.
import React, { useRef } from 'react';

function TiltedCard({ children, className = '', maxTilt = 10 }) {
  const ref = useRef(null);

  const handleMove = (event) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const tiltX = ((y / rect.height) * 2 - 1) * -maxTilt;
    const tiltY = ((x / rect.width) * 2 - 1) * maxTilt;
    node.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    node.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
  };

  const handleLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty('--tilt-x', '0deg');
    node.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <div
      ref={ref}
      className={`tilted-card ${className}`.trim()}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="tilted-card__inner">
        {children}
      </div>
    </div>
  );
}

export default TiltedCard;
