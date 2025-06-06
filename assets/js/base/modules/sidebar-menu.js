/**
 * Módulo que controla cualquier menú lateral (sidebar) con accesibilidad y animaciones.
 * @param {Object} options - Opciones con referencias a elementos DOM y configuración.
 * @param {HTMLElement} options.menuToggle - Botón para abrir el menú.
 * @param {HTMLElement} options.closeMenuToggle - Botón para cerrar el menú.
 * @param {HTMLElement} options.sidebarWrapper - Contenedor del menú lateral.
 * @param {string} [options.label='menú lateral'] - Nombre accesible del menú.
 * @param {string} [options.shortcutKey] - Tecla rápida (ej: 'a' para Alt+A).
 */
export function setupSidebarMenu({
  menuToggle,
  closeMenuToggle,
  sidebarWrapper,
  label = 'menú lateral',
  shortcutKey
}) {
  if (!(menuToggle && closeMenuToggle && sidebarWrapper)) return;

  // Atributos de accesibilidad básicos
  sidebarWrapper.setAttribute('tabindex', '-1');
  sidebarWrapper.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-controls', sidebarWrapper.id);
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', `Abrir ${label}`);
  closeMenuToggle.setAttribute('aria-label', `Cerrar ${label}`);

  const focusableSelector = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function trapFocus(e) {
    if (e.key !== 'Tab') return;

    const focusables = [...sidebarWrapper.querySelectorAll(focusableSelector)];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function openSidebar() {
    sidebarWrapper.classList.add('sidebar-enter');
    sidebarWrapper.classList.remove('sidebar-exit');
    sidebarWrapper.setAttribute('aria-hidden', 'false');
    sidebarWrapper.focus();

    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.style.display = 'none';
    closeMenuToggle.style.display = 'flex';

    document.addEventListener('keydown', trapFocus);
  }

  function closeSidebar() {
    sidebarWrapper.classList.remove('sidebar-enter');
    sidebarWrapper.classList.add('sidebar-exit');
    sidebarWrapper.setAttribute('aria-hidden', 'true');

    menuToggle.setAttribute('aria-expanded', 'false');
    closeMenuToggle.style.display = 'none';
    menuToggle.style.display = 'flex';
    menuToggle.focus();

    document.removeEventListener('keydown', trapFocus);
  }

  menuToggle.addEventListener('click', openSidebar);
  closeMenuToggle.addEventListener('click', closeSidebar);

  sidebarWrapper.querySelectorAll('a, .dropdown-item').forEach(el =>
    el.addEventListener('click', closeSidebar)
  );

  document.addEventListener('click', (e) => {
    if (!sidebarWrapper.contains(e.target) && !menuToggle.contains(e.target) && sidebarWrapper.classList.contains('sidebar-enter')) {
      closeSidebar();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarWrapper.classList.contains('sidebar-enter')) {
      closeSidebar();
    }

    // Atajo de teclado opcional
    if (shortcutKey && e.altKey && e.key.toLowerCase() === shortcutKey.toLowerCase()) {
      e.preventDefault();
      openSidebar();
    }
  });
}
