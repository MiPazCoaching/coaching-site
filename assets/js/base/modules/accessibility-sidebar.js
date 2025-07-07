// assets/js/base/modules/accessibility-sidebar.js

import { trapFocus } from './helpers.js';

export function initAccessibilitySidebar() {
  const toggleBtn = document.getElementById('accessibility-toggle');
  const sidebar = document.getElementById('accessibility-sidebar');
  const closeBtn = document.getElementById('close-accessibility-toggle');
  const html = document.documentElement;

  if (!toggleBtn || !sidebar || !closeBtn) return;

  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.setAttribute('aria-controls', 'accessibility-sidebar');
  toggleBtn.setAttribute('aria-label', 'Abrir opciones de accesibilidad');
  closeBtn.setAttribute('aria-label', 'Cerrar opciones de accesibilidad');

  sidebar.setAttribute('aria-hidden', 'true');
  sidebar.setAttribute('tabindex', '-1');

  function openSidebar() {
    sidebar.classList.add('active');
    sidebar.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    sidebar.focus();

    sidebar.addEventListener('keydown', (e) => trapFocus(e, sidebar));
  }

  function closeSidebar() {
    sidebar.classList.remove('active');
    sidebar.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', openSidebar);
  closeBtn.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
      closeSidebar();
    }
  });

  // Restaurar configuración del localStorage
  const settings = {
    colorblind: 'data-colorblind',
    textSize: 'data-text-size',
    animation: 'data-animation',
    readingMode: 'data-reading',
    dyslexia: 'data-dyslexia',
  };

  for (const [key, attr] of Object.entries(settings)) {
    const saved = localStorage.getItem(key);
    if (saved) {
      if (key === 'readingMode' || key === 'dyslexia') {
        html.toggleAttribute(attr, saved === 'true');
        const toggle = document.getElementById(`${key}-toggle`);
        if (toggle) toggle.checked = saved === 'true';
      } else {
        html.setAttribute(attr, saved);
        const input = document.querySelector(`[data-${key}-type="${saved}"], [data-${key}="${saved}"]`);
        if (input) input.checked = true;
      }
    }
  }

  // Eventos para cada tipo de ajuste accesible
  document.querySelectorAll('[data-contrast-choice]').forEach((btn) =>
      btn.addEventListener('click', () => {
        const value = btn.dataset.contrastChoice;
        html.setAttribute('data-contrast', value);
        localStorage.setItem('contrast', value);
      })
  );

  document.querySelectorAll('[data-colorblind-type]').forEach((btn) =>
      btn.addEventListener('click', () => {
        const type = btn.dataset.colorblindType;
        html.setAttribute('data-colorblind', type);
        localStorage.setItem('colorblind', type);
      })
  );

  document.querySelectorAll('[data-text-size]').forEach((btn) =>
      btn.addEventListener('click', () => {
        const size = btn.dataset.textSize;
        html.setAttribute('data-text-size', size);
        localStorage.setItem('textSize', size);
      })
  );

  const animationSlider = document.getElementById('animation-slider');
  if (animationSlider) {
    animationSlider.addEventListener('input', (e) => {
      html.setAttribute('data-animation', e.target.value);
      localStorage.setItem('animation', e.target.value);
    });
    const saved = localStorage.getItem('animation');
    if (saved) animationSlider.value = saved;
  }

  const readingToggle = document.getElementById('reading-mode-toggle');
  if (readingToggle) {
    readingToggle.addEventListener('change', (e) => {
      html.toggleAttribute('data-reading', e.target.checked);
      localStorage.setItem('readingMode', e.target.checked);
    });
  }

  const dyslexiaToggle = document.getElementById('dyslexia-toggle');
  if (dyslexiaToggle) {
    dyslexiaToggle.addEventListener('change', (e) => {
      html.toggleAttribute('data-dyslexia', e.target.checked);
      localStorage.setItem('dyslexia', e.target.checked);
    });
  }
}
