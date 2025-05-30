/**
 * Módulo que controla la apertura, cierre y accesibilidad del menú lateral.
 * @param {Object} options - Opciones con referencias a elementos DOM.
 * @param {HTMLElement} options.menuToggle - Botón para abrir menú.
 * @param {HTMLElement} options.closeMenuToggle - Botón para cerrar menú.
 * @param {HTMLElement} options.sidebarWrapper - Contenedor del menú lateral.
 */
export function setupSidebarMenu({ menuToggle, closeMenuToggle, sidebarWrapper }) {
  if (!(menuToggle && closeMenuToggle && sidebarWrapper)) return;

  if (!sidebarWrapper.hasAttribute('tabindex')) {
    sidebarWrapper.setAttribute('tabindex', '-1');
  }

  menuToggle.setAttribute('aria-controls', 'sidebar-wrapper');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú lateral');
  closeMenuToggle.setAttribute('aria-label', 'Cerrar menú lateral');

  const closeSidebar = () => {
    sidebarWrapper.classList.remove('active');
    sidebarWrapper.setAttribute('aria-hidden', 'true');
    closeMenuToggle.style.display = 'none';
    menuToggle.style.display = 'flex';
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.focus();
    sidebarWrapper.removeEventListener('keydown', trapFocus);
  };

  const trapFocus = (e) => {
    if (e.key === 'Tab') {
      const focusableElements = sidebarWrapper.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  };

  menuToggle.addEventListener('click', () => {
    sidebarWrapper.classList.add('active');
    sidebarWrapper.setAttribute('aria-hidden', 'false');
    menuToggle.style.display = 'none';
    closeMenuToggle.style.display = 'flex';
    menuToggle.setAttribute('aria-expanded', 'true');
    sidebarWrapper.focus();
    sidebarWrapper.addEventListener('keydown', trapFocus);
  });

  closeMenuToggle.addEventListener('click', closeSidebar);

  sidebarWrapper.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeSidebar);
  });

  document.addEventListener('click', (e) => {
    if (
      !sidebarWrapper.contains(e.target) &&
      !menuToggle.contains(e.target) &&
      sidebarWrapper.classList.contains('active')
    ) {
      closeSidebar();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarWrapper.classList.contains('active')) {
      closeSidebar();
    }
  });
}
