// calendly-button.js

export function initCalendlyButton() {
  document.addEventListener('DOMContentLoaded', () => {
    const calendlyButton = document.getElementById('calendly-button');

    if (!calendlyButton) return;

    calendlyButton.addEventListener('click', (e) => {
      e.preventDefault();

      if (typeof Calendly !== 'undefined') {
        Calendly.initPopupWidget({
          url: 'https://calendly.com/martapaz-coaching',
        });
      } else {
        console.warn('Calendly script no cargado aún');
      }

      if (typeof gtag === 'function') {
        gtag('event', 'calendly_opened', {
          event_category: 'Calendly',
          event_label: 'Botón de reserva',
          value: 1,
        });
      }
    });
  });
}
