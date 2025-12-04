// assets/js/main.js
// Punto de entrada principal con soporte multiidioma

// Importar módulos principales
import './core/app.js';
import './utils/contact-manager.js';

// Importar sistema de accesibilidad si existe
const loadAccessibility = async () => {
    try {
        const module = await import('./accessibility/accessibility-main.js');
        console.log('✅ Sistema de accesibilidad cargado');
        return module.default || module;
    } catch (error) {
        console.warn('⚠️ Módulo de accesibilidad no encontrado');
        return null;
    }
};

// Inicialización de la aplicación
const initApp = async () => {
    console.log('🎯 Iniciando aplicación...');

    // Detectar idioma actual
    const currentLang = document.documentElement.lang || 'es';
    console.log(`🌍 Idioma detectado: ${currentLang}`);

    // Cargar módulo de accesibilidad
    const accessibilitySystem = await loadAccessibility();

    // Configurar manejo de contactos
    if (window.contactManager) {
        console.log('📞 Contact Manager inicializado');
    }

    // Eventos globales
    setupGlobalEvents();

    console.log('✅ Aplicación lista');

    // Comandos de desarrollo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setupDebugCommands(accessibilitySystem);
    }
};

// Configurar eventos globales
const setupGlobalEvents = () => {
    // Manejar cambios de tema
    document.addEventListener('themeChanged', (e) => {
        console.log('🎨 Tema cambiado:', e.detail.theme);
        document.body.setAttribute('data-theme', e.detail.theme);
    });

    // Manejar cambios de idioma
    document.addEventListener('languageChanged', (e) => {
        console.log('🌍 Idioma cambiado:', e.detail.lang);
        // Recargar página o actualizar contenido
    });

    // Detectar interacciones de contacto
    document.addEventListener('contactMade', (e) => {
        console.log('📞 Contacto registrado:', e.detail);
    });
};

// Comandos de debug para desarrollo
const setupDebugCommands = (accessibilitySystem) => {
    window.DEBUG = {
        // Información del sistema
        info: {
            lang: document.documentElement.lang,
            theme: document.body.getAttribute('data-theme') || 'light',
            url: window.location.href
        },

        // Módulos
        contact: window.contactManager,
        accessibility: accessibilitySystem,

        // Utilidades
        logs: () => {
            const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
            console.table(logs);
            return logs;
        },

        clearLogs: () => {
            localStorage.removeItem('app_logs');
            console.log('🗑️ Logs eliminados');
        },

        // Cambiar idioma (simulado)
        setLang: (lang) => {
            document.documentElement.lang = lang;
            document.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { lang }
            }));
            console.log(`🌍 Idioma cambiado a: ${lang}`);
        },

        // Cambiar tema
        setTheme: (theme) => {
            document.body.setAttribute('data-theme', theme);
            document.dispatchEvent(new CustomEvent('themeChanged', {
                detail: { theme }
            }));
            console.log(`🎨 Tema cambiado a: ${theme}`);
        },

        // Contactos
        showContacts: () => {
            if (window.contactManager) {
                console.log('📞 Contactos:', window.contactManager.getContactInfo());
            }
        },

        version: '1.0.0'
    };

    console.log('🔧 Comandos de debug disponibles en window.DEBUG');
    console.log('📋 Usa DEBUG.info para ver información del sistema');
};

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Exportar para módulos
export default initApp;