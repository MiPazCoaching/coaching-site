// assets/js/theme-switcher.js
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

  const themeButtons = themeMenu.querySelectorAll('button[data-theme-choice]');
  const contrastButtons = themeMenu.querySelectorAll('button[data-contrast-choice]');

  let currentTheme = null;
  let currentContrast = null;

  function applyThemeAndContrast(theme, contrast) {
    currentTheme = theme;
    currentContrast = contrast;

    htmlElement.setAttribute('data-theme', theme);
    contrast && contrast !== 'default'
      ? htmlElement.setAttribute('data-contrast', contrast)
      : htmlElement.removeAttribute('data-contrast');

    localStorage.setItem('theme', theme);
    localStorage.setItem('contrast', contrast || 'default');

    updateImagesForTheme(theme);
    loadParticles(theme, contrast);
    updateTippyTheme(theme);
    updateMobileBarColor(theme);

    themeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.themeChoice === theme);
    });

    contrastButtons.forEach(btn => {
      const c = btn.dataset.contrastChoice || 'default';
      btn.classList.toggle('active', c === (contrast || 'default'));
    });
  }

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.themeChoice;
      applyThemeAndContrast(theme, currentContrast || 'default');
      themeMenu.classList.remove('show');
      themeToggle.setAttribute('aria-expanded', 'false');
      themeToggle.focus();
    });
  });

  contrastButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const contrast = btn.dataset.contrastChoice || 'default';
      applyThemeAndContrast(currentTheme || 'dark', contrast);
    });
  });

  themeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const expanded = themeMenu.classList.toggle('show');
    themeToggle.setAttribute('aria-expanded', expanded);
    if (expanded) themeMenu.querySelector('button')?.focus();
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

  const storedTheme = localStorage.getItem('theme') || 'dark';
  const storedContrast = localStorage.getItem('contrast') || 'default';
  applyThemeAndContrast(storedTheme, storedContrast);
}

