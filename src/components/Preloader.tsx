import { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Disable scroll while preloader is active
    document.body.style.overflow = 'hidden';

    const milestones = [0, 18, 35, 54, 72, 89, 100];
    let mIdx = 0;
    let currentVal = 0;

    const interval = setInterval(() => {
      const floor = milestones[mIdx];
      const ceilingNext = milestones[mIdx + 1] ?? 100;
      const roll = Math.random();

      // Fluctuation logic: 15% chance of minor seismic dip if above floor+3
      if (roll < 0.15 && currentVal > floor + 3) {
        currentVal -= Math.floor(Math.random() * 4) + 1;
      } else {
        currentVal += Math.floor(Math.random() * 6) + 2;
      }

      if (currentVal >= ceilingNext) {
        currentVal = ceilingNext;
        if (mIdx < milestones.length - 1) mIdx++;
      }

      currentVal = Math.max(floor, Math.min(100, currentVal));
      setProgress(currentVal);

      if (currentVal >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFinished(true);
          document.body.style.overflow = '';
          setTimeout(onComplete, 800);
        }, 300);
      }
    }, 55);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-[#050505] text-[#f0f0f0] z-[9999] flex flex-col items-center justify-between overflow-hidden select-none transition-all duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] ${
        isFinished ? '-translate-y-full opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[120px]"></div>
      </div>

      {/* Header Info */}
      <header className="w-full flex justify-between p-8 sm:p-12 z-10 font-mono">
        <div className="flex flex-col gap-1 text-left">
          <span className="text-[10px] tracking-[0.3em] text-white/30 uppercase font-bold">
            Portfolio
          </span>
          <span className="text-xs tracking-widest text-white/70 font-sans font-bold">
            Arsy Nuur Rahmatullah
          </span>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <span className="text-[10px] tracking-[0.3em] text-white/30 uppercase font-bold">
            Location
          </span>
          <span className="text-xs tracking-widest text-white/70">
            Bandung, Indonesia
          </span>
        </div>
      </header>

      {/* Main Massive Loading Number */}
      <main className="flex-1 flex items-center justify-center z-10 w-full relative">
        <div className="relative flex flex-col items-center">
          <div className="text-[140px] sm:text-[220px] md:text-[300px] lg:text-[380px] font-bold leading-none tracking-tighter text-white opacity-95 flex items-baseline justify-center font-sans">
            <span>{String(progress).padStart(2, '0')}</span>
          </div>

          <div className="absolute -bottom-8 sm:-bottom-12 flex gap-4 sm:gap-8 items-center">
            <div className="w-8 sm:w-12 h-[1px] bg-white/20"></div>
            <span className="text-[9px] sm:text-[11px] tracking-[0.8em] sm:tracking-[1em] text-white/40 uppercase font-medium font-mono whitespace-nowrap">
              Loading Sequence
            </span>
            <div className="w-8 sm:w-12 h-[1px] bg-white/20"></div>
          </div>
        </div>
      </main>

      {/* Footer Ticker */}
      <footer className="w-full z-10">
        <div className="w-full bg-[#050505] py-6 sm:py-8 overflow-hidden whitespace-nowrap">
          <div className="animate-marquee flex gap-8 text-[11px] sm:text-[13px] tracking-[0.25em] text-white/50 font-light uppercase px-12 font-mono">
            <span>COMPUTATIONAL GEOPHYSICS</span>
            <span className="text-white/10">/</span>
            <span>TIME-LAPSE SEISMOLOGY</span>
            <span className="text-white/10">/</span>
            <span>DAS FIBER OPTICS</span>
            <span className="text-white/10">/</span>
            <span>CARBON STORAGE INTEGRITY</span>
            <span className="text-white/10">/</span>
            <span>NORSAR 3D RAYTRACING</span>
            <span className="text-white/10">/</span>
            <span>PETREL INVERSION</span>
            <span className="text-white/10">/</span>
            <span>COMPUTATIONAL GEOPHYSICS</span>
            <span className="text-white/10">/</span>
            <span>TIME-LAPSE SEISMOLOGY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

