// modules/theme/theme.js

import {
    THEME_KEY,
    CONTRAST_KEY,
    DEFAULT_THEME,
    DEFAULT_CONTRAST,
} from "./theme-constants.js";

function getSavedTheme() {
    return localStorage.getItem(THEME_KEY);
}

function getSavedContrast() {
    return localStorage.getItem(CONTRAST_KEY);
}

function getPreferredTheme() {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function applyTheme(theme = DEFAULT_THEME, contrast = DEFAULT_CONTRAST) {
    document.body.setAttribute("data-theme", theme);
    document.body.setAttribute("data-contrast", contrast);
}

function initTheme() {
    const theme = getSavedTheme() || getPreferredTheme();
    const contrast = getSavedContrast() || DEFAULT_CONTRAST;
    applyTheme(theme, contrast);
    return theme; // para pasar a meta-theme.js
}

export {
    initTheme,
    applyTheme,
    getSavedTheme,
    getSavedContrast,
};
