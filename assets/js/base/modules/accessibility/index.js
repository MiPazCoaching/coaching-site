// assets/js/base/modules/accessibility/index.js

import { initAccessibilitySidebar } from './sidebar.js';
import { initAccessibilityPopup } from './popup.js';
import { initAccessibilityFab } from './fab.js';

export function initAccessibilityFeatures() {
  initAccessibilitySidebar();
  initAccessibilityPopup();
  initAccessibilityFab();
}
