import React, { useEffect, useRef, useState } from 'react';
import { frames, totalFrames, FrameInfo } from '../data/frames';
import FrameViewer from './FrameViewer';
import RoomLabel from './RoomLabel';
import ProgressIndicator from './ProgressIndicator';
import { ChevronDown } from 'lucide-react';

export const ScrollExperience: React.FC = () => {
  const [progress, setProgress] = useState(1);
  const [activeFrame, setActiveFrame] = useState<FrameInfo>(frames[0]);
  
  // Refs for tracking scroll position in requestAnimationFrame loop
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentProgressRef = useRef(1);
  const targetProgressRef = useRef(1);
  const animationFrameIdRef = useRef<number | null>(null);

  // Calculate scrolling metrics
  // 180px per frame gives 54,000px total scroll height for highly granular, smooth control
  const scrollHeightPerFrame = 180;
  const totalScrollHeight = totalFrames * scrollHeightPerFrame;

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      if (maxScroll <= 0) return;
      
      const pct = Math.max(0, Math.min(1, scrollY / maxScroll));
      // Map percentage to frame index range [1, totalFrames]
      targetProgressRef.current = 1 + pct * (totalFrames - 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    // Initial trigger
    handleScroll();

    // Query param override for frame-specific loading (for testing & verification)
    const params = new URLSearchParams(window.location.search);
    const queryFrame = params.get('frame');
    if (queryFrame) {
      const targetFrame = parseInt(queryFrame, 10);
      if (!isNaN(targetFrame) && targetFrame >= 1 && targetFrame <= totalFrames) {
        targetProgressRef.current = targetFrame;
        currentProgressRef.current = targetFrame;
        const pct = (targetFrame - 1) / (totalFrames - 1);
        setTimeout(() => {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          window.scrollTo(0, pct * maxScroll);
        }, 100);
      }
    }

    // Lerp loop for silky-smooth motion (dampens abrupt scroll jumps)
    const updateLerp = () => {
      const diff = targetProgressRef.current - currentProgressRef.current;
      
      // If difference is tiny, snap to target to avoid continuous calculations
      if (Math.abs(diff) < 0.005) {
        currentProgressRef.current = targetProgressRef.current;
      } else {
        // Highly dampened LERP factor (0.045) for an ultra-smooth, cinematic steadycam glide
        currentProgressRef.current += diff * 0.045;
      }

      // Constrain progress range
      const cleanProgress = Math.max(1, Math.min(totalFrames, currentProgressRef.current));
      
      setProgress(cleanProgress);

      // Determine active frame info based on floor of current progress
      const frameIndex = Math.min(totalFrames - 1, Math.floor(cleanProgress) - 1);
      setActiveFrame(frames[frameIndex]);

      animationFrameIdRef.current = requestAnimationFrame(updateLerp);
    };

    animationFrameIdRef.current = requestAnimationFrame(updateLerp);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // Show "Scroll to explore" indicator on frame 1, fading out by frame 4
  const showScrollIndicator = progress < 4;
  const scrollIndicatorOpacity = Math.max(0, Math.min(1, (4 - progress) / 3));

  // Determine end of journey overlay (fades in during last 15 frames)
  const endThreshold = 285;
  const showEndOverlay = progress > endThreshold;
  const endOverlayOpacity = showEndOverlay
    ? Math.max(0, Math.min(1, (progress - endThreshold) / (totalFrames - endThreshold)))
    : 0;

  return (
    <div 
      ref={scrollContainerRef} 
      className="relative w-full"
      style={{ height: `${totalScrollHeight}px` }}
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-zinc-950">
        
        {/* Immersive Frame Viewer */}
        <FrameViewer progress={progress} />

        {/* Translucent UI Overlay Header with Bottom Fade */}
        <header className="absolute top-0 left-0 right-0 z-50 pt-6 pb-20 px-8 bg-gradient-to-b from-zinc-950/90 via-zinc-950/40 to-transparent pointer-events-none select-none">
          <div className="flex justify-between items-center w-full">
            {/* Room / Location label */}
            <div className="flex-1">
              <RoomLabel 
                location={activeFrame.location} 
                section={activeFrame.section} 
              />
            </div>

            {/* Centered Website Name */}
            <div className="flex-none text-center">
              <h1 className="font-sans text-[11px] tracking-[0.5em] text-zinc-200 font-medium uppercase">
                home sweet home
              </h1>
            </div>

            {/* Minimal House Tour Brand / Metadata & Menu */}
            <div className="flex-1 flex items-center justify-end gap-6">
              <span className="hidden sm:inline font-sans text-[8px] tracking-[0.2em] text-zinc-500 uppercase">
                Immersive Walkthrough
              </span>
              <button 
                className="pointer-events-auto flex flex-col gap-1 items-end group p-2 -mr-2 cursor-pointer"
                aria-label="Menu"
              >
                <span className="w-5 h-[1.5px] bg-zinc-400 group-hover:bg-zinc-100 transition-all duration-300"></span>
                <span className="w-3.5 h-[1.5px] bg-zinc-400 group-hover:w-5 group-hover:bg-zinc-100 transition-all duration-300"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Subtle Scroll Progress Indicator */}
        <ProgressIndicator 
          currentFrame={Math.floor(progress)} 
          totalFrames={totalFrames} 
        />

        {/* Start Overlay: Scroll to Explore */}
        {showScrollIndicator && (
          <div 
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none select-none transition-opacity duration-300"
            style={{ opacity: scrollIndicatorOpacity }}
          >
            <span className="font-sans text-[10px] tracking-[0.3em] text-zinc-300 uppercase font-medium">
              Scroll to explore
            </span>
            <ChevronDown className="w-5 h-5 text-zinc-400 animate-bounce mt-1" />
          </div>
        )}

        {/* End Overlay: Peaceful Conclusion */}
        {showEndOverlay && (
          <div 
            className="absolute inset-0 bg-zinc-950/85 z-40 flex flex-col justify-center items-center text-center px-6 pointer-events-none transition-all duration-300"
            style={{ 
              opacity: endOverlayOpacity,
              backdropFilter: `blur(${endOverlayOpacity * 8}px)`
            }}
          >
            <div className="max-w-md select-text pointer-events-auto">
              <span className="font-sans text-[10px] tracking-[0.4em] text-emerald-400 font-semibold uppercase mb-4 block">
                JOURNEY COMPLETE
              </span>
              <h1 className="font-sans text-3xl md:text-4xl font-light text-zinc-100 uppercase tracking-widest mb-6">
                WELCOME HOME
              </h1>
              <p className="font-sans text-sm text-zinc-400 font-light leading-relaxed mb-8">
                You have reached the garden sanctuary. The walkthrough is complete, leaving you in the peaceful embrace of nature.
              </p>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="pointer-events-auto px-6 py-2.5 border border-zinc-700 hover:border-zinc-200 text-zinc-300 hover:text-white text-xs tracking-[0.2em] uppercase rounded-full bg-zinc-900/50 transition-all duration-300"
              >
                Start Over
              </button>
            </div>
          </div>
        )}

        {/* Technical debugging watermark (subtle bottom-left indicator for inspection) */}
        <div className="absolute bottom-4 left-4 z-30 font-mono text-[8px] text-zinc-700 select-none pointer-events-none">
          FRAME {Math.floor(progress)} / {totalFrames} • OFFSET {Math.floor(progress * scrollHeightPerFrame)}px
        </div>
      </div>
    </div>
  );
};

export default ScrollExperience;
