# What that therapy word means

Visual, beginner-level introductions to psychology and therapy concepts. One idea per page, big pictures, few words, and nothing assumed about what the reader already knows.

**Live:** https://therapywords.elezea.com (also at https://befriending-your-nervous-system.rian-db8.workers.dev)

| Page | Subject |
|---|---|
| `/` | Landing page: the site name, a welcome, and one colour slab per explainer |
| `/tist/` | **The thing you do to cope is trying to help** — Janina Fisher's Trauma-Informed Stabilization Treatment: the hospital it began in, being triggered, why the cut works, the split into a going-on-with-normal-life side and five survival parts, suicide as the fight part turned inward, the word "I", and what Fisher teaches people to do |
| `/ifs/` | **There are no bad parts** — Richard Schwartz's Internal Family Systems: parts as a family, the three jobs they take (managers, firefighters, exiles), the rule that protectors go first, the Self, blending, and what a session does |
| `/emdr/` | **Some memories never turn into the past** — Francine Shapiro's EMDR: the unprocessed-memory model, what happens in a session, what changes, whether the eye movements matter, and the full eight-phase practice |
| `/brainspotting/` | **Where you look affects how you feel** — David Grand's Brainspotting: the 2003 discovery, the orienting reflex, what a brainspot is, the three ways of finding one, what a session actually consists of, the dual attunement frame, and how well the method stands up |
| `/polyvagal/` | **Your body decides before you do** — Deb Dana on Polyvagal Theory: the vagus nerve and where its traffic actually flows, neuroception, the three-rung ladder, why you climb it in order, "story follows state", co-regulation, glimmers, and the four R's |

## What's here

```
public/
  index.html            landing page; one <a class="shelf-slab"> per explainer
  assets/explainer.css  the entire design system, shared by every page
  assets/explainer.js   reduced-motion handling for inline SVG animation
  <slug>/index.html     one explainer
  <slug>/og.png         its share image, generated
  og.png, favicon.*, apple-touch-icon.png, sitemap.xml, robots.txt
scripts/build-og.mjs    renders the share images, favicon PNGs and sitemap
wrangler.jsonc          assets-only Worker config, custom domain
```

There is no framework or bundler. Motion is CSS animation and SVG `animateMotion`/SMIL. One small shared script pauses SMIL figures at a useful static frame when the browser requests reduced motion. Pages read the browser's colour scheme for light and dark.

`explainer.css` holds every style. A new page adds markup and inline SVG; if it needs a style that isn't there, the style goes in the shared sheet so every page gets it. The three accent colours are named `--accent-a/b/c` and `--field-a/b/c` on purpose — each page decides what its own three stand for.

Pages are built with the `building-psych-explainers` skill in the [product-ai](https://github.com/rianvdm) repo, which carries the beat structure, the required page furniture, and the four review passes.

## Develop

```bash
npx wrangler dev
```

The CSS is linked at an absolute path (`/assets/explainer.css`), so opening a page over `file://` will render it unstyled. Any static server works — `python3 -m http.server` from inside `public/` is enough.

## Deploy

```bash
npx wrangler deploy
```

Deploys to the personal Cloudflare account, on the custom domain `therapywords.elezea.com` (the `routes` entry in `wrangler.jsonc`; `workers_dev: true` keeps the original hostname serving as well). Because there is no `main` script, this is an assets-only Worker: Cloudflare serves `public/` directly and no Worker code runs. `html_handling` defaults to `auto-trailing-slash`, so `/brainspotting` 307-redirects to `/brainspotting/`.

## Share images, favicon, sitemap

Every page carries canonical, Open Graph, Twitter-card and icon tags in its head. The share images are not drawn by hand: `node scripts/build-og.mjs` reads each `<a class="shelf-slab">` on the landing page — colour, byline, title, glyph — wraps it in a 1200×630 page on `explainer.css`, and screenshots it with headless Chrome (`/Applications/Google Chrome.app`, no npm dependencies) to `public/<slug>/og.png`. The same run renders `favicon.png` and `apple-touch-icon.png` from `favicon.svg`, and rewrites `sitemap.xml`. Run it after adding a page, and commit what it writes.

## Sourcing and caveats

Every page quotes its originator directly, from a transcript or their own writing rather than a summary, and every page ends with a sources list and a `<p class="caveat">` stating plainly how well evidenced the idea is.

**Polyvagal.** Drawn mainly from the [Sounds True interview transcript](https://soundstrue.com/a/resources/transcript/deb-dana-befriending-your-nervous-system/), plus [Anchored](https://www.soundstrue.com/products/anchored) and [Rhythm of Regulation](https://www.rhythmofregulation.com/). The evolutionary dates are the theory's standard account. The evidence footer pairs [a 2026 evaluation by 39 authors](https://doi.org/10.36131/cnfioritieditore20260110), which calls the core claims untenable, with [Porges's response](https://doi.org/10.36131/cnfioritieditore20260111).

**Brainspotting.** Drawn mainly from Grand's [NICABM interview transcript](https://s3.amazonaws.com/nicabm-stealthseminar/Rethinking-trauma-new/David/NICABM-DavidGrand-Transcript2.pdf). The evidence base is thin and actively disputed — one small single-therapist randomised trial, a handful of comparisons on non-clinical samples, a proposed brain mechanism published as a hypothesis, and a published exchange in *Medical Hypotheses* over whether the method qualifies as pseudoscience. The page footer states all of this and the page describes the method as Grand teaches it rather than endorsing it.

**IFS.** Schwartz's words come from his [Sounds True interview transcript](https://resources.soundstrue.com/transcript/no-bad-parts/) and his own [account of the model's evolution](https://ifs-institute.com/resources/articles/evolution-internal-family-systems-model-dr-richard-schwartz-ph-d). The evidence footer leans on a 2025 scoping review: twenty-seven studies, two of them randomised.

**TIST.** Fisher's spoken words come from her [Therapy on the Cutting Edge interview](https://www.therapyonthecuttingedge.com/janinafishertranscript.html); the five parts and the "how does it help" question are from her own [2021 training slides](https://dmhrspi.org/wp-content/uploads/2022/06/TISTTrainingDMHModuleOne2021Handout.pdf), and the pilots from her [2017 paper](https://janinafisher.com/wp-content/uploads/2023/03/Janina-Fisher-Trauma-Informed-Stabilization-Treatment-TIST-a-New-Approach-to-Treating-Unsafe-Behavior_compressed.pdf), which says itself that TIST "has yet to develop a formal evidence base". One observational study of thirty-two in-patients is under way in Norway.

**EMDR.** Shapiro's words come from her [Psychotherapy.net interview](https://www.psychotherapy.net/interview/francine-shapiro-emdr); her institute supplies the 1987 park story and eight phases. The evidence footer includes the main meta-analyses, the additive effect of eye movements, and the VA/DoD and APA guideline positions.

## Licence

The code is free to reuse. The ideas belong to the people who developed them — go buy their books.
