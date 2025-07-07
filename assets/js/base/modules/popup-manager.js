// assets/js/base/modules/popup-manager.js

import { trapFocus } from './helpers.js';

export function initPopupManager() {
  const popups = document.querySelectorAll('.popup');
  const openButtons = document.querySelectorAll('[data-open-popup]');
  const closeButtons = document.querySelectorAll('[data-close-popup]');

  if (popups.length === 0 && openButtons.length === 0) return;

  function openPopup(popupId) {
    const popup = document.getElementById(popupId);
    if (!popup) return;

    popup.classList.add('show');
    popup.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const focusable = popup.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable) focusable.focus();

    popup.addEventListener('keydown', (e) => trapFocus(e, popup));
  }

  function closePopup(popup) {
    if (!popup || !popup.classList.contains('show')) return;

    popup.classList.remove('show');
    popup.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const popupId = btn.getAttribute('data-open-popup');
      openPopup(popupId);
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const popup = btn.closest('.popup');
      if (popup) closePopup(popup);
    });
  });

  document.addEventListener('click', (e) => {
    popups.forEach((popup) => {
      const content = popup.querySelector('.popup-content');
      if (popup.classList.contains('show') && !content.contains(e.target) && !e.target.hasAttribute('data-open-popup')) {
        closePopup(popup);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      popups.forEach((popup) => {
        if (popup.classList.contains('show')) {
          closePopup(popup);
        }
      });
    }
  });
}
