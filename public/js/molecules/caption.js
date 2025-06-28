/**
 * =========================
 *     CAPTION MOLECULE
 *     Simple Tooltip Logic      
 * =========================
 */

/**
 * Initialize all tooltips with smart positioning
 */
function initTooltips() {
  const captionContainers = document.querySelectorAll('.caption-container');
  
  captionContainers.forEach(container => {
    const tooltip = container.querySelector('.tooltip-popup');
    if (!tooltip) return;
    
    // Add event listeners for show/hide functionality
    container.addEventListener('mouseenter', () => showTooltip(tooltip));
    container.addEventListener('mouseleave', () => hideTooltip(tooltip));
    container.addEventListener('focus', () => showTooltip(tooltip));
    container.addEventListener('blur', () => hideTooltip(tooltip));
    
    // Keyboard accessibility - close on Escape key
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideTooltip(tooltip);
        container.blur();
      }
    });
  });
}

/**
 * Show tooltip with smart positioning to avoid viewport overflow
 * Adjusts position vertically (top/bottom) and horizontally (left/center/right)
 */
function showTooltip(tooltip) {
  // Only show tooltips on desktop
  if (window.innerWidth <= 768) return;
  
  // Show tooltip first to measure its dimensions
  tooltip.style.opacity = '1';
  tooltip.style.visibility = 'visible';
  
  // Reset to default position (below icon, centered)
  tooltip.style.top = '64px';
  tooltip.style.left = '50%';
  tooltip.style.transform = 'translateX(-50%)';
  
  // Check position after rendering and adjust if needed
  setTimeout(() => {
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 20; // Safety margin from viewport edges
    
    // Check vertical overflow - move above icon if no space below
    if (tooltipRect.bottom > viewportHeight - margin) {
      tooltip.style.top = '-130px'; // Position above icon
    }
    
    // Check horizontal overflow and adjust alignment
    if (tooltipRect.left < margin) {
      // Overflows left edge - align tooltip to left
      tooltip.style.left = '0';
      tooltip.style.transform = 'translateX(0)';
    } else if (tooltipRect.right > viewportWidth - margin) {
      // Overflows right edge - align tooltip to right  
      tooltip.style.left = '100%';
      tooltip.style.transform = 'translateX(-100%)';
    }
  }, 10); // Small delay to ensure tooltip is rendered
}

/**
 * Hide tooltip and reset to default positioning
 */
function hideTooltip(tooltip) {
  tooltip.style.opacity = '0';
  tooltip.style.visibility = 'hidden';
  tooltip.style.top = ''; // Reset to CSS default position
}

/**
 * Handle window resize - hide any open tooltips
 */
function handleTooltipResize() {
  const openTooltips = document.querySelectorAll('.tooltip-popup[style*="opacity: 1"]');
  openTooltips.forEach(hideTooltip);
}

// =========================
// INITIALIZATION
// =========================

// Initialize tooltips when DOM is ready
document.addEventListener('DOMContentLoaded', initTooltips);

// Hide tooltips on window resize to avoid positioning issues
window.addEventListener('resize', handleTooltipResize);

// Export for potential external use or testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initTooltips, showTooltip, hideTooltip };
}