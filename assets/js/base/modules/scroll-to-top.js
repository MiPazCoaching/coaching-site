// assets/js/scroll-to-top.js
import { fadeIn, fadeOut } from './helpers.js';

export function setupScrollToTop(scrollToTopBtn) {
  if (!scrollToTopBtn) return;

  let visible = false;

  window.addEventListener('scroll', () => {
    const shouldShow = window.scrollY > 100;
    if (shouldShow !== visible) {
      visible = shouldShow;
      shouldShow ? fadeIn(scrollToTopBtn) : fadeOut(scrollToTopBtn);
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
