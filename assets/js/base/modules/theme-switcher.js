import {
  loadParticles,
  updateImagesForTheme,
  updateTippyTheme,
  updateMobileBarColor
} from './theme-helpers.js';

export function setupThemeSwitcher({ themeToggle, themeDropdown, themeMenu, htmlElement }) {
  if (!(themeToggle && themeDropdown && themeMenu && htmlElement)) return;

  themeToggle.setAttribute('aria-haspopup', 'true');
  themeToggle.setAttribute('aria-expanded', 'false');

  // Obtener todos los botones que elijan tema base y contraste
  // Buscamos dentro de themeMenu porque allí hay submenús también
  const themeButtons = themeMenu.querySelectorAll('button[data-theme-choice]');
  const contrastButtons = themeMenu.querySelectorAll('button[data-contrast-choice]');

  // Estado actual
  let currentTheme = null;
  let currentContrast = null;

  // Función para actualizar botones activos y aplicar atributos
  function applyThemeAndContrast(theme, contrast) {
    currentTheme = theme;
    currentContrast = contrast;

    htmlElement.setAttribute('data-theme', theme);
    if (contrast && contrast !== 'default') {
      htmlElement.setAttribute('data-contrast', contrast);
    } else {
      htmlElement.removeAttribute('data-contrast');
    }

    localStorage.setItem('theme', theme);
    localStorage.setItem('contrast', contrast || 'default');

    updateImagesForTheme(theme);
    loadParticles(theme, contrast);
    updateTippyTheme(theme);
    updateMobileBarColor(theme);

    // Actualizar estilos activos para botones de tema
    themeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme-choice') === theme);
    });

    // Actualizar estilos activos para botones de contraste
    contrastButtons.forEach(btn => {
      const c = btn.getAttribute('data-contrast-choice') || 'default';
      btn.classList.toggle('active', c === (contrast || 'default'));
    });
  }

  // Manejo click en botones de tema base
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedTheme = btn.getAttribute('data-theme-choice');
      // Mantener contraste actual o default si no hay
      const contrastToApply = currentContrast || 'default';

      applyThemeAndContrast(selectedTheme, contrastToApply);
      // Cerrar menú y actualizar aria
      themeMenu.classList.remove('show');
      themeToggle.setAttribute('aria-expanded', 'false');
      themeToggle.focus();
    });
  });

  // Manejo click en botones de contraste
  contrastButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedContrast = btn.getAttribute('data-contrast-choice') || 'default';
      // Mantener tema actual
      const themeToApply = currentTheme || 'dark';

      applyThemeAndContrast(themeToApply, selectedContrast);
      // No cerramos menú para que puedan elegir otros ajustes fácilmente
      // Pero si quieres cerrar, descomenta las siguientes líneas:
      // themeMenu.classList.remove('show');
      // themeToggle.setAttribute('aria-expanded', 'false');
      // themeToggle.focus();
    });
  });

  // Toggle dropdown menú principal
  themeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const expanded = themeMenu.classList.toggle('show');
    themeToggle.setAttribute('aria-expanded', expanded);
    if (expanded) themeMenu.querySelector('button')?.focus();
  });

  // Cerrar menú si clic fuera
  document.addEventListener('click', (e) => {
    if (!themeDropdown.contains(e.target)) {
      themeMenu.classList.remove('show');
      themeToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Cerrar menú con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && themeMenu.classList.contains('show')) {
      themeMenu.classList.remove('show');
      themeToggle.setAttribute('aria-expanded', 'false');
      themeToggle.focus();
    }
  });

  // Navegación con flechas arriba/abajo dentro del menú
  themeMenu.addEventListener('keydown', (e) => {
    const items = Array.from(themeMenu.querySelectorAll('button'));
    const i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    }
  });

  // Inicializar con tema y contraste guardados o por defecto
  const storedTheme = localStorage.getItem('theme') || 'dark';
  const storedContrast = localStorage.getItem('contrast') || 'default';
  applyThemeAndContrast(storedTheme, storedContrast);
}
