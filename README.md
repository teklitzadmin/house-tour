# Nature House Tour — Immersive Walkthrough

An immersive, scroll-driven physical walkthrough of a beautiful, nature-integrated modern home. Scrolling down moves you progressively forward through the house from the exterior garden to the interior rooms, and finally to the backyard sanctuary.

## Features

- **Smooth steadycam transitions (LERP)**: Uses linear interpolation in a `requestAnimationFrame` render loop to smooth out mouse wheel or trackpad jumps, rendering smooth frame-by-frame camera movement.
- **Dual-Layer Opacity Crossfading**: Renders two overlapping frames (base layer and target layer) and crossfades the target layer's opacity according to scroll progress to prevent blank frames or flashes.
- **Ahead-of-Time Frame Preloading**: Pre-fetches the next 10 frames and previous 3 frames dynamically in browser memory to eliminate network-induced lag during scrolling.
- **Interactive Navigation Timeline**: A sleek sidebar timeline representing progress landmarks (Exterior, Entrance, Living, Dining, Bedrooms, Kitchen, Backyard) which highlight dynamically.
- **Opening & Ending Overlays**: Elegantly styled overlays to initiate exploration ("Scroll to Explore") and conclude the journey ("Welcome Home").
- **Fully Responsive Layout**: Designed to adapt dynamically to mobile, tablet, laptop, and desktop viewports, using intelligent cropping to keep important architectural details centered.

## Tech Stack

- **Framework**: Vite + React + TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Browser Automation (testing)**: Puppeteer Core

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`.

## Frame Sequence Mapping

The walkthrough sequence consists of 300 sequential frames mapping the rooms:
- **Exterior**: Frames 1–40
- **Front Entrance**: Frames 41–70
- **Living Room**: Frames 71–110
- **Hallway**: Frames 111–140
- **Dining Room**: Frames 141–170
- **Bedroom 1**: Frames 171–185
- **Bedroom 2**: Frames 186–194
- **Kitchen**: Frames 195–255
- **Kitchen Door**: Frames 256–270
- **Backyard Garden**: Frames 271–300
