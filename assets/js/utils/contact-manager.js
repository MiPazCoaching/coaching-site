/**
 * Contact Manager - Marta Paz Ogle
 * Datos seguros y codificados
 */

class ContactManager {
    constructor() {
        this.isInitialized = false;
        this.lang = document.documentElement.lang || 'es';

        // ======================================
        // TUS DATOS REALES - CODIFICADOS
        // ======================================
        this.contactData = {
            phone: this.decodeData('KzM0IDcxMSAyMCAyMyAxMg=='),          
            whatsapp: this.decodeData('KzM0IDcxMSAyMCAyMyAxMg=='),      
            email: this.decodeData('bWkucGF6LmNvYWNoaW5nQGdtYWlsLmNvbQ=='),
            linkedin: this.decodeData('aHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL21hcnRhLXBhei1vZ2xlP3V0bV9zb3VyY2U9c2hhcmUmdXRtX2NhbXBhaWduPXNoYXJlX3ZpYSZ1dG1fY29udGVudD1wcm9maWxlJnV0bV9tZWRpdW09aW9zX2FwcA=='),
            facebook: this.decodeData('aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3Byb2ZpbGUucGhwPWlkPTEwMDAwMDAwMDAwMDAw') 
        };

        // Mensajes personalizados por idioma
        this.messages = {
            es: {
                whatsapp: 'Hola Marta, me gustaría obtener más información sobre tus servicios de coaching personal y profesional.',
                emailSubject: 'Consulta - Marta Paz Ogle Coaching',
                emailBody: 'Hola Marta,\n\nMe gustaría obtener más información sobre tus servicios de coaching personal y profesional.\n\nMi consulta es:\n\nSaludos cordiales,\n[Tu nombre]',
                confirmCall: '¿Deseas llamar ahora a Marta Paz Ogle?'
            },
            en: {
                whatsapp: 'Hello Marta, I would like to get more information about your personal and professional coaching services.',
                emailSubject: 'Inquiry - Marta Paz Ogle Coaching',
                emailBody: 'Hello Marta,\n\nI would like to get more information about your personal and professional coaching services.\n\nMy question is:\n\nBest regards,\n[Your name]',
                confirmCall: 'Do you want to call Marta Paz Ogle now?'
            },
            fr: {
                whatsapp: 'Bonjour Marta, je voudrais obtenir plus d\'informations sur vos services de coaching personnel et professionnel.',
                emailSubject: 'Demande d\'information - Marta Paz Ogle Coaching',
                emailBody: 'Bonjour Marta,\n\nJe voudrais obtenir plus d\'informations sur vos servicios de coaching personnel et professionnel.\n\nMa question est:\n\nCordialement,\n[Votre nom]',
                confirmCall: 'Voulez-vous appeler Marta Paz Ogle maintenant?'
            }
        };

        this.logger = this.createLogger();
    }

    createLogger() {
        return {
            info: (msg, data) => console.info(`[ContactManager] ℹ️ ${msg}`, data || ''),
            success: (msg, data) => console.log(`[ContactManager] ✅ ${msg}`, data || ''),
            error: (msg, error) => console.error(`[ContactManager] ❌ ${msg}`, error),
            warn: (msg, data) => console.warn(`[ContactManager] ⚠️ ${msg}`, data || '')
        };
    }

    decodeData(encodedData) {
        try {
            return atob(encodedData);
        } catch (error) {
            this.logger.error('Error decodificando datos', error);
            return '';
        }
    }

    async init() {
        if (this.isInitialized) {
            this.logger.warn('Ya está inicializado');
            return;
        }

        try {
            this.logger.info('Inicializando Contact Manager...');

            // Mostrar datos decodificados (solo en desarrollo)
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('📞 Datos de contacto decodificados:');
                console.log('- Teléfono:', this.contactData.phone);
                console.log('- WhatsApp:', this.contactData.whatsapp);
                console.log('- Email:', this.contactData.email);
                console.log('- Facebook:', this.contactData.facebook);
            }

            this.setupContactElements();
            this.bindEvents();

            this.isInitialized = true;
            this.logger.success('Contact Manager inicializado', {
                lang: this.lang,
                phone: this.contactData.phone,
                email: this.contactData.email
            });

        } catch (error) {
            this.logger.error('Error en inicialización', error);
        }
    }

    setupContactElements() {
        // Configurar todos los elementos con data-contact
        document.querySelectorAll('[data-contact]').forEach(element => {
            const type = element.getAttribute('data-contact');

            if (element.tagName === 'A') {
                element.href = '#';
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleContact(type);
                });

                // Añadir texto descriptivo
                const textMap = {
                    'email': {
                        'es': 'Enviar email',
                        'en': 'Send email',
                        'fr': 'Envoyer email'
                    },
                    'phone': {
                        'es': 'Llamar por teléfono',
                        'en': 'Make phone call',
                        'fr': 'Appeler par téléphone'
                    },
                    'whatsapp': {
                        'es': 'Abrir WhatsApp',
                        'en': 'Open WhatsApp',
                        'fr': 'Ouvrir WhatsApp'
                    },
                    'linkedin': {
                        'es': 'Conectar en LinkedIn',
                        'en': 'Connect on LinkedIn',
                        'fr': 'Se connecter sur LinkedIn'
                    }
                };

                if (!element.textContent.trim() && textMap[type]) {
                    element.textContent = textMap[type][this.lang] || textMap[type]['en'];
                }
            }
        });
    }

    bindEvents() {
        document.addEventListener('languageChanged', (e) => {
            this.lang = e.detail.lang;
        });
    }

    async handleContact(type) {
        this.logger.info(`Iniciando contacto: ${type}`);

        switch(type) {
            case 'whatsapp':
                await this.openWhatsApp();
                break;
            case 'phone':
                await this.makePhoneCall();
                break;
            case 'email':
                await this.sendEmail();
                break;
            case 'linkedin':
                await this.openLinkedIn();
                break;
            case 'facebook':
                await this.openFacebook();
                break;
            default:
                this.logger.warn(`Tipo de contacto no reconocido: ${type}`);
        }
    }

    openWhatsApp() {
        try {
            // Obtener número y limpiar
            let phoneNumber = this.contactData.whatsapp;

            // Eliminar espacios y caracteres especiales, mantener +
            phoneNumber = phoneNumber.replace(/\s/g, '');

            // Verificar que empiece con +
            if (!phoneNumber.startsWith('+')) {
                phoneNumber = '+' + phoneNumber;
            }

            // Eliminar el + para wa.me (WhatsApp lo prefiere sin + en la URL)
            const whatsappNumber = phoneNumber.substring(1); // Quita el +

            // Mensaje personalizado
            const message = this.messages[this.lang]?.whatsapp || this.messages.es.whatsapp;
            const encodedMessage = encodeURIComponent(message);

            // Construir URL
            const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            this.logger.info('Abriendo WhatsApp', {
                original: this.contactData.whatsapp,
                formatted: phoneNumber,
                urlNumber: whatsappNumber,
                url: url
            });

            // Abrir WhatsApp
            window.open(url, '_blank', 'noopener,noreferrer');

            return true;

        } catch (error) {
            this.logger.error('Error al abrir WhatsApp', error);

            // Fallback: Mostrar número para copiar
            alert(`WhatsApp: ${this.contactData.whatsapp}\n\nSi no se abre automáticamente, agrega este número a tus contactos.`);

            return false;
        }
    }

    makePhoneCall() {
        const phoneNumber = this.contactData.phone.replace(/\s/g, '');
        const message = this.messages[this.lang]?.confirmCall || this.messages.es.confirmCall;

        if (window.confirm(message)) {
            this.logger.info('Iniciando llamada', { phoneNumber });
            window.location.href = `tel:${phoneNumber}`;
        }
    }

    sendEmail() {
        const email = this.contactData.email;
        const messages = this.messages[this.lang] || this.messages.es;
        const subject = encodeURIComponent(messages.emailSubject);
        const body = encodeURIComponent(messages.emailBody);

        this.logger.info('Abriendo cliente de email', { email });
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }
    
    openLinkedIn() {
        const url = this.contactData.linkedin;
        console.log('Abriendo LinkedIn', { url });
        window.open(url, '_blank', 'noopener,noreferrer');
    }
    
    openFacebook() {
        const url = this.contactData.facebook;
        this.logger.info('Abriendo Facebook', { url });
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    trackContact(method) {
        this.logger.info(`Contacto realizado: ${method}`);

        // ================================================
        // GOOGLE ANALYTICS - Eventos de contacto
        // ================================================
        if (typeof gtag === 'function') {
            gtag('event', 'contact_form_submit', {
                'event_category': 'engagement',
                'event_label': method,
                'method': method,
                'language': this.lang,
                'page_path': window.location.pathname,
                'page_title': document.title
            });
        }

        // ================================================
        // Evento personalizado para otros trackers
        // ================================================
        document.dispatchEvent(new CustomEvent('contactMade', {
            detail: {
                method: method,
                lang: this.lang,
                timestamp: Date.now(),
                page: window.location.pathname
            }
        }));

        // ================================================
        // Facebook Pixel (opcional)
        // ================================================
        if (typeof fbq === 'function') {
            fbq('track', 'Contact', {
                method: method,
                language: this.lang
            });
        }

        return true;
    }

    getContactInfo() {
        return {
            phone: this.contactData.phone,
            email: this.contactData.email,
            whatsapp: this.contactData.whatsapp,
            facebook: this.contactData.facebook
        };
    }
}

// Inicialización automática
document.addEventListener('DOMContentLoaded', () => {
    window.contactManager = new ContactManager();
    window.contactManager.init();

    // Añadir a DEBUG en desarrollo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.DEBUG = window.DEBUG || {};
        window.DEBUG.contact = window.contactManager;
        console.log('🔧 Contact Manager disponible en DEBUG.contact');
        console.log('📞 Datos disponibles:', window.contactManager.getContactInfo());
    }
});

export { ContactManager };