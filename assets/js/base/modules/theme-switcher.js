// assets/js/theme-switcher.js

import { setTheme } from './theme-helpers.js';

document.addEventListener('DOMContentLoaded', () => {
  const themeMenu = document.getElementById('themeMenu');

  if (!themeMenu) {
    console.warn('Theme switcher: #themeMenu not found.');
    return;
  }

  // Cambio de tema (oscuro, claro, sepia...)
  themeMenu.addEventListener('click', (event) => {
    const button = event.target.closest('[data-theme-choice]');
    if (button) {
      const theme = button.getAttribute('data-theme-choice');
      if (theme) {
        setTheme(theme); // cambia el tema y actualiza el DOM
        closeAllSubmenus();
      }
    }
  });

  // Activar/desactivar submenús manualmente
  const submenuToggles = document.querySelectorAll('.dropdown-submenu > .dropdown-toggle');

  submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const submenu = toggle.nextElementSibling;
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

      closeAllSubmenus();

      if (!isExpanded && submenu) {
        submenu.style.display = 'block';
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Cierra los submenús al hacer clic fuera
  document.addEventListener('click', closeAllSubmenus);

  // Utilidad: cerrar todos los submenús
  function closeAllSubmenus() {
    document.querySelectorAll('.dropdown-submenu > .dropdown-menu').forEach(menu => {
      menu.style.display = 'none';
    });
    document.querySelectorAll('.dropdown-submenu > .dropdown-toggle').forEach(toggle => {
      toggle.setAttribute('aria-expanded', 'false');
    });
  }
});
