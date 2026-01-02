// Texto animado estilo ASCII basado en el ejemplo de React Bits.
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float uEnableWaves;

void main() {
  vUv = uv;
  float time = uTime * 5.0;

  float waveFactor = uEnableWaves;

  vec3 transformed = position;
  transformed.x += sin(time + position.y) * 0.5 * waveFactor;
  transformed.y += cos(time + position.z) * 0.15 * waveFactor;
  transformed.z += sin(time + position.x) * waveFactor;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
  float time = uTime;
  vec2 pos = vUv;
  float r = texture2D(uTexture, pos + cos(time * 2.0 - time + pos.x) * 0.01).r;
  float g = texture2D(uTexture, pos + tan(time * 0.5 + pos.x - time) * 0.01).g;
  float b = texture2D(uTexture, pos - cos(time * 2.0 + time + pos.y) * 0.01).b;
  float a = texture2D(uTexture, pos).a;
  gl_FragColor = vec4(r, g, b, a);
}
`;

const mapRange = (n, start, stop, start2, stop2) =>
  ((n - start) / (stop - start)) * (stop2 - start2) + start2;

const PX_RATIO = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

class AsciiFilter {
  constructor(renderer, { fontSize, fontFamily, charset, invert } = {}) {
    this.renderer = renderer;
    this.domElement = document.createElement('div');
    this.domElement.style.position = 'absolute';
    this.domElement.style.top = '0';
    this.domElement.style.left = '0';
    this.domElement.style.width = '100%';
    this.domElement.style.height = '100%';

    this.pre = document.createElement('pre');
    this.domElement.appendChild(this.pre);

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.domElement.appendChild(this.canvas);

    this.deg = 0;
    this.invert = invert ?? true;
    this.fontSize = fontSize ?? 12;
    this.fontFamily = fontFamily ?? "'Courier New', monospace";
    this.charset =
      charset ??
      " .\\'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

    this.context.webkitImageSmoothingEnabled = false;
    this.context.mozImageSmoothingEnabled = false;
    this.context.msImageSmoothingEnabled = false;
    this.context.imageSmoothingEnabled = false;

    this.onMouseMove = this.onMouseMove.bind(this);
    document.addEventListener('mousemove', this.onMouseMove);
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
    this.reset();
    this.center = { x: width / 2, y: height / 2 };
    this.mouse = { x: this.center.x, y: this.center.y };
  }

  reset() {
    this.context.font = `${this.fontSize}px ${this.fontFamily}`;
    const charWidth = this.context.measureText('A').width;

    this.cols = Math.floor(this.width / (this.fontSize * (charWidth / this.fontSize)));
    this.rows = Math.floor(this.height / this.fontSize);

    this.canvas.width = this.cols;
    this.canvas.height = this.rows;
    this.pre.style.fontFamily = this.fontFamily;
    this.pre.style.fontSize = `${this.fontSize}px`;
    this.pre.style.margin = '0';
    this.pre.style.padding = '0';
    this.pre.style.lineHeight = '1em';
    this.pre.style.position = 'absolute';
    this.pre.style.left = '50%';
    this.pre.style.top = '50%';
    this.pre.style.transform = 'translate(-50%, -50%)';
    this.pre.style.zIndex = '9';
    this.pre.style.backgroundAttachment = 'fixed';
    this.pre.style.mixBlendMode = 'difference';
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.context.clearRect(0, 0, w, h);
    if (this.context && w && h) {
      this.context.drawImage(this.renderer.domElement, 0, 0, w, h);
    }
    this.asciify(this.context, w, h);
    this.hue();
  }

  onMouseMove(e) {
    this.mouse = { x: e.clientX * PX_RATIO, y: e.clientY * PX_RATIO };
  }

  get dx() {
    return this.mouse.x - this.center.x;
  }

  get dy() {
    return this.mouse.y - this.center.y;
  }

  hue() {
    const degrees = (Math.atan2(this.dy, this.dx) * 180) / Math.PI;
    this.deg += (degrees - this.deg) * 0.075;
    this.domElement.style.filter = `hue-rotate(${this.deg.toFixed(1)}deg)`;
  }

  asciify(context, width, height) {
    if (!width || !height) return;
    const data = context.getImageData(0, 0, width, height).data;
    let output = '';
    for (let row = 0; row < height; row += 1) {
      for (let col = 0; col < width; col += 1) {
        const idx = col * 4 + row * 4 * width;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];
        if (a === 0) {
          output += ' ';
          continue;
        }
        const brightness = (0.3 * r + 0.6 * g + 0.1 * b) / 255;
        let charIdx = Math.floor((1 - brightness) * (this.charset.length - 1));
        if (this.invert) charIdx = this.charset.length - charIdx - 1;
        output += this.charset[charIdx];
      }
      output += '\n';
    }
    this.pre.innerHTML = output;
  }

  dispose() {
    document.removeEventListener('mousemove', this.onMouseMove);
  }
}

class TextCanvas {
  constructor(text, { fontSize = 200, fontFamily = 'Arial', color = '#fdf9f3' } = {}) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.text = text;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.color = color;
    this.font = `600 ${this.fontSize}px ${this.fontFamily}`;
  }

  resize() {
    this.context.font = this.font;
    const metrics = this.context.measureText(this.text);
    const width = Math.ceil(metrics.width) + 20;
    const height = Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) + 20;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.color;
    this.context.font = this.font;
    const baseline = 10 + this.context.measureText(this.text).actualBoundingBoxAscent;
    this.context.fillText(this.text, 10, baseline);
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  get texture() {
    return this.canvas;
  }
}

class AsciiScene {
  constructor(
    { text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves },
    container,
    width,
    height
  ) {
    this.textString = text;
    this.asciiFontSize = asciiFontSize;
    this.textFontSize = textFontSize;
    this.textColor = textColor;
    this.planeBaseHeight = planeBaseHeight;
    this.container = container;
    this.width = width;
    this.height = height;
    this.enableWaves = enableWaves;

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
    this.camera.position.z = 30;
    this.scene = new THREE.Scene();
    this.mouse = { x: 0, y: 0 };
    this.onMouseMove = this.onMouseMove.bind(this);

    this.setMesh();
    this.setRenderer();
  }

  setMesh() {
    this.textCanvas = new TextCanvas(this.textString, {
      fontSize: this.textFontSize,
      fontFamily: 'IBM Plex Mono',
      color: this.textColor,
    });
    this.textCanvas.resize();
    this.textCanvas.render();

    this.texture = new THREE.CanvasTexture(this.textCanvas.texture);
    this.texture.minFilter = THREE.LinearFilter;

    const aspect = this.textCanvas.width / this.textCanvas.height;
    const baseHeight = this.planeBaseHeight;
    const width = baseHeight * aspect;
    const height = baseHeight;
    this.geometry = new THREE.PlaneGeometry(width, height, 36, 36);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: this.texture },
        uEnableWaves: { value: this.enableWaves ? 1 : 0 },
      },
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0, 0);

    this.filter = new AsciiFilter(this.renderer, {
      fontFamily: 'IBM Plex Mono',
      fontSize: this.asciiFontSize,
      invert: true,
    });
    this.container.appendChild(this.filter.domElement);
    this.setSize(this.width, this.height);
    this.container.addEventListener('mousemove', this.onMouseMove);
    this.container.addEventListener('touchmove', this.onMouseMove);
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.filter.setSize(width, height);
    this.center = { x: width / 2, y: height / 2 };
  }

  load() {
    this.animate();
  }

  onMouseMove(event) {
    const point = event.touches ? event.touches[0] : event;
    const rect = this.container.getBoundingClientRect();
    this.mouse = {
      x: point.clientX - rect.left,
      y: point.clientY - rect.top,
    };
  }

  animate() {
    const loop = () => {
      this.animationFrameId = requestAnimationFrame(loop);
      this.render();
    };
    loop();
  }

  render() {
    const time = new Date().getTime() * 0.001;
    this.textCanvas.render();
    this.texture.needsUpdate = true;
    this.mesh.material.uniforms.uTime.value = Math.sin(time);
    this.updateRotation();
    this.filter.render(this.scene, this.camera);
  }

  updateRotation() {
    const targetX = mapRange(this.mouse.y, 0, this.height, 0.5, -0.5);
    const targetY = mapRange(this.mouse.x, 0, this.width, -0.5, 0.5);
    this.mesh.rotation.x += (targetX - this.mesh.rotation.x) * 0.05;
    this.mesh.rotation.y += (targetY - this.mesh.rotation.y) * 0.05;
  }

  clear() {
    this.scene.traverse((child) => {
      if (child.isMesh && typeof child.material === 'object' && child.material !== null) {
        Object.keys(child.material).forEach((key) => {
          const value = child.material[key];
          if (value && typeof value.dispose === 'function') value.dispose();
        });
        child.material.dispose();
        child.geometry.dispose();
      }
    });
    this.scene.clear();
  }

  dispose() {
    cancelAnimationFrame(this.animationFrameId);
    this.filter.dispose();
    this.container.removeChild(this.filter.domElement);
    this.container.removeEventListener('mousemove', this.onMouseMove);
    this.container.removeEventListener('touchmove', this.onMouseMove);
    this.clear();
    this.renderer.dispose();
  }
}

function AsciiText({
  text = 'Red Privada',
  asciiFontSize = 8,
  textFontSize = 180,
  textColor = '#fdf9f3',
  planeBaseHeight = 8,
  enableWaves = true,
  className = '',
}) {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const init = () => {
      const { width, height } = node.getBoundingClientRect();
      if (width === 0 || height === 0) return false;
      instanceRef.current = new AsciiScene(
        { text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves },
        node,
        width,
        height
      );
      instanceRef.current.load();
      return true;
    };

    if (!init()) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.boundingClientRect.width > 0 && entry.boundingClientRect.height > 0) {
            init();
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(node);
      return () => {
        observer.disconnect();
        if (instanceRef.current) instanceRef.current.dispose();
      };
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry || !instanceRef.current) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        instanceRef.current.setSize(width, height);
      }
    });
    resizeObserver.observe(node);

    return () => {
      resizeObserver.disconnect();
      if (instanceRef.current) instanceRef.current.dispose();
    };
  }, [text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves]);

  return <div ref={containerRef} className={`ascii-text-container ${className}`.trim()} />;
}

export default AsciiText;
