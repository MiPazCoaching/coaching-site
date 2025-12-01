// assets/js/accessibility/core/base-feature-manager.js

export class BaseFeatureManager {
    constructor(name, logger) {
        this.name = name;
        this.logger = logger || this.createDefaultLogger();
        this.settings = this.getDefaultSettings();
        this.isInitialized = false;
        this.onEnable = null;
        this.onDisable = null;
    }

    createDefaultLogger() {
        return {
            debug: (...args) => console.debug(`[${this.name}]`, ...args),
            info: (...args) => console.info(`[${this.name}]`, ...args),
            warn: (...args) => console.warn(`[${this.name}]`, ...args),
            error: (...args) => console.error(`[${this.name}]`, ...args)
        };
    }

    loadSettings() {
        try {
            const allSettings = JSON.parse(localStorage.getItem('accessibility_settings') || '{}');
            const savedSettings = allSettings[this.name];

            if (savedSettings) {
                this.settings = {
                    ...this.getDefaultSettings(),
                    ...savedSettings
                };
                this.logger.debug(`Configuración cargada`, this.settings);
            } else {
                this.logger.debug(`Configuración por defecto`, this.settings);
            }
        } catch (error) {
            this.logger.error(`Error cargando configuración`, error);
            this.settings = this.getDefaultSettings();
        }
    }

    saveSettings() {
        try {
            const allSettings = JSON.parse(localStorage.getItem('accessibility_settings') || '{}');
            allSettings[this.name] = this.settings;
            localStorage.setItem('accessibility_settings', JSON.stringify(allSettings));
            this.logger.debug(`Configuración guardada`, this.settings);
        } catch (error) {
            this.logger.error(`Error guardando configuración`, error);
        }
    }

    getDefaultSettings() {
        return {
            enabled: false,
            intensity: 3
        };
    }

    getStatus() {
        return {
            name: this.name,
            enabled: this.settings.enabled || false,
            settings: { ...this.settings },
            initialized: this.isInitialized,
            timestamp: new Date().toISOString()
        };
    }

    async initialize() {
        try {
            this.logger.info('Inicializando...');
            this.loadSettings();
            await this.setupEventListeners();
            this.applySettings();
            this.isInitialized = true;
            this.logger.info('Inicializado correctamente');
            return true;
        } catch (error) {
            this.logger.error('Error inicializando', error);
            throw error;
        }
    }

    enable(intensity = null) {
        this.settings.enabled = true;
        if (intensity !== null) {
            this.setIntensity(intensity);
        }
        this.applySettings();
        this.saveSettings();
        this.onEnable?.();
        this.logger.info('Activado', { intensity: this.settings.intensity });
        return this.getStatus();
    }

    disable() {
        this.settings.enabled = false;
        this.applySettings();
        this.saveSettings();
        this.onDisable?.();
        this.logger.info('Desactivado');
        return this.getStatus();
    }

    setIntensity(intensity) {
        this.settings.intensity = this.validateIntensity(intensity);
        if (this.settings.enabled) {
            this.applySettings();
            this.saveSettings();
        }
        this.logger.debug('Intensidad actualizada', { intensity: this.settings.intensity });
        return this.settings.intensity;
    }

    toggle() {
        if (this.settings.enabled) {
            return this.disable();
        } else {
            return this.enable();
        }
    }

    validateIntensity(intensity, min = 1, max = 5) {
        const parsed = parseInt(intensity);
        return Math.min(max, Math.max(min, isNaN(parsed) ? min : parsed));
    }

    // Métodos que deben ser implementados por las clases hijas
    async setupEventListeners() {
        throw new Error('Método setupEventListeners debe ser implementado');
    }

    applySettings() {
        throw new Error('Método applySettings debe ser implementado');
    }

    // Métodos utilitarios comunes
    setupToggle(toggleId, onChange = null) {
        const toggle = document.getElementById(toggleId);
        if (!toggle) {
            this.logger.warn(`Toggle no encontrado: ${toggleId}`);
            return false;
        }

        toggle.checked = this.settings.enabled;
        toggle.addEventListener('change', (e) => {
            this.settings.enabled = e.target.checked;

            // Ejecutar callbacks
            if (e.target.checked) {
                this.onEnable?.();
            } else {
                this.onDisable?.();
            }

            onChange?.(e);
            this.applySettings();
            this.saveSettings();
        });

        // Aplicar estado inicial
        if (this.settings.enabled) {
            setTimeout(() => this.onEnable?.(), 0);
        }

        this.logger.debug(`Toggle configurado: ${toggleId}`);
        return true;
    }

    setupSlider(sliderId, settingKey = 'intensity', onChange = null) {
        const slider = document.getElementById(sliderId);
        if (!slider) {
            this.logger.warn(`Slider no encontrado: ${sliderId}`);
            return false;
        }

        const valueDisplay = this.findValueDisplay(slider);

        const currentValue = this.settings[settingKey] ?? this.settings.intensity;
        slider.value = currentValue;
        if (valueDisplay) {
            valueDisplay.textContent = currentValue;
        }

        slider.addEventListener('input', (e) => {
            const newValue = parseInt(e.target.value);
            this.settings[settingKey] = newValue;
            if (valueDisplay) {
                valueDisplay.textContent = newValue;
            }

            onChange?.(e);
            this.applySettings();
            this.saveSettings();
        });

        this.logger.debug(`Slider configurado: ${sliderId}`);
        return true;
    }

    findValueDisplay(slider) {
        // Buscar en contenedores comunes
        const containers = ['.intensity-control', '.slider-container', '.photophobia-controls'];
        for (const containerClass of containers) {
            const container = slider.closest(containerClass);
            const valueDisplay = container?.querySelector('.intensity-value, .slider-value');
            if (valueDisplay) return valueDisplay;
        }

        // Buscar por patrón de id
        const valueId = slider.id + '-value';
        return document.getElementById(valueId);
    }

    toggleIntensityControl(controlId, show) {
        const control = document.getElementById(controlId);
        if (!control) {
            this.logger.warn(`Control no encontrado: ${controlId}`);
            return false;
        }

        if (show) {
            control.classList.add('visible');
            control.style.display = 'block';
        } else {
            control.classList.remove('visible');
            control.style.display = 'none';
        }
        return true;
    }
}