// modules/accessibility-sidebar.js

export function setupAccessibilitySidebar() {
  const sidebar = document.getElementById('accessibility-sidebar');
  const toggleBtn = document.getElementById('accessibility-toggle');
  const closeBtn = document.getElementById('accessibility-close');

  if (!sidebar || !toggleBtn || !closeBtn) return;

  const openSidebar = () => {
    sidebar.classList.add('open');
    sidebar.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  };

  const closeSidebar = () => {
    sidebar.classList.remove('open');
    sidebar.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };

  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (sidebar.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeSidebar();
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });
}
