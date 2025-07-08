// modules/theme/theme-switcher.js
import {
  loadParticles,
  updateImagesForTheme,
  updateTippyTheme,
  initTippy
} from '../utils/theme-helpers.js';

import { applyTheme } from './theme.js';

export async function initThemeSwitcher() {
  const themeMenuBtn = document.getElementById('themeMenuBtn');
  const themeMenu = document.getElementById('themeMenu');
  const themeButtons = themeMenu?.querySelectorAll('[data-theme]');
  const html = document.documentElement;

  if (!themeMenuBtn || !themeMenu || !themeButtons) return;

  await initTippy();

  function setActiveTheme(selectedTheme) {
    applyTheme(selectedTheme); // Usa lógica centralizada
    localStorage.setItem('theme', selectedTheme);

    themeButtons.forEach(btn => {
      const theme = btn.getAttribute('data-theme');
      const isActive = theme === selectedTheme;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive.toString());
    });

    loadParticles(selectedTheme);
    updateImagesForTheme(selectedTheme);
    updateTippyTheme(selectedTheme);

    document.dispatchEvent(new CustomEvent('themeChanged', {
      detail: { theme: selectedTheme }
    }));
  }

  // Aplica el tema guardado al iniciar
  const savedTheme = localStorage.getItem('theme') || 'light';
  setActiveTheme(savedTheme);

  // Alternar menú
  themeMenuBtn.addEventListener('click', () => {
    const isExpanded = themeMenuBtn.getAttribute('aria-expanded') === 'true';
    themeMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
    themeMenu.hidden = isExpanded;
  });

  // Cerrar al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!themeMenu.contains(e.target) && e.target !== themeMenuBtn) {
      themeMenu.hidden = true;
      themeMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Escape para cerrar
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      themeMenu.hidden = true;
      themeMenuBtn.setAttribute('aria-expanded', 'false');
      themeMenuBtn.focus();
    }
  });

  // Navegación con flechas
  themeMenu.addEventListener('keydown', (e) => {
    const buttons = Array.from(themeButtons);
    const index = buttons.indexOf(document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (index + 1) % buttons.length;
      buttons[next].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (index - 1 + buttons.length) % buttons.length;
      buttons[prev].focus();
    }
  });

  // Click en botón de tema
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedTheme = btn.getAttribute('data-theme');
      setActiveTheme(selectedTheme);
      themeMenu.hidden = true;
      themeMenuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}
