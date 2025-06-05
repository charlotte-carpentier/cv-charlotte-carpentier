/**
 * active-tag.js - Interactive tag component functionality
 * 
 * Transforms static tags into interactive components that can be selected/deselected.
 * Tags with data-active-tag="true" attribute become interactive with keyboard support.
 * 
 * Features:
 * - Toggle functionality via click or keyboard (Space/Enter)
 * - ARIA support for accessibility
 * - Custom event emission for integration with other components
 * - Visual feedback via .active-tag class
 * 
 * @author HAT Team
 */

document.addEventListener('DOMContentLoaded', () => {
    // Find all interactive tags
    const activeTags = document.querySelectorAll('[data-active-tag="true"]');
    
    // Initialize each tag
    activeTags.forEach(tag => {
      // Make focusable and add proper role
      tag.setAttribute('tabindex', '0');
      if (!tag.hasAttribute('role')) {
        tag.setAttribute('role', 'button');
      }
      
      // Add keyboard support
      tag.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleTagActive(tag);
        }
      });
      
      // Add click handler
      tag.addEventListener('click', () => {
        toggleTagActive(tag);
      });
      
      // Set initial state
      if (!tag.hasAttribute('aria-pressed')) {
        tag.setAttribute('aria-pressed', 'false');
      }
    });
    
    /**
     * Toggle a tag's active state
     * @param {HTMLElement} tag - The tag element to toggle
     */
    function toggleTagActive(tag) {
      // Get current state and invert it
      const isActive = tag.getAttribute('aria-pressed') === 'true';
      const newState = !isActive;
      
      // Update ARIA state
      tag.setAttribute('aria-pressed', newState.toString());
      
      // Update visual appearance
      if (newState) {
        tag.classList.add('active-tag');
      } else {
        tag.classList.remove('active-tag');
      }
      
      // Emit event for other components
      const tagChangeEvent = new CustomEvent('tagStateChange', {
        bubbles: true,
        detail: {
          tag: tag,
          name: tag.textContent.trim(),
          isActive: newState
        }
      });
      
      tag.dispatchEvent(tagChangeEvent);
    }
  });