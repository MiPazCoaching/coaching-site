// assets/js/base/main.js

// Core funcionalidad general
import { initScrollToTop } from './modules/core/scroll-to-top.js';
import { initSidebarMenu } from './modules/core/sidebar-menu.js';
import { initCalendlyButton } from './modules/core/calendly-button.js';
import { initPopupManager } from './modules/core/popup-manager.js';

// Accesibilidad
import { initAccessibilityFeatures } from './modules/accessibility/index.js';


// Temas
import { initThemeFeatures } from './modules/theme/index.js';

document.addEventListener('DOMContentLoaded', () => {
    initSidebarMenu();
    initScrollToTop();
    initThemeFeatures();
    initAccessibilityFeatures();
    initPopupManager();
    initCalendlyButton();
});
