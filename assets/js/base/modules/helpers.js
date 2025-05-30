/**
 * Funciones helper para efectos visuales y otros utilitarios.
 */

/**
 * Aplica efecto fade in a un elemento.
 * @param {HTMLElement} el - Elemento a mostrar con fade.
 */
export function fadeIn(el) {
  el.style.display = 'flex';
  el.style.opacity = 0;
  (function fade() {
    let val = parseFloat(el.style.opacity);
    if (!((val += 0.1) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
}

/**
 * Aplica efecto fade out a un elemento.
 * @param {HTMLElement} el - Elemento a ocultar con fade.
 */
export function fadeOut(el) {
  (function fade() {
    if ((el.style.opacity -= 0.1) < 0) {
      el.style.display = 'none';
    } else {
      requestAnimationFrame(fade);
    }
  })();
}
