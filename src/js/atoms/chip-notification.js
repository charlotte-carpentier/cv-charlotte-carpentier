/**
 * Chip Notification Module
 * Handles interactive behavior of notification chips
 * 
 * @module atoms/chip-notification
 */

document.addEventListener('DOMContentLoaded', () => {
    // Select all chip notifications in the document
    const chipNotifications = document.querySelectorAll('[data-chip-notification]');
    
    // Initialize each chip notification
    chipNotifications.forEach(chip => {
      // Get the name of the chip for identification
      const chipName = chip.dataset.chipNotification;
      
      // Add click event listener for dismissible chips
      if (chip.classList.contains('dismissible')) {
        chip.addEventListener('click', (event) => {
          // Prevent default action
          event.preventDefault();
          
          // Hide the chip
          chip.style.display = 'none';
          
          // Dispatch custom event for other components to listen to
          const dismissEvent = new CustomEvent('chip:dismissed', {
            detail: { chipName }
          });
          document.dispatchEvent(dismissEvent);
        });
      }
    });
    
    // Debug log to confirm script is running
    console.log('Chip notification module initialized');
  });
  
  /**
   * Programmatically update a chip notification value
   * 
   * @param {string} chipName - The name attribute of the chip to update
   * @param {string|number} newValue - The new text value to display
   * @param {boolean} animate - Whether to animate the update (default: false)
   */
  window.updateChipNotification = (chipName, newValue, animate = false) => {
    const chip = document.querySelector(`[data-chip-notification="${chipName}"]`);
    
    if (!chip) {
      console.warn(`Chip notification "${chipName}" not found in the document`);
      return;
    }
    
    if (animate) {
      // Apply a simple animation
      chip.style.transform = 'scale(1.1)';
      chip.style.transition = 'transform 200ms';
      
      setTimeout(() => {
        chip.textContent = newValue;
        
        // Update size class based on new content length
        updateChipSize(chip, newValue.toString());
        
        setTimeout(() => {
          chip.style.transform = 'scale(1)';
        }, 200);
      }, 200);
    } else {
      chip.textContent = newValue;
      updateChipSize(chip, newValue.toString());
    }
  };
  
  /**
   * Update chip size classes based on content length
   * 
   * @param {HTMLElement} chip - The chip element to update
   * @param {string} text - The text content to measure
   */
  function updateChipSize(chip, text) {
    // Remove existing size classes
    chip.classList.remove('h-6', 'w-6', 'h-8', 'w-8', 'h-10', 'w-10', 'min-h-10', 'min-w-10', 'px-1', 'px-2', 'py-1', 'text-xs', 'text-sm');
    
    // Apply appropriate size class based on content length
    const contentLength = text.length;
    
    if (contentLength > 2) {
      chip.classList.add('min-h-10', 'min-w-10', 'px-2', 'py-1', 'text-sm');
    } else if (contentLength > 1) {
      chip.classList.add('h-8', 'w-8', 'text-sm');
    } else {
      chip.classList.add('h-6', 'w-6', 'text-xs');
    }
  }