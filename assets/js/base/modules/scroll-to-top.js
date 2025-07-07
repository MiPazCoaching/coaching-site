// modules/scroll-to-top.js
import { fadeIn, fadeOut } from './helpers.js';

export function initScrollToTop() {
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');
  if (!scrollToTopBtn) return;

  let scrollToTopVisible = false;

  window.addEventListener('scroll', () => {
    const shouldBeVisible = window.scrollY > 300;

    if (shouldBeVisible !== scrollToTopVisible) {
      scrollToTopVisible = shouldBeVisible;
      requestAnimationFrame(() => {
        if (scrollToTopVisible) {
          fadeIn(scrollToTopBtn);
        } else {
          fadeOut(scrollToTopBtn);
        }
      });
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
