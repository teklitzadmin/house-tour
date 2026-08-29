import React from 'react';

interface RoomLabelProps {
  location: string;
  section: string;
}

export const RoomLabel: React.FC<RoomLabelProps> = ({ location }) => {
  return (
    <div className="flex flex-col pointer-events-none select-none">
      <span className="text-[8px] tracking-[0.25em] text-zinc-500 font-semibold uppercase mb-1 font-sans">
        Current Space
      </span>
      <h2 className="text-sm md:text-base font-light tracking-widest text-zinc-100 uppercase font-sans transition-all duration-300">
        {location}
      </h2>
    </div>
  );
};

export default RoomLabel;
