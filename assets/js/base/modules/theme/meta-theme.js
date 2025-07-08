// modules/theme/meta-theme.js

import { META_THEME_COLORS } from "./theme-constants.js";
import { initTheme } from "./theme.js";

function updateThemeColorMeta(themeName) {
    const themeColorMeta = document.querySelector("meta[name=theme-color]");
    if (!themeColorMeta) return;

    const color = META_THEME_COLORS[themeName] ?? META_THEME_COLORS.light;
    themeColorMeta.setAttribute("content", color);
}

const theme = initTheme(); // Aplica y recupera el tema actual
updateThemeColorMeta(theme);
