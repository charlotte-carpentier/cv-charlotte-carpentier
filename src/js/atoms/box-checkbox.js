/**
 * Box and Checkbox Components Handler
 * 
 * Handles state management for box and checkbox components.
 * Reads style definitions directly from the data attributes on the elements.
 * 
 * @file /js/atoms/box-checkbox.js
 */
document.addEventListener('DOMContentLoaded', () => {
    // Select all box inputs
    const boxInputs = document.querySelectorAll('input[data-box-component="true"]');
    
    // Initialize a styles object for each input
    boxInputs.forEach(input => {
      // Get the component's parent which should have data attributes
      const component = input.closest('[data-box-styles]');
      
      if (!component) {
        console.warn('Box component without data-box-styles attribute:', input);
        return;
      }
      
      try {
        // Parse the styles JSON from the data attribute
        const styles = JSON.parse(component.dataset.boxStyles);
        
        // Add event listeners with the appropriate styles
        setupBoxEventListeners(input, styles);
        
        // Set initial classes based on state
        updateInputClass(input, styles);
      } catch (error) {
        console.error('Error parsing box styles:', error);
      }
    });
    
    /**
     * Sets up all event listeners for a box input
     * @param {HTMLInputElement} input - The checkbox input element
     * @param {Object} styles - Object containing style definitions
     */
    function setupBoxEventListeners(input, styles) {
      input.addEventListener('focus', () => {
        if (input.disabled) return;
        setClasses(input, 'focus', styles);
      });
      
      input.addEventListener('blur', () => {
        updateInputClass(input, styles);
      });
      
      input.addEventListener('mouseover', () => {
        if (input.disabled || document.activeElement === input) return;
        setClasses(input, 'hover', styles);
      });
      
      input.addEventListener('mouseout', () => {
        if (input.disabled || document.activeElement === input) return;
        updateInputClass(input, styles);
      });
      
      input.addEventListener('change', () => {
        updateInputClass(input, styles);
      });
    }
    
    /**
     * Updates input classes based on current state
     * @param {HTMLInputElement} input - The checkbox input element
     * @param {Object} styles - Object containing style definitions
     */
    function updateInputClass(input, styles) {
      if (input.disabled) {
        setClasses(input, input.checked ? 'disabledChecked' : 'disabled', styles);
      } else {
        setClasses(input, input.checked ? 'checked' : 'default', styles);
      }
    }
    
    /**
     * Sets the appropriate classes for a given state
     * @param {HTMLInputElement} input - The checkbox input element
     * @param {string} state - State name from stateClasses
     * @param {Object} styles - Object containing style definitions
     */
    function setClasses(input, state, styles) {
      const baseClasses = styles.baseClasses;
      const stateClasses = styles.variants;
      
      // First clear all state classes
      for (const className of Object.values(stateClasses)) {
        const classes = className.split(' ');
        input.classList.remove(...classes);
      }
      
      // Then add the base and state-specific classes
      const allClasses = `${baseClasses} ${stateClasses[state]}`.split(' ');
      input.classList.add(...allClasses);
    }
  });