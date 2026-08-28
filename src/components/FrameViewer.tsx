import React, { useEffect, useState } from 'react';
import { totalFrames } from '../data/frames';

interface FrameViewerProps {
  progress: number; // Float value from 1 to 300
}

export const FrameViewer: React.FC<FrameViewerProps> = ({ progress }) => {
  const [preloaded, setPreloaded] = useState<Record<number, boolean>>({});

  // Determine base frame and next frame indices
  const baseIndex = Math.floor(progress);
  const nextIndex = Math.min(totalFrames, baseIndex + 1);
  const crossfadeProgress = progress - baseIndex;

  // Format filename helper
  const getFrameSrc = (index: number) => {
    const pad = String(index).padStart(4, '0');
    return `/frames/frame_${pad}.png`;
  };

  // Preloading engine to fetch upcoming images in the scrolling direction
  useEffect(() => {
    const activeFrame = Math.floor(progress);
    const prefetchCount = 10; // Prefetch 10 frames ahead
    const newPreloads: Record<number, boolean> = { ...preloaded };
    let updated = false;

    for (let i = 0; i < prefetchCount; i++) {
      const idx = Math.min(totalFrames, activeFrame + i);
      if (!newPreloads[idx]) {
        const img = new Image();
        img.src = getFrameSrc(idx);
        newPreloads[idx] = true;
        updated = true;
      }
    }

    // Also prefetch a couple of frames backwards in case of scroll up
    const backtrackCount = 3;
    for (let i = 1; i <= backtrackCount; i++) {
      const idx = Math.max(1, activeFrame - i);
      if (!newPreloads[idx]) {
        const img = new Image();
        img.src = getFrameSrc(idx);
        newPreloads[idx] = true;
        updated = true;
      }
    }

    if (updated) {
      setPreloaded(newPreloads);
    }
  }, [baseIndex]);

  return (
    <div className="relative w-full h-full bg-zinc-950 overflow-hidden select-none pointer-events-none">
      {/* Base Frame (underneath layer) */}
      <img
        src={getFrameSrc(baseIndex)}
        alt={`House Tour Frame ${baseIndex}`}
        className="absolute inset-0 w-full h-full object-cover object-center will-change-transform"
        style={{
          // Subtle scale down effect for depth feel (vlog camera movement)
          transform: `scale(${1 + (1 - crossfadeProgress) * 0.005})`,
          filter: 'brightness(0.95)'
        }}
      />

      {/* Crossfade Frame (overlay layer) */}
      {nextIndex !== baseIndex && (
        <img
          src={getFrameSrc(nextIndex)}
          alt={`House Tour Frame ${nextIndex}`}
          className="absolute inset-0 w-full h-full object-cover object-center will-change-transform"
          style={{
            opacity: crossfadeProgress,
            transform: `scale(${1 + (1 - crossfadeProgress) * 0.005})`,
            filter: 'brightness(0.95)'
          }}
        />
      )}

      {/* Screen Vignette for cinematic vlog atmosphere */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
};

export default FrameViewer;
