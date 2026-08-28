export interface FrameInfo {
  id: number;
  src: string;
  location: string;
  section: string;
  alt: string;
}

// Define the ranges for each section of the house tour.
// We will refine these ranges as we visually inspect the walk-through.
export const frameRanges = [
  { start: 1, end: 40, location: "Exterior", section: "exterior", label: "House Exterior" },
  { start: 41, end: 70, location: "Front Entrance", section: "entrance", label: "Front Entrance" },
  { start: 71, end: 110, location: "Living Room", section: "living-room", label: "Living Room" },
  { start: 111, end: 140, location: "Hallway", section: "hallway", label: "Hallway" },
  { start: 141, end: 170, location: "Dining Room", section: "dining-room", label: "Dining Room" },
  { start: 171, end: 185, location: "Bedroom 1", section: "bedroom-1", label: "Bedroom 1" },
  { start: 186, end: 194, location: "Bedroom 2", section: "bedroom-2", label: "Bedroom 2" },
  { start: 195, end: 255, location: "Kitchen", section: "kitchen", label: "Kitchen" },
  { start: 256, end: 270, location: "Kitchen Door", section: "kitchen-door", label: "Kitchen Door" },
  { start: 271, end: 300, location: "Backyard Garden", section: "backyard", label: "Backyard Garden" }
];

export const totalFrames = 300;

export const frames: FrameInfo[] = Array.from({ length: totalFrames }, (_, i) => {
  const id = i + 1;
  const pad = String(id).padStart(4, '0');
  
  // Find which range this frame falls into
  const range = frameRanges.find(r => id >= r.start && id <= r.end) || frameRanges[0];
  
  return {
    id,
    src: `/frames/frame_${pad}.png`,
    location: range.location,
    section: range.section,
    alt: `A photograph showing the ${range.label.toLowerCase()} of the house - Tour frame ${id} of 300`
  };
});
