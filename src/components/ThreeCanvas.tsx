import { useEffect, useRef, MutableRefObject } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  scrollProgressRef: MutableRefObject<number>;
}

export default function ThreeCanvas({ scrollProgressRef }: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.0035);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 150);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x050505, 1);
    container.appendChild(renderer.domElement);

    // 2. 3D Particle Starfield (Gold, Sage, Blush, Cream)
    const particleCount = 2200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPalette = [
      new THREE.Color('#dfab54'), // Sediment Gold
      new THREE.Color('#8ba58f'), // Sage Mineral Green
      new THREE.Color('#cca797'), // Organic Clay Blush
      new THREE.Color('#faf8f5'), // Cream
    ];

    for (let i = 0; i < particleCount; i++) {
      // Spread across 3D space
      positions[i * 3] = (Math.random() - 0.5) * 220;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 800 - 100; // Z depth range

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = Math.random() * 2.2 + 0.8;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom circular particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.4, 'rgba(255,255,255,0.6)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);

    const pMaterial = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const starParticles = new THREE.Points(geometry, pMaterial);
    scene.add(starParticles);

    // 3. 3D Waveform Strata Grid in Background
    const planeGeo = new THREE.PlaneGeometry(300, 400, 40, 60);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x8ba58f,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const strataMesh = new THREE.Mesh(planeGeo, planeMat);
    strataMesh.rotation.x = -Math.PI / 2.2;
    strataMesh.position.set(0, -40, -100);
    scene.add(strataMesh);

    // 4. Subtle Mouse Movement Target
    let targetMouseX = 0;
    let targetMouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 5. Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 6. Smoothed Animation Loop (Per-frame lerp to avoid jerkiness)
    let smoothedProgress = 0;
    let animationFrameId: number;

    const originalPos = planeGeo.attributes.position.array as Float32Array;
    const posAttr = planeGeo.attributes.position;

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth scroll progress interpolation
      const rawTarget = scrollProgressRef.current;
      smoothedProgress += (rawTarget - smoothedProgress) * 0.07; // Smooth factor

      // Depth crossfade color targets
      // Core (0.00-0.15), Mantle (0.15-0.35), Crust (0.35-0.80), Orbit (0.80-1.00)
      const p = smoothedProgress;
      const cCore = new THREE.Color('#070404');
      const cMantle = new THREE.Color('#080603');
      const cCrust = new THREE.Color('#040706');
      const cOrbit = new THREE.Color('#030306');

      const wCore = new THREE.Color('#dfab54');
      const wMantle = new THREE.Color('#dfa054');
      const wCrust = new THREE.Color('#8ba58f');
      const wOrbit = new THREE.Color('#a0b5d0');

      let targetBg = cCore;
      let targetWire = wCore;

      if (p <= 0.15) {
        const factor = p / 0.15;
        targetBg = cCore.clone().lerp(cMantle, factor);
        targetWire = wCore.clone().lerp(wMantle, factor);
      } else if (p <= 0.35) {
        const factor = (p - 0.15) / 0.20;
        targetBg = cMantle.clone().lerp(cCrust, factor);
        targetWire = wMantle.clone().lerp(wCrust, factor);
      } else if (p <= 0.80) {
        const factor = (p - 0.35) / 0.45;
        targetBg = cCrust.clone().lerp(cOrbit, factor);
        targetWire = wCrust.clone().lerp(wOrbit, factor);
      } else {
        targetBg = cOrbit;
        targetWire = wOrbit;
      }

      renderer.setClearColor(targetBg, 1);
      scene.fog.color.copy(targetBg);
      planeMat.color.copy(targetWire);

      // Camera Z motion: flies from +150 down through -450 as user scrolls flight sequence
      const targetCamZ = 150 - smoothedProgress * 600;
      camera.position.z += (targetCamZ - camera.position.z) * 0.1;

      // Mouse parallax
      camera.position.x += (targetMouseX * 12 - camera.position.x) * 0.05;
      camera.position.y += (-targetMouseY * 8 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, camera.position.z - 100);

      // Rotate particle cloud gently
      starParticles.rotation.z = time * 0.00008;
      starParticles.rotation.y = time * 0.00005;

      // Dynamic seismic wave deformation on strata wireframe
      const t = time * 0.0015;
      for (let i = 0; i < posAttr.count; i++) {
        const x = originalPos[i * 3];
        const y = originalPos[i * 3 + 1];
        // Wave deformation
        const zWave =
          Math.sin(x * 0.05 + t) * 3 +
          Math.cos(y * 0.04 - t * 0.8) * 2.5 +
          Math.sin(smoothedProgress * 10 + x * 0.02) * 4;
        posAttr.setZ(i, zWave);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      pMaterial.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      renderer.dispose();
    };
  }, [scrollProgressRef]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
}
