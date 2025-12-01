// assets/js/accessibility/accessibility-main.js

import { AccessibilityManager } from './core/accessibility-manager.js';

class AccessibilitySystem {
    constructor() {
        this.manager = null;
        this.isInitialized = false;
        this.initializationPromise = null;
    }

    async initialize() {
        // Prevenir múltiples inicializaciones
        if (this.isInitialized) {
            console.log('♿ Sistema de accesibilidad ya inicializado');
            return this.manager.getStatus();
        }

        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        this.initializationPromise = this._initialize();
        return this.initializationPromise;
    }

    async _initialize() {
        try {
            console.log('♿ Inicializando sistema de accesibilidad...');

            // Esperar a que el DOM esté listo
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Crear e inicializar el manager
            this.manager = new AccessibilityManager();
            await this.manager.initialize();

            this.isInitialized = true;
            console.log('✅ Sistema de accesibilidad completamente inicializado');

            // Exponer para debugging (opcional)
            if (process.env.NODE_ENV === 'development') {
                window.accessibilitySystem = this;
                console.log('♿ Sistema disponible en window.accessibilitySystem');
            }

            // Disparar evento de inicialización
            this.dispatchInitializedEvent();

            return this.manager.getStatus();

        } catch (error) {
            console.error('❌ Error inicializando sistema de accesibilidad:', error);
            this.initializationPromise = null;
            throw error;
        }
    }

    dispatchInitializedEvent() {
        const event = new CustomEvent('accessibilitySystem:initialized', {
            detail: {
                system: this,
                status: this.manager.getStatus(),
                timestamp: new Date().toISOString()
            }
        });
        document.dispatchEvent(event);
    }

    // ===== API PÚBLICA SIMPLE =====

    enable(feature, intensity) {
        if (!this.isInitialized) {
            console.warn('⚠️ Sistema no inicializado. Inicializando automáticamente...');
            return this.initialize().then(() => this.enable(feature, intensity));
        }

        const result = this.manager.enableFeature(feature, intensity);
        if (result) {
            console.log(`✅ "${feature}" activado`);
        } else {
            console.warn(`⚠️ No se pudo activar "${feature}"`);
        }
        return result;
    }

    disable(feature) {
        if (!this.isInitialized) {
            console.warn('⚠️ Sistema no inicializado');
            return false;
        }

        const result = this.manager.disableFeature(feature);
        if (result) {
            console.log(`✅ "${feature}" desactivado`);
        }
        return result;
    }

    toggle(feature) {
        if (!this.isInitialized) {
            console.warn('⚠️ Sistema no inicializado');
            return false;
        }

        return this.manager.toggleFeature(feature);
    }

    setIntensity(feature, intensity) {
        if (!this.isInitialized) {
            console.warn('⚠️ Sistema no inicializado');
            return false;
        }

        const result = this.manager.setFeatureIntensity(feature, intensity);
        if (result) {
            console.log(`✅ Intensidad de "${feature}" ajustada a ${intensity}`);
        }
        return result;
    }

    status(feature = null) {
        if (!this.isInitialized) {
            return {
                initialized: false,
                message: 'Sistema no inicializado'
            };
        }

        if (feature) {
            return this.manager.getFeatureStatus(feature);
        }

        return this.manager.getStatus();
    }

    getFeatures() {
        if (!this.isInitialized) {
            return [];
        }

        return Array.from(this.manager.getAllManagers().keys());
    }

    isReady() {
        return this.isInitialized;
    }

    // Método para resetear (útil en desarrollo)
    reset() {
        if (!this.isInitialized) return false;

        this.manager.resetAll();
        console.log('♿ Todos los features reseteados');
        return true;
    }
}

// ===== INICIALIZACIÓN AUTOMÁTICA =====

// Crear instancia única
const accessibilitySystem = new AccessibilitySystem();

// Inicialización automática cuando el DOM esté listo
const initAccessibility = () => {
    // Verificar si hay elementos de accesibilidad en la página
    const hasAccessibilityElements =
        document.getElementById('photophobia-mode-toggle') ||
        document.getElementById('motion-intensity') ||
        document.querySelector('.accessibility-panel');

    if (hasAccessibilityElements) {
        accessibilitySystem.initialize().catch(error => {
            console.error('Error al inicializar accesibilidad:', error);
        });
    } else {
        console.log('♿ No se encontraron elementos de accesibilidad en esta página');
    }
};

// Inicializar según el estado del DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
    // DOM ya está listo
    initAccessibility();
}

// ===== EXPORTACIONES =====

// Para uso modular
export { accessibilitySystem };
export default accessibilitySystem;

// Para uso global (opcional)
if (typeof window !== 'undefined') {
    window.accessibility = accessibilitySystem;
}