(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // assets/js/base/modules/utils/helpers.js
  function trapFocus(e, container) {
    if (e.key !== "Tab") return;
    const focusableElements = container.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  function fadeIn(element, duration = 300) {
    element.style.opacity = 0;
    element.style.display = "block";
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    requestAnimationFrame(() => {
      element.style.opacity = 1;
    });
  }
  function fadeOut(element, duration = 300) {
    element.style.transition = `opacity ${duration}ms ease-in-out`;
    element.style.opacity = 0;
    requestAnimationFrame(() => {
      element.style.opacity = 0;
    });
    setTimeout(() => {
      element.style.display = "none";
    }, duration);
  }
  var init_helpers = __esm({
    "assets/js/base/modules/utils/helpers.js"() {
    }
  });

  // assets/js/base/modules/core/scroll-to-top.js
  function initScrollToTop() {
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (!scrollToTopBtn) return;
    let scrollToTopVisible = false;
    window.addEventListener("scroll", () => {
      const shouldBeVisible = window.scrollY > 300;
      if (shouldBeVisible !== scrollToTopVisible) {
        scrollToTopVisible = shouldBeVisible;
        requestAnimationFrame(() => {
          if (scrollToTopVisible) {
            fadeIn(scrollToTopBtn);
          } else {
            fadeOut(scrollToTopBtn);
          }
        });
      }
    });
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  var init_scroll_to_top = __esm({
    "assets/js/base/modules/core/scroll-to-top.js"() {
      init_helpers();
    }
  });

  // assets/js/base/modules/core/sidebar-menu.js
  function initSidebarMenu() {
    const menuToggle = document.getElementById("menu-toggle");
    const closeMenuToggle = document.getElementById("close-menu-toggle");
    const sidebarWrapper = document.getElementById("sidebar-wrapper");
    if (!(menuToggle && closeMenuToggle && sidebarWrapper)) return;
    if (!sidebarWrapper.hasAttribute("tabindex")) {
      sidebarWrapper.setAttribute("tabindex", "-1");
    }
    menuToggle.setAttribute("aria-controls", "sidebar-wrapper");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir men\xFA lateral");
    closeMenuToggle.setAttribute("aria-label", "Cerrar men\xFA lateral");
    const handleTrapFocus = (e) => trapFocus(e, sidebarWrapper);
    function openSidebar() {
      sidebarWrapper.classList.add("active");
      sidebarWrapper.setAttribute("aria-hidden", "false");
      menuToggle.style.display = "none";
      closeMenuToggle.style.display = "flex";
      menuToggle.setAttribute("aria-expanded", "true");
      sidebarWrapper.focus();
      sidebarWrapper.addEventListener("keydown", handleTrapFocus);
    }
    function closeSidebar() {
      sidebarWrapper.classList.remove("active");
      sidebarWrapper.setAttribute("aria-hidden", "true");
      closeMenuToggle.style.display = "none";
      menuToggle.style.display = "flex";
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.focus();
      sidebarWrapper.removeEventListener("keydown", handleTrapFocus);
    }
    menuToggle.addEventListener("click", openSidebar);
    closeMenuToggle.addEventListener("click", closeSidebar);
    sidebarWrapper.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeSidebar);
    });
    document.addEventListener("click", (e) => {
      if (!sidebarWrapper.classList.contains("active")) return;
      if (!sidebarWrapper.contains(e.target) && !menuToggle.contains(e.target)) {
        closeSidebar();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && sidebarWrapper.classList.contains("active")) {
        closeSidebar();
      }
    });
  }
  var init_sidebar_menu = __esm({
    "assets/js/base/modules/core/sidebar-menu.js"() {
      init_helpers();
    }
  });

  // assets/js/base/modules/core/calendly-button.js
  function initCalendlyButton() {
    document.addEventListener("DOMContentLoaded", () => {
      const calendlyButton = document.getElementById("calendly-button");
      if (!calendlyButton) return;
      calendlyButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (typeof Calendly !== "undefined") {
          Calendly.initPopupWidget({
            url: "https://calendly.com/martapaz-coaching"
          });
        } else {
          console.warn("Calendly script no cargado a\xFAn");
        }
        if (typeof gtag === "function") {
          gtag("event", "calendly_opened", {
            event_category: "Calendly",
            event_label: "Bot\xF3n de reserva",
            value: 1
          });
        }
      });
    });
  }
  var init_calendly_button = __esm({
    "assets/js/base/modules/core/calendly-button.js"() {
    }
  });

  // assets/js/base/modules/core/popup-manager.js
  function initPopupManager() {
    const popups = document.querySelectorAll(".popup");
    const openButtons = document.querySelectorAll("[data-open-popup]");
    const closeButtons = document.querySelectorAll("[data-close-popup]");
    if (popups.length === 0 && openButtons.length === 0) return;
    function openPopup(popupId) {
      const popup = document.getElementById(popupId);
      if (!popup) return;
      popup.classList.add("show");
      popup.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      const focusable = popup.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) focusable.focus();
      popup.addEventListener("keydown", (e) => trapFocus(e, popup));
    }
    function closePopup(popup) {
      if (!popup || !popup.classList.contains("show")) return;
      popup.classList.remove("show");
      popup.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
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
    document.addEventListener("click", (e) => {
      popups.forEach((popup) => {
        const content = popup.querySelector(".popup-content");
        if (popup.classList.contains("show") && !content.contains(e.target) && !e.target.hasAttribute("data-open-popup")) {
          closePopup(popup);
        }
      });
    });
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
  var init_popup_manager = __esm({
    "assets/js/base/modules/core/popup-manager.js"() {
      init_helpers();
    }
  });

  // assets/js/base/modules/accessibility/accessibility-state.js
  function restoreAccessibilitySettings() {
    const html = document.documentElement;
    const settings = {
      contrast: "data-contrast",
      colorblind: "data-colorblind",
      textSize: "data-text-size",
      animation: "data-animation",
      readingMode: "data-reading",
      dyslexia: "data-dyslexia"
    };
    for (const [key, attr] of Object.entries(settings)) {
      const saved = localStorage.getItem(key);
      if (!saved) continue;
      if (key === "readingMode" || key === "dyslexia") {
        html.toggleAttribute(attr, saved === "true");
        const toggleId = key === "readingMode" ? "reading-mode-toggle" : "dyslexia-toggle";
        const toggle = document.getElementById(toggleId);
        if (toggle) toggle.checked = saved === "true";
      } else {
        html.setAttribute(attr, saved);
        setOptionActive(`[data-contrast-choice], [data-colorblind-type], [data-text-size]`, saved);
      }
      if (key === "animation") {
        const slider = document.getElementById("animation-slider");
        if (slider) slider.value = saved;
      }
    }
  }
  function setOptionActive(selector, value) {
    document.querySelectorAll(selector).forEach((el) => {
      const datasetKey = Object.keys(el.dataset).find((key) => el.dataset[key] === value);
      el.classList.toggle("active", !!datasetKey);
    });
  }
  var init_accessibility_state = __esm({
    "assets/js/base/modules/accessibility/accessibility-state.js"() {
    }
  });

  // assets/js/base/modules/accessibility/accessibility-sidebar.js
  function initAccessibilitySidebar() {
    const sidebar = document.getElementById("accessibility-sidebar");
    const closeButton = document.getElementById("close-accessibility-toggle");
    const toggleBtn = document.getElementById("accessibility-toggle");
    const html = document.documentElement;
    if (!sidebar || !closeButton || !toggleBtn) return;
    function openSidebar() {
      sidebar.setAttribute("data-visible", "true");
      sidebar.setAttribute("aria-hidden", "false");
      toggleBtn.setAttribute("aria-expanded", "true");
      document.body.classList.add("no-scroll");
      const firstInput = sidebar.querySelector(
        'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (firstInput || sidebar).focus();
    }
    function closeSidebar() {
      sidebar.setAttribute("data-visible", "false");
      sidebar.setAttribute("aria-hidden", "true");
      toggleBtn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
      toggleBtn.focus();
    }
    toggleBtn.addEventListener("click", openSidebar);
    closeBtn.addEventListener("click", closeSidebar);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && sidebar.getAttribute("data-visible") === "true") {
        closeSidebar();
      }
      if (sidebar.getAttribute("data-visible") === "true") {
        trapFocus(e, sidebar);
      }
    });
    restoreAccessibilitySettings();
    document.querySelectorAll("[data-contrast-choice]").forEach(
      (btn) => btn.addEventListener("click", () => {
        const value = btn.dataset.contrastChoice;
        html.setAttribute("data-contrast", value);
        localStorage.setItem("contrast", value);
        setOptionActive("[data-contrast-choice]", value);
      })
    );
    document.querySelectorAll("[data-colorblind-type]").forEach(
      (btn) => btn.addEventListener("click", () => {
        const type = btn.dataset.colorblindType;
        html.setAttribute("data-colorblind", type);
        localStorage.setItem("colorblind", type);
        setOptionActive("[data-colorblind-type]", type);
      })
    );
    document.querySelectorAll("[data-text-size]").forEach(
      (btn) => btn.addEventListener("click", () => {
        const size = btn.dataset.textSize;
        html.setAttribute("data-text-size", size);
        localStorage.setItem("textSize", size);
        setOptionActive("[data-text-size]", size);
      })
    );
    const animationSlider = document.getElementById("animation-slider");
    if (animationSlider) {
      animationSlider.addEventListener("input", (e) => {
        const value = e.target.value;
        html.setAttribute("data-animation", value);
        localStorage.setItem("animation", value);
      });
    }
    const readingToggle = document.getElementById("reading-mode-toggle");
    if (readingToggle) {
      readingToggle.addEventListener("change", (e) => {
        html.toggleAttribute("data-reading", e.target.checked);
        localStorage.setItem("readingMode", e.target.checked);
      });
    }
    const dyslexiaToggle = document.getElementById("dyslexia-toggle");
    if (dyslexiaToggle) {
      dyslexiaToggle.addEventListener("change", (e) => {
        html.toggleAttribute("data-dyslexia", e.target.checked);
        localStorage.setItem("dyslexia", e.target.checked);
      });
    }
  }
  var init_accessibility_sidebar = __esm({
    "assets/js/base/modules/accessibility/accessibility-sidebar.js"() {
      init_helpers();
      init_accessibility_state();
    }
  });

  // assets/js/base/modules/accessibility/accessibility-popup.js
  function initAccessibilityPopup() {
    const popup = document.getElementById("accessibility-popup");
    const closeBtn2 = document.getElementById("accessibility-popup-close");
    const openPanelBtn = document.getElementById("accessibility-popup-open");
    const storageKey = "hasSeenAccessibilityPopup";
    if (!popup || !closeBtn2) return;
    const hasSeenPopup = localStorage.getItem(storageKey) === "true";
    function hidePopup() {
      popup.setAttribute("data-visible", "false");
      popup.addEventListener("transitionend", function handler() {
        popup.hidden = true;
        popup.removeEventListener("transitionend", handler);
      }, { once: true });
      localStorage.setItem(storageKey, "true");
    }
    if (!hasSeenPopup) {
      popup.hidden = false;
      popup.setAttribute("data-visible", "true");
      setTimeout(hidePopup, 5e3);
    }
    closeBtn2.addEventListener("click", (e) => {
      e.stopPropagation();
      hidePopup();
    });
    if (openPanelBtn) {
      openPanelBtn.addEventListener("click", () => {
        const sidebarToggle = document.getElementById("accessibility-toggle");
        if (sidebarToggle) sidebarToggle.click();
        popup.setAttribute("data-visible", "false");
        popup.hidden = true;
      });
    }
    restoreAccessibilitySettings();
  }
  var init_accessibility_popup = __esm({
    "assets/js/base/modules/accessibility/accessibility-popup.js"() {
      init_accessibility_state();
    }
  });

  // assets/js/base/modules/accessibility/index.js
  function initAccessibilityFeatures() {
    initAccessibilitySidebar();
    initAccessibilityPopup();
  }
  var init_accessibility = __esm({
    "assets/js/base/modules/accessibility/index.js"() {
      init_accessibility_sidebar();
      init_accessibility_popup();
    }
  });

  // assets/js/base/modules/utils/theme-helpers.js
  function loadParticles(selectedTheme) {
    return __async(this, null, function* () {
      if (window.pJSDom && window.pJSDom.length > 0) {
        window.pJSDom.forEach((p) => p.pJS.fn.vendors.destroypJS());
        window.pJSDom = [];
      }
      const configPath = `/assets/particles/particles-${selectedTheme}.json`;
      if (window.particlesJS) {
        window.particlesJS.load("particles-js", configPath);
      }
    });
  }
  function updateImagesForTheme(selectedTheme) {
    const themeImages = document.querySelectorAll("[data-theme-img]");
    themeImages.forEach((img) => {
      const baseName = img.getAttribute("data-theme-img");
      const ext = img.getAttribute("data-theme-ext") || "png";
      const path = img.getAttribute("data-theme-path") || "/assets/images/";
      const newSrc = `${path}${baseName}-${selectedTheme}.${ext}`;
      if (img.tagName === "IMG") {
        img.style.opacity = "0";
        setTimeout(() => {
          img.src = newSrc;
          img.style.opacity = "1";
        }, 200);
      } else {
        img.style.opacity = "0";
        setTimeout(() => {
          img.style.backgroundImage = `url('${newSrc}')`;
          img.style.opacity = "1";
        }, 200);
      }
    });
  }
  function updateTippyTheme(selectedTheme) {
    const tippyElements = document.querySelectorAll("[data-tippy-content]");
    tippyElements.forEach((el) => {
      if (el._tippy) {
        el._tippy.setProps({ theme: selectedTheme });
      }
    });
  }
  function initTippy() {
    return __async(this, null, function* () {
      if (!window.Popper) {
        yield import("https://unpkg.com/@popperjs/core@2?module");
      }
      if (!window.tippy) {
        yield import("https://unpkg.com/tippy.js@6?module");
      }
      window.tippy("[data-tippy-content]", {
        theme: "light",
        // Tema por defecto (puedes cambiarlo o hacerlo dinámico)
        animation: "shift-away",
        delay: [100, 50],
        duration: [300, 200]
      });
    });
  }
  var init_theme_helpers = __esm({
    "assets/js/base/modules/utils/theme-helpers.js"() {
    }
  });

  // assets/js/base/modules/theme/theme-constants.js
  var THEME_KEY, CONTRAST_KEY, DEFAULT_THEME, DEFAULT_CONTRAST, META_THEME_COLORS;
  var init_theme_constants = __esm({
    "assets/js/base/modules/theme/theme-constants.js"() {
      THEME_KEY = "theme";
      CONTRAST_KEY = "contrast";
      DEFAULT_THEME = "light";
      DEFAULT_CONTRAST = "medium";
      META_THEME_COLORS = {
        light: "#ffffff",
        dark: "#101010"
      };
    }
  });

  // assets/js/base/modules/theme/theme.js
  function getSavedTheme() {
    return localStorage.getItem(THEME_KEY);
  }
  function getSavedContrast() {
    return localStorage.getItem(CONTRAST_KEY);
  }
  function getPreferredTheme() {
    var _a;
    return ((_a = window.matchMedia) == null ? void 0 : _a.call(window, "(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  }
  function applyTheme(theme = DEFAULT_THEME, contrast = DEFAULT_CONTRAST) {
    document.body.setAttribute("data-theme", theme);
    document.body.setAttribute("data-contrast", contrast);
  }
  function initTheme() {
    const theme = getSavedTheme() || getPreferredTheme();
    const contrast = getSavedContrast() || DEFAULT_CONTRAST;
    applyTheme(theme, contrast);
    return theme;
  }
  var init_theme = __esm({
    "assets/js/base/modules/theme/theme.js"() {
      init_theme_constants();
    }
  });

  // assets/js/base/modules/theme/theme-switcher.js
  function initThemeSwitcher() {
    return __async(this, null, function* () {
      const themeMenuBtn = document.getElementById("themeMenuBtn");
      const themeMenu = document.getElementById("themeMenu");
      const themeButtons = themeMenu == null ? void 0 : themeMenu.querySelectorAll("[data-theme]");
      const html = document.documentElement;
      if (!themeMenuBtn || !themeMenu || !themeButtons) return;
      yield initTippy();
      function setActiveTheme(selectedTheme) {
        applyTheme(selectedTheme);
        localStorage.setItem("theme", selectedTheme);
        themeButtons.forEach((btn) => {
          const theme = btn.getAttribute("data-theme");
          const isActive = theme === selectedTheme;
          btn.classList.toggle("active", isActive);
          btn.setAttribute("aria-pressed", isActive.toString());
        });
        loadParticles(selectedTheme);
        updateImagesForTheme(selectedTheme);
        updateTippyTheme(selectedTheme);
        document.dispatchEvent(new CustomEvent("themeChanged", {
          detail: { theme: selectedTheme }
        }));
      }
      const savedTheme = localStorage.getItem("theme") || "light";
      setActiveTheme(savedTheme);
      themeMenuBtn.addEventListener("click", () => {
        const isExpanded = themeMenuBtn.getAttribute("aria-expanded") === "true";
        themeMenuBtn.setAttribute("aria-expanded", String(!isExpanded));
        themeMenu.hidden = isExpanded;
      });
      document.addEventListener("click", (e) => {
        if (!themeMenu.contains(e.target) && e.target !== themeMenuBtn) {
          themeMenu.hidden = true;
          themeMenuBtn.setAttribute("aria-expanded", "false");
        }
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          themeMenu.hidden = true;
          themeMenuBtn.setAttribute("aria-expanded", "false");
          themeMenuBtn.focus();
        }
      });
      themeMenu.addEventListener("keydown", (e) => {
        const buttons = Array.from(themeButtons);
        const index = buttons.indexOf(document.activeElement);
        if (e.key === "ArrowDown") {
          e.preventDefault();
          const next = (index + 1) % buttons.length;
          buttons[next].focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const prev = (index - 1 + buttons.length) % buttons.length;
          buttons[prev].focus();
        }
      });
      themeButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const selectedTheme = btn.getAttribute("data-theme");
          setActiveTheme(selectedTheme);
          themeMenu.hidden = true;
          themeMenuBtn.setAttribute("aria-expanded", "false");
        });
      });
    });
  }
  var init_theme_switcher = __esm({
    "assets/js/base/modules/theme/theme-switcher.js"() {
      init_theme_helpers();
      init_theme();
    }
  });

  // assets/js/base/modules/theme/meta-theme.js
  var require_meta_theme = __commonJS({
    "assets/js/base/modules/theme/meta-theme.js"() {
      init_theme_constants();
      init_theme();
      function updateThemeColorMeta(themeName) {
        var _a;
        const themeColorMeta = document.querySelector("meta[name=theme-color]");
        if (!themeColorMeta) return;
        const color = (_a = META_THEME_COLORS[themeName]) != null ? _a : META_THEME_COLORS.light;
        themeColorMeta.setAttribute("content", color);
      }
      var theme = initTheme();
      updateThemeColorMeta(theme);
    }
  });

  // assets/js/base/modules/theme/index.js
  function initThemeFeatures() {
    initThemeSwitcher();
  }
  var import_meta_theme;
  var init_theme2 = __esm({
    "assets/js/base/modules/theme/index.js"() {
      init_theme_switcher();
      import_meta_theme = __toESM(require_meta_theme());
    }
  });

  // assets/js/base/main.js
  var require_main = __commonJS({
    "assets/js/base/main.js"() {
      init_scroll_to_top();
      init_sidebar_menu();
      init_calendly_button();
      init_popup_manager();
      init_accessibility();
      init_theme2();
      document.addEventListener("DOMContentLoaded", () => {
        initSidebarMenu();
        initScrollToTop();
        initThemeFeatures();
        initAccessibilityFeatures();
        initPopupManager();
        initCalendlyButton();
      });
    }
  });
  require_main();
})();
//# sourceMappingURL=bundle.js.map
