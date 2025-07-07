// assets/js/base/main.js

import { initScrollToTop } from './modules/scroll-to-top.js';
import { initThemeSwitcher } from './modules/theme-switcher.js';
import { initSidebarMenu } from './modules/sidebar-menu.js';
import { initAccessibilityPopup } from './modules/accessibility-popup.js';
import { initAccessibilitySidebar } from './modules/accessibility-sidebar.js';
import { initPopupManager } from './modules/popup-manager.js';
// Agrega más init... aquí si agregas más módulos

// Aplica tema base antes de que cargue todo (sin esperar DOM)
import './modules/theme.js';
import './modules/meta-theme.js';

document.addEventListener('DOMContentLoaded', () => {
    initSidebarMenu();
    initScrollToTop();
    initThemeSwitcher();
    initAccessibilityPopup();
    initAccessibilitySidebar();
    initPopupManager();
    // Llama aquí a más inicializadores si agregas nuevos módulos
});
