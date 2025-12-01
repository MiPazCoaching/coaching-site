// assets/js/accessibility/features/photophobia-manager.js

import { BaseFeatureManager } from '../core/base-feature-manager.js';

export class PhotophobiaManager extends BaseFeatureManager {
    constructor(logger) {
        super('photophobia', logger);
        this.currentTheme = 'light';
        this.themeSettings = {
            light: { defaultBrightness: 5, defaultTemp: 5 },
            dark: { defaultBrightness: 4, defaultTemp: 7 },
            'high-contrast': { defaultBrightness: 3, defaultTemp: 6 }
        };
    }

    getDefaultSettings() {
        const defaultTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const themeConfig = this.themeSettings[defaultTheme] || this.themeSettings.light;

        return {
            enabled: false,
            colorTemperature: themeConfig.defaultTemp,
            brightness: themeConfig.defaultBrightness,
            refreshRate: 7,
            contrast: 5,
            saturation: 5
        };
    }

    async setupEventListeners() {
        // Configurar toggle principal
        this.setupToggle('photophobia-mode-toggle', (e) => {
            const isEnabled = e.target.checked;
            this.toggleIntensityControl('photophobia-controls', isEnabled);

            // Actualizar atributo en root
            document.documentElement.setAttribute('data-photophobia-mode', isEnabled.toString());

            // Si se desactiva, restaurar valores del tema actual
            if (!isEnabled) {
                this.restoreThemeDefaults();
            }
        });

        // Configurar sliders
        this.setupSlider('color-temperature', 'colorTemperature', (e) => {
            this.logger.debug('Temperatura de color ajustada', { value: e.target.value });
        });

        this.setupSlider('brightness', 'brightness', (e) => {
            this.logger.debug('Brillo ajustado', { value: e.target.value });
        });

        this.setupSlider('refresh-rate', 'refreshRate', (e) => {
            this.logger.debug('Refresh rate ajustado', { value: e.target.value });
        });

        // Nuevos controles opcionales
        this.setupSlider('contrast', 'contrast');
        this.setupSlider('saturation', 'saturation');

        // Escuchar cambios de tema
        this.setupThemeListener();

        this.logger.debug('Event listeners de photophobia configurados');
    }

    setupThemeListener() {
        // Observar cambios en el atributo data-theme
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    this.currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                    this.onThemeChanged();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        // Obtener tema inicial
        this.currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    }

    onThemeChanged() {
        this.logger.info('Tema cambiado', { theme: this.currentTheme });

        if (this.settings.enabled) {
            // Reaplicar configuración con ajustes para el nuevo tema
            this.applySettings();
        } else {
            // Si el modo fotofobia no está activo, solo cargar defaults del tema
            const themeConfig = this.themeSettings[this.currentTheme] || this.themeSettings.light;
            this.settings.colorTemperature = themeConfig.defaultTemp;
            this.settings.brightness = themeConfig.defaultBrightness;
            this.updateSliderValues();
        }
    }

    restoreThemeDefaults() {
        const themeConfig = this.themeSettings[this.currentTheme] || this.themeSettings.light;

        // Restaurar sliders a valores por defecto del tema
        this.settings.colorTemperature = themeConfig.defaultTemp;
        this.settings.brightness = themeConfig.defaultBrightness;

        this.updateSliderValues();
        this.removeCustomFilters();
        this.logger.debug('Valores restaurados al tema actual', { theme: this.currentTheme });
    }

    updateSliderValues() {
        // Actualizar visualmente los sliders
        const sliders = [
            { id: 'color-temperature', key: 'colorTemperature' },
            { id: 'brightness', key: 'brightness' },
            { id: 'refresh-rate', key: 'refreshRate' },
            { id: 'contrast', key: 'contrast' },
            { id: 'saturation', key: 'saturation' }
        ];

        sliders.forEach(({ id, key }) => {
            const slider = document.getElementById(id);
            const valueDisplay = slider?.closest('.slider-container')?.querySelector('.slider-value') ||
                slider?.closest('.intensity-control')?.querySelector('.intensity-value');

            if (slider && this.settings[key] !== undefined) {
                slider.value = this.settings[key];
                if (valueDisplay) {
                    valueDisplay.textContent = this.settings[key];
                }
            }
        });
    }

    applySettings() {
        const root = document.documentElement;

        if (this.settings.enabled) {
            root.setAttribute('data-photophobia-mode', 'true');
            root.setAttribute('data-photophobia-intensity', this.calculateOverallIntensity());

            this.applyCustomFilters();
            this.applyRefreshRateEffects();
            this.applyThemeSpecificAdjustments();

            this.logger.info('Modo fotofobia activado', {
                settings: this.settings,
                theme: this.currentTheme,
                intensity: this.calculateOverallIntensity()
            });
        } else {
            root.removeAttribute('data-photophobia-mode');
            root.removeAttribute('data-photophobia-intensity');
            this.removeCustomFilters();
            this.removeRefreshRateEffects();
            this.logger.info('Modo fotofobia desactivado');
        }
    }

    calculateOverallIntensity() {
        // Calcular intensidad general basada en múltiples factores (1-10)
        const factors = {
            brightness: (this.settings.brightness - 5) * 0.6, // -3 a +3
            refreshRate: (10 - this.settings.refreshRate) * 0.3, // 0 a +3
            theme: this.currentTheme === 'dark' ? -1 : this.currentTheme === 'high-contrast' ? 2 : 0
        };

        const base = 5; // Nivel medio
        const calculated = base + factors.brightness + factors.refreshRate + factors.theme;

        return Math.max(1, Math.min(10, Math.round(calculated)));
    }

    applyCustomFilters() {
        const filters = [];
        const root = document.documentElement;

        // 1. Temperatura de color (0=frío azulado, 10=cálido anaranjado)
        const tempValue = (this.settings.colorTemperature - 5) * 20; // -100 a +100 grados
        if (tempValue !== 0) {
            filters.push(`hue-rotate(${tempValue}deg)`);
        }

        // 2. Brillo (0=oscuro, 10=brillante)
        const brightnessValue = this.calculateBrightness();
        if (brightnessValue !== 1.0) {
            filters.push(`brightness(${brightnessValue})`);
        }

        // 3. Contraste (si está configurado)
        if (this.settings.contrast !== undefined && this.settings.contrast !== 5) {
            const contrastValue = 0.8 + (this.settings.contrast * 0.04); // 0.8 a 1.2
            filters.push(`contrast(${contrastValue})`);
        }

        // 4. Saturación (si está configurado)
        if (this.settings.saturation !== undefined && this.settings.saturation !== 5) {
            const saturationValue = 0.7 + (this.settings.saturation * 0.06); // 0.7 a 1.3
            filters.push(`saturate(${saturationValue})`);
        }

        // Aplicar filtros al body
        if (filters.length > 0) {
            document.body.style.filter = filters.join(' ');
            root.style.setProperty('--filter-combined', filters.join(' '));
        } else {
            document.body.style.filter = '';
            root.style.removeProperty('--filter-combined');
        }

        // Aplicar variables CSS para elementos específicos
        this.applyCssVariables();
    }

    calculateBrightness() {
        // Brillo adaptado al tema actual
        const baseBrightness = {
            light: 1.0,
            dark: 0.9,
            'high-contrast': 0.8
        }[this.currentTheme] || 1.0;

        // Ajuste manual del usuario (-0.3 a +0.3)
        const userAdjustment = (this.settings.brightness - 5) * 0.06;

        return Math.max(0.4, Math.min(1.6, baseBrightness + userAdjustment));
    }

    applyCssVariables() {
        const root = document.documentElement;

        // Opacidad de imágenes y videos
        const imageOpacity = this.calculateImageOpacity();
        root.style.setProperty('--image-opacity', imageOpacity);

        // Opacidad de partículas
        const particlesOpacity = imageOpacity * 0.6;
        root.style.setProperty('--particles-opacity', particlesOpacity);

        // Brillo para elementos específicos
        const elementBrightness = this.calculateElementBrightness();
        root.style.setProperty('--element-brightness', elementBrightness);
    }

    calculateImageOpacity() {
        // Opacidad basada en refresh rate y brillo
        const baseOpacity = this.settings.refreshRate <= 3 ? 0.7 :
            this.settings.refreshRate <= 6 ? 0.8 : 0.9;

        const brightnessFactor = 1 - ((10 - this.settings.brightness) * 0.02);
        return Math.max(0.5, Math.min(1, baseOpacity * brightnessFactor));
    }

    calculateElementBrightness() {
        // Brillo para elementos UI específicos
        return this.currentTheme === 'high-contrast' ?
            0.9 :
            1 - ((10 - this.settings.brightness) * 0.03);
    }

    applyRefreshRateEffects() {
        const root = document.documentElement;

        if (this.settings.enabled) {
            root.setAttribute('data-refresh-rate', this.settings.refreshRate.toString());

            // Aplicar también intensidad calculada
            const intensity = this.calculateOverallIntensity();
            root.setAttribute('data-photophobia-intensity', intensity.toString());

            const levelInfo = this.getRefreshRateLevelInfo(this.settings.refreshRate);
            this.logger.debug('Refresh rate aplicado', {
                level: this.settings.refreshRate,
                intensity: intensity,
                description: levelInfo.description
            });
        }
    }

    applyThemeSpecificAdjustments() {
        const root = document.documentElement;

        switch(this.currentTheme) {
            case 'dark':
                // En modo oscuro, aplicar ajustes adicionales
                root.style.setProperty('--darkmode-brightness-adjust', '0.1');
                break;

            case 'high-contrast':
                // En alto contraste, mantener colores puros pero reducir brillo
                root.style.setProperty('--high-contrast-brightness', '0.85');
                break;

            default:
                // Light mode - ajustes mínimos
                root.style.removeProperty('--darkmode-brightness-adjust');
                root.style.removeProperty('--high-contrast-brightness');
        }
    }

    removeCustomFilters() {
        document.body.style.filter = '';

        const root = document.documentElement;
        root.style.removeProperty('--filter-combined');
        root.style.removeProperty('--image-opacity');
        root.style.removeProperty('--particles-opacity');
        root.style.removeProperty('--element-brightness');
        root.style.removeProperty('--darkmode-brightness-adjust');
        root.style.removeProperty('--high-contrast-brightness');

        this.removeRefreshRateEffects();
    }

    removeRefreshRateEffects() {
        const root = document.documentElement;
        root.removeAttribute('data-refresh-rate');
        root.removeAttribute('data-photophobia-intensity');
    }

    getRefreshRateLevelInfo(level) {
        const levels = {
            0: { description: 'Máxima reducción - Sin animaciones', priority: 'crítico' },
            1: { description: 'Reducción extrema - Mínimo movimiento', priority: 'alto' },
            2: { description: 'Reducción crítica - Movimiento muy limitado', priority: 'alto' },
            3: { description: 'Reducción alta - Movimiento limitado', priority: 'medio-alto' },
            4: { description: 'Reducción media-alta - Movimiento controlado', priority: 'medio' },
            5: { description: 'Reducción media - Movimiento moderado', priority: 'medio' },
            6: { description: 'Reducción baja - Movimiento suave', priority: 'medio-bajo' },
            7: { description: 'Reducción mínima - Movimiento casi normal', priority: 'bajo' },
            8: { description: 'Casi normal - Movimiento fluido', priority: 'muy bajo' },
            9: { description: 'Normal - Sin restricciones', priority: 'ninguno' },
            10: { description: 'Máximo - Experiencia completa', priority: 'ninguno' }
        };

        return levels[level] || levels[7];
    }

    setRefreshRate(rate) {
        this.settings.refreshRate = Math.min(10, Math.max(0, parseInt(rate)));
        if (this.settings.enabled) {
            this.applyRefreshRateEffects();
            this.saveSettings();
        }
        this.logger.info('Refresh rate actualizado', {
            rate: this.settings.refreshRate,
            theme: this.currentTheme
        });
    }

    setBrightness(brightness) {
        this.settings.brightness = Math.min(10, Math.max(0, parseInt(brightness)));
        if (this.settings.enabled) {
            this.applySettings();
            this.saveSettings();
        }
        this.logger.debug('Brillo actualizado', {
            brightness: this.settings.brightness,
            theme: this.currentTheme
        });
    }

    setColorTemperature(temp) {
        this.settings.colorTemperature = Math.min(10, Math.max(0, parseInt(temp)));
        if (this.settings.enabled) {
            this.applySettings();
            this.saveSettings();
        }
        this.logger.debug('Temperatura de color actualizada', {
            temperature: this.settings.colorTemperature
        });
    }

    getRefreshRateState() {
        return {
            level: this.settings.refreshRate,
            info: this.getRefreshRateLevelInfo(this.settings.refreshRate),
            enabled: this.settings.enabled,
            theme: this.currentTheme,
            overallIntensity: this.calculateOverallIntensity()
        };
    }

    getCurrentSettings() {
        return {
            ...this.settings,
            theme: this.currentTheme,
            overallIntensity: this.calculateOverallIntensity(),
            themeDefaults: this.themeSettings[this.currentTheme]
        };
    }

    // Método para sincronizar con preferencias del sistema
    syncWithSystemPreferences() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Si el sistema prefiere movimiento reducido, ajustar refresh rate
            if (this.settings.refreshRate > 4) {
                this.settings.refreshRate = 4;
                this.logger.info('Sincronizado con preferencias del sistema: movimiento reducido');
            }
        }

        if (window.matchMedia('(prefers-contrast: high)').matches) {
            // Si el sistema prefiere alto contraste
            this.currentTheme = 'high-contrast';
            this.logger.info('Sincronizado con preferencias del sistema: alto contraste');
        }

        if (this.settings.enabled) {
            this.applySettings();
        }
    }
}