"use client";

import { useEffect, useRef } from "react";

/*
 * Simulation pixel budget per device class.
 * Each pixel costs ~20 trig ops (4 inner-loop iterations × ~5 ops).
 * 72k → 20k = ~72% CPU reduction on desktop.
 * 20k → 8k  = ~60% further reduction on mobile.
 */
const SIM_PIXELS_DESKTOP = 20_000;
const SIM_PIXELS_MOBILE  =  8_000;

/** Uniform time scale — lower = slower animation. */
const WAVE_TIME_SCALE = 0.38;

export default function HeroWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isTouch     = window.matchMedia("(pointer: coarse)").matches;

    const MAX_SIM_PIXELS = isTouch ? SIM_PIXELS_MOBILE : SIM_PIXELS_DESKTOP;
    /*
     * FPS cap: 30fps on mobile halves the GPU/CPU budget without any visible
     * quality loss for a slow-moving wave. Desktop runs uncapped (~60fps).
     */
    const FRAME_INTERVAL = isTouch ? 1000 / 30 : 0;

    let rafId = 0;
    let width = 0;
    let height = 0;
    let imageData: ImageData;
    let data: Uint8ClampedArray;

    const resizeCanvas = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      const aspect = canvas.width / canvas.height;

      let h = Math.floor(Math.sqrt(MAX_SIM_PIXELS / aspect));
      let w = Math.floor(h * aspect);
      h = Math.max(32, h);
      w = Math.max(32, w);

      width  = w;
      height = h;
      imageData = ctx.createImageData(width, height);
      data = imageData.data;
    };

    window.addEventListener("resize", resizeCanvas, { passive: true });
    resizeCanvas();

    // Pre-computed trig lookup tables — avoid Math.sin/cos in the hot loop.
    const SIN_TABLE = new Float32Array(1024);
    const COS_TABLE = new Float32Array(1024);
    for (let i = 0; i < 1024; i++) {
      const angle = (i / 1024) * Math.PI * 2;
      SIN_TABLE[i] = Math.sin(angle);
      COS_TABLE[i] = Math.cos(angle);
    }

    const TWO_PI_INV = 1 / (Math.PI * 2);
    const fastSin = (x: number) =>
      SIN_TABLE[Math.floor(((x % (Math.PI * 2)) * TWO_PI_INV) * 1024) & 1023]!;
    const fastCos = (x: number) =>
      COS_TABLE[Math.floor(((x % (Math.PI * 2)) * TWO_PI_INV) * 1024) & 1023]!;

    const drawFrame = (time: number) => {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const u_x = (2 * x - width)  / height;
          const u_y = (2 * y - height) / height;

          let a = 0;
          let d = 0;
          for (let i = 0; i < 4; i++) {
            a += fastCos(i - d + time * 0.5 - a * u_x);
            d += fastSin(i * u_y + a);
          }

          const wave        = (fastSin(a) + fastCos(d)) * 0.5;
          const intensity   = 0.3 + 0.4 * wave;
          const baseVal     = 0.1 + 0.15 * fastCos(u_x + u_y + time * 0.3);
          const blueAccent  = 0.2  * fastSin(a * 1.5 + time * 0.2);
          const purpleAccent= 0.15 * fastCos(d * 2   + time * 0.1);

          const r = Math.max(0, Math.min(1, baseVal + purpleAccent * 0.8)) * intensity;
          const g = Math.max(0, Math.min(1, baseVal + blueAccent   * 0.6)) * intensity;
          const b = Math.max(0, Math.min(1, baseVal + blueAccent   * 1.2 + purpleAccent * 0.4)) * intensity;

          const idx = (y * width + x) * 4;
          data[idx]     = r * 255;
          data[idx + 1] = g * 255;
          data[idx + 2] = b * 255;
          data[idx + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Upscale simulation pixels to full canvas resolution.
      if (width < canvas.width || height < canvas.height) {
        ctx.imageSmoothingEnabled = true;
        // "low" is sufficient for a blurry wave and faster than "high".
        ctx.imageSmoothingQuality = "low";
        ctx.drawImage(canvas, 0, 0, width, height, 0, 0, canvas.width, canvas.height);
      }
    };

    const paintFallback = () => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0,    "#0a0a12");
      gradient.addColorStop(0.45, "#12122a");
      gradient.addColorStop(1,    "#0f1020");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    let lastFrameTime = 0;
    const startTime   = performance.now();

    const loop = (now: DOMHighResTimeStamp) => {
      // Schedule next frame first so timing stays stable even if drawFrame is slow.
      rafId = window.requestAnimationFrame(loop);

      // FPS throttle: skip this frame if not enough time has elapsed.
      if (FRAME_INTERVAL > 0 && now - lastFrameTime < FRAME_INTERVAL) return;
      lastFrameTime = now;

      const time = ((now - startTime) * 0.001) * WAVE_TIME_SCALE;
      drawFrame(time);
    };

    if (motionQuery.matches) {
      paintFallback();
    } else {
      rafId = window.requestAnimationFrame(loop);
    }

    const onMotionChange = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
      resizeCanvas();
      if (motionQuery.matches) {
        paintFallback();
      } else {
        rafId = window.requestAnimationFrame(loop);
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      } else if (!motionQuery.matches && rafId === 0) {
        lastFrameTime = 0; // Allow immediate first frame after resume
        rafId = window.requestAnimationFrame(loop);
      }
    };

    motionQuery.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      motionQuery.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
