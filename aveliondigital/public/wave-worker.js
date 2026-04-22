'use strict';

/**
 * Wave background — runs entirely off the main thread via OffscreenCanvas.
 * The main thread transfers the canvas once and sends lightweight messages
 * for resize / visibility changes. Zero main-thread CPU for the wave loop.
 *
 * Messages received (from main thread):
 *   { type: 'init',       canvas: OffscreenCanvas, width, height, isTouch }
 *   { type: 'resize',     width, height }
 *   { type: 'visibility', hidden: boolean }
 *   { type: 'stop' }
 */

/* ─── Constants ─────────────────────────────────────────────────────────── */
var SIM_PIXELS_DESKTOP = 20000;
var SIM_PIXELS_MOBILE  =  8000;
var WAVE_TIME_SCALE    = 0.38;

/* ─── State ─────────────────────────────────────────────────────────────── */
var canvas        = null;
var ctx           = null;
var rafId         = 0;
var simW          = 0;
var simH          = 0;
var imageData     = null;
var data          = null;
var maxSimPixels  = SIM_PIXELS_DESKTOP;
var frameInterval = 0;          // ms; 0 = uncapped
var lastFrameTime = 0;
var startTime     = 0;

/* ─── requestAnimationFrame shim ─────────────────────────────────────────
 * RAF is part of AnimationFrameProvider (spec) and available in dedicated
 * workers in all browsers that support OffscreenCanvas. The setTimeout
 * fallback covers the rare edge case.                                      */
var _raf = (typeof requestAnimationFrame !== 'undefined')
  ? function (cb) { return requestAnimationFrame(cb); }
  : function (cb) { return setTimeout(cb, 1000 / 60); };
var _caf = (typeof cancelAnimationFrame !== 'undefined')
  ? function (id) { cancelAnimationFrame(id); }
  : function (id) { clearTimeout(id); };

/* ─── Trig lookup tables ─────────────────────────────────────────────────
 * Pre-computed sin/cos over [0, 2π] — avoids Math.sin/cos in the hot loop. */
var SIN_TABLE  = null;
var COS_TABLE  = null;
var TWO_PI_INV = 1 / (Math.PI * 2);

function initTables() {
  SIN_TABLE = new Float32Array(1024);
  COS_TABLE = new Float32Array(1024);
  for (var i = 0; i < 1024; i++) {
    var angle = (i / 1024) * Math.PI * 2;
    SIN_TABLE[i] = Math.sin(angle);
    COS_TABLE[i] = Math.cos(angle);
  }
}

function fastSin(x) {
  return SIN_TABLE[Math.floor(((x % (Math.PI * 2)) * TWO_PI_INV) * 1024) & 1023];
}

function fastCos(x) {
  return COS_TABLE[Math.floor(((x % (Math.PI * 2)) * TWO_PI_INV) * 1024) & 1023];
}

/* ─── Sizing ─────────────────────────────────────────────────────────────
 * Sets the canvas pixel buffer to the real viewport size, then computes
 * a smaller simulation grid that gets upscaled via drawImage.              */
function applySize(cw, ch) {
  canvas.width  = cw;
  canvas.height = ch;

  var aspect = cw / ch;
  var h = Math.floor(Math.sqrt(maxSimPixels / aspect));
  var w = Math.floor(h * aspect);
  simH = Math.max(32, h);
  simW = Math.max(32, w);

  imageData = ctx.createImageData(simW, simH);
  data      = imageData.data;
}

/* ─── Frame rendering ────────────────────────────────────────────────────
 * CPU-side pixel shader — computes the wave field and writes RGBA bytes.   */
function drawFrame(time) {
  for (var y = 0; y < simH; y++) {
    for (var x = 0; x < simW; x++) {
      var u_x = (2 * x - simW) / simH;
      var u_y = (2 * y - simH) / simH;

      var a = 0, d = 0;
      for (var i = 0; i < 4; i++) {
        a += fastCos(i - d + time * 0.5 - a * u_x);
        d += fastSin(i * u_y + a);
      }

      var wave         = (fastSin(a) + fastCos(d)) * 0.5;
      var intensity    = 0.3 + 0.4  * wave;
      var baseVal      = 0.1 + 0.15 * fastCos(u_x + u_y + time * 0.3);
      var blueAcc      = 0.2  * fastSin(a * 1.5 + time * 0.2);
      var purpleAcc    = 0.15 * fastCos(d * 2   + time * 0.1);

      var r = Math.max(0, Math.min(1, baseVal + purpleAcc * 0.8)) * intensity;
      var g = Math.max(0, Math.min(1, baseVal + blueAcc   * 0.6)) * intensity;
      var b = Math.max(0, Math.min(1, baseVal + blueAcc   * 1.2 + purpleAcc * 0.4)) * intensity;

      var idx      = (y * simW + x) * 4;
      data[idx]     = r * 255;
      data[idx + 1] = g * 255;
      data[idx + 2] = b * 255;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // Upscale simulation grid to full canvas resolution.
  if (simW < canvas.width || simH < canvas.height) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'low';
    ctx.drawImage(canvas, 0, 0, simW, simH, 0, 0, canvas.width, canvas.height);
  }
}

/* ─── Animation loop ─────────────────────────────────────────────────────*/
function loop(now) {
  rafId = _raf(loop);

  // FPS cap: skip frame if insufficient time has passed (mainly for mobile).
  if (frameInterval > 0 && now - lastFrameTime < frameInterval) return;
  lastFrameTime = now;

  drawFrame(((now - startTime) * 0.001) * WAVE_TIME_SCALE);
}

function startLoop() {
  if (rafId !== 0) return;
  lastFrameTime = 0;
  rafId = _raf(loop);
}

function stopLoop() {
  if (rafId !== 0) { _caf(rafId); rafId = 0; }
}

/* ─── Message handler ────────────────────────────────────────────────────*/
self.onmessage = function (e) {
  var msg = e.data;

  switch (msg.type) {
    case 'init':
      canvas        = msg.canvas;
      ctx           = canvas.getContext('2d', { alpha: false });
      maxSimPixels  = msg.isTouch ? SIM_PIXELS_MOBILE : SIM_PIXELS_DESKTOP;
      frameInterval = msg.isTouch ? Math.ceil(1000 / 30) : 0;
      initTables();
      applySize(msg.width, msg.height);
      startTime = performance.now();
      startLoop();
      break;

    case 'resize':
      if (ctx) applySize(msg.width, msg.height);
      break;

    case 'visibility':
      if (msg.hidden) { stopLoop(); }
      else            { startLoop(); }
      break;

    case 'stop':
      stopLoop();
      break;
  }
};
