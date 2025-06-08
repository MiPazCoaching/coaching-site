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
  const menuToggle = document.getElementById('menu-toggle');
  const closeMenuToggle = document.getElementById('close-menu-toggle');
  const sidebarWrapper = document.getElementById('sidebar-wrapper');

  if (menuToggle && closeMenuToggle && sidebarWrapper) {
    setupSidebarMenu({ menuToggle, closeMenuToggle, sidebarWrapper });
  }

  // === Scroll to Top ===
  const scrollBtn = document.getElementById('scrollToTopBtn');
  if (scrollBtn) {
    setupScrollToTop(scrollBtn);
  }

  // === Switch de Tema ===
  const themeToggle = document.getElementById('themeToggle');
  const themeDropdown = document.getElementById('themeDropdown');
  const themeMenu = document.getElementById('themeMenu');

  if (themeToggle && themeDropdown && themeMenu) {
    setupThemeSwitcher({
      themeToggle,
      themeDropdown,
      themeMenu,
      htmlElement: document.documentElement,
    });
  }

  // === Selector de Idioma ===
  const languageToggle = document.getElementById('language-toggle');
  const languageDropdown = document.getElementById('language-dropdown');
  const languageMenu = document.getElementById('language-menu');

  if (languageToggle && languageDropdown && languageMenu) {
    setupLanguageSwitcher({ languageToggle, languageDropdown, languageMenu });
  }

  // === Popup Personalizado ===
  const popup = document.getElementById('popup-personal');
  const closeBtn = document.getElementById('popup-close-btn');
  const actionBtn = document.getElementById('popup-action-btn');
  const reopenBtn = document.getElementById('popup-reopen-btn');

  if (popup && closeBtn && actionBtn && reopenBtn) {
    console.log('✅ Inicializando popup...');
    setupCustomPopup({ popup, closeBtn, actionBtn, reopenBtn });
  } else {
    console.warn('❌ No se inicializó el popup. Faltan elementos.');
  }

  // === Sidebar de Accesibilidad ===
  if (typeof setupAccessibilitySidebar === 'function') {
    setupAccessibilitySidebar();
  }

  // === Popup de Accesibilidad ===
  if (typeof setupAccessibilityPopup === 'function') {
    setupAccessibilityPopup();
  }
});
