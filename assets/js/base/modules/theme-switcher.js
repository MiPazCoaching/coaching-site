// modules/theme-switcher.js
import { loadParticles, updateImagesForTheme, updateTippyTheme, initTippy } from './theme-helpers.js';

export async function initThemeSwitcher() {
  const themeMenuBtn = document.getElementById('themeMenuBtn');
  const themeMenu = document.getElementById('themeMenu');
  const themeButtons = themeMenu?.querySelectorAll('[data-theme]');
  const html = document.documentElement;

  if (!themeMenuBtn || !themeMenu || !themeButtons) return;
  
  // Inicializa Tippy solo una vez al inicio
  await initTippy();

  function setActiveTheme(selectedTheme) {
    html.setAttribute('data-theme', selectedTheme);
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

    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: selectedTheme } }));
  }
  
  // Inicializar tema guardado
  const savedTheme = localStorage.getItem('theme') || 'light';
  setActiveTheme(savedTheme);

  // Evento click en botón principal
  themeMenuBtn.addEventListener('click', () => {
    const isExpanded = themeMenuBtn.getAttribute('aria-expanded') === 'true';
    themeMenuBtn.setAttribute('aria-expanded', !isExpanded);
    themeMenu.hidden = isExpanded;
  });

  // Cerrar al hacer clic fuera o presionar Escape
  document.addEventListener('click', (e) => {
    if (!themeMenu.contains(e.target) && e.target !== themeMenuBtn) {
      themeMenu.hidden = true;
      themeMenuBtn.setAttribute('aria-expanded', 'false');
    }
  });

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

  // Click en cada botón de tema
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedTheme = btn.getAttribute('data-theme');
      setActiveTheme(selectedTheme);
      themeMenu.hidden = true;
      themeMenuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}
