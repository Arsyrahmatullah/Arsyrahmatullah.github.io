import { useState } from 'react';

interface NavigationProps {
  onNavClick: (targetId: string) => void;
}

export default function Navigation({ onNavClick }: NavigationProps) {
  const [audioActive, setAudioActive] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [oscNode, setOscNode] = useState<OscillatorNode | null>(null);

  const toggleAudio = () => {
    if (!audioActive) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(45, ctx.currentTime); // Deep 45Hz Earth drone
      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      setAudioCtx(ctx);
      setOscNode(osc);
      setAudioActive(true);
    } else {
      if (oscNode) {
        oscNode.stop();
        oscNode.disconnect();
      }
      if (audioCtx) {
        audioCtx.close();
      }
      setOscNode(null);
      setAudioCtx(null);
      setAudioActive(false);
    }
  };

  return (
    <>
      {/* Top Header */}
      <nav className="fixed top-0 left-0 z-40 w-full px-6 md:px-12 py-6 flex items-center justify-between text-xs tracking-widest uppercase pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2">
          <span className="font-sans font-bold text-xl sm:text-2xl tracking-tight text-white">
            ARSY.
          </span>
        </div>

        <div className="pointer-events-auto">
          <button
            onClick={toggleAudio}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#050505]/80 hover:bg-white hover:text-[#050505] text-white/70 transition-all text-[9px] font-mono font-bold tracking-[0.2em] uppercase cursor-pointer backdrop-blur-md"
          >
            <span>{audioActive ? '🔊' : '🔈'}</span>
            <span className="hidden sm:inline">Sound:</span>
            <span
              className={audioActive ? 'text-[#dfab54] font-bold' : 'text-white/40 font-bold'}
            >
              {audioActive ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </nav>

      {/* Bottom Floating Nav Bar */}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-40 flex items-center gap-1 p-1.5 rounded-full bg-[#050505]/90 backdrop-blur-xl shadow-2xl">
        <button
          onClick={() => onNavClick('flight-spacer')}
          className="px-4 md:px-5 py-2 rounded-full text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-white hover:bg-white hover:text-[#050505] transition-all cursor-pointer"
        >
          Profile
        </button>
        <button
          onClick={() => onNavClick('playground-section')}
          className="px-4 md:px-5 py-2 rounded-full text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-white/60 hover:bg-white hover:text-[#050505] transition-all cursor-pointer"
        >
          Projects
        </button>
        <button
          onClick={() => onNavClick('contact-section')}
          className="px-4 md:px-5 py-2 rounded-full text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-white/60 hover:bg-white hover:text-[#050505] transition-all cursor-pointer"
        >
          Contact
        </button>
      </div>
    </>
  );
}
