import * as THREE from "three";

/*
 * Procedural textures for the Safety Air scene, drawn on canvas at runtime so
 * the page ships no image files for the model. Every function returns
 * textures already configured (colour space, wrapping, repeat).
 */

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  return [c, c.getContext("2d")!] as const;
};

const tex = (c: HTMLCanvasElement, color: boolean, repeat: [number, number] = [1, 1]) => {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 4;
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

/** deterministic pseudo random, so the scene looks the same on every visit */
export function rng(seed = 7) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function noise(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number, seed: number) {
  const r = rng(seed);
  const img = ctx.getImageData(0, 0, w, h);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (r() - 0.5) * amount;
    img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

/** Trapezoidal steel sheet: one rib per tile, vertical ribs. Returns colour + normal + roughness. */
export function corrugated(base: string, ribsAcross: number, rows = 1) {
  const W = 128, H = 128;
  const profile = (x: number) => {
    // trapezoid: flat valley, slope, flat crest, slope
    const u = x / W;
    if (u < 0.3) return 0;
    if (u < 0.4) return (u - 0.3) / 0.1;
    if (u < 0.8) return 1;
    if (u < 0.9) return 1 - (u - 0.8) / 0.1;
    return 0;
  };
  const [nc, n] = canvas(W, H);
  const nimg = n.createImageData(W, H);
  for (let x = 0; x < W; x++) {
    const d = (profile(Math.min(W - 1, x + 1)) - profile(Math.max(0, x - 1))) * 6;
    const len = Math.hypot(d, 1);
    const r = ((-d / len) * 0.5 + 0.5) * 255, b = ((1 / len) * 0.5 + 0.5) * 255;
    for (let y = 0; y < H; y++) { const i = (y * W + x) * 4; nimg.data[i] = r; nimg.data[i + 1] = 128; nimg.data[i + 2] = b; nimg.data[i + 3] = 255; }
  }
  n.putImageData(nimg, 0, 0);

  const [cc, c] = canvas(W, H);
  c.fillStyle = base; c.fillRect(0, 0, W, H);
  for (let x = 0; x < W; x++) { const p = profile(x); c.fillStyle = `rgba(255,255,255,${p * 0.06})`; c.fillRect(x, 0, 1, H); }
  noise(c, W, H, 10, ribsAcross);

  return { map: tex(cc, true, [ribsAcross, rows]), normalMap: tex(nc, false, [ribsAcross, rows]) };
}

/** Ventilation louvre: horizontal slats with shading. */
export function louvre(slats: number) {
  const W = 64, H = 64;
  const [cc, c] = canvas(W, H);
  const g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#b3b9be"); g.addColorStop(0.55, "#959ca2"); g.addColorStop(0.64, "#5d6368"); g.addColorStop(1, "#80878d");
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  const [nc, n] = canvas(W, H);
  const ng = n.createLinearGradient(0, 0, 0, H);
  ng.addColorStop(0, "rgb(128,200,220)"); ng.addColorStop(0.58, "rgb(128,170,240)"); ng.addColorStop(0.62, "rgb(128,40,200)"); ng.addColorStop(1, "rgb(128,110,240)");
  n.fillStyle = ng; n.fillRect(0, 0, W, H);
  return { map: tex(cc, true, [1, slats]), normalMap: tex(nc, false, [1, slats]) };
}

/** Interlocking concrete pavers (running bond) like the site photos. */
export function pavers(repeat: number) {
  const W = 512, H = 512, r = rng(11);
  const [cc, c] = canvas(W, H);
  c.fillStyle = "#77746e"; c.fillRect(0, 0, W, H);
  const bw = 64, bh = 32;
  for (let row = 0; row < H / bh; row++) {
    const off = row % 2 ? bw / 2 : 0;
    for (let x = -bw; x < W + bw; x += bw) {
      const v = 128 + Math.floor(r() * 22), warm = Math.floor(r() * 6);
      c.fillStyle = `rgb(${v + warm},${v + warm - 2},${v - 4})`;
      c.fillRect(x + off + 2, row * bh + 2, bw - 4, bh - 4);
    }
  }
  noise(c, W, H, 16, 3);
  const [rc, rr] = canvas(W, H);
  rr.fillStyle = "#e6e6e6"; rr.fillRect(0, 0, W, H);
  for (let row = 0; row < H / bh; row++) { const off = row % 2 ? bw / 2 : 0; for (let x = -bw; x < W + bw; x += bw) { rr.fillStyle = "#c8c8c8"; rr.fillRect(x + off + 2, row * bh + 2, bw - 4, bh - 4); } }
  return { map: tex(cc, true, [repeat, repeat]), roughnessMap: tex(rc, false, [repeat, repeat]) };
}

export function grass(repeat: number) {
  const W = 256, H = 256, r = rng(5);
  const [cc, c] = canvas(W, H);
  c.fillStyle = "#5d7a45"; c.fillRect(0, 0, W, H);
  for (let i = 0; i < 2600; i++) {
    const g = 95 + Math.floor(r() * 60);
    c.fillStyle = `rgba(${g * 0.55},${g},${g * 0.42},0.55)`;
    c.fillRect(r() * W, r() * H, 1 + r() * 2, 2 + r() * 4);
  }
  return tex(cc, true, [repeat, repeat]);
}

export function concrete(repeat: number, base = "#b9b6ae") {
  const W = 256, H = 256;
  const [cc, c] = canvas(W, H);
  c.fillStyle = base; c.fillRect(0, 0, W, H);
  noise(c, W, H, 22, 9);
  return tex(cc, true, [repeat, repeat]);
}

/** Vertical sky gradient used as the scene background (matches the fog colour at the horizon). */
export function sky(horizon: string) {
  const [cc, c] = canvas(8, 256);
  const g = c.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, "#b9d3e8"); g.addColorStop(0.55, "#e3ecf1"); g.addColorStop(1, horizon);
  c.fillStyle = g; c.fillRect(0, 0, 8, 256);
  const t = new THREE.CanvasTexture(cc); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Front of a generic rotary screw package: cream doors, dark frame, controller, grilles. Neutral, no third-party brand. */
export function compressorFront() {
  const W = 256, H = 360;
  const [cc, c] = canvas(W, H);
  c.fillStyle = "#1d2023"; c.fillRect(0, 0, W, H);
  c.fillStyle = "#d8cfb0"; c.fillRect(88, 10, 160, H - 26);
  c.fillStyle = "#c9bf9f"; c.fillRect(166, 10, 2, H - 26);
  c.fillStyle = "#1d2023"; c.fillRect(150, 150, 4, 30); c.fillRect(180, 150, 4, 30);
  // controller
  c.fillStyle = "#c4c8cb"; c.fillRect(18, 60, 56, 62); c.fillStyle = "#233a4f"; c.fillRect(25, 67, 42, 30);
  c.fillStyle = "#7fd0ff"; c.fillRect(29, 72, 20, 3); c.fillRect(29, 79, 30, 2);
  c.fillStyle = "#d71920"; c.beginPath(); c.arc(46, 110, 6, 0, Math.PI * 2); c.fill();
  // grilles
  c.fillStyle = "#2a2e32";
  for (let y = 170; y < 320; y += 7) c.fillRect(16, y, 60, 3);
  return tex(cc, true);
}

export function compressorSide() {
  const W = 256, H = 360;
  const [cc, c] = canvas(W, H);
  c.fillStyle = "#d8cfb0"; c.fillRect(0, 0, W, H);
  c.fillStyle = "#1d2023"; c.fillRect(0, 0, 18, H); c.fillRect(W - 18, 0, 18, H); c.fillRect(0, H - 18, W, 18);
  c.fillStyle = "#2a2e32"; for (let y = 40; y < 150; y += 8) c.fillRect(40, y, W - 80, 4);
  noise(c, W, H, 6, 21);
  return tex(cc, true);
}

/** Safety Air badge: shield with the product name and TecAr wordmark (drawn, not an image). */
export function badge() {
  const W = 256, H = 340;
  const [cc, c] = canvas(W, H);
  c.clearRect(0, 0, W, H);
  c.fillStyle = "#ffffff"; c.strokeStyle = "#1d2023"; c.lineWidth = 8;
  c.beginPath(); c.moveTo(20, 20); c.lineTo(W - 20, 20); c.lineTo(W - 20, 200); c.quadraticCurveTo(W - 20, 280, W / 2, 320); c.quadraticCurveTo(20, 280, 20, 200); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = "#1d2023"; c.font = "700 30px Inter, Arial, sans-serif"; c.textAlign = "center";
  c.fillText("SAFETY AIR", W / 2, 70);
  c.lineWidth = 6; c.beginPath(); c.ellipse(W / 2, 150, 86, 42, 0, 0, Math.PI * 2); c.stroke();
  c.font = "italic 800 44px Inter, Arial, sans-serif"; c.fillStyle = "#1d2023"; c.fillText("tec", W / 2 - 30, 166);
  c.fillStyle = "#d71920"; c.fillText("AR", W / 2 + 38, 166);
  c.fillStyle = "#d71920"; c.font = "600 18px Inter, Arial, sans-serif"; c.fillText("CENTRAL DE AR", W / 2, 236);
  const t = new THREE.CanvasTexture(cc); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

/** Soft radial shadow that grounds the cabin (ambient occlusion on the yard). */
export function contactShadow() {
  const [cc, c] = canvas(256, 256);
  const g = c.createRadialGradient(128, 128, 30, 128, 128, 128);
  g.addColorStop(0, "rgba(0,0,0,0.42)"); g.addColorStop(0.55, "rgba(0,0,0,0.18)"); g.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = g; c.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(cc);
}
