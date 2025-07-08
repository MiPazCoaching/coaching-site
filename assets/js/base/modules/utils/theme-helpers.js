// modules/theme-helpers.js

export async function loadParticles(selectedTheme) {
    if (window.pJSDom && window.pJSDom.length > 0) {
        window.pJSDom.forEach(p => p.pJS.fn.vendors.destroypJS());
        window.pJSDom = [];
    }

    const configPath = `/assets/particles/particles-${selectedTheme}.json`;

    if (window.particlesJS) {
        window.particlesJS.load('particles-js', configPath);
    }
}

export function updateImagesForTheme(selectedTheme) {
    const themeImages = document.querySelectorAll('[data-theme-img]');
    themeImages.forEach((img) => {
        const baseName = img.getAttribute('data-theme-img');
        const ext = img.getAttribute('data-theme-ext') || 'png';
        const path = img.getAttribute('data-theme-path') || '/assets/images/';
        const newSrc = `${path}${baseName}-${selectedTheme}.${ext}`;

        if (img.tagName === 'IMG') {
            img.style.opacity = '0';
            setTimeout(() => {
                img.src = newSrc;
                img.style.opacity = '1';
            }, 200);
        } else {
            img.style.opacity = '0';
            setTimeout(() => {
                img.style.backgroundImage = `url('${newSrc}')`;
                img.style.opacity = '1';
            }, 200);
        }
    });
}

export function updateTippyTheme(selectedTheme) {
    const tippyElements = document.querySelectorAll('[data-tippy-content]');
    tippyElements.forEach(el => {
        if (el._tippy) {
            el._tippy.setProps({ theme: selectedTheme });
        }
    });
}

// Nueva función para cargar e inicializar Tippy
export async function initTippy() {
    if (!window.Popper) {
        await import('https://unpkg.com/@popperjs/core@2?module');
    }
    if (!window.tippy) {
        await import('https://unpkg.com/tippy.js@6?module');
    }

    // Inicializar tooltips sólo en elementos que tienen data-tippy-content
    window.tippy('[data-tippy-content]', {
        theme: 'light',      // Tema por defecto (puedes cambiarlo o hacerlo dinámico)
        animation: 'shift-away',
        delay: [100, 50],
        duration: [300, 200],
    });
}
