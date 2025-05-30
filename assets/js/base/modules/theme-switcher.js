import { loadParticles, updateImagesForTheme, updateTippyTheme } from './theme-helpers.js';

/**
 * Controla el menú desplegable para cambio de tema (claro/oscuro).
 * @param {Object} options - Elementos DOM necesarios.
 * @param {HTMLElement} options.themeToggle - Botón que abre el menú de temas.
 * @param {HTMLElement} options.themeDropdown - Contenedor dropdown.
 * @param {HTMLElement} options.themeMenu - Menú con opciones.
 * @param {HTMLElement} options.htmlElement - Elemento HTML raíz para aplicar data-theme.
 */
export function setupThemeSwitcher({ themeToggle, themeDropdown, themeMenu, htmlElement }) {
  if (!(themeToggle && themeDropdown && themeMenu && htmlElement)) return;

  themeToggle.setAttribute('aria-haspopup', 'true');
  themeToggle.setAttribute('aria-expanded', 'false');

  const themeButtons = themeMenu.querySelectorAll('[data-theme-choice]');

  const setActiveTheme = (theme) => {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateImagesForTheme(theme);
    loadParticles(theme);
    updateTippyTheme(theme);

    themeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme-choice') === theme);
    });
  };

  themeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const expanded = themeMenu.classList.toggle('show');
    themeToggle.setAttribute('aria-expanded', expanded);
    const first = themeMenu.querySelector('button');
    if (first && expanded) first.focus();
  });

  document.addEventListener('click', (e) => {
    if (!themeDropdown.contains(e.target)) {
      themeMenu.classList.remove('show');
      themeToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && themeMenu.classList.contains('show')) {
      themeMenu.classList.remove('show');
      themeToggle.setAttribute('aria-expanded', 'false');
      themeToggle.focus();
    }
  });

  themeMenu.addEventListener('keydown', (e) => {
    const items = [...themeMenu.querySelectorAll('button')];
    const i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    }
  });

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedTheme = btn.getAttribute('data-theme-choice');
      setActiveTheme(selectedTheme);
      themeMenu.classList.remove('show');
      themeToggle.setAttribute('aria-expanded', 'false');
      themeToggle.focus();
    });
  });

  // Inicializar tema con valor de localStorage o dark por defecto
  let initialTheme = 'dark';
  try {
    const stored = localStorage.getItem('theme');
    if (stored) initialTheme = stored;
  } catch {}
  setActiveTheme(initialTheme);
}
