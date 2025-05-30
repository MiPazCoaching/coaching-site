const BASE_URL = '/coaching-site'; // Ajusta según sea necesario

/**
 * Carga la configuración de partículas según el tema.
 * @param {string} theme - 'dark' o 'light'.
 */
export function loadParticles(theme) {
  const configFile = theme === 'dark' ? 'particles-dark.json' : 'particles-light.json';
  if (window.pJSDom && window.pJSDom.length > 0) {
    window.pJSDom[0].pJS.fn.vendors.destroypJS();
    window.pJSDom = [];
  }
  particlesJS.load('particles-js', `${BASE_URL}/assets/particles/${configFile}`);
}

/**
 * Cambia la imagen de fondo del header según el tema.
 * @param {string} theme - 'dark' o 'light'.
 */
export function updateImagesForTheme(theme) {
  const heroHeader = document.querySelector('header.hero');
  if (heroHeader?.dataset.imgDark && heroHeader?.dataset.imgLight) {
    heroHeader.style.transition = 'background-image 0.5s ease-in-out';
    heroHeader.style.backgroundImage = `url('${theme === 'dark' ? heroHeader.dataset.imgDark : heroHeader.dataset.imgLight}')`;
  }
}

/**
 * Actualiza la configuración de tippy.js para que use el tema actual.
 * @param {string} theme - 'dark' o 'light'.
 */
export function updateTippyTheme(theme) {
  if (window.tippy) {
    window.tippy.setDefaultProps({ theme });
  }
}
