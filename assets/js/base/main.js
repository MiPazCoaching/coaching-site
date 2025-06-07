// main.js
// Punto de entrada principal: Inicializa módulos al cargar el DOM

import { setupSidebarMenu } from './modules/sidebar-menu.js';
import { setupScrollToTop } from './modules/scroll-to-top.js';
import { setupThemeSwitcher } from './modules/theme-switcher.js';
import { setupLanguageSwitcher } from './modules/language-switcher.js';
import { setupCustomPopup } from './modules/custom-popup.js';
import { setupAccessibilitySidebar } from './modules/accessibility-sidebar.js';
import { setupAccessibilityPopup } from './modules/accessibility-popup.js';

document.addEventListener('DOMContentLoaded', () => {
  // === Sidebar principal ===
  const menuToggle = document.querySelector('#menu-toggle');
  const closeMenuToggle = document.querySelector('#close-menu-toggle');
  const sidebarWrapper = document.querySelector('#sidebar-wrapper');

  if (menuToggle && closeMenuToggle && sidebarWrapper) {
    setupSidebarMenu({ menuToggle, closeMenuToggle, sidebarWrapper });
  }

  // === Scroll to Top ===
  const scrollBtn = document.querySelector('#scrollToTopBtn');
  if (scrollBtn) {
    setupScrollToTop(scrollBtn);
  }

  // === Switch de Tema ===
  const themeToggle = document.querySelector('#themeToggle');
  const themeDropdown = document.querySelector('#themeDropdown');
  const themeMenu = document.querySelector('#themeMenu');

  if (themeToggle && themeDropdown && themeMenu) {
    setupThemeSwitcher({
      themeToggle,
      themeDropdown,
      themeMenu,
      htmlElement: document.documentElement,
    });
  }

  // === Selector de Idioma ===
  const languageToggle = document.querySelector('#language-toggle');
  const languageDropdown = document.querySelector('#language-dropdown');
  const languageMenu = document.querySelector('#language-menu');

  if (languageToggle && languageDropdown && languageMenu) {
    setupLanguageSwitcher({ languageToggle, languageDropdown, languageMenu });
  }

  // === Popup Personalizado ===
  const popup = document.querySelector('#popup-personal');
  const closeBtn = document.querySelector('#popup-close-btn');
  const actionBtn = document.querySelector('#popup-action-btn');
  const reopenBtn = document.querySelector('#popup-reopen-btn');

  if (popup && closeBtn && actionBtn && reopenBtn) {
    setupCustomPopup({ popup, closeBtn, actionBtn, reopenBtn });
  }

  // === Sidebar de Accesibilidad ===
  setupAccessibilitySidebar?.();

  // === Popup de Accesibilidad ===
  setupAccessibilityPopup?.();
});
