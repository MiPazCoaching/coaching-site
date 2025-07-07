// modules/theme.js

const body = document.body;
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
const savedTheme = localStorage.getItem("theme");
const savedContrast = localStorage.getItem("contrast");

const theme = savedTheme ?? (prefersDark ? "dark" : "light");
const contrast = savedContrast ?? "medium";

body.setAttribute("data-theme", theme);
body.setAttribute("data-contrast", contrast);

export { theme };
