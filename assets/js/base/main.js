// main.js
// Importa y ejecuta la inicialización de todos los módulos

import { setupSidebarMenu } from './modules/sidebar-menu.js';
import { setupScrollToTop } from './modules/scroll-to-top.js';
import { setupThemeSwitcher } from './modules/theme-switcher.js';
import { setupLanguageSwitcher } from './modules/language-switcher.js';
import { setupCustomPopup } from './modules/custom-popup.js';

document.addEventListener('DOMContentLoaded', () => {
  // Elementos DOM principales
  const menuToggle = document.getElementById('menu-toggle');
  const closeMenuToggle = document.getElementById('close-menu-toggle');
  const sidebarWrapper = document.getElementById('sidebar-wrapper');

  const scrollToTopBtn = document.getElementById('scroll-to-top');

  const themeToggle = document.getElementById('theme-toggle');
  const themeDropdown = document.getElementById('theme-dropdown');
  const themeMenu = document.getElementById('theme-menu');
  const htmlElement = document.documentElement;

  const languageToggle = document.getElementById('language-toggle');
  const languageDropdown = document.getElementById('language-dropdown');
  const languageMenu = document.getElementById('language-menu');

  const popup = document.getElementById('popup-personal');
  const closeBtn = document.getElementById('popup-close-btn');
  const actionBtn = document.getElementById('popup-action-btn');
  const reopenBtn = document.getElementById('popup-reopen-btn');

  setupSidebarMenu({ menuToggle, closeMenuToggle, sidebarWrapper });
  setupScrollToTop(scrollToTopBtn);
  setupThemeSwitcher({ themeToggle, themeDropdown, themeMenu, htmlElement });
  setupLanguageSwitcher({ languageToggle, languageDropdown, languageMenu });
  setupCustomPopup({ popup, closeBtn, actionBtn, reopenBtn });
});
