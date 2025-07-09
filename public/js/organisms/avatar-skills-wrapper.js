/**
 * Avatar Skills Wrapper Component
 * Handles responsive toggle for multiple skills cards on mobile
 * v2.0 - Multi-skills vanilla JS implementation
 */

class AvatarSkillsWrapper {
  constructor() {
    // Define button to container mapping
    this.buttonMapping = {
      'button_languages': 'skills-card-languages',
      'button_hard_skills': 'skills-card-hard-skills',
      'button_soft_skills': 'skills-card-soft-skills',
      'button_interests': 'skills-card-interests'
    };
    
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
    } else {
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    // Find the avatar-skills-wrapper component
    const wrapper = document.querySelector('[data-component="avatar-skills-wrapper"]');
    
    if (!wrapper) {
      console.warn('Avatar Skills Wrapper: Component not found');
      return;
    }

    // Setup listeners for each button
    Object.entries(this.buttonMapping).forEach(([buttonId, containerId]) => {
      this.setupButtonListener(wrapper, buttonId, containerId);
    });

    console.log('Avatar Skills Wrapper: Event listeners initialized for all buttons');
  }

  setupButtonListener(wrapper, buttonId, containerId) {
    // Find the specific button
    const button = wrapper.querySelector(`[data-button="${buttonId}"]`);
    
    if (!button) {
      console.warn(`Avatar Skills Wrapper: Button ${buttonId} not found`);
      return;
    }

    // Find the corresponding container
    const container = document.getElementById(containerId);
    
    if (!container) {
      console.warn(`Avatar Skills Wrapper: Container ${containerId} not found`);
      return;
    }

    // Add click event listener
    button.addEventListener('click', (event) => {
      event.preventDefault();
      this.toggleSkillsVisibility(container, button, buttonId);
    });

    // Handle keyboard accessibility (Enter and Space keys)
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.toggleSkillsVisibility(container, button, buttonId);
      }
    });

    // Initialize ARIA attributes
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', containerId);
    
    console.log(`Avatar Skills Wrapper: Listener setup for ${buttonId} → ${containerId}`);
  }

  toggleSkillsVisibility(container, button, buttonId) {
    // Check if we're on mobile (adjust breakpoint as needed)
    const isMobile = window.innerWidth < 768; // md breakpoint
    
    // Only toggle on mobile devices
    if (!isMobile) {
      return;
    }

    // Hide all other skills containers first (accordion-like behavior)
    this.hideAllSkillsContainers(buttonId);

    // Check if container is currently visible (check if it has 'mobile-visible' class)
    const isCurrentlyVisible = container.classList.contains('mobile-visible');
    
    if (isCurrentlyVisible) {
      // Hide the container
      container.classList.remove('mobile-visible');
      button.setAttribute('aria-expanded', 'false');
    } else {
      // Show the container
      container.classList.add('mobile-visible');
      button.setAttribute('aria-expanded', 'true');
    }

    // Dispatch custom event
    const event = new CustomEvent('skillsToggled', {
      detail: {
        buttonId: buttonId,
        containerId: this.buttonMapping[buttonId],
        visible: !isCurrentlyVisible,
        container: container,
        button: button
      }
    });
    
    document.dispatchEvent(event);
  }

  hideAllSkillsContainers(exceptButtonId = null) {
    // Hide all skills containers and reset button states
    Object.entries(this.buttonMapping).forEach(([buttonId, containerId]) => {
      // Skip the current button if specified
      if (exceptButtonId && buttonId === exceptButtonId) {
        return;
      }

      const container = document.getElementById(containerId);
      const button = document.querySelector(`[data-button="${buttonId}"]`);
      
      if (container) {
        container.classList.remove('mobile-visible');
      }
      
      if (button) {
        button.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Public method to manually toggle a specific skills card
  static toggleSkillsCard(buttonId) {
    const instance = new AvatarSkillsWrapper();
    const containerId = instance.buttonMapping[buttonId];
    
    if (!containerId) {
      console.warn(`Avatar Skills Wrapper: Unknown button ID ${buttonId}`);
      return;
    }

    const container = document.getElementById(containerId);
    const button = document.querySelector(`[data-button="${buttonId}"]`);
    
    if (container && button) {
      instance.toggleSkillsVisibility(container, button, buttonId);
    }
  }

  // Public method to check if a specific skills card is visible
  static isSkillsCardVisible(buttonId) {
    const instance = new AvatarSkillsWrapper();
    const containerId = instance.buttonMapping[buttonId];
    
    if (!containerId) {
      return false;
    }

    const container = document.getElementById(containerId);
    return container ? container.classList.contains('mobile-visible') : false;
  }

  // Public method to hide all skills cards
  static hideAllSkillsCards() {
    const instance = new AvatarSkillsWrapper();
    instance.hideAllSkillsContainers();
  }
}

// Initialize the component when the script loads
const avatarSkillsWrapper = new AvatarSkillsWrapper();

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AvatarSkillsWrapper;
}

// Add to window for global access if needed
window.AvatarSkillsWrapper = AvatarSkillsWrapper;