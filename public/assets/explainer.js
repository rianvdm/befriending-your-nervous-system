const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function syncSvgMotion() {
  for (const svg of document.querySelectorAll('svg')) {
    if (typeof svg.pauseAnimations !== 'function') continue;

    if (reducedMotion.matches) {
      // Hold SMIL figures at a useful point instead of leaving animated parts
      // hidden at time zero.
      const staticTime = Number(svg.dataset.reducedMotionTime ?? 3);
      svg.setCurrentTime(staticTime);
      svg.pauseAnimations();
    } else {
      svg.unpauseAnimations();
    }
  }
}

syncSvgMotion();

if (typeof reducedMotion.addEventListener === 'function') {
  reducedMotion.addEventListener('change', syncSvgMotion);
} else {
  reducedMotion.addListener(syncSvgMotion);
}
