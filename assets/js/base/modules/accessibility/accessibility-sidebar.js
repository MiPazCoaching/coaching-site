// assets/js/base/modules/accessibility-sidebar.js

import { trapFocus } from '../utils/helpers.js';
import { restoreAccessibilitySettings, setOptionActive } from './accessibility-state.js';

export function initAccessibilitySidebar() {
  const sidebar = document.getElementById("accessibility-sidebar");
  const closeButton = document.getElementById("close-accessibility-toggle");
  const toggleBtn = document.getElementById("accessibility-toggle");
  const html = document.documentElement;

  if (!sidebar || !closeButton || !toggleBtn) return;

  function openSidebar() {
    sidebar.setAttribute('data-visible', 'true');
    sidebar.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    
    const firstInput = sidebar.querySelector(
        'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    (firstInput || sidebar).focus();
  }

  function closeSidebar() {
    sidebar.setAttribute('data-visible', 'false');
    sidebar.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', openSidebar);
  closeBtn.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.getAttribute('data-visible') === 'true') {
      closeSidebar();
    }

    if (sidebar.getAttribute('data-visible') === 'true') {
        trapFocus(e, sidebar);
    }
  });

  // Restaurar estados guardados y marcar opciones activas
  restoreAccessibilitySettings();

  // Eventos para opciones del sidebar
  document.querySelectorAll('[data-contrast-choice]').forEach((btn) =>
      btn.addEventListener('click', () => {
        const value = btn.dataset.contrastChoice;
        html.setAttribute('data-contrast', value);
        localStorage.setItem('contrast', value);
        setOptionActive('[data-contrast-choice]', value);
      })
  );

  document.querySelectorAll('[data-colorblind-type]').forEach((btn) =>
      btn.addEventListener('click', () => {
        const type = btn.dataset.colorblindType;
        html.setAttribute('data-colorblind', type);
        localStorage.setItem('colorblind', type);
        setOptionActive('[data-colorblind-type]', type);
      })
  );

  document.querySelectorAll('[data-text-size]').forEach((btn) =>
      btn.addEventListener('click', () => {
        const size = btn.dataset.textSize;
        html.setAttribute('data-text-size', size);
        localStorage.setItem('textSize', size);
        setOptionActive('[data-text-size]', size);
      })
  );

  const animationSlider = document.getElementById('animation-slider');
  if (animationSlider) {
    animationSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      html.setAttribute('data-animation', value);
      localStorage.setItem('animation', value);
    });
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
