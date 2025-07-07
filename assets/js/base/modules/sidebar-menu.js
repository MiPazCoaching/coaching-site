// assets/js/base/modules/sidebar-menu.js

import { trapFocus } from './helpers.js';

export function initSidebarMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const closeMenuToggle = document.getElementById('close-menu-toggle');
  const sidebarWrapper = document.getElementById('sidebar-wrapper');

  if (!(menuToggle && closeMenuToggle && sidebarWrapper)) return;

  if (!sidebarWrapper.hasAttribute('tabindex')) {
    sidebarWrapper.setAttribute('tabindex', '-1');
  }

  menuToggle.setAttribute('aria-controls', 'sidebar-wrapper');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú lateral');
  closeMenuToggle.setAttribute('aria-label', 'Cerrar menú lateral');

  const handleTrapFocus = (e) => trapFocus(e, sidebarWrapper);

  function openSidebar() {
    sidebarWrapper.classList.add('active');
    sidebarWrapper.setAttribute('aria-hidden', 'false');
    menuToggle.style.display = 'none';
    closeMenuToggle.style.display = 'flex';
    menuToggle.setAttribute('aria-expanded', 'true');
    sidebarWrapper.focus();
    sidebarWrapper.addEventListener('keydown', handleTrapFocus);
  }

  function closeSidebar() {
    sidebarWrapper.classList.remove('active');
    sidebarWrapper.setAttribute('aria-hidden', 'true');
    closeMenuToggle.style.display = 'none';
    menuToggle.style.display = 'flex';
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.focus();
    sidebarWrapper.removeEventListener('keydown', handleTrapFocus);
  }

  menuToggle.addEventListener('click', openSidebar);
  closeMenuToggle.addEventListener('click', closeSidebar);

  sidebarWrapper.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeSidebar);
  });

  document.addEventListener('click', (e) => {
    if (!sidebarWrapper.classList.contains('active')) return;
    if (!sidebarWrapper.contains(e.target) && !menuToggle.contains(e.target)) {
      closeSidebar();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebarWrapper.classList.contains('active')) {
      closeSidebar();
    }
  });
}
