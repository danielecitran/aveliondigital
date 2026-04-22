"use client";

import { useEffect, useRef } from "react";

/*
 * Wave background — primary path uses OffscreenCanvas + Web Worker so that
 * ALL pixel computation runs off the main thread. ScrollSmoother, GSAP
 * animations and React rendering therefore get their full 60 fps budget.
 *
 * Browser support (OffscreenCanvas + RAF in workers):
 *   Chrome 69+  · Firefox 105+  · Safari 16.4+
 * Older browsers fall back to the original main-thread renderer.
 */

const WAVE_TIME_SCALE    = 0.38;
const SIM_PIXELS_DESKTOP = 20_000;
const SIM_PIXELS_MOBILE  =  8_000;

export default function HeroWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isTouch     = window.matchMedia("(pointer: coarse)").matches;

    /* ── Reduced-motion: paint a static gradient and exit ─────────────── */
    if (motionQuery.matches) {
      const ctx = canvas.getContext("2d", { alpha: false });
      if (ctx) {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        g.addColorStop(0,    "#0a0a12");
        g.addColorStop(0.45, "#12122a");
        g.addColorStop(1,    "#0f1020");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    /* ── Primary: OffscreenCanvas + Web Worker ─────────────────────────
     * Transfers control of the canvas to a dedicated worker so the wave
     * loop never touches the main thread.                                */
    const supportsOffscreen =
      typeof OffscreenCanvas !== "undefined" &&
      typeof (canvas as HTMLCanvasElement & { transferControlToOffscreen?: () => OffscreenCanvas })
        .transferControlToOffscreen === "function";

    if (supportsOffscreen) {
      let worker: Worker | null = null;

      try {
        // transferControlToOffscreen() is a one-way transfer — after this
        // the canvas DOM element still renders whatever the worker draws.
        const offscreen = (canvas as HTMLCanvasElement & {
          transferControlToOffscreen: () => OffscreenCanvas;
        }).transferControlToOffscreen();

        worker = new Worker("/wave-worker.js");

        worker.postMessage(
          {
            type: "init",
            canvas: offscreen,
            isTouch,
            width:  window.innerWidth,
            height: window.innerHeight,
          },
          [offscreen], // Transfer — not clone
        );

        const onResize = () => {
          worker?.postMessage({
            type: "resize",
            width:  window.innerWidth,
            height: window.innerHeight,
          });
        };

        const onVisibility = () => {
          worker?.postMessage({ type: "visibility", hidden: document.hidden });
        };

        window.addEventListener("resize", onResize, { passive: true });
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
          window.removeEventListener("resize", onResize);
          document.removeEventListener("visibilitychange", onVisibility);
          worker?.postMessage({ type: "stop" });
          // Small delay so the worker can process "stop" before being killed.
          setTimeout(() => worker?.terminate(), 100);
        };
      } catch {
        // If transferControlToOffscreen throws for any reason, fall through
        // to the main-thread renderer below.
        worker?.terminate();
      }
    }

    /* ── Fallback: main-thread renderer (same logic as worker) ─────────
     * Used on browsers that don't support OffscreenCanvas.               */
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const MAX_SIM_PIXELS = isTouch ? SIM_PIXELS_MOBILE : SIM_PIXELS_DESKTOP;
    const FRAME_INTERVAL = isTouch ? 1000 / 30 : 0;

    let rafId = 0;
    let width = 0, height = 0;
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
          let a = 0, d = 0;
          for (let i = 0; i < 4; i++) {
            a += fastCos(i - d + time * 0.5 - a * u_x);
            d += fastSin(i * u_y + a);
          }
          const wave      = (fastSin(a) + fastCos(d)) * 0.5;
          const intensity = 0.3 + 0.4 * wave;
          const baseVal   = 0.1 + 0.15 * fastCos(u_x + u_y + time * 0.3);
          const blueAcc   = 0.2  * fastSin(a * 1.5 + time * 0.2);
          const purpleAcc = 0.15 * fastCos(d * 2   + time * 0.1);
          const r = Math.max(0, Math.min(1, baseVal + purpleAcc * 0.8)) * intensity;
          const g = Math.max(0, Math.min(1, baseVal + blueAcc   * 0.6)) * intensity;
          const b = Math.max(0, Math.min(1, baseVal + blueAcc   * 1.2 + purpleAcc * 0.4)) * intensity;
          const idx = (y * width + x) * 4;
          data[idx]     = r * 255;
          data[idx + 1] = g * 255;
          data[idx + 2] = b * 255;
          data[idx + 3] = 255;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      if (width < canvas.width || height < canvas.height) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "low";
        ctx.drawImage(canvas, 0, 0, width, height, 0, 0, canvas.width, canvas.height);
      }
    };

    let lastFrameTime = 0;
    const startTime   = performance.now();

    const loop = (now: DOMHighResTimeStamp) => {
      rafId = window.requestAnimationFrame(loop);
      if (FRAME_INTERVAL > 0 && now - lastFrameTime < FRAME_INTERVAL) return;
      lastFrameTime = now;
      drawFrame(((now - startTime) * 0.001) * WAVE_TIME_SCALE);
    };

    rafId = window.requestAnimationFrame(loop);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId); rafId = 0;
      } else if (rafId === 0) {
        lastFrameTime = 0;
        rafId = window.requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", onVisibility);
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
