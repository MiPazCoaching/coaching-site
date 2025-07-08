// assets/js/base/modules/accessibility-popup.js

import { restoreAccessibilitySettings } from './accessibility-state.js';

export function initAccessibilityPopup() {
  const popup = document.getElementById('accessibility-popup');
  const closeBtn = document.getElementById('accessibility-popup-close');
  const openPanelBtn = document.getElementById('accessibility-popup-open');
  const storageKey = 'hasSeenAccessibilityPopup';

  if (!popup || !closeBtn) return;

  const hasSeenPopup = localStorage.getItem(storageKey) === 'true';

  function hidePopup() {
    popup.setAttribute('data-visible', 'false');
    popup.addEventListener('transitionend', function handler() {
      popup.hidden = true;
      popup.removeEventListener('transitionend', handler);
    }, { once: true });
    localStorage.setItem(storageKey, 'true');
  }

  if (!hasSeenPopup) {
    popup.hidden = false;
    popup.setAttribute('data-visible', 'true');
    setTimeout(hidePopup, 5000);
  }

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    hidePopup();
  });

  if (openPanelBtn) {
    openPanelBtn.addEventListener('click', () => {
      const sidebarToggle = document.getElementById('accessibility-toggle');
      if (sidebarToggle) sidebarToggle.click();

      popup.setAttribute('data-visible', 'false');
      popup.hidden = true;
    });
  }

  // Aplica estados guardados para asegurar que la configuración se refleje en el popup si es necesario
  restoreAccessibilitySettings();
}
