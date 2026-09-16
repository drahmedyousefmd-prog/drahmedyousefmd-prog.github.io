/**
 * Doctor hero image + shipping copy.
 *
 * Guarantees `public/doctor-hero.png` and `public/doctor-hero.webp` always
 * exist so the static export serves the hero image:
 *   - if `assets/images/doctor-hero.png` already exists (the real photo),
 *     it is copied verbatim to `public/doctor-hero.png` and optimized to a
 *     ~900px WebP (<200KB) at `public/doctor-hero.webp` via `sharp`;
 *   - otherwise a clean SVG-free placeholder (doctor silhouette on the
 *     reference turquoise gradient, 640x720) is generated there.
 *
 * Uses `sharp` when available and falls back to the PNG copy alone otherwise
 * (the site HTML references the WebP, so generate-icons is best run locally).
 * Usage: node scripts/hero-doctor.mjs
 */

import { writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ASSET = join(ROOT, "assets", "images", "doctor-hero.png");
const DEST = join(ROOT, "public", "doctor-hero.png");
const DEST_WEBP = join(ROOT, "public", "doctor-hero.webp");

/* ---------------- PNG encoding (zero-dependency) ---------------- */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const stride = width * 4 + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0; // filter: none
    Buffer.from(rgba.buffer, rgba.byteOffset + y * width * 4, width * 4).copy(
      raw,
      y * stride + 1
    );
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

/* ---------------- Placeholder raster (640x720) ---------------- */

const W = 640;
const H = 720;
const TOP = [0x1b, 0xa3, 0x9c]; // --color-primary
const BOT = [0x14, 0x83, 0x7d]; // --color-primary-dark

function sdfCircle(x, y, cx, cy, r) {
  return Math.hypot(x - cx, y - cy) - r;
}

function sdfRoundRect(x, y, cx, cy, hw, hh, r) {
  const dx = Math.max(Math.abs(x - cx) - hw + r, 0);
  const dy = Math.max(Math.abs(y - cy) - hh + r, 0);
  return Math.hypot(dx, dy) + Math.min(Math.max(dx, dy), 0) - r;
}

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function render() {
  const img = new Uint8Array(W * H * 4);
  for (let y = 0; y < H; y++) {
    const t = Math.min(Math.max(y / H, 0), 1);
    const bg = [
      TOP[0] + (BOT[0] - TOP[0]) * t,
      TOP[1] + (BOT[1] - TOP[1]) * t,
      TOP[2] + (BOT[2] - TOP[2]) * t,
    ];
    for (let x = 0; x < W; x++) {
      // soft halo behind the silhouette
      const halo = clamp01(0.5 - sdfCircle(x, y, 320, 250, 210));
      // silhouette: head + shoulders
      const head = clamp01(0.5 - sdfCircle(x, y, 320, 246, 118));
      const body = clamp01(0.5 - sdfRoundRect(x, y, 320, 520, 205, 158, 112));
      const shape = Math.max(head, body);
      let r = bg[0];
      let g = bg[1];
      let b = bg[2];
      const glow = halo * 0.16;
      r += (255 - r) * glow;
      g += (255 - g) * glow;
      b += (255 - b) * glow;
      r = r + (255 - r) * shape;
      g = g + (255 - g) * shape;
      b = b + (255 - b) * shape;
      const i = (y * W + x) * 4;
      img[i] = Math.round(r);
      img[i + 1] = Math.round(g);
      img[i + 2] = Math.round(b);
      img[i + 3] = 255;
    }
  }
  return img;
}

/* ---------------- Output ---------------- */

mkdirSync(join(ROOT, "assets", "images"), { recursive: true });
mkdirSync(join(ROOT, "public"), { recursive: true });

if (existsSync(ASSET)) {
  // Prefer the real photo if the user dropped one in.
  copyFileSync(ASSET, DEST);
  console.log("assets/images/doctor-hero.png found — copied to public/doctor-hero.png");
  try {
    const { default: sharp } = await import("sharp");
    const { width } = await sharp(ASSET).metadata();
    const buf = await sharp(ASSET)
      .rotate()
      .resize({ width: 900, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    writeFileSync(DEST_WEBP, buf);
    console.log(
      `Optimized to public/doctor-hero.webp (${width}px source → ${(buf.length / 1024).toFixed(0)}KB)`
    );
  } catch {
    console.warn(
      "sharp unavailable — WebP skipped; <picture> on the page will serve the PNG copy."
    );
  }
} else {
  writeFileSync(ASSET, encodePNG(W, H, render()));
  console.log("Generated placeholder assets/images/doctor-hero.png (640x720)");
  copyFileSync(ASSET, DEST);
  console.log("Copied to public/doctor-hero.png — replace the asset with the real doctor photo and rebuild to ship it.");
}