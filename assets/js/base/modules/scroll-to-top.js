import { fadeIn, fadeOut } from './helpers.js';

/**
 * Controla el botón "scroll to top" con aparición según scroll y smooth scroll al hacer click.
 * @param {HTMLElement} scrollToTopBtn - Botón para hacer scroll arriba.
 */
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
