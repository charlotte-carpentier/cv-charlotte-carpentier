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
    container.addEventListener('mouseenter', () => showTooltip(tooltip, container));
    container.addEventListener('mouseleave', () => hideTooltip(tooltip));
    container.addEventListener('focus', () => showTooltip(tooltip, container));
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
function showTooltip(tooltip, container) {
  // Only show tooltips on desktop
  if (window.innerWidth <= 768) return;
  
  // Hide all other tooltips first to avoid overlap
  hideAllTooltips();
  
  // Move tooltip to body to escape stacking context
  document.body.appendChild(tooltip);
  
  // Get container position for absolute positioning
  const containerRect = container.getBoundingClientRect();
  
  // Set initial position relative to container
  tooltip.style.position = 'fixed';
  tooltip.style.top = (containerRect.bottom + window.scrollY) + 'px';
  tooltip.style.left = (containerRect.left + containerRect.width / 2) + 'px';
  tooltip.style.transform = 'translateX(-50%)';
  tooltip.style.zIndex = '9999';
  
  // Show tooltip first to measure its dimensions
  tooltip.style.opacity = '1';
  tooltip.style.visibility = 'visible';
  
  // Check position after rendering and adjust if needed
  setTimeout(() => {
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 20; // Safety margin from viewport edges
    
    // Check vertical overflow - move above icon if no space below
    if (tooltipRect.bottom > viewportHeight - margin) {
      // Disable transition temporarily for instant repositioning
      tooltip.style.transition = 'none';
      tooltip.style.top = (containerRect.top + window.scrollY - tooltipRect.height - 10) + 'px';
      
      // Re-enable transition after repositioning
      setTimeout(() => {
        tooltip.style.transition = '';
      }, 0);
    }
    
    // Check horizontal overflow and adjust alignment
    if (tooltipRect.left < margin) {
      // Overflows left edge - align tooltip to left
      tooltip.style.left = containerRect.left + 'px';
      tooltip.style.transform = 'translateX(0)';
    } else if (tooltipRect.right > viewportWidth - margin) {
      // Overflows right edge - align tooltip to right  
      tooltip.style.left = containerRect.right + 'px';
      tooltip.style.transform = 'translateX(-100%)';
    }
  }, 10); // Small delay to ensure tooltip is rendered
}

/**
 * Hide all tooltips instantly
 */
function hideAllTooltips() {
  const allTooltips = document.querySelectorAll('.tooltip-popup');
  allTooltips.forEach(tooltip => {
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'hidden';
  });
}

/**
 * Hide tooltip and reset to default positioning
 */
function hideTooltip(tooltip) {
  tooltip.style.opacity = '0';
  tooltip.style.visibility = 'hidden';
  
  // Reset position styles but keep the tooltip in body
  setTimeout(() => {
    if (tooltip.style.opacity === '0') {
      tooltip.style.position = '';
      tooltip.style.top = '';
      tooltip.style.left = '';
      tooltip.style.transform = '';
      tooltip.style.zIndex = '';
    }
  }, 300); // Wait for transition to complete
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