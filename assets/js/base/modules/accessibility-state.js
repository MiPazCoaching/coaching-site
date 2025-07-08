// assets/js/base/modules/accessibility-state.js

// Aplica estados guardados en localStorage
export function restoreAccessibilitySettings() {
  const html = document.documentElement;

  const settings = {
    contrast: 'data-contrast',
    colorblind: 'data-colorblind',
    textSize: 'data-text-size',
    animation: 'data-animation',
    readingMode: 'data-reading',
    dyslexia: 'data-dyslexia',
  };

  for (const [key, attr] of Object.entries(settings)) {
    const saved = localStorage.getItem(key);
    if (!saved) continue;

    if (key === 'readingMode' || key === 'dyslexia') {
      html.toggleAttribute(attr, saved === 'true');
      const toggle = document.getElementById(`${key === 'readingMode' ? 'reading-mode' : 'dyslexia'}-toggle`);
      if (toggle) toggle.checked = saved === 'true';
    } else {
      html.setAttribute(attr, saved);
      setOptionActive(`[data-${key}-type], [data-${key}]`, saved);
    }

    if (key === 'animation') {
      const slider = document.getElementById('animation-slider');
      if (slider) slider.value = saved;
    }
  }
}

// Marca visualmente los botones activos
export function setOptionActive(selector, value) {
  document.querySelectorAll(selector).forEach((el) => {
    const match =
        el.dataset.contrastChoice === value ||
        el.dataset.colorblindType === value ||
        el.dataset.textSize === value;

    el.classList.toggle('active', match);
  });
}
