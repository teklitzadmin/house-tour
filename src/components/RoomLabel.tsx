import React from 'react';

interface RoomLabelProps {
  location: string;
  section: string;
}

export const RoomLabel: React.FC<RoomLabelProps> = ({ location }) => {
  return (
    <div className="absolute top-8 left-8 z-30 flex flex-col pointer-events-none select-none">
      <span className="text-[9px] tracking-[0.3em] text-zinc-500 font-semibold uppercase mb-1.5 font-sans">
        Current Space
      </span>
      <h2 className="text-xl md:text-2xl font-light tracking-widest text-zinc-100 uppercase font-sans transition-all duration-300">
        {location}
      </h2>
    </div>
  );
};

export default RoomLabel;
