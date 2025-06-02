// assets/js/theme-helpers.js

const BASE_URL = '/coaching-site';

export function setTheme(theme) {
  const html = document.documentElement;

  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  loadParticles(theme);
  updateImagesForTheme(theme);
  updateTippyTheme(theme);
  updateMobileBarColor(theme);

  // Opcional: resaltar botón activo
  document.querySelectorAll('[data-theme-choice]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-theme-choice') === theme);
  });
}

export function loadParticles(theme) {
  let configFile = 'particles-light.json';

  if (theme.includes('dark')) configFile = 'particles-dark.json';
  if (theme.includes('colorblind')) configFile = 'particles-colorblind.json';

  if (window.pJSDom?.length > 0) {
    window.pJSDom[0].pJS.fn.vendors.destroypJS();
    window.pJSDom = [];
  }

  particlesJS.load('particles-js', `${BASE_URL}/assets/particles/${configFile}`);
}

export function updateImagesForTheme(theme) {
  const heroHeader = document.querySelector('header.hero');
  if (!heroHeader) return;

  const { imgDark, imgLight } = heroHeader.dataset;
  if (imgDark && imgLight) {
    const useDark = ['dark', 'colorblind', 'colorblind-dark'].some(t => theme.includes(t));
    heroHeader.style.transition = 'background-image 0.5s ease-in-out';
    heroHeader.style.backgroundImage = `url('${useDark ? imgDark : imgLight}')`;
  }
}

export function updateTippyTheme(theme) {
  if (window.tippy) {
    window.tippy.setDefaultProps({ theme });
  }
}

export function updateMobileBarColor(theme) {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (!metaThemeColor) return;

  let color = '#ffffff';
  if (theme.includes('dark')) color = '#0d1117';
  if (theme.includes('colorblind')) color = '#222';

  metaThemeColor.setAttribute('content', color);
}
