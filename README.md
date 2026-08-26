# Befriending Your Nervous System

A single-page visual introduction to Deb Dana's work on Polyvagal Theory, written for someone who knows nothing about it.

**Live:** https://befriending-your-nervous-system.rian-db8.workers.dev

Covers the vagus nerve and where its traffic actually flows, neuroception, the three-rung ladder (ventral vagal, sympathetic, dorsal vagal), why you climb it in order, "story follows state", co-regulation, glimmers, and the four R's.

## What's here

```
public/index.html    the whole page — one file, no build step, no dependencies
wrangler.jsonc       assets-only Worker config
```

There is no framework, no bundler and no JavaScript on the page. Motion is CSS animation and SVG `animateMotion`, and it all respects `prefers-reduced-motion`. The page reads from the browser's colour scheme for light and dark.

## Develop

```bash
npx wrangler dev
```

Or just open `public/index.html` in a browser — nothing about the page needs a server.

## Deploy

```bash
npx wrangler deploy
```

Deploys to the personal Cloudflare account. Because there is no `main` script, this is an assets-only Worker: Cloudflare serves `public/` directly and no Worker code runs.

## Sources

The content is drawn from Dana's own words where possible, mainly the [Sounds True interview transcript](https://soundstrue.com/a/resources/transcript/deb-dana-befriending-your-nervous-system/) for the [Befriending Your Nervous System](https://www.soundstrue.com/products/befriending-your-nervous-system) audio program, plus [Anchored](https://www.soundstrue.com/products/anchored) and [Rhythm of Regulation](https://www.rhythmofregulation.com/) for the four R's. Every source is linked at the foot of the page.

Two caveats, carried in the page footer as well as here. The evolutionary dates (~500m / ~400m / ~200m years) are Polyvagal Theory's standard account; Dana herself says only "hundreds of millions of years", so the page marks them approximate. And Polyvagal Theory has real critics in academic neuroscience even while it is widely used in trauma therapy, so the page explains Dana's framework on its own terms and makes no claim that the underlying science is settled.

## Licence

The code is free to reuse. The ideas belong to Deb Dana and Stephen Porges — go buy their books.
