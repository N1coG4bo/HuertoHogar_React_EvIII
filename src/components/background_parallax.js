// Fondo global con parallax para toda la app.
import { useEffect, useRef } from 'react';
import SimpleParallax from 'simple-parallax-js/vanilla';

function BackgroundParallax({ src = '/bg-network.png' }) {
  const imgRef = useRef(null);
  const parallaxRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return undefined;

    const init = () => {
      if (parallaxRef.current) parallaxRef.current.destroy();
      parallaxRef.current = new SimpleParallax(img, {
        scale: 1.35,
        overflow: true,
        delay: 0.2,
        orientation: 'down',
      });
    };

    if (img.complete) {
      init();
    } else {
      img.addEventListener('load', init);
    }

    return () => {
      img.removeEventListener('load', init);
      if (parallaxRef.current) parallaxRef.current.destroy();
    };
  }, [src]);

  return (
    <div className="global-parallax">
      <img ref={imgRef} src={src} alt="" />
    </div>
  );
}

export default BackgroundParallax;
