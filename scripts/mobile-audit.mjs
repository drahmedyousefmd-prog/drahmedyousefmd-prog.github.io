// Mobile layout audit for the static export in ./out
// Usage: node scripts/mobile-audit.mjs
// Uses the system Chrome (channel: "chrome") so no browser download is needed.
import http from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "out");
const SHOTS = path.join(ROOT, "mobile-audit-screenshots");
const BASE_PATH = (process.env.AUDIT_BASE ?? "").replace(/\/+$/, "");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function resolveServerFile(rawUrl) {
  let url = (rawUrl.split("?")[0] || "/").replace(/\/+$/, "") || "/";
  if (BASE_PATH && (url === BASE_PATH || url.startsWith(BASE_PATH + "/"))) {
    url = url.slice(BASE_PATH.length) || "/";
  }
  if (url === "/") return path.join(OUT, "index.html");
  if (url.startsWith("/_next/")) {
    const p = path.join(OUT, url);
    return existsSync(p) ? p : null;
  }
  const candidates = [
    path.join(OUT, url),
    path.join(OUT, url + ".html"),
    path.join(OUT, url, "index.html"),
  ];
  for (const c of candidates) {
    if (existsSync(c)) return c;
  }
  return null;
}

function startServer() {
  const server = http.createServer(async (req, res) => {
    const file = resolveServerFile(req.url ?? "/");
    if (!file) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    try {
      const body = await readFile(file);
      res.writeHead(200, {
        "content-type": MIME[path.extname(file)] ?? "application/octet-stream",
      });
      res.end(body);
    } catch {
      res.writeHead(500);
      res.end("error");
    }
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

const VIEWPORTS = [
  { name: "360x800", width: 360, height: 800 },
  { name: "390x844", width: 390, height: 844 },
  { name: "412x915", width: 412, height: 915 },
  { name: "768x1024", width: 768, height: 1024 },
];

const ROUTES =
  process.env.AUDIT_MOBILE === "1"
    ? [
        { name: "home", path: "/" },
        { name: "services", path: "/services" },
      ]
    : [
        { name: "home", path: "/" },
        { name: "categories", path: "/doctor/categories" },
        { name: "chapter", path: "/doctor/chapter/psychiatry" },
        { name: "case", path: "/doctor/case/rochetta-001" },
      ];

const MIN_TOUCH = 44;
const TARGET_SELECTOR =
  "button, a.btn-pill, a.nav-cta, .recent-chip, .nav-burger, a.chapter-chip, .case-tab, .acc-toggle";

let BASE = "";

async function auditPage(page, route, vp) {
  const problems = [];
  await page.goto(`${BASE}${route.path}`, { waitUntil: "networkidle", timeout: 30000 });

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  if (overflow.scrollWidth > overflow.innerWidth + 1) {
    problems.push(
      `horizontal overflow: scrollWidth=${overflow.scrollWidth} > innerWidth=${overflow.innerWidth}`
    );
  }

  const smallTargets = await page.evaluate(
    ({ min, sel }) => {
      const out = [];
      for (const el of Array.from(document.querySelectorAll(sel))) {
        const r = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") continue;
        if (r.width === 0 || r.height === 0) continue;
        if (r.width < min - 0.5 || r.height < min - 0.5) {
          const label = (el.textContent || el.getAttribute("aria-label") || el.tagName)
            .trim()
            .slice(0, 32);
          const cls = String(el.className).split(" ").slice(0, 2).join(".");
          out.push(`${el.tagName}.${cls} "${label}" ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
      }
      return out;
    },
    { min: MIN_TOUCH, sel: TARGET_SELECTOR }
  );
  for (const t of smallTargets) problems.push(`touch target < ${MIN_TOUCH}: ${t}`);

  await page.screenshot({
    path: path.join(SHOTS, `${route.name}-${vp.name}.png`),
    fullPage: true,
  });
  return problems;
}

async function auditDrawer(page) {
  const problems = [];
  const burger = page.locator(".nav-burger");
  if ((await burger.count()) === 0 || !(await burger.isVisible())) {
    problems.push("hamburger not visible on mobile");
    return problems;
  }
  await burger.click();
  await page.waitForTimeout(150);
  const drawer = page.locator(".nav-drawer.open");
  if (!(await drawer.isVisible())) {
    problems.push("drawer did not open after tapping the hamburger");
    return problems;
  }
  const locked = await page.evaluate(() => document.body.style.overflow);
  if (locked !== "hidden") problems.push("body scroll not locked while drawer is open");
  const links = await drawer.locator("a").count();
  if (links === 0) problems.push("drawer has no links");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);
  if (await page.locator(".nav-drawer.open").count()) {
    problems.push("drawer did not close on Escape");
  }
  return problems;
}

async function main() {
  if (!existsSync(OUT)) {
    console.error("No ./out build found — run `npm run build` first.");
    process.exit(2);
  }
  await mkdir(SHOTS, { recursive: true });
  const { server, port } = await startServer();
  BASE = `http://127.0.0.1:${port}`;

  let browser;
  try {
    browser = await chromium.launch({ channel: "chrome", args: ["--no-sandbox"] });
  } catch (e) {
    console.error("Could not launch Chrome:", e.message);
    server.close();
    process.exit(3);
  }

  let total = 0;
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: vp.width <= 480,
      hasTouch: true,
    });
    const page = await context.newPage();
    for (const route of ROUTES) {
      const problems = await auditPage(page, route, vp);
      if (route.name === "home" && vp.width <= 480) {
        problems.push(...(await auditDrawer(page)));
      }
      if (problems.length) {
        total += problems.length;
        console.log(`\n[FAIL] ${route.name} @ ${vp.name}`);
        for (const p of problems) console.log("   - " + p);
      } else {
        console.log(`[ok]   ${route.name} @ ${vp.name}`);
      }
    }
    await context.close();
  }

  await browser.close();
  server.close();
  console.log(`\nScreenshots -> ${SHOTS}`);
  if (total) {
    console.log(`\n${total} issue(s) found.`);
    process.exit(1);
  }
  console.log("\nNo issues found.");
}

main();
