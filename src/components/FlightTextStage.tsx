import { useEffect, useRef, useState, MutableRefObject } from 'react';
import ResearchInterestsTicker from './ResearchInterestsTicker';

interface FlightTextStageProps {
  scrollProgressRef: MutableRefObject<number>;
  onDescendClick: () => void;
}

export default function FlightTextStage({
  scrollProgressRef,
  onDescendClick,
}: FlightTextStageProps) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const [smoothedProgress, setSmoothedProgress] = useState(0);

  useEffect(() => {
    let animId: number;

    const handleScroll = () => {
      if (!spacerRef.current) return;
      const rect = spacerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const scrollable = spacerRef.current.offsetHeight - viewportHeight;
      if (scrollable <= 0) return;
      const rawP = Math.min(1, Math.max(0, -rect.top / scrollable));
      scrollProgressRef.current = rawP;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    let curP = 0;
    const loop = () => {
      animId = requestAnimationFrame(loop);
      const targetP = scrollProgressRef.current;
      // High-precision smooth lerp for continuous mobile and desktop flight
      curP += (targetP - curP) * 0.1;
      setSmoothedProgress(curP);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, [scrollProgressRef]);

  // Continuous, fluid spatial transform calculation
  const getLayerStyle = (
    start: number,
    end: number,
    align: 'center' | 'left' | 'right' = 'center'
  ) => {
    const p = smoothedProgress;

    // Special handling for Act 0 when at top of page (p = 0)
    if (start === 0 && p <= 0) {
      return {
        opacity: 1,
        transform: 'perspective(1000px) translate3d(0, 0, 0) scale(0.9)',
        pointerEvents: 'auto' as const,
        visibility: 'visible' as const,
        willChange: 'transform, opacity',
      };
    }

    if (p < start || p > end) {
      return {
        opacity: 0,
        transform: 'perspective(1000px) translate3d(0, 0, -800px) scale(0.2)',
        pointerEvents: 'none' as const,
        visibility: 'hidden' as const,
        willChange: 'transform, opacity',
      };
    }

    // Normalized progress t inside [0, 1] for this layer
    const t = (p - start) / (end - start);

    // Act 0 fades out smoothly as scroll begins
    let opacity: number;
    let translateZ: number;
    let translateY: number;
    let scale: number;

    if (start === 0) {
      opacity = Math.max(0, 1 - Math.pow(t, 1.2));
      translateZ = t * 450;
      translateY = -t * 80;
      scale = 0.9 + t * 0.7;
    } else {
      // Smooth bell curve for entrance -> focal -> exit
      opacity = Math.pow(Math.sin(t * Math.PI), 0.75);
      translateZ = -600 + t * 950;
      translateY = 30 - t * 60;
      scale = 0.45 + t * 0.95;
    }

    // Horizontal offset for dynamic position shifting
    let focalOffsetX = 0;
    if (align === 'left') focalOffsetX = -28;
    if (align === 'right') focalOffsetX = 28;

    let translateX = focalOffsetX;
    if (start !== 0) {
      if (align === 'left') translateX = focalOffsetX - (t - 0.5) * 50;
      if (align === 'right') translateX = focalOffsetX + (t - 0.5) * 50;
    }

    return {
      opacity,
      transform: `perspective(1000px) translate3d(${translateX}px, ${translateY}px, ${translateZ}px) scale(${scale})`,
      pointerEvents: opacity > 0.35 ? ('auto' as const) : ('none' as const),
      visibility: opacity > 0.01 ? ('visible' as const) : ('hidden' as const),
      willChange: 'transform, opacity',
    };
  };

  return (
    <div id="flight-spacer" ref={spacerRef} className="relative h-[1600vh] touch-pan-y">
      {/* Sticky viewport frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center z-10 px-4 sm:px-8 md:px-12">
        
        {/* ACT 0: TITLE & NAME (STARTING SIGN INCLUDED) */}
        <div
          className="absolute max-w-3xl w-full text-center space-y-6 transition-all duration-75 ease-out select-none"
          style={getLayerStyle(0.0, 0.12, 'center')}
        >
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs text-white/70 tracking-[0.25em] uppercase font-mono px-4 py-1.5 rounded-full">
            <span>Geophysics & Subsurface Physics</span>
          </div>

          <h1 className="hero-title font-sans font-extrabold tracking-tighter leading-none text-white uppercase drop-shadow-md">
            Arsy Nuur <br />
            <span className="font-serif italic font-light text-[#dfab54] normal-case">
              Rahmatullah.
            </span>
          </h1>

          <p className="text-white/80 text-sm sm:text-base md:text-lg font-light tracking-wide max-w-xl mx-auto leading-relaxed drop-shadow">
            Geophysical Engineer specializing in carbon storage monitoring, borehole seismology, and subsurface imaging.
          </p>

          {/* START GUIDE SIGN */}
          <div className="pt-8 flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase transition-all animate-pulse shadow-lg">
              <span>SCROLL TO EXPLORE</span>
              <span className="text-[#dfab54]">//</span>
              <span>SWIPE DOWN</span>
            </div>
            <span className="animate-bounce text-[#dfab54] text-xl">↓</span>
          </div>
        </div>

        {/* ACT 1: RESEARCH INTERESTS */}
        <div
          className="absolute w-full max-w-4xl text-center space-y-6 transition-all duration-75 ease-out"
          style={getLayerStyle(0.10, 0.22, 'right')}
        >
          <div className="space-y-2">
            <span className="text-xs text-[#dfab54] tracking-[0.3em] uppercase font-bold font-mono">
              Core Focus
            </span>
            <h2 className="section-title font-serif italic text-white font-light leading-none">
              Research{' '}
              <span className="font-sans font-bold uppercase tracking-tighter normal-case text-white/90 block sm:inline">
                Interests.
              </span>
            </h2>
            <p className="text-white/70 text-xs sm:text-sm font-light max-w-lg mx-auto">
              Primary areas of investigation in subsurface monitoring and energy transition.
            </p>
          </div>

          <ResearchInterestsTicker />
        </div>

        {/* ACT 2: PROFILE & 3:4 PORTRAIT PHOTO */}
        <div
          className="absolute max-w-4xl w-full transition-all duration-75 ease-out px-4 text-left"
          style={getLayerStyle(0.20, 0.32, 'left')}
        >
          <div className="space-y-6">
            <span className="text-xs text-[#dfab54] tracking-[0.3em] uppercase font-bold font-mono">
              About & Mission
            </span>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Detailed 3:4 Aspect Ratio Photo Frame */}
              <div className="relative aspect-[3/4] w-36 sm:w-44 md:w-52 rounded-2xl overflow-hidden shrink-0 shadow-2xl bg-neutral-900 group">
                <img
                  src="/profile.jpg"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80';
                  }}
                  alt="Arsy Nuur Rahmatullah"
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                />
              </div>

              <div className="space-y-4 text-white/80 text-xs sm:text-sm md:text-base font-light leading-relaxed">
                <h3 className="text-xl sm:text-2xl font-serif italic text-white leading-snug">
                  Ensuring underground CO₂ storage remains securely sequestered over geological time.
                </h3>
                <p>
                  I am a Geophysical Engineering graduate from{' '}
                  <span className="text-white font-semibold">
                    Bandung Institute of Technology (ITB)
                  </span>
                  . My work focuses on subsurface time-lapse seismic monitoring, processing strain rate measurements from Distributed Acoustic Sensing (DAS) fiber optic arrays to track carbon dioxide plumes in real-time.
                </p>

                {/* Skill Badges */}
                <div className="flex flex-wrap gap-2 pt-2 text-[10px] font-mono tracking-wider uppercase text-white/70">
                  {['Python', 'MATLAB', 'Petrel', 'NORSAR 3D', 'Kirchhoff Depth Migration', 'DAS Fiber Optics'].map((skill, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/10 text-white font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACT 3: EDUCATION & HONORS */}
        <div
          className="absolute max-w-3xl w-full transition-all duration-75 ease-out px-4 text-left"
          style={getLayerStyle(0.30, 0.42, 'right')}
        >
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs text-[#dfab54] tracking-[0.3em] uppercase font-bold font-mono">
                Education
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif italic text-white">
                Institut Teknologi Bandung (ITB)
              </h2>
            </div>

            <div className="space-y-4 pl-2 py-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-lg font-bold text-white font-sans">
                  B.Sc. Geophysical Engineering
                </span>
                <span className="text-xs font-mono text-[#dfab54] uppercase tracking-widest font-bold">
                  Class of 2024
                </span>
              </div>

              <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed">
                Awarded the <span className="text-white font-semibold">ITB Ganesha Karsa Award</span> for exceptional student leadership, community service impact, and outstanding contributions to the university community.
              </p>
            </div>
          </div>
        </div>

        {/* ACT 4: UNDERGRADUATE THESIS */}
        <div
          className="absolute max-w-3xl w-full transition-all duration-75 ease-out px-4 text-left"
          style={getLayerStyle(0.40, 0.52, 'left')}
        >
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs text-[#dfab54] tracking-[0.3em] uppercase font-bold font-mono">
                Undergraduate Thesis
              </span>
              <h2 className="text-xl sm:text-2xl font-serif italic text-white leading-tight">
                Time-Lapse VSP-DAS Seismic Monitoring Simulation
              </h2>
            </div>

            <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed">
              Synthesized fiber optic strain measurements in vertical seismic profiling (VSP) geometry to model velocity anomalies induced by subsurface CO₂ injection. Implemented Kirchhoff depth migration algorithms to accurately image plume boundary evolution.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs font-mono">
              <div>
                <span className="text-white/40 text-[10px] uppercase block">Modeling Tools</span>
                <span className="text-white font-bold">NORSAR 3D & Petrel</span>
              </div>
              <div>
                <span className="text-white/40 text-[10px] uppercase block">Code Implementation</span>
                <span className="text-[#dfab54] font-bold">Python & MATLAB</span>
              </div>
            </div>
          </div>
        </div>

        {/* ACT 5: LEADERSHIP & ACTIVITIES - HMTG ITB */}
        <div
          className="absolute max-w-3xl w-full transition-all duration-75 ease-out px-4 text-left"
          style={getLayerStyle(0.50, 0.62, 'right')}
        >
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs text-[#dfab54] tracking-[0.3em] uppercase font-bold font-mono">
                Leadership & Activities
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h2 className="text-xl sm:text-2xl font-serif italic text-white">
                  Geophysical Engineering Student Association (HIMA TG TERRA ITB)
                </h2>
                <span className="text-xs font-mono text-[#dfab54] uppercase tracking-widest font-bold">
                  Head of Community Service Division
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-white/50 font-mono pt-1">
                <span>Bandung</span>
                <span>Jan 2023 – Mar 2024</span>
              </div>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-white/80 font-light leading-relaxed list-disc list-inside">
              <li>
                Directed divisional operations, leading cross-functional engineering student teams to successfully design and execute regional geological hazard mitigation and social outreach programs.
              </li>
              <li>
                Coordinated multi-stakeholder collaboration with local authorities to conduct landslide and earthquake risk communication seminars.
              </li>
            </ul>
          </div>
        </div>

        {/* ACT 6: LEADERSHIP & ACTIVITIES - KKN ITB 2023 & IUGC */}
        <div
          className="absolute max-w-3xl w-full transition-all duration-75 ease-out px-4 text-left"
          style={getLayerStyle(0.60, 0.72, 'left')}
        >
          <div className="space-y-6">
            <span className="text-xs text-[#dfab54] tracking-[0.3em] uppercase font-bold font-mono">
              Leadership & Activities
            </span>

            <div className="space-y-6 text-xs sm:text-sm">
              {/* KKN ITB 2023 */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-white font-bold text-base">ITB Student Community Service (KKN ITB 2023)</span>
                  <span className="text-[#dfab54] text-xs font-mono font-bold">Vice Head of Media Division & Group Mentor</span>
                </div>
                <div className="text-[11px] font-mono text-white/50">Bandung • Feb 2023 – Dec 2023</div>
                <ul className="space-y-1.5 text-white/70 font-light leading-relaxed list-disc list-inside pt-1">
                  <li>
                    Managed comprehensive communication workflows, public relations content, and media strategy to promote rural development achievements.
                  </li>
                  <li>
                    Served as field mentor, driving conflict resolution and logistics management for diverse on-the-ground volunteer groups.
                  </li>
                </ul>
              </div>

              {/* IUGC */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-white font-bold text-base">International Undergraduate Geophysics Competition (IUGC)</span>
                  <span className="text-[#dfab54] text-xs font-mono font-bold">Head Social Media Manager</span>
                </div>
                <div className="text-[11px] font-mono text-white/50">Bandung • Jan 2022 – Feb 2023</div>
                <ul className="space-y-1.5 text-white/70 font-light leading-relaxed list-disc list-inside pt-1">
                  <li>
                    Spearheaded global marketing and digital promotion campaigns, utilizing web analytics to maximize registration metrics and international outreach.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ACT 7: INDUSTRY CERTIFICATIONS */}
        <div
          className="absolute max-w-3xl w-full transition-all duration-75 ease-out px-4 text-left"
          style={getLayerStyle(0.72, 0.85, 'right')}
        >
          <div className="space-y-6">
            <span className="text-xs text-[#dfab54] tracking-[0.3em] uppercase font-bold font-mono">
              Industry Certifications
            </span>

            <div className="space-y-5 text-xs sm:text-sm">
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-white font-bold text-sm sm:text-base">SEG DISC (2024)</span>
                  <span className="text-[#dfab54] text-xs font-mono">ITB & NTNU</span>
                </div>
                <p className="text-white/70 font-light leading-relaxed">
                  Storage of Carbon Dioxide in Saline Aquifers – Building Confidence by Forecasting and Monitoring (ITB & Norwegian University of Science and Technology).
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-white font-bold text-sm sm:text-base">Carbon Management Certification (2024)</span>
                  <span className="text-[#dfab54] text-xs font-mono">ITB</span>
                </div>
                <p className="text-white/70 font-light leading-relaxed">
                  Carbon Management and Understanding Through Digital Tools (ITB).
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-white font-bold text-sm sm:text-base">Decarbonizing Industry (2024)</span>
                  <span className="text-[#dfab54] text-xs font-mono">ITB</span>
                </div>
                <p className="text-white/70 font-light leading-relaxed">
                  Integrating Surface Facilities to Support Carbon Capture Utilization and Storage (ITB).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ACT 8: ARCHIVE OVERVIEW */}
        <div
          className="absolute max-w-2xl w-full text-center space-y-6 transition-all duration-75 ease-out"
          style={getLayerStyle(0.85, 1.00, 'center')}
        >
          <span className="text-xs text-[#dfab54] tracking-[0.3em] uppercase font-bold font-mono">
            Projects & Code
          </span>

          <h2 className="section-title font-serif italic text-white font-light leading-none">
            Codebase{' '}
            <span className="font-sans font-bold uppercase text-white/90 block">
              Archive.
            </span>
          </h2>

          <p className="text-white/70 text-sm sm:text-base font-light max-w-md mx-auto">
            Explore computational geophysics software, wave propagation solvers, and carbon storage screening toolkits.
          </p>

          <button
            onClick={onDescendClick}
            className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-black hover:bg-[#dfab54] hover:text-black transition-all duration-300 mx-auto font-mono text-xs font-bold uppercase tracking-[0.2em] shadow-2xl cursor-pointer"
          >
            <span>View GitHub Projects</span>
            <span className="group-hover:translate-y-1 transition-transform">↓</span>
          </button>
        </div>

      </div>
    </div>
  );
}
