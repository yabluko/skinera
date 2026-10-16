import { useEffect } from 'react';

// Matches --ease-in-out in global.css (cubic-bezier(0.77, 0, 0.175, 1))
const bezier = (x1: number, y1: number, x2: number, y2: number) => {
  const a = (p1: number, p2: number) => 1 - 3 * p2 + 3 * p1;
  const b = (p1: number, p2: number) => 3 * p2 - 6 * p1;
  const c = (p1: number) => 3 * p1;
  const at = (t: number, p1: number, p2: number) => ((a(p1, p2) * t + b(p1, p2)) * t + c(p1)) * t;
  const slope = (t: number, p1: number, p2: number) =>
    3 * a(p1, p2) * t * t + 2 * b(p1, p2) * t + c(p1);
  return (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const s = slope(t, x1, x2);
      if (Math.abs(s) < 1e-6) break;
      t -= (at(t, x1, x2) - x) / s;
    }
    return at(Math.min(Math.max(t, 0), 1), y1, y2);
  };
};

const ease = bezier(0.77, 0, 0.175, 1);
const DURATION = 1400;
// swallow trackpad inertia after landing so it doesn't overshoot past the target
const SETTLE = 450;
// space kept between the fixed header and the target's content after landing
const LAND_GAP = 32;
const SCROLL_KEYS = new Set(['ArrowDown', 'PageDown', ' ']);

/**
 * Downward scroll inside the hero glides once to the target section (content aligned under the
 * fixed header). Upward scroll and everything below the target stay native.
 * Off for prefers-reduced-motion and while a modal is open.
 */
export function useHeroGlide(targetId: string) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let busy = false;
    let frame = 0;
    let touchStartY: number | null = null;

    const targetTop = () => {
      const el = document.getElementById(targetId);
      if (!el) return null;
      const header =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0;
      // skip most of the section's top padding so its content, not empty space, fills the view
      const pad = parseFloat(getComputedStyle(el).paddingTop) || 0;
      const skip = Math.max(0, pad - LAND_GAP);
      return Math.round(el.getBoundingClientRect().top + window.scrollY + skip - header);
    };

    const canGlide = () => {
      if (document.body.classList.contains('modal-open')) return null;
      const top = targetTop();
      return top !== null && window.scrollY < top - 8 ? top : null;
    };

    const glide = (to: number) => {
      busy = true;
      const from = window.scrollY;
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / DURATION, 1);
        window.scrollTo(0, from + (to - from) * ease(p));
        if (p < 1) frame = requestAnimationFrame(step);
        else window.setTimeout(() => (busy = false), SETTLE);
      };
      frame = requestAnimationFrame(step);
    };

    const onWheel = (e: WheelEvent) => {
      if (busy) return e.preventDefault();
      if (e.deltaY <= 0 || e.ctrlKey) return;
      const to = canGlide();
      if (to === null) return;
      e.preventDefault();
      glide(to);
    };

    const onKey = (e: KeyboardEvent) => {
      if (!SCROLL_KEYS.has(e.key) || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const el = document.activeElement;
      if (el && el.closest('input, textarea, select, button, video, [contenteditable="true"]'))
        return;
      if (busy) return e.preventDefault();
      const to = canGlide();
      if (to === null) return;
      e.preventDefault();
      glide(to);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? null;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0]?.clientY;
      if (busy || touchStartY === null || endY === undefined) return;
      const swipedDown = touchStartY - endY > 30; // finger moved up → page scrolls down
      touchStartY = null;
      const to = swipedDown ? canGlide() : null;
      if (to !== null) glide(to);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [targetId]);
}
