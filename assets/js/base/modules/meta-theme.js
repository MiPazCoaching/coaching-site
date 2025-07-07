// modules/meta-theme.js

import { theme } from './theme.js';

function updateThemeColorMeta(themeName) {
    const themeColorMeta = document.querySelector("meta[name=theme-color]");
    if (!themeColorMeta) return;

    const colors = {
        light: "#ffffff",
        dark: "#101010",
    };

    themeColorMeta.setAttribute("content", colors[themeName] ?? "#ffffff");
}

updateThemeColorMeta(theme);

