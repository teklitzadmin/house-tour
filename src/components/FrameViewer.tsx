import React, { useEffect, useRef } from 'react';
import { totalFrames } from '../data/frames';

interface FrameViewerProps {
  progress: number; // Float value from 1 to 300
}

export const FrameViewer: React.FC<FrameViewerProps> = ({ progress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingImagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const progressRef = useRef(progress);

  // Sync progress ref to prevent stale closures in callbacks
  progressRef.current = progress;

  // Format filename helper
  const getFrameSrc = (index: number) => {
    const pad = String(index).padStart(4, '0');
    return `/frames/frame_${pad}.png`;
  };

  // Helper to draw an image covering the canvas (object-cover equivalent in 2D canvas)
  const drawImageCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, width: number, height: number, opacity = 1.0) => {
    ctx.globalAlpha = opacity;
    
    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;
    
    if (imgWidth === 0 || imgHeight === 0) return;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawWidth = height * imgRatio;
      offsetX = (width - drawWidth) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentProgress = progressRef.current;
    const baseIndex = Math.floor(currentProgress);
    const nextIndex = Math.min(totalFrames, baseIndex + 1);
    const crossfadeProgress = currentProgress - baseIndex;

    const width = canvas.width;
    const height = canvas.height;

    if (width === 0 || height === 0) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find the best image to draw as base
    let baseImg = imageCacheRef.current.get(baseIndex);
    
    // Fallback search if current base image isn't loaded yet
    if (!baseImg) {
      // Look up to 100 frames backward/forward for any loaded frame
      for (let offset = 1; offset < 100; offset++) {
        // Check behind first (more likely to be cached if scrolling forward)
        const checkBack = Math.max(1, baseIndex - offset);
        if (imageCacheRef.current.has(checkBack)) {
          baseImg = imageCacheRef.current.get(checkBack);
          break;
        }
        // Check ahead
        const checkForward = Math.min(totalFrames, baseIndex + offset);
        if (imageCacheRef.current.has(checkForward)) {
          baseImg = imageCacheRef.current.get(checkForward);
          break;
        }
      }
    }

    // Draw base image if available
    if (baseImg) {
      drawImageCover(ctx, baseImg, width, height, 1.0);
    }

    // Draw next image if crossfading and next image is loaded
    if (nextIndex !== baseIndex && crossfadeProgress > 0) {
      const nextImg = imageCacheRef.current.get(nextIndex);
      if (nextImg) {
        drawImageCover(ctx, nextImg, width, height, crossfadeProgress);
      }
    }

    // Reset alpha
    ctx.globalAlpha = 1.0;
  };

  // Image loading function
  const loadImage = (index: number, callback?: () => void) => {
    if (imageCacheRef.current.has(index)) {
      if (callback) callback();
      return;
    }
    if (loadingImagesRef.current.has(index)) {
      return;
    }

    const img = new Image();
    // Maintain strong reference to prevent garbage collection request cancellation
    loadingImagesRef.current.set(index, img);

    img.onload = () => {
      imageCacheRef.current.set(index, img);
      loadingImagesRef.current.delete(index);
      if (callback) callback();
    };
    img.onerror = () => {
      loadingImagesRef.current.delete(index);
    };
    img.src = getFrameSrc(index);
  };

  // Trigger preloading when base index changes
  const baseIndex = Math.floor(progress);
  useEffect(() => {
    const triggerRedraw = () => {
      draw();
    };

    // Ensure immediate and next frames are loading
    loadImage(baseIndex, triggerRedraw);
    const nextIndex = Math.min(totalFrames, baseIndex + 1);
    loadImage(nextIndex, triggerRedraw);

    // Preload ahead and behind in background
    const prefetchCount = 15;
    for (let i = 2; i <= prefetchCount; i++) {
      const idx = Math.min(totalFrames, baseIndex + i);
      loadImage(idx);
    }
    const backtrackCount = 5;
    for (let i = 1; i <= backtrackCount; i++) {
      const idx = Math.max(1, baseIndex - i);
      loadImage(idx);
    }
  }, [baseIndex]);

  // Handle redraw on progress changes
  useEffect(() => {
    draw();
  }, [progress]);

  // Handle canvas resize via ResizeObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = window.devicePixelRatio || 1;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        draw();
      }
    });

    // Observe parent element to match its container size
    const parent = canvas.parentElement;
    if (parent) {
      resizeObserver.observe(parent);
    } else {
      resizeObserver.observe(canvas);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const crossfadeProgress = progress - baseIndex;

  return (
    <div className="relative w-full h-full bg-zinc-950 overflow-hidden select-none pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover object-center will-change-transform"
        style={{
          transform: `scale(${1 + (1 - crossfadeProgress) * 0.005})`,
          filter: 'brightness(0.95)'
        }}
      />
      {/* Screen Vignette for cinematic vlog atmosphere */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
};

export default FrameViewer;
