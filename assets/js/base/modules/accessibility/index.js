// assets/js/base/modules/accessibility/index.js

import { initAccessibilitySidebar } from './accessibility-sidebar.js';
import { initAccessibilityPopup } from './accessibility-popup.js';
import { initAccessibilityState } from './accessibility-state.js';

export function initAccessibilityFeatures() {
  initAccessibilitySidebar();
  initAccessibilityPopup();
  initAccessibilityState();
}
