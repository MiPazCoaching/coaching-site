/**
 * Controla el menú desplegable para cambio de idioma.
 * @param {Object} options - Elementos DOM necesarios.
 * @param {HTMLElement} options.languageToggle - Botón que abre el menú de idiomas.
 * @param {HTMLElement} options.languageDropdown - Contenedor dropdown.
 * @param {HTMLElement} options.languageMenu - Menú con opciones de idioma.
 */
export function setupLanguageSwitcher({ languageToggle, languageDropdown, languageMenu }) {
  if (!(languageToggle && languageDropdown && languageMenu)) return;

  languageToggle.setAttribute('aria-haspopup', 'true');
  languageToggle.setAttribute('aria-expanded', 'false');

  languageToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const expanded = languageMenu.classList.toggle('show');
    languageToggle.setAttribute('aria-expanded', expanded);
    const first = languageMenu.querySelector('a, button');
    if (first && expanded) first.focus();
  });

  document.addEventListener('click', (e) => {
    if (!languageDropdown.contains(e.target)) {
      languageMenu.classList.remove('show');
      languageToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && languageMenu.classList.contains('show')) {
      languageMenu.classList.remove('show');
      languageToggle.setAttribute('aria-expanded', 'false');
      languageToggle.focus();
    }
  });

  languageMenu.addEventListener('keydown', (e) => {
    const items = [...languageMenu.querySelectorAll('a, button')];
    const i = items.indexOf(document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    }
  });
}
