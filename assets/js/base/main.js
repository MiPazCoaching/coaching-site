// main.js
// Importa y ejecuta la inicialización de todos los módulos

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

  setupSidebarMenu({ menuToggle, closeMenuToggle, sidebarWrapper });

  // === Scroll to Top ===
  const scrollBtn = document.getElementById('scrollToTopBtn');
  setupScrollToTop(scrollBtn);

  // === Switch de Tema ===
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeDropdown = document.getElementById('themeDropdown');
  const themeMenu = document.getElementById('themeMenu');

  setupThemeSwitcher({ themeToggle, themeDropdown, themeMenu, htmlElement: html });

  // === Selector de Idioma ===
  const languageToggle = document.getElementById('language-toggle');
  const languageDropdown = document.getElementById('language-dropdown');
  const languageMenu = document.getElementById('language-menu');

  setupLanguageSwitcher({ languageToggle, languageDropdown, languageMenu });

  // === Popup Personalizado ===
  const popup = document.getElementById('popup-personal');
  const closeBtn = document.getElementById('popup-close-btn');
  const actionBtn = document.getElementById('popup-action-btn');
  const reopenBtn = document.getElementById('popup-reopen-btn');

  if (popup && closeBtn && actionBtn && reopenBtn) {
    setupCustomPopup({ popup, closeBtn, actionBtn, reopenBtn });
  }

  // === Sidebar de Accesibilidad ===
  setupAccessibilitySidebar();

  // === Popup de Accesibilidad ===
  setupAccessibilityPopup();
});
