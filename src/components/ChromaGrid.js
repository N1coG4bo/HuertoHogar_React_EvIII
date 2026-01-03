// Componente ChromaGrid con efecto de iluminación al pasar el mouse
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * Tarjeta individual con efecto spotlight
 */
function ChromaCard({ item, radius, damping, fadeOut, ease }) {
  const cardRef = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const spotlight = spotlightRef.current;
    if (!card || !spotlight) return;

    let animationFrame;
    let isHovering = false;

    const handleMouseMove = (e) => {
      if (!isHovering) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Cancelar animación anterior
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }

      // Animar el spotlight suavemente
      animationFrame = requestAnimationFrame(() => {
        gsap.to(spotlight, {
          duration: damping,
          x: x,
          y: y,
          ease: ease,
          opacity: 1,
        });
      });
    };

    const handleMouseEnter = () => {
      isHovering = true;
      gsap.to(spotlight, {
        duration: 0.3,
        opacity: 1,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      isHovering = false;
      gsap.to(spotlight, {
        duration: fadeOut,
        opacity: 0,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [damping, fadeOut, ease]);

  return (
    <div className="chroma-card-wrapper">
      <div ref={cardRef} className="chroma-card">
        {/* Spotlight effect */}
        <div
          ref={spotlightRef}
          className="chroma-spotlight"
          style={{
            width: `${radius}px`,
            height: `${radius}px`,
          }}
        />
        
        {/* Content */}
        <div className="chroma-card-content">
          {item.image && (
            <div className="chroma-card-avatar">
              {item.image.startsWith('http') ? (
                <img src={item.image} alt={item.name} />
              ) : (
                <div className="chroma-card-initials">
                  {item.image}
                </div>
              )}
            </div>
          )}
          
          <div className="chroma-card-info">
            <h3 className="chroma-card-name">{item.name}</h3>
            {item.username && (
              <p className="chroma-card-username">@{item.username}</p>
            )}
            {item.role && (
              <p className="chroma-card-role">{item.role}</p>
            )}
            {item.email && (
              <p className="chroma-card-email">{item.email}</p>
            )}
            {item.rut && (
              <p className="chroma-card-rut">RUT: {item.rut}</p>
            )}
          </div>

          {item.actions && (
            <div className="chroma-card-actions">
              {item.actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Grid de tarjetas con efecto chroma
 */
export default function ChromaGrid({
  items = [],
  className = '',
  radius = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out',
}) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No hay elementos para mostrar</p>
      </div>
    );
  }

  return (
    <div className={`chroma-grid ${className}`}>
      {items.map((item, index) => (
        <ChromaCard
          key={item.id || item.email || index}
          item={item}
          radius={radius}
          damping={damping}
          fadeOut={fadeOut}
          ease={ease}
        />
      ))}
    </div>
  );
}
