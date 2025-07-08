// modules/theme/index.js
import { initThemeSwitcher } from './theme-switcher.js';
import './meta-theme.js'; // Aplica el tema y actualiza <meta name=theme-color>

export function initThemeFeatures() {
    initThemeSwitcher();
}
