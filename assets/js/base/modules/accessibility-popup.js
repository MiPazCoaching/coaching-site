// modules/accessibility-popup.js

export function setupAccessibilityPopup() {
  const accessibility_popup = document.getElementById('accessibility-popup');
  const accessibility_closeBtn = document.getElementById('close-popup');

  if (!accessibility_popup || !accessibility_closeBtn) return;

  const currentLang = document.documentElement.lang || 'default';
  const langKey = `accessibilityPopupSeen_${currentLang}`;

  const hasSeenPopup = localStorage.getItem(langKey);

  if (!hasSeenPopup) {
    accessibility_popup.hidden = false;
    accessibility_popup.setAttribute('data-visible', 'true');

    setTimeout(() => {
      accessibility_popup.setAttribute('data-visible', 'false');
      accessibility_popup.hidden = true;
      localStorage.setItem(langKey, 'true');
    }, 5000);
  }

  accessibility_closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    accessibility_popup.setAttribute('data-visible', 'false');
    accessibility_popup.hidden = true;
    localStorage.setItem(langKey, 'true');
  });
}
