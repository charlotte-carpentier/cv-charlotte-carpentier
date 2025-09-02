/* ===========================================================
   @ORGANISMS - ERROR-LAYOUT
   - Simple halo reveal system using CSS mask
   - Fixed halo for central triptych + mobile halo following mouse
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
document.addEventListener('DOMContentLoaded', initErrorLayout);

// Handle window resize
window.addEventListener('resize', handleResize);

// Export for potential external use or testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    initErrorLayout,
    handleResize
  };
}