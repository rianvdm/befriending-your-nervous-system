#!/usr/bin/env node
// Builds the share images, the favicon PNGs and the sitemap from what is already
// on the landing page. No npm dependencies: Node built-ins plus headless Chrome.
//
//   node scripts/build-og.mjs
//
// Each <a class="shelf-slab"> in public/index.html already carries the page's
// colour, its "TIST · Janina Fisher" line, its title and its glyph, so that markup
// is wrapped in a 1200×630 page on explainer.css and screenshotted. A new explainer
// gets its og.png by adding its slab and running this again.

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, statSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const ROOT = resolve(new URL("..", import.meta.url).pathname);
const PUBLIC = join(ROOT, "public");
const CSS = `file://${join(PUBLIC, "assets", "explainer.css")}`;
const SITE = "https://therapywords.elezea.com";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const work = mkdtempSync(join(tmpdir(), "og-"));

function shoot({ html, out, width, height, transparent = false }) {
  const page = join(work, `${width}x${height}-${Math.random().toString(36).slice(2)}.html`);
  writeFileSync(page, html);
  const args = [
    "--headless=new", "--disable-gpu", "--hide-scrollbars",
    `--window-size=${width},${height}`,
    "--virtual-time-budget=4000",
    `--screenshot=${out}`,
    `file://${page}`,
  ];
  if (transparent) args.splice(3, 0, "--default-background-color=00000000");
  execFileSync(CHROME, args, { stdio: "ignore" });
  console.log(`wrote ${out.replace(ROOT + "/", "")}`);
}

// Hold every SMIL figure at the same frame the reduced-motion script uses, so a
// glyph that fades in or travels is caught at a useful moment rather than at t=0.
const FREEZE = `<script>
  for (const svg of document.querySelectorAll("svg")) {
    svg.pauseAnimations();
    svg.setCurrentTime(Number(svg.dataset.reducedMotionTime ?? 3));
  }
</script>`;

const shell = (body, style) => `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<link rel="stylesheet" href="${CSS}"><style>
html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
${style}
</style></head><body>${body}${FREEZE}</body></html>`;

// ---- one share image per explainer -----------------------------------------

const index = readFileSync(join(PUBLIC, "index.html"), "utf8");
const slabs = [...index.matchAll(/<a class="shelf-slab ([abc])" href="\/([^/]+)\/">([\s\S]*?)<\/a>/g)];
if (!slabs.length) throw new Error("no shelf slabs found in public/index.html");

const SLAB_STYLE = `
.shelf-slab { display: block; width: 1200px; height: 630px; }
.shelf-inner { max-width: none; height: 630px; padding: 60px 84px; gap: 0 64px; align-items: center; }
.slab-pos { font-size: 22px; letter-spacing: .2em; margin: 0 0 28px; }
.shelf-slab h3 { font-size: 86px; max-width: 11ch; margin: 0 0 30px; text-decoration: none; }
.shelf-sub { font-size: 28px; line-height: 1.35; max-width: 30ch; margin: 0; }
.shelf-go { display: none; }
.glyph { width: 330px; }`;

const pages = [];
for (const [, colour, slug, inner] of slabs) {
  const out = join(PUBLIC, slug, "og.png");
  shoot({ html: shell(`<div class="shelf-slab ${colour}">${inner}</div>`, SLAB_STYLE), out, width: 1200, height: 630 });
  pages.push(slug);
}

// ---- the landing page: site name and the orb on the dark base ----------------

const LANDING = `<div class="card">
  <div>
    <p class="eyebrow">Therapy, explained from scratch</p>
    <h1>What that<br>therapy word<br>means</h1>
    <p class="sub">Polyvagal, EMDR, brainspotting, IFS, TIST. One idea per page, big pictures, few words, nothing assumed.</p>
  </div>
  <div class="orb"><i></i><b></b></div>
</div>`;
const LANDING_STYLE = `
body { background: #0e0d0b; color: #f4f0e8; }
.card { display: grid; grid-template-columns: 1fr auto; gap: 0 80px; align-items: center; height: 630px; padding: 60px 84px; }
.eyebrow { color: #887f72; font-size: 22px; letter-spacing: .2em; margin: 0 0 26px; }
h1 { font-size: 96px; line-height: .95; letter-spacing: -.045em; margin: 0 0 30px; }
.sub { font-family: var(--serif); font-size: 28px; line-height: 1.35; color: #a79e90; max-width: 30ch; margin: 0; }
.orb { position: relative; width: 320px; height: 320px; }
.orb i, .orb b { position: absolute; border-radius: 50%; }
.orb i { inset: 0; border: 1px solid rgba(244,240,232,.34); }
.orb b { inset: 44px; background: #4fc793; }`;
shoot({ html: shell(LANDING, LANDING_STYLE), out: join(PUBLIC, "og.png"), width: 1200, height: 630 });

// ---- favicon PNGs from favicon.svg -------------------------------------------

const favicon = readFileSync(join(PUBLIC, "favicon.svg"), "utf8");
const icon = (size, bg) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
html, body { margin: 0; width: ${size}px; height: ${size}px; background: ${bg}; overflow: hidden; }
svg { display: block; width: ${size}px; height: ${size}px; }
</style></head><body>${favicon}</body></html>`;
shoot({ html: icon(96, "transparent"), out: join(PUBLIC, "favicon.png"), width: 96, height: 96, transparent: true });
// Apple ignores transparency and rounds the corners itself, so this one sits on the
// dark base with the orb a little smaller than the tile.
shoot({
  html: icon(180, "#0e0d0b").replace("<svg", '<svg style="padding:18px;box-sizing:border-box"'),
  out: join(PUBLIC, "apple-touch-icon.png"), width: 180, height: 180,
});

// ---- sitemap ------------------------------------------------------------------

const lastmod = (file) => statSync(file).mtime.toISOString().slice(0, 10);
const urls = [
  { loc: `${SITE}/`, mod: lastmod(join(PUBLIC, "index.html")) },
  ...pages.map((slug) => ({ loc: `${SITE}/${slug}/`, mod: lastmod(join(PUBLIC, slug, "index.html")) })),
];
writeFileSync(join(PUBLIC, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.mod}</lastmod></url>`).join("\n") +
  `\n</urlset>\n`);
console.log(`wrote public/sitemap.xml (${urls.length} urls)`);

rmSync(work, { recursive: true, force: true });
