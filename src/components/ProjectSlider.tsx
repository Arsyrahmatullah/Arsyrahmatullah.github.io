import { useEffect, useRef, useState, PointerEvent, WheelEvent } from 'react';
import { GithubRepo } from '../types';

const FALLBACK_REPOS: GithubRepo[] = [
  {
    title: 'CO2-Plume-Seismic-Monitoring',
    subtitle: 'Synthetic seismology modeling tools for CCS monitoring systems',
    description:
      'A computational geophysics toolkit built to simulate time-lapse VSP and DAS seismic arrays. Implements Kirchhoff depth migrations to track carbon dioxide injection plumes and de-risk subsurface storage facilities.',
    primaryLanguage: 'Python',
    stars: '5 ★',
    url: 'https://github.com/Arsyrahmatullah',
    systemClass: 'GitHub Repository',
    coverImg:
      'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Acoustic-Wave-Simulation',
    subtitle: 'Numerical solvers and ray-tracing models for layered geological media',
    description:
      'MATLAB and Python modules designed for acoustic and elastic wave propagation. Includes custom finite-difference code for wave equation solutions used in time-lapse seismology analysis.',
    primaryLanguage: 'MATLAB',
    stars: '4 ★',
    url: 'https://github.com/Arsyrahmatullah',
    systemClass: 'GitHub Repository',
    coverImg:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Subsurface-Fault-Mapping-Gravity',
    subtitle: 'Inversion routines for processing gravity and magnetic field vectors',
    description:
      'Computational tools for spatial density and gravity inversion. Delineates bedrock geometry, active fault paths, and detects deep groundwater aquifers under post-earthquake geological regimes.',
    primaryLanguage: 'Python',
    stars: '4 ★',
    url: 'https://github.com/Arsyrahmatullah',
    systemClass: 'GitHub Repository',
    coverImg:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Time-Lapse-VSP-DAS-Modeling',
    subtitle: 'Distributed Acoustic Sensing (DAS) synthetic seismogram generator',
    description:
      'High-resolution fiber optic strain simulation in vertical seismic profiling geometry. Converts strain rate measurements into synthetic time-lapse velocity anomalies.',
    primaryLanguage: 'Python',
    stars: '6 ★',
    url: 'https://github.com/Arsyrahmatullah',
    systemClass: 'GitHub Repository',
    coverImg:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  },
];

export default function ProjectSlider() {
  const [repos, setRepos] = useState<GithubRepo[]>(FALLBACK_REPOS);
  const [targetIndex, setTargetIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedRepo, setSelectedRepo] = useState<GithubRepo | null>(null);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const dragStartTargetRef = useRef(0);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const res = await fetch(
          'https://api.github.com/users/Arsyrahmatullah/repos?sort=updated&per_page=100'
        );
        if (!res.ok) return;
        const data = await res.json();
        const ignoredRepos = ['arsyrahmatullah', 'arsyrahmatullah.github.io'];
        const filtered = data.filter(
          (r: any) => !ignoredRepos.includes(r.name.toLowerCase())
        );
        if (filtered.length === 0) return;

        const mapped: GithubRepo[] = filtered.map((r: any, idx: number) => {
          const imgs = [
            'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
          ];
          return {
            title: r.name.replace(/[-_]+/g, ' '),
            subtitle: r.description || 'Computational Tooling & Spatial Modeling',
            description:
              r.description ||
              'Raw codebase containing algorithms, automation components, and computation scripts. Click to open and inspect source files.',
            primaryLanguage: r.language || 'Python',
            stars: `${r.stargazers_count} ★`,
            url: r.html_url,
            systemClass: 'GitHub Repository',
            coverImg: imgs[idx % imgs.length],
          };
        });
        setRepos(mapped);
      } catch {
        // Fallback remains
      }
    }
    fetchRepos();
  }, []);

  // Smooth spring lerp for infinite rotation index
  useEffect(() => {
    let animId: number;
    const loop = () => {
      setCurrentIndex((prev) => prev + (targetIndex - prev) * 0.14);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [targetIndex]);

  // Pointer drag events for hand/mouse slide
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartTargetRef.current = targetIndex;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 5) {
      hasMovedRef.current = true;
    }
    // Continuous infinite scroll translation
    setTargetIndex(dragStartTargetRef.current - deltaX / 220);
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if released
    }
  };

  // Wheel horizontal / vertical swipe inside gallery
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > 10) {
      setTargetIndex((prev) => prev + (delta > 0 ? 0.35 : -0.35));
    }
  };

  const activeNormalizedIndex =
    ((Math.round(targetIndex) % repos.length) + repos.length) % repos.length;
  const activeRepo = repos[activeNormalizedIndex] || repos[0];

  const handlePrev = () => setTargetIndex((prev) => prev - 1);
  const handleNext = () => setTargetIndex((prev) => prev + 1);

  return (
    <section
      id="playground-section"
      className="max-w-7xl mx-auto px-6 md:px-12 py-20 space-y-12 select-none"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left pb-2">
        <div className="space-y-2">
          <span className="text-xs text-[#dfab54] tracking-[0.35em] uppercase font-bold font-mono">
            // Drag Deck
          </span>
          <h2 className="section-title font-sans font-extrabold tracking-tighter leading-none text-white uppercase">
            GitHub Repositories.
          </h2>
        </div>
        <p className="max-w-md text-xs sm:text-sm text-white/60 font-light leading-relaxed">
          Slide directly with hand or mouse in an endless 3D loop. Click any active card to view codebase details.
        </p>
      </div>

      {/* 3D Infinite Card Deck Stage with Touch / Drag Hand Gestures */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        className={`relative h-[420px] w-full flex items-center justify-center perspective-[1200px] touch-pan-y ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {repos.map((repo, idx) => {
          const N = repos.length;
          let offset = idx - currentIndex;
          const half = N / 2;
          while (offset < -half) offset += N;
          while (offset > half) offset -= N;

          const absOffset = Math.abs(offset);
          const rotateY = offset * -22;
          const translateX = offset * 270;
          const translateY = absOffset * 12;
          const translateZ = absOffset * -160;
          const scale = 1 - absOffset * 0.12;
          const zIndex = Math.round(100 - absOffset * 10);
          const opacity = absOffset > 2.5 ? 0 : Math.max(0.2, 1 - absOffset * 0.42);

          return (
            <div
              key={idx}
              onClick={() => {
                if (!hasMovedRef.current) {
                  if (absOffset < 0.3) {
                    setSelectedRepo(repo);
                  } else {
                    setTargetIndex(targetIndex + offset);
                  }
                }
              }}
              style={{
                transform: `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                zIndex,
                opacity,
              }}
              className="absolute w-[280px] h-[370px] sm:w-[320px] sm:h-[400px] rounded-[32px] bg-[#080808]/90 p-6 flex flex-col justify-between overflow-hidden shadow-2xl transition-transform duration-75 ease-out group"
            >
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={repo.coverImg}
                  alt={repo.title}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 opacity-25"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
              </div>

              <div className="relative z-10 flex justify-between items-start">
                <span className="text-[9px] font-mono bg-white/10 text-white px-2.5 py-1 rounded-full uppercase tracking-widest font-bold">
                  {repo.systemClass}
                </span>
                <span className="text-[9px] font-mono text-white/70 bg-black/80 px-2 py-0.5 rounded">
                  {repo.stars}
                </span>
              </div>

              <div className="relative z-10 space-y-2 mt-auto">
                <span className="text-[9px] text-[#dfab54] tracking-[0.2em] uppercase block font-bold font-mono">
                  {repo.primaryLanguage}
                </span>
                <h3 className="font-serif italic text-2xl text-white group-hover:text-[#dfab54] transition-colors leading-tight">
                  {repo.title}
                </h3>
                <p className="text-white/60 text-xs font-light line-clamp-2 leading-relaxed">
                  {repo.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Ticker Controls */}
      <div className="flex justify-between items-center text-[11px] text-white/60 uppercase tracking-[0.2em] font-mono pt-2">
        <div className="flex items-center gap-2">
          <span className="text-white/30">SWIPE OR DRAG // INDEX:</span>
          <span className="text-white font-bold">
            {String(activeNormalizedIndex + 1).padStart(2, '0')} /{' '}
            {String(repos.length).padStart(2, '0')}
          </span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handlePrev}
            className="hover:text-[#dfab54] transition-colors cursor-pointer"
          >
            ← PREV
          </button>
          <span className="text-white/20">|</span>
          <button
            onClick={handleNext}
            className="hover:text-[#dfab54] transition-colors cursor-pointer"
          >
            NEXT →
          </button>
        </div>
      </div>

      {/* Active Detail Display */}
      {activeRepo && (
        <div className="pt-6 text-left grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[10px] text-[#dfab54] tracking-[0.3em] uppercase font-bold font-mono">
              Selected Repository
            </span>
            <h3 className="font-serif italic text-3xl text-white">
              {activeRepo.title}
            </h3>
            <p className="text-white/70 text-sm font-light leading-relaxed">
              {activeRepo.description}
            </p>
          </div>
          <div className="lg:col-span-4 space-y-3 font-mono text-xs text-white/70 pl-2">
            <div>
              <span className="text-white/30 block text-[9px]">LANGUAGE</span>
              <span className="text-white font-bold">
                {activeRepo.primaryLanguage}
              </span>
            </div>
            <div>
              <span className="text-white/30 block text-[9px]">RATING / STARS</span>
              <span className="text-white font-bold">{activeRepo.stars}</span>
            </div>
            <button
              onClick={() => setSelectedRepo(activeRepo)}
              className="mt-2 text-[#dfab54] hover:text-white text-[10px] font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer"
            >
              INSPECT CODEBASE DETAILS ↗
            </button>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedRepo && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedRepo(null)}
        >
          <div
            className="bg-[#0a0a0a] rounded-[32px] p-6 sm:p-10 max-w-2xl w-full text-left space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedRepo(null)}
              className="absolute top-6 right-6 text-white/40 hover:text-white text-xl cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-[10px] text-[#dfab54] tracking-[0.3em] uppercase font-bold font-mono">
                // FULL REPORT ENTRY
              </span>
              <h3 className="font-serif italic text-3xl text-white">
                {selectedRepo.title}
              </h3>
              <p className="text-xs text-white/50 font-mono">
                {selectedRepo.subtitle}
              </p>
            </div>

            <div className="h-[1px] bg-white/10 w-full" />

            <div className="space-y-2">
              <span className="text-[10px] text-[#dfab54] tracking-[0.2em] uppercase block font-bold font-mono">
                Abstract & Technical Summary:
              </span>
              <p className="text-white/70 text-sm font-light leading-relaxed">
                {selectedRepo.description}
              </p>
            </div>

            <div className="pl-4 py-1 text-xs font-mono text-white/60">
              <span className="text-[10px] text-[#dfab54] tracking-[0.2em] uppercase block font-bold">
                Stack & Methodologies:
              </span>
              <p>
                Built with {selectedRepo.primaryLanguage} for numerical modeling, inversion analysis, and computational geophysics.
              </p>
            </div>

            <div className="pt-4 flex justify-between items-center text-[10px] font-mono">
              <span className="text-white/40">{selectedRepo.stars}</span>
              <a
                href={selectedRepo.url}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2 rounded-full bg-white text-black hover:bg-[#dfab54] hover:text-black font-bold uppercase tracking-wider transition-all"
              >
                OPEN ON GITHUB ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
