/* ===========================================================
   @ORGANISMS - ERROR-LAYOUT
   - Simple halo reveal system using CSS mask
   - Fixed halo for central triptych + mobile halo following mouse
   - Accessibility toggle to show/hide all content
=========================================================== */

/**
 * Initialize error layout halo system
 * Simple approach: CSS mask with radial gradients
 */
function initErrorLayout() {
  const container = document.querySelector('.error-layout--cross-layout');
  if (!container) return;

  // Only apply halo system on desktop (lg and xl breakpoints)
  if (window.innerWidth < 1024) return;

  // Set initial mouse position outside viewport
  container.style.setProperty('--mouse-x', '-200px');
  container.style.setProperty('--mouse-y', '-200px');

  // Track mouse movement and update CSS custom properties
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update CSS custom properties for mask position
    container.style.setProperty('--mouse-x', x + 'px');
    container.style.setProperty('--mouse-y', y + 'px');
  });

  // Hide mobile halo when mouse leaves container
  container.addEventListener('mouseleave', () => {
    container.style.setProperty('--mouse-x', '-200px');
    container.style.setProperty('--mouse-y', '-200px');
  });
}

/**
 * Initialize accessibility toggle functionality
 */
function initAccessibilityToggle() {
  const container = document.querySelector('.error-layout--cross-layout');
  if (!container) return;

  const buttons = container.querySelectorAll('[data-button="button-reveal-all"], [data-button="button-hide-all"]');
  
  buttons.forEach(button => {
    button.addEventListener('click', () => toggleMaskVisibility(container, button));
  });
}

/**
 * Toggle mask visibility and update content
 */
function toggleMaskVisibility(container, button) {
  const isRevealing = button.getAttribute('data-button') === 'button-reveal-all';
  
  if (isRevealing) {
    // Show all content
    container.classList.add('error-layout--no-mask');
    updateAccessibilityContent(container, 'hidden');
  } else {
    // Hide content (restore mask)
    container.classList.remove('error-layout--no-mask');
    updateAccessibilityContent(container, 'visible');
  }
}

/**
 * Update accessibility text and button
 */
function updateAccessibilityContent(container, state) {
  const textElements = container.querySelectorAll('.error-layout-accessibility-text p');
  const buttons = container.querySelectorAll('.error-layout-accessibility-button button');
  
  if (state === 'hidden') {
    textElements.forEach(text => text.textContent = 'Pour invisibiliser les contenus révélés :');
    buttons.forEach(btn => {
      btn.textContent = 'Masquer tout';
      btn.setAttribute('data-button', 'button-hide-all');
      btn.setAttribute('aria-label', 'Masquer tous les contenus révélés');
    });
  } else {
    textElements.forEach(text => text.textContent = 'Pour rendre visibles les contenus cachés :');
    buttons.forEach(btn => {
      btn.textContent = 'Afficher tout';
      btn.setAttribute('data-button', 'button-reveal-all');
      btn.setAttribute('aria-label', 'Afficher tous les contenus cachés');
    });
  }
}

/**
 * Handle window resize to reinitialize if needed
 */
function handleResize() {
  const container = document.querySelector('.error-layout--cross-layout');
  if (!container) return;

  // Reset mask properties if switching to mobile
  if (window.innerWidth < 1024) {
    container.style.removeProperty('--mouse-x');
    container.style.removeProperty('--mouse-y');
  }
}

// =========================
// INITIALIZATION
// =========================

// Initialize error layout when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initErrorLayout();
  initAccessibilityToggle();
});

// Handle window resize
window.addEventListener('resize', handleResize);

// Export for potential external use or testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    initErrorLayout,
    initAccessibilityToggle,
    toggleMaskVisibility,
    handleResize
  };
}