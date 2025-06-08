// main.js

// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {

  // === Constantes Globales ===
  const body = document.body;
  const html = document.documentElement;
  const BASE_URL = '/coaching-site';

  // === TEMA Y CONTRASTE (al cargar la página)====================================================
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("theme");
  const savedContrast = localStorage.getItem("contrast");
  // Usa un operador de coalescencia nula (??) para un manejo más explícito de `null` o `undefined`.
  // Aunque en este caso || funciona bien para strings vacíos, el ?? es más preciso para la intención de "si no es null/undefined".
  const theme = savedTheme ?? (prefersDark ? "dark" : "light");
  const contrast = savedContrast ?? "medium";
  body.setAttribute("data-theme", theme);
  body.setAttribute("data-contrast", contrast);

  // === METADATOS DE COLOR EN NAVEGADOR MÓVIL====================================================
  function updateThemeColorMeta(themeName) {
    const themeColorMeta = document.querySelector("meta[name=theme-color]");
    if (!themeColorMeta) return; // Mejor comprobación explícita
    const colors = {
      light: "#ffffff",
      dark: "#101010",
    };
    // Utiliza un operador de coalescencia nula para el fallback, asegurando un valor si themeName no coincide.
    themeColorMeta.setAttribute("content", colors[themeName] ?? "#ffffff");
  }

  updateThemeColorMeta(theme); // Se inicializa con el tema actual al cargar


  // === MENÚ LATERAL ========================================================

  const menuToggle = document.getElementById('menu-toggle');
  const closeMenuToggle = document.getElementById('close-menu-toggle');
  const sidebarWrapper = document.getElementById('sidebar-wrapper');

  // Encapsular toda la lógica dentro de la comprobación de existencia de elementos.
  if (menuToggle && closeMenuToggle && sidebarWrapper) {
    // Optimización: No es necesario comprobar hasAttribute cada vez.
    // Simplemente asegúrate de que el tabindex esté presente si no lo está.
    // Esto es un one-time setup.
    if (!sidebarWrapper.hasAttribute('tabindex')) {
      sidebarWrapper.setAttribute('tabindex', '-1');
    }

    // Configuración inicial de atributos ARIA.
    menuToggle.setAttribute('aria-controls', 'sidebar-wrapper');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú lateral');
    closeMenuToggle.setAttribute('aria-label', 'Cerrar menú lateral');

    // Función para abrir el menú lateral
    const openSidebar = () => {
      sidebarWrapper.classList.add('active');
      sidebarWrapper.setAttribute('aria-hidden', 'false');
      menuToggle.style.display = 'none'; // Oculta el botón de abrir
      closeMenuToggle.style.display = 'flex'; // Muestra el botón de cerrar
      menuToggle.setAttribute('aria-expanded', 'true');
      sidebarWrapper.focus(); // Mueve el foco al sidebar
      sidebarWrapper.addEventListener('keydown', trapFocus);
    };
    
    // Función para cerrar el menú lateral
    const closeSidebar = () => {
      sidebarWrapper.classList.remove('active');
      sidebarWrapper.setAttribute('aria-hidden', 'true');
      // Usar CSS para manejar display es generalmente mejor para transiciones y estados
      // Alternativamente, puedes usar una clase CSS para controlar el display.
      closeMenuToggle.style.display = 'none'; // Asegura que el botón de cerrar esté oculto
      menuToggle.style.display = 'flex'; // Asegura que el botón de abrir esté visible
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus();
      sidebarWrapper.removeEventListener('keydown', trapFocus);
    };

    // Función para atrapar el foco
    const trapFocus = (e) => {
      if (e.key === 'Tab') {
        const focusableElements = sidebarWrapper.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return; // Evita errores si no hay elementos enfocables

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else { // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
           }
        }
      } 
      else if (e.key === 'Escape' && sidebarWrapper.classList.contains('active')) {
        // Manejar Escape dentro del trapFocus si se desea, o mantenerlo global.
        // Aquí lo mantenemos global para mayor consistencia, pero se puede integrar.
        closeSidebar();
      }
    };
  
    // Event Listeners
    menuToggle.addEventListener('click', openSidebar); // Usa la función openSidebar
    closeMenuToggle.addEventListener('click', closeSidebar);

    sidebarWrapper.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeSidebar);
    });

    // Cierre al hacer clic fuera del menú
    document.addEventListener('click', (e) => {
      // Optimizacion: Si el menu no está activo, no hagas nada.
      if (!sidebarWrapper.classList.contains('active')) return;

      // Comprueba si el clic no está dentro del sidebar y no está en el botón de toggle.
      if (!sidebarWrapper.contains(e.target) && !menuToggle.contains(e.target)) {
        closeSidebar();
      }
    });

    // Cierre con la tecla Escape
    document.addEventListener('keydown', (e) => {
      // Optimizacion: Si el menu no está activo, no hagas nada.
      if (!sidebarWrapper.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeSidebar();
      }
    });
  }

// === BOTÓN SCROLL TO TOP ================================================

  const scrollToTop = document.querySelector('.scroll-to-top');
  let scrollToTopVisible = false;  // Estado para evitar actualizaciones redundantes

  if (scrollToTop) {
      // Uso de requestAnimationFrame para las animaciones fadeIn/fadeOut es una excelente práctica.

      // Listener de scroll optimizado
      window.addEventListener('scroll', () => {
        const shouldShow = window.scrollY > 100;
        if (shouldShow !== scrollToTopVisible) { // Solo actualiza si el estado cambia
          scrollToTopVisible = shouldShow;
          shouldShow ? fadeIn(scrollToTop) : fadeOut(scrollToTop);
        }
      });

      scrollToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    
    // Funciones de animación (fadeIn, fadeOut)
    // Estas funciones son correctas y utilizan requestAnimationFrame, lo cual es óptimo para animaciones.
    // Podrían ser más genéricas o parametrizables si se usaran en más lugares, pero aquí están bien.
    function fadeIn(el) {
      el.style.display = 'flex'; // Asegura que el elemento sea visible antes de animar la opacidad
      el.style.opacity = 0;
      let opacity = 0; // Usar una variable local para la opacidad
      function animateFadeIn() {
        if (opacity < 1) {
          opacity += 0.1;
          el.style.opacity = opacity;
          requestAnimationFrame(animateFadeIn);
        } else {
          el.style.opacity = 1; // Asegura que la opacidad final sea 1
        }
      }
      requestAnimationFrame(animateFadeIn);
    }


    function fadeOut(el) {
      let opacity = 1; // Usar una variable local para la opacidad
      function animateFadeOut() {
        if (opacity > 0) {
          opacity -= 0.1;
          el.style.opacity = opacity;
          requestAnimationFrame(animateFadeOut);
        } else {
          el.style.display = 'none'; // Oculta el elemento completamente al finalizar
          el.style.opacity = 0; // Asegura que la opacidad final sea 0
        }
      }
      requestAnimationFrame(animateFadeOut);
    }


  // === CAMBIO DE TEMA ======================================================

  const themeToggle = document.getElementById('theme-toggle');
  const themeDropdown = document.getElementById('theme-dropdown');
  // Usar el operador de encadenamiento opcional (?.) para evitar errores si themeDropdown es null
  const themeMenu = themeDropdown?.querySelector('.dropdown-menu');

  if (themeToggle && themeDropdown && themeMenu) {
    themeToggle.setAttribute('aria-haspopup', 'true');
    themeToggle.setAttribute('aria-expanded', 'false');

    const themeButtons = themeMenu.querySelectorAll('[data-theme-choice]');

    // Función central para cambiar el tema
    const setActiveTheme = (selectedTheme) => {
      html.setAttribute('data-theme', selectedTheme);
      body.setAttribute('data-theme', selectedTheme); // Asegurarse de que el body también tenga el tema
      localStorage.setItem('theme', selectedTheme);
      updateImagesForTheme(selectedTheme);
      loadParticles(selectedTheme);
      updateTippyTheme(selectedTheme);

      themeButtons.forEach(btn => {
        // Usar un booleano para toggle es más limpio
        const isActive = btn.getAttribute('data-theme-choice') === selectedTheme;
        btn.classList.toggle('active', isActive);
        // Añadir aria-pressed para botones de toggle
        btn.setAttribute('aria-pressed', isActive);
      });
    };

    // Inicializar el tema activo al cargar la página en el menú
    setActiveTheme(html.getAttribute('data-theme')); // Asegurarse de que el tema inicial del HTML se refleje en los botones.

    themeToggle.addEventListener('click', (e) => {
      e.stopPropagation(); // Evita que el clic se propague al document y cierre el menú inmediatamente
      const isExpanded = themeMenu.classList.toggle('show');
      themeToggle.setAttribute('aria-expanded', isExpanded);
      if (isExpanded) {
        // Enfoque el primer botón del menú para accesibilidad
        const firstButton = themeMenu.querySelector('button');
        if (firstButton) firstButton.focus();
      } else {
        themeToggle.focus(); // Regresa el foco al toggle si se cierra el menú
      }
    });

    // Cierre del dropdown al hacer clic fuera
    document.addEventListener('click', (e) => {
      // Si el menú no está visible, no hacer nada
      if (!themeMenu.classList.contains('show')) return;
      if (!themeDropdown.contains(e.target)) {
        themeMenu.classList.remove('show');
        themeToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Cierre del dropdown con Escape
    document.addEventListener('keydown', (e) => {
      // Si el menú no está visible, no hacer nada
      if (!themeMenu.classList.contains('show')) return;
      if (e.key === 'Escape') {
        themeMenu.classList.remove('show');
        themeToggle.setAttribute('aria-expanded', 'false');
        themeToggle.focus(); // Regresa el foco al botón de toggle
      }
    });

    // Navegación con flechas en el dropdown (accesibilidad)
    themeMenu.addEventListener('keydown', (e) => {
      const items = [...themeMenu.querySelectorAll('button')]; // Convertir a array para usar indexOf
      if (items.length === 0) return; // Si no hay ítems, no hagas nada.
      const currentIndex = items.indexOf(document.activeElement);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        items[nextIndex].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        items[prevIndex].focus();
      }
    });

    // Listener para los botones de selección de tema
    themeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedTheme = btn.getAttribute('data-theme-choice');
        setActiveTheme(selectedTheme); // Usa la función central
        themeMenu.classList.remove('show');
        themeToggle.setAttribute('aria-expanded', 'false');
        themeToggle.focus(); // Regresa el foco al toggle después de la selección
      });
    });
  }
  
    // === FUNCIONES DE TEMA ===

  // loadParticles: Asegúrate de que `particlesJS` esté disponible globalmente.
  function loadParticles(theme) {
    const configFile = theme === 'dark' ? 'particles-dark.json' : 'particles-light.json';
     // Comprobar si particlesJS está cargado y si hay instancias activas
    if (window.pJSDom && window.pJSDom.length > 0) {
      window.pJSDom[0].pJS.fn.vendors.destroypJS();
      window.pJSDom = [];
    }
    // Asegúrate de que la URL sea correcta y completa.
    // Usar template literals para construir la URL es una buena práctica.
    if (typeof particlesJS !== 'undefined') { // Asegura que particlesJS existe
        particlesJS.load('particles-js', `${BASE_URL}/assets/particles/${configFile}`);
    } else {
        console.warn('particlesJS no está cargado. No se pueden cargar las partículas.');
    }
  }

  function updateImagesForTheme(theme) {
    // Función auxiliar para establecer la imagen de fondo
    const setBackgroundImage = (element, darkUrl, lightUrl) => {
      if (element && darkUrl && lightUrl) {
        element.style.transition = 'background-image 0.5s ease-in-out';
        element.style.backgroundImage = `url('${theme === 'dark' ? darkUrl : lightUrl}')`;
      }
    };

    // Hero Header
    const heroHeader = document.querySelector('header.hero');
    setBackgroundImage(heroHeader, heroHeader?.dataset.imgDark, heroHeader?.dataset.imgLight);

    // Hero Post
    const heroPost = document.querySelector('.post-hero-image');
    setBackgroundImage(heroPost, heroPost?.dataset.bgDark, heroPost?.dataset.bgLight);

    // Imágenes dinámicas (IMG tags)
    const themeImgs = document.querySelectorAll('[data-img-dark][data-img-light]');
    themeImgs.forEach(img => {
      if (img.tagName === 'IMG') { // Asegura que es un elemento <img>
        img.style.transition = 'opacity 0.5s ease-in-out';
        img.style.opacity = 0; // Inicia la transición de opacidad
        setTimeout(() => {
          img.src = theme === 'dark' ? img.dataset.imgDark : img.dataset.imgLight;
          img.style.opacity = 1; // Revela la imagen con opacidad
        }, 200); // Pequeño retardo para la transición suave
      }
    });

    // Elementos con background-image (excepto post-hero-image que ya se maneja)
    const bgImgs = document.querySelectorAll('[data-bg-dark][data-bg-light]');
    bgImgs.forEach(el => {
      // Evitar doble procesamiento si post-hero-image ya fue manejado por setBackgroundImage
      if (!el.classList.contains('post-hero-image')) {
        setBackgroundImage(el, el.dataset.bgDark, el.dataset.bgLight);
      }
    });
  }
  

  // updateTippyTheme: Asegúrate de que Tippy.js esté cargado.
  function updateTippyTheme(theme) {
    const tippyTheme = (theme === 'dark') ? 'material' : 'light';
    // Utiliza document.querySelectorAll y _tippy para actualizar los tooltips existentes.
    document.querySelectorAll('[data-tippy-content]').forEach(el => {
      if (el._tippy) { // Comprueba si Tippy.js ya ha inicializado el tooltip
        el._tippy.setProps({ theme: tippyTheme });
      }
    });
  }

  // Inicializar tooltips al cargar la página
  // Esta inicialización debe estar fuera de las funciones de tema
  // para que se ejecute solo una vez al cargar el DOM.
  if (typeof tippy !== 'undefined') { // Asegura que Tippy.js existe
    tippy('[data-tippy-content]', {
      animation: 'shift-away',
      // Determina el tema inicial de Tippy basado en el data-theme actual del HTML
      theme: (['dark'].includes(document.documentElement.getAttribute('data-theme')))
        ? 'material'
        : 'light',
      delay: [100, 50],
      arrow: true,
    });
  } else {
      console.warn('Tippy.js no está cargado. Los tooltips no se inicializarán.');
  }

 // === ACCESIBILIDAD: FAB, POPUP Y SIDEBAR ========================================================
  // Se asume que los IDs de los elementos son únicos y consistentes.
  const accessibilityToggle = document.getElementById("accessibility-toggle"); // El botón FAB/toggle
  const accessibilitySidebar = document.getElementById("accessibility-sidebar"); // La barra lateral de accesibilidad
  const closeAccessibilityButton = document.getElementById("close-accessibility-toggle"); // Botón para cerrar la barra lateral
  
  // Solo si los elementos principales de accesibilidad existen
  if (accessibilityToggle && accessibilitySidebar && closeAccessibilityButton) {
    // Configuración inicial de ARIA para el sidebar de accesibilidad
    accessibilitySidebar.setAttribute('aria-hidden', 'true');
    accessibilitySidebar.setAttribute('tabindex', '-1'); // Para que sea enfocable
    accessibilityToggle.setAttribute('aria-expanded', 'false');
    accessibilityToggle.setAttribute('aria-controls', 'accessibility-sidebar');
    accessibilityToggle.setAttribute('aria-label', 'Abrir opciones de accesibilidad');
    closeAccessibilityButton.setAttribute('aria-label', 'Cerrar opciones de accesibilidad');

    // Función para abrir la sidebar de accesibilidad
    const openAccessibilitySidebar = () => {
      accessibilitySidebar.classList.add('active'); // Usar 'active' para consistencia con el menú lateral
      accessibilitySidebar.setAttribute('aria-hidden', 'false');
      accessibilityToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll'); // Añadir clase para deshabilitar scroll del body
      accessibilitySidebar.focus(); // Mover el foco a la sidebar
      accessibilitySidebar.addEventListener('keydown', trapAccessibilityFocus); // Activar trap de foco
    };

    // Función para cerrar la sidebar de accesibilidad
    const closeAccessibilitySidebar = () => {
      accessibilitySidebar.classList.remove('active');
      accessibilitySidebar.setAttribute('aria-hidden', 'true');
      accessibilityToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
      accessibilityToggle.focus(); // Regresar foco al botón toggle
      accessibilitySidebar.removeEventListener('keydown', trapAccessibilityFocus); // Desactivar trap de foco
    };

    // Función para atrapar el foco en la sidebar de accesibilidad
    const trapAccessibilityFocus = (e) => {
      if (e.key === 'Tab') {
        const focusableElements = accessibilitySidebar.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else { // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    };


    // Event Listeners para la sidebar de accesibilidad
    accessibilityToggle.addEventListener("click", openAccessibilitySidebar);
    closeAccessibilityButton.addEventListener("click", closeAccessibilitySidebar);

    // Cerrar sidebar de accesibilidad con tecla ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && accessibilitySidebar.classList.contains("active")) {
        closeAccessibilitySidebar();
      }
    });
  
    // Recuperar configuración previa desde localStorage
    const savedColorblind = localStorage.getItem("colorblind");
    const savedTextSize = localStorage.getItem("textSize");
    const savedAnimation = localStorage.getItem("animation");
    const savedReadingMode = localStorage.getItem("readingMode");
    const savedDyslexia = localStorage.getItem("dyslexia");

    if (savedColorblind) html.setAttribute("data-colorblind", savedColorblind);
    if (savedTextSize) html.setAttribute("data-text-size", savedTextSize);
    if (savedAnimation) html.setAttribute("data-animation", savedAnimation);

    // Para toggles (checkboxes), actualiza su estado y el atributo del HTML
    const readingModeToggle = document.getElementById("reading-mode-toggle");
    if (readingModeToggle) {
      readingModeToggle.checked = savedReadingMode === "true";
      html.toggleAttribute("data-reading", readingModeToggle.checked);
    }
    const dyslexiaToggle = document.getElementById("dyslexia-toggle");
    if (dyslexiaToggle) {
      dyslexiaToggle.checked = savedDyslexia === "true";
      html.toggleAttribute("data-dyslexia", dyslexiaToggle.checked);
    }


    // Cambiar nivel de contraste (ya manejado por la sección de tema, pero se mantiene si es una configuración aparte de accesibilidad)
    document.querySelectorAll("[data-contrast-choice]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const contrast = btn.dataset.contrastChoice;
        html.setAttribute("data-contrast", contrast); // Usa html (root) en lugar de root
        localStorage.setItem("contrast", contrast);
      });
    });

    // Cambiar tipo de daltonismo
    document.querySelectorAll("[data-colorblind-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.colorblindType;
        html.setAttribute("data-colorblind", type);
        localStorage.setItem("colorblind", type);
      });
    });

    // Cambiar tamaño de texto
    document.querySelectorAll("[data-text-size]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const size = btn.dataset.textSize;
        html.setAttribute("data-text-size", size);
        localStorage.setItem("textSize", size);
      });
    });

    // Cambiar nivel de animación (slider)
    const animationSlider = document.getElementById("animation-slider");
    if (animationSlider) {
      animationSlider.addEventListener("input", (e) => {
        const level = e.target.value;
        html.setAttribute("data-animation", level);
        localStorage.setItem("animation", level);
      });
      // Inicializar slider con valor guardado
      if (savedAnimation) {
        animationSlider.value = savedAnimation;
      }
    }

    // Toggle modo lectura
    if (readingModeToggle) { // Si ya se encontró el elemento
      readingModeToggle.addEventListener("change", (e) => {
        html.toggleAttribute("data-reading", e.target.checked);
        localStorage.setItem("readingMode", e.target.checked);
      });
    }

    // Toggle modo dislexia
    if (dyslexiaToggle) { // Si ya se encontró el elemento
      dyslexiaToggle.addEventListener("change", (e) => {
        html.toggleAttribute("data-dyslexia", e.target.checked);
        localStorage.setItem("dyslexia", e.target.checked);
      });
    }

    // === POPUP DE ACCESIBILIDAD (si es diferente de los popups generales) ===
    const accessibilityPopup = document.getElementById('accessibility-popup'); // Asumiendo que tiene un ID.
    const accessibilityPopupCloseBtn = document.getElementById('accessibility-popup-close'); // Asumiendo que tiene un ID.
    const hasSeenAccessibilityPopupKey = 'hasSeenAccessibilityPopup'; // Clave para localStorage

    if (accessibilityPopup && accessibilityPopupCloseBtn) {
        const hasSeenPopup = localStorage.getItem(hasSeenAccessibilityPopupKey) === 'true';

        if (!hasSeenPopup) {
            accessibilityPopup.hidden = false;
            accessibilityPopup.setAttribute('data-visible', 'true');

            setTimeout(() => {
                accessibilityPopup.setAttribute('data-visible', 'false');
                // Usar transitionend para ocultar completamente después de la animación
                accessibilityPopup.addEventListener('transitionend', function handler() {
                    accessibilityPopup.hidden = true;
                    accessibilityPopup.removeEventListener('transitionend', handler);
                }, { once: true });
                localStorage.setItem(hasSeenAccessibilityPopupKey, 'true');
            }, 5000); // Muestra por 5 segundos
        }

        accessibilityPopupCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            accessibilityPopup.setAttribute('data-visible', 'false');
            accessibilityPopup.addEventListener('transitionend', function handler() {
                accessibilityPopup.hidden = true;
                accessibilityPopup.removeEventListener('transitionend', handler);
            }, { once: true });
            localStorage.setItem(hasSeenAccessibilityPopupKey, 'true');
        });
    }
  }
  // === POPUPS GENERALES =============================================================
  // Esta sección se consolida y se mueve al final, ya que los popups son una funcionalidad general.

  const popups = document.querySelectorAll(".popup");
  const openButtons = document.querySelectorAll("[data-open-popup]");
  const closeButtons = document.querySelectorAll("[data-close-popup]");

  // Optimizacion: Solo inicializa si hay popups o botones de apertura
  if (popups.length > 0 || openButtons.length > 0) {


    function openPopup(popupId) {
      const popup = document.getElementById(popupId);
      if (!popup) {
        console.warn(`Popup con ID "${popupId}" no encontrado.`);
        return;
      }
      popup.classList.add("show");
      popup.setAttribute("aria-hidden", "false");
      // Encuentra el primer elemento enfocable dentro del popup
      const focusable = popup.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])");
      if (focusable) focusable.focus();
      document.body.style.overflow = 'hidden'; // Evita el scroll del body
      popup.addEventListener('keydown', trapPopupFocus); // Añade el trap de foco
    }

    function closePopup(popup) {
      if (!popup || !popup.classList.contains("show")) return; // Si no hay popup o no está abierto, no hagas nada
      popup.classList.remove("show");
      popup.setAttribute("aria-hidden", "true");
      document.body.style.overflow = ''; // Restaura el scroll del body
      // Opcional: devolver el foco al elemento que abrió el popup
      // Esto requeriría almacenar `document.activeElement` al abrir el popup.
      popup.removeEventListener('keydown', trapPopupFocus); // Remueve el trap de foco
    }

    // Función para atrapar el foco en los popups
    const trapPopupFocus = (e) => {
      if (e.key === 'Tab') {
        const popup = e.currentTarget; // El popup actual es el target del evento
        const focusableElements = popup.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else { // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      } else if (e.key === 'Escape') {
        // Permitir cerrar con Escape dentro del trap, si no se maneja globalmente.
        closePopup(e.currentTarget);
      }
    };

    openButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const popupId = btn.getAttribute("data-open-popup");
        openPopup(popupId);
      });
    });

    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const popup = btn.closest(".popup");
        if (popup) closePopup(popup);
      });
    });

    // Cierre al hacer clic fuera del popup
    document.addEventListener("click", (e) => {
      popups.forEach((popup) => {
        // Solo cierra si el popup está visible y el clic fue fuera de su contenido y no en un botón de abrir
        if (popup.classList.contains("show") && !popup.querySelector(".popup-content").contains(e.target) && !e.target.hasAttribute('data-open-popup')) {
          closePopup(popup);
        }
      });
    });

    // Cierre con la tecla Escape (manejo global)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        popups.forEach((popup) => {
          if (popup.classList.contains("show")) {
            closePopup(popup);
          }
        });
      }
    });
  }
});