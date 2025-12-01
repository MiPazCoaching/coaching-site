// assets/js/accessibility/core/accessibility-manager.js

import { MotionManager } from '../features/motion-manager.js';
import { PhotophobiaManager } from '../features/photophobia-manager.js';
import { DyslexiaManager } from '../features/dyslexia-manager.js';
import { ReadingManager } from '../features/reading-manager.js';
import { FontManager } from '../features/font-manager.js';
import { AccessibilityLogger } from './accessibility-logger.js';

export class AccessibilityManager {
    constructor() {
        if (window.__accessibilityManagerInstance) {
            return window.__accessibilityManagerInstance;
        }
        window.__accessibilityManagerInstance = this;

        this.logger = this.createLogger();
        this.managers = new Map();
        this.isInitialized = false;
        this.initializationPromise = null;
    }

    createLogger() {
        return {
            debug: (...args) => console.debug('♿ [Manager]', ...args),
            info: (...args) => console.info('♿ [Manager]', ...args),
            warn: (...args) => console.warn('♿ [Manager]', ...args),
            error: (...args) => console.error('❌ [Manager]', ...args)
        };
    }

    async initialize() {
        if (this.isInitialized) {
            this.logger.debug('Ya inicializado, omitiendo...');
            return this.getStatus();
        }

        if (this.initializationPromise) {
            this.logger.debug('Inicialización en progreso, esperando...');
            return this.initializationPromise;
        }

        this.initializationPromise = this._initialize();
        return this.initializationPromise;
    }

    async _initialize() {
        try {
            this.logger.info('Inicializando AccessibilityManager...');
            this.debugAccessibilityElements();

            // Esperar DOM si es necesario
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // Inicializar managers
            await this.initializeManagers();

            // Migrar configuraciones antiguas
            await this.migrateFromOldSettings();

            // Configurar comunicación entre managers
            this.setupInterManagerCommunication();
            
            this.isInitialized = true;
            this.logger.info('AccessibilityManager inicializado correctamente');

            // Exponer API global
            this.exposeGlobalAPI();

            return this.getStatus();

        } catch (error) {
            this.logger.error('Error inicializando AccessibilityManager', error);
            this.initializationPromise = null;
            throw error;
        }
    }

    async initializeManagers() {
        const managerConfigs = [
            { 
                key: 'motion', 
                Class: MotionManager,
                requiredElements: [
                    'reduced-motion-toggle', 
                    'motion-intensity', 
                    'motion-intensity-control'
                ]
            },
            { 
                key: 'photophobia', 
                Class: PhotophobiaManager,
                requiredElements: [
                    'photophobia-mode-toggle',
                    'color-temperature',
                    'brightness',
                    'refresh-rate',
                    'photophobia-controls'
                ]
            },
            { 
                key: 'dyslexia', 
                Class: DyslexiaManager,
                requiredElements: [
                    'dyslexia-mode-toggle', 
                    'dyslexia-intensity', 
                    'dyslexia-intensity-control'
                ] 
            },
            { 
                key: 'reading', 
                Class: ReadingManager,
                requiredElements: [
                    'reading-mode-toggle', 
                    'reading-intensity', 
                    'reading-intensity-control'
                ]
            },
            { 
                key: 'font', 
                Class: FontManager,
                requiredElements: [
                    'font-size-toggle', 
                    'font-size', 
                    'font-size-control'
                ] }
        ];

        for (const config of managerConfigs) {
            try {

                // Verificar si los elementos necesarios existen
                const elementsExist = config.requiredElements.every(id => {
                    const exists = !!document.getElementById(id);
                    if (!exists) {
                        this.logger.warn(`Elemento no encontrado: ${id} para ${config.key}`);
                    }
                    return exists;
                });

                if (!elementsExist) {
                    this.logger.info(`Manager ${config.key} omitido - elementos no encontrados`);
                    continue;
                }

                // Crear e inicializar manager
                const manager = new config.Class(this.logger);
                await manager.initialize();

                this.managers.set(config.key, manager);
                this.logger.info(`${config.key}Manager inicializado`);

            } catch (error) {
                this.logger.error(`Error inicializando ${config.key}Manager`, error);
            }
        }
    }

   

    debugAccessibilityElements() {
        const allElements = [
            'reduced-motion-toggle', 'motion-intensity', 'motion-intensity-control',
            'dyslexia-mode-toggle', 'dyslexia-intensity', 'dyslexia-intensity-control',
            'reading-mode-toggle', 'reading-intensity', 'reading-intensity-control',
            'font-size-toggle', 'font-size', 'font-size-control',
            'photophobia-mode-toggle', 'color-temperature', 'brightness', 'refresh-rate', 'photophobia-controls'
        ];

        this.logger.info('=== DEBUG: Elementos de Accesibilidad ===');
        allElements.forEach(id => {
            const element = document.getElementById(id);
            this.logger.debug(`- ${id}:`, element ? '✅' : '❌');
        });
        this.logger.info('=== FIN DEBUG ===');
    }

    setupInterManagerCommunication() {
        // Configurar interacciones entre managers
        const readingManager = this.managers.get('reading');
        if (readingManager) {
            readingManager.onEnable = () => {
                const photophobiaManager = this.managers.get('photophobia');
                if (photophobiaManager?.settings.enabled) {
                    photophobiaManager.disable();
                    this.logger.info('Fotofobia desactivada automáticamente al activar modo lectura');
                }
            };
        }

        const photophobiaManager = this.managers.get('photophobia');
        if (photophobiaManager) {
            photophobiaManager.onEnable = () => {
                this.logger.info('Fotofobia activada - aplicando ajustes relacionados');
                
                const motionManager = this.managers.get('motion');
                if (motionManager && !motionManager.settings.enabled) {
                    motionManager.enable(2);
                    this.logger.info('Movimiento reducido activado automáticamente con fotofobia');
                }
            };
            photophobiaManager.onDisable = () => {
                this.logger.info('Fotofobia desactivada - restaurando configuraciones');
            };
        }
    }

    // ... (el resto de los métodos permanecen igual)
    exposeGlobalAPI() {
        // API simple para uso global
        window.accessibilityAPI = {
            enable: (feature, intensity) => this.enableFeature(feature, intensity),
            disable: (feature) => this.disableFeature(feature),
            toggle: (feature) => this.toggleFeature(feature),
            getStatus: () => this.getStatus(),
            getFeatureStatus: (feature) => this.getFeatureStatus(feature),
            setIntensity: (feature, intensity) => this.setFeatureIntensity(feature, intensity),
            getAvailableFeatures: () => Array.from(this.managers.keys()),
            ersion: '1.0.0'
        };

        this.logger.info('API de accesibilidad expuesta globalmente');
    }

    // Métodos de gestión de features
    enableFeature(feature, intensity = null) {
        const manager = this.managers.get(feature);
        if (manager) {
            manager.enable(intensity);
            this.logger.info(`Feature activada: ${feature}`);
            
            return true;
        }
        this.logger.warn(`Feature no encontrada: ${feature}`);
        return false;
    }

    disableFeature(feature) {
        const manager = this.managers.get(feature);
        if (manager) {
            manager.disable();
            this.logger.info(`Feature desactivada: ${feature}`);
            return true;
        }
        this.logger.warn(`Feature no encontrada: ${feature}`);
        return false;
    }

    toggleFeature(feature) {
        const manager = this.managers.get(feature);
        if (manager) {
            manager.toggle();
            this.logger.info(`Feature alternada: ${feature}`);
            return true;
        }
        return false;
    }

    setFeatureIntensity(feature, intensity) {
        const manager = this.managers.get(feature);
        if (manager) {
            manager.setIntensity(intensity);
            this.logger.info(`Intensidad ajustada para ${feature}: ${intensity}`);
            return true;
        }
        return false;
    }

    getFeatureStatus(feature) {
        const manager = this.managers.get(feature);
        return manager ? manager.getStatus() : null;
    }

    getStatus() {
        const featuresStatus = {};
        for (const [key, manager] of this.managers) {
            featuresStatus[key] = manager.getStatus();
        }

        return {
            initialized: this.isInitialized,
            features: featuresStatus,
            timestamp: new Date().toISOString(),
            totalFeatures: this.managers.size
        };
    }

    getAllManagers() {
        return this.managers;
    }

    resetAll() {
        for (const manager of this.managers.values()) {
            manager.disable();
        }
        this.logger.info('Todos los features reseteados');
    }

    async migrateFromOldSettings() {
        const oldSettings = localStorage.getItem('accessibilitySettings');
        if (oldSettings) {
            try {
                const settings = JSON.parse(oldSettings);
                this.logger.info('Migrando configuraciones antiguas');

                // Migrar fotofobia si existe
                if (settings.photophobiaMode !== undefined && this.managers.has('photophobia')) {
                    const photophobia = this.managers.get('photophobia');
                    if (settings.photophobiaMode) {
                        photophobia.enable();
                    }
                }

                localStorage.removeItem('accessibilitySettings');
                this.logger.info('Migración completada');

            } catch (error) {
                this.logger.error('Error en migración', error);
            }
        }
    }
}