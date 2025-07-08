// assets/js/base/modules/accessibility/index.js

import { initAccessibilitySidebar } from './accessibility-sidebar.js';
import { initAccessibilityPopup } from './accessibility-popup.js';

export function initAccessibilityFeatures() {
  initAccessibilitySidebar();
  initAccessibilityPopup();
}
