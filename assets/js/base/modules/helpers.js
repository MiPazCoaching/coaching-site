// assets/js/base/helpers.js

export function fadeIn(el) {
  el.style.display = 'flex';
  el.style.opacity = 0;
  let opacity = 0;

  function step() {
    opacity += 0.1;
    el.style.opacity = opacity;
    if (opacity < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

export function fadeOut(el) {
  let opacity = 1;

  function step() {
    opacity -= 0.1;
    el.style.opacity = opacity;
    if (opacity <= 0) {
      el.style.display = 'none';
    } else {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
