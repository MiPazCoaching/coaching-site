// assets/js/base/modules/accessibility-popup.js

export function initAccessibilityPopup() {
  const popup = document.getElementById('accessibility-popup');
  const closeBtn = document.getElementById('accessibility-popup-close');
  const storageKey = 'hasSeenAccessibilityPopup';

  if (!popup || !closeBtn) return;

  const hasSeenPopup = localStorage.getItem(storageKey) === 'true';

  if (!hasSeenPopup) {
    popup.hidden = false;
    popup.setAttribute('data-visible', 'true');

    setTimeout(() => {
      popup.setAttribute('data-visible', 'false');
      popup.addEventListener('transitionend', function handler() {
        popup.hidden = true;
        popup.removeEventListener('transitionend', handler);
      }, { once: true });

      localStorage.setItem(storageKey, 'true');
    }, 5000);
  }

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    popup.setAttribute('data-visible', 'false');
    popup.addEventListener('transitionend', function handler() {
      popup.hidden = true;
      popup.removeEventListener('transitionend', handler);
    }, { once: true });

    localStorage.setItem(storageKey, 'true');
  });
}
