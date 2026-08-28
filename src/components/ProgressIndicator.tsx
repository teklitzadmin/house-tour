import React from 'react';

interface ProgressIndicatorProps {
  currentFrame: number;
  totalFrames: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentFrame, totalFrames }) => {
  const percentage = (currentFrame / totalFrames) * 100;

  // Major landmarks to show along the progress bar
  const landmarks = [
    { label: "Exterior", frame: 1 },
    { label: "Entrance", frame: 45 },
    { label: "Living", frame: 90 },
    { label: "Dining", frame: 155 },
    { label: "Bedrooms", frame: 185 },
    { label: "Kitchen", frame: 240 },
    { label: "Backyard", frame: 285 }
  ];

  return (
    <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-row items-center gap-3 pointer-events-none select-none">
      {/* Landmark labels aligned along the height of the timeline */}
      <div className="relative h-64 w-20">
        {landmarks.map((l, i) => {
          // Normalize position as percentage of total height (0-100%)
          const topPct = ((l.frame - 1) / (totalFrames - 1)) * 100;
          const isActive = currentFrame >= l.frame;
          
          return (
            <div
              key={i}
              className="absolute right-0 flex items-center gap-1.5 transition-all duration-300"
              style={{ top: `${topPct}%`, transform: 'translateY(-50%)' }}
            >
              <span className={`text-[8px] tracking-[0.25em] uppercase font-sans transition-colors duration-300 ${
                isActive ? 'text-zinc-200 font-medium' : 'text-zinc-600'
              }`}>
                {l.label}
              </span>
              <div className={`w-1 h-[1px] transition-colors duration-300 ${
                isActive ? 'bg-zinc-400' : 'bg-zinc-800'
              }`} />
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* Progress track */}
        <div className="relative h-64 w-[2px] bg-zinc-800/60 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 w-full bg-zinc-200/80 transition-all duration-100 ease-out"
            style={{ height: `${percentage}%` }}
          />
        </div>
        
        {/* Progress numbers */}
        <div className="flex flex-col items-center">
          <span className="font-sans text-[10px] font-light tracking-widest text-zinc-400">
            {String(currentFrame).padStart(3, '0')}
          </span>
          <div className="w-4 h-[1px] bg-zinc-800 my-0.5"></div>
          <span className="font-sans text-[8px] text-zinc-600 tracking-wider">
            {totalFrames}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
