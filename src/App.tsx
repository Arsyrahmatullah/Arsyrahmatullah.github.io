import { useRef, useState } from 'react';
import ThreeCanvas from './components/ThreeCanvas';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import FlightTextStage from './components/FlightTextStage';
import ProjectSlider from './components/ProjectSlider';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const scrollProgressRef = useRef<number>(0);

  const handleDescend = () => {
    const el = document.getElementById('playground-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-[#050505] text-[#f0f0f0] min-h-screen selection:bg-white selection:text-[#050505]">
      {/* Film Grain Texture */}
      <div className="noise-overlay" />

      {/* Preloader - Big Centered Number Only */}
      <Preloader onComplete={() => setIsLoaded(true)} />

      {/* Real Three.js 3D Background Scene */}
      <ThreeCanvas scrollProgressRef={scrollProgressRef} />

      {/* Custom Telemetry Pointer Cursor */}
      <CustomCursor />

      {/* Navigation */}
      <Navigation onNavClick={handleNavClick} />

      {/* Flight Stage - Flat Sharp Text Layers & Running Text Marquee */}
      <FlightTextStage
        scrollProgressRef={scrollProgressRef}
        onDescendClick={handleDescend}
      />

      {/* Main Sections below Flight Stage */}
      <main className="relative z-10 bg-[#050505]">
        <ProjectSlider />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}
