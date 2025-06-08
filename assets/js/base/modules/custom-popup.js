/**
 * Controla la lógica de un popup personalizado con auto-ocultación y botones de acción.
 * @param {Object} options - Elementos DOM necesarios.
 * @param {HTMLElement} options.popup - Contenedor del popup.
 * @param {HTMLElement} options.closeBtn - Botón para cerrar el popup.
 * @param {HTMLElement} options.actionBtn - Botón o enlace para ejecutar acción en el popup.
 * @param {HTMLElement} options.reopenBtn - Botón externo para reabrir el popup.
 */
export function setupCustomPopup({ popup, closeBtn, actionBtn, reopenBtn }) {
  if (!(popup && closeBtn && actionBtn && reopenBtn)) return;

  let popupShown = false;
  let autoHideTimeout;

  function showPopup() {
    popup.classList.add('show');
    popupShown = true;
    autoHideTimeout = setTimeout(hidePopup, 4000);
  }

  function hidePopup() {
    popup.classList.remove('show');
    popupShown = false;
    clearTimeout(autoHideTimeout);
  }

  closeBtn.addEventListener('click', () => {
    hidePopup();
  });

  actionBtn.addEventListener('click', (e) => {
    e.preventDefault(); // ← evita que el enlace navegue inmediatamente
    alert('Acción del popup ejecutada');
    hidePopup();
    // Opcional: redirigir tras un retardo
    setTimeout(() => {
      window.location.href = actionBtn.href;
    }, 500);
  });

  reopenBtn.addEventListener('click', () => {
    if (!popupShown) {
      showPopup();
    }
  });

  // Mostrar popup inicial
  setTimeout(showPopup, 2000);
}
