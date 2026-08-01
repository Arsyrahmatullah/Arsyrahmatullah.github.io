import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      document.body.classList.add('custom-cursor-active');
    }

    const cursor = cursorRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetX = mouseX;
    let targetY = mouseY;

    interface Sparkle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      decay: number;
      color: string;
      size: number;
      starShape?: boolean;
    }

    const sparkles: Sparkle[] = [];
    const colors = ['#dfab54', '#ffffff', '#8ba58f', '#dfa054', '#faf8f5'];

    const spawnSparklesAt = (x: number, y: number, count = 2) => {
      for (let i = 0; i < count; i++) {
        sparkles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 2.2,
          vy: (Math.random() - 0.5) * 2.2 - 0.3,
          alpha: 1,
          decay: Math.random() * 0.035 + 0.015,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 3.5 + 1.5,
          starShape: Math.random() > 0.4,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      spawnSparklesAt(e.clientX, e.clientY, 2);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        targetX = touch.clientX;
        targetY = touch.clientY;
        spawnSparklesAt(touch.clientX, touch.clientY, 3);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let animId: number;
    const loop = () => {
      animId = requestAnimationFrame(loop);

      if (cursor) {
        mouseX += (targetX - mouseX) * 0.25;
        mouseY += (targetY - mouseY) * 0.25;
        cursor.style.transform = `translate3d(${mouseX - 12}px, ${mouseY - 12}px, 0)`;
      }

      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparkles.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = s.alpha;
          ctx.fillStyle = s.color;

          if (s.starShape) {
            // Draw 4-point sparkle star
            const r = s.size * 1.8;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y - r);
            ctx.quadraticCurveTo(s.x, s.y, s.x + r, s.y);
            ctx.quadraticCurveTo(s.x, s.y, s.x, s.y + r);
            ctx.quadraticCurveTo(s.x, s.y, s.x - r, s.y);
            ctx.quadraticCurveTo(s.x, s.y, s.x, s.y - r);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }
    };

    animId = requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-50 pointer-events-none"
      />
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-6 h-6 rounded-full border border-[#dfab54]/60 bg-[#dfab54]/10 pointer-events-none z-50 hidden lg:flex items-center justify-center mix-blend-screen transition-transform duration-75"
      >
        <span className="text-[7px] text-[#dfab54] font-mono">+</span>
      </div>
    </>
  );
}
