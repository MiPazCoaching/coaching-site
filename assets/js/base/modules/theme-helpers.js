const BASE_URL = '/coaching-site';

export function loadParticles(theme, contrast) {
  // Puedes personalizar config según combinación
  let configFile = 'particles-light.json'; // default

  if (theme.includes('dark')) configFile = 'particles-dark.json';
  if (theme.includes('colorblind')) configFile = 'particles-colorblind.json';

  // Opcional: si quieres variar config según contraste, añade lógica aquí

  if (window.pJSDom?.length > 0) {
    window.pJSDom[0].pJS.fn.vendors.destroypJS();
    window.pJSDom = [];
  }
  particlesJS.load('particles-js', `${BASE_URL}/assets/particles/${configFile}`);
}

export function updateImagesForTheme(theme) {
  const heroHeader = document.querySelector('header.hero');
  if (heroHeader?.dataset.imgDark && heroHeader?.dataset.imgLight) {
    heroHeader.style.transition = 'background-image 0.5s ease-in-out';
    // Aquí, para temas colorblind usa imgDark (o adapta)
    const darkThemes = ['dark', 'colorblind', 'colorblind-dark'];
    const useDarkImage = darkThemes.some(t => theme.includes(t));
    heroHeader.style.backgroundImage = `url('${useDarkImage ? heroHeader.dataset.imgDark : heroHeader.dataset.imgLight}')`;
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

  // Puedes personalizar colores por tema y contraste
  let color = '#ffffff'; // light default
  if (theme.includes('dark')) color = '#0d1117';
  if (theme.includes('colorblind')) color = '#222'; // ejemplo para colorblind

  metaThemeColor.setAttribute('content', color);
}
