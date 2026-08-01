import { useState, MouseEvent } from 'react';

const INTERESTS_PRIMARY = [
  "Carbon Capture & Storage (CCS)",
  "Borehole Seismology",
  "Time-Lapse Seismic Monitoring",
  "Distributed Acoustic Sensing (DAS)",
];

const INTERESTS_SECONDARY = [
  "Seismic Imaging & Kirchhoff Depth Migration",
  "Rock Physics & Fluid Substitution",
  "Subsurface Structural Inversion",
  "Machine Learning & Wave Solvers",
];

export default function ResearchInterestsTicker() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setRotate({ x, y });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.y}deg) rotateY(${rotate.x}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
      className="w-full overflow-hidden py-8 my-4 space-y-4 cursor-pointer select-none"
    >
      {/* Ribbon 1 - Moving Left */}
      <div className="animate-marquee flex whitespace-nowrap items-center text-sm sm:text-base md:text-lg font-mono tracking-[0.25em] uppercase text-white/90">
        {[...INTERESTS_PRIMARY, ...INTERESTS_PRIMARY, ...INTERESTS_PRIMARY].map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 px-6">
            <span className="text-white font-medium hover:text-[#dfab54] transition-colors">{item}</span>
            <span className="text-white/20 font-light">///</span>
          </div>
        ))}
      </div>

      {/* Ribbon 2 - Moving Right */}
      <div className="animate-marquee-reverse flex whitespace-nowrap items-center text-xs sm:text-sm md:text-base font-mono tracking-[0.2em] uppercase text-white/60">
        {[...INTERESTS_SECONDARY, ...INTERESTS_SECONDARY, ...INTERESTS_SECONDARY].map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 px-6">
            <span className="text-[#dfab54] font-medium hover:text-white transition-colors">{item}</span>
            <span className="text-white/20 font-light">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
