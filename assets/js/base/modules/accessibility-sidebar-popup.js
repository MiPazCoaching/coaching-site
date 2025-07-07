// === ACCESIBILIDAD: FAB, POPUP Y SIDEBAR ========================================================
const accessibilityToggle = document.getElementById("accessibility-toggle");
const accessibilitySidebar = document.getElementById("accessibility-sidebar");
const closeAccessibilityButton = document.getElementById("close-accessibility-toggle");

if (accessibilityToggle && accessibilitySidebar && closeAccessibilityButton) {
  accessibilitySidebar.setAttribute("aria-hidden", "true");
  accessibilitySidebar.setAttribute("tabindex", "-1");
  accessibilityToggle.setAttribute("aria-expanded", "false");
  accessibilityToggle.setAttribute("aria-controls", "accessibility-sidebar");
  accessibilityToggle.setAttribute("aria-label", "Abrir opciones de accesibilidad");
  closeAccessibilityButton.setAttribute("aria-label", "Cerrar opciones de accesibilidad");

  const openAccessibilitySidebar = () => {
    accessibilitySidebar.classList.add("active");
    accessibilitySidebar.setAttribute("aria-hidden", "false");
    accessibilityToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
    accessibilitySidebar.focus();
    accessibilitySidebar.addEventListener("keydown", trapAccessibilityFocus);
  };

  const closeAccessibilitySidebar = () => {
    accessibilitySidebar.classList.remove("active");
    accessibilitySidebar.setAttribute("aria-hidden", "true");
    accessibilityToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
    accessibilityToggle.focus();
    accessibilitySidebar.removeEventListener("keydown", trapAccessibilityFocus);
  };

  const trapAccessibilityFocus = (e) => {
    if (e.key === "Tab") {
      const focusableElements = accessibilitySidebar.querySelectorAll(
          "a, button, input, textarea, select, [tabindex]:not([tabindex='-1'])"
      );
      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  };

  accessibilityToggle.addEventListener("click", openAccessibilitySidebar);
  closeAccessibilityButton.addEventListener("click", closeAccessibilitySidebar);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && accessibilitySidebar.classList.contains("active")) {
      closeAccessibilitySidebar();
    }
  });

  const html = document.documentElement;
  const savedColorblind = localStorage.getItem("colorblind");
  const savedTextSize = localStorage.getItem("textSize");
  const savedAnimation = localStorage.getItem("animation");
  const savedReadingMode = localStorage.getItem("readingMode");
  const savedDyslexia = localStorage.getItem("dyslexia");

  if (savedColorblind) html.setAttribute("data-colorblind", savedColorblind);
  if (savedTextSize) html.setAttribute("data-text-size", savedTextSize);
  if (savedAnimation) html.setAttribute("data-animation", savedAnimation);

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

  document.querySelectorAll("[data-contrast-choice]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const contrast = btn.dataset.contrastChoice;
      html.setAttribute("data-contrast", contrast);
      localStorage.setItem("contrast", contrast);
    });
  });

  document.querySelectorAll("[data-colorblind-type]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.colorblindType;
      html.setAttribute("data-colorblind", type);
      localStorage.setItem("colorblind", type);
    });
  });

  document.querySelectorAll("[data-text-size]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const size = btn.dataset.textSize;
      html.setAttribute("data-text-size", size);
      localStorage.setItem("textSize", size);
    });
  });

  const animationSlider = document.getElementById("animation-slider");
  if (animationSlider) {
    animationSlider.addEventListener("input", (e) => {
      const level = e.target.value;
      html.setAttribute("data-animation", level);
      localStorage.setItem("animation", level);
    });
    if (savedAnimation) {
      animationSlider.value = savedAnimation;
    }
  }

  if (readingModeToggle) {
    readingModeToggle.addEventListener("change", (e) => {
      html.toggleAttribute("data-reading", e.target.checked);
      localStorage.setItem("readingMode", e.target.checked);
    });
  }

  if (dyslexiaToggle) {
    dyslexiaToggle.addEventListener("change", (e) => {
      html.toggleAttribute("data-dyslexia", e.target.checked);
      localStorage.setItem("dyslexia", e.target.checked);
    });
  }

  const accessibilityPopup = document.getElementById("accessibility-popup");
  const accessibilityPopupCloseBtn = document.getElementById("accessibility-popup-close");
  const hasSeenAccessibilityPopupKey = "hasSeenAccessibilityPopup";

  if (accessibilityPopup && accessibilityPopupCloseBtn) {
    const hasSeenPopup = localStorage.getItem(hasSeenAccessibilityPopupKey) === "true";

    if (!hasSeenPopup) {
      accessibilityPopup.hidden = false;
      accessibilityPopup.setAttribute("data-visible", "true");

      setTimeout(() => {
        accessibilityPopup.setAttribute("data-visible", "false");
        accessibilityPopup.addEventListener(
            "transitionend",
            function handler() {
              accessibilityPopup.hidden = true;
              accessibilityPopup.removeEventListener("transitionend", handler);
            },
            { once: true }
        );
        localStorage.setItem(hasSeenAccessibilityPopupKey, "true");
      }, 5000);
    }

    accessibilityPopupCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      accessibilityPopup.setAttribute("data-visible", "false");
      accessibilityPopup.addEventListener(
          "transitionend",
          function handler() {
            accessibilityPopup.hidden = true;
            accessibilityPopup.removeEventListener("transitionend", handler);
          },
          { once: true }
      );
      localStorage.setItem(hasSeenAccessibilityPopupKey, "true");
    });
  }
}

// === POPUPS GENERALES =============================================================
const popups = document.querySelectorAll(".popup");
const openButtons = document.querySelectorAll("[data-open-popup]");
const closeButtons = document.querySelectorAll("[data-close-popup]");

if (popups.length > 0 || openButtons.length > 0) {
  function openPopup(popupId) {
    const popup = document.getElementById(popupId);
    if (!popup) return;
    popup.classList.add("show");
    popup.setAttribute("aria-hidden", "false");
    const focusable = popup.querySelector(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    if (focusable) focusable.focus();
    document.body.style.overflow = "hidden";
    popup.addEventListener("keydown", trapPopupFocus);
  }

  function closePopup(popup) {
    if (!popup || !popup.classList.contains("show")) return;
    popup.classList.remove("show");
    popup.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    popup.removeEventListener("keydown", trapPopupFocus);
  }

  const trapPopupFocus = (e) => {
    if (e.key === "Tab") {
      const popup = e.currentTarget;
      const focusableElements = popup.querySelectorAll(
          "a, button, input, textarea, select, [tabindex]:not([tabindex='-1'])"
      );
      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    } else if (e.key === "Escape") {
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

  document.addEventListener("click", (e) => {
    popups.forEach((popup) => {
      if (
          popup.classList.contains("show") &&
          !popup.querySelector(".popup-content").contains(e.target) &&
          !e.target.hasAttribute("data-open-popup")
      ) {
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
