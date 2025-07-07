// modules/helpers.js

/**
 * Función para atrapar el foco dentro de un contenedor accesible (popup, sidebar, etc.)
 * @param {KeyboardEvent} e
 * @param {HTMLElement} container - El contenedor donde se debe atrapar el foco
 */
export function trapFocus(e, container) {
    if (e.key !== 'Tab') return;

    const focusableElements = container.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}

// Suavemente muestra un elemento
export function fadeIn(element, duration = 300) {
    element.style.opacity = 0;
    element.style.display = 'block';
    element.style.transition = `opacity ${duration}ms ease-in-out`;

    requestAnimationFrame(() => {
        element.style.opacity = 1;
    });
}

// Suavemente oculta un elemento
export function fadeOut(element, duration = 300) {
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    element.style.opacity = 0;

    requestAnimationFrame(() => {
        element.style.opacity = 0;
    });

    setTimeout(() => {
        element.style.display = 'none';
    }, duration);
}

