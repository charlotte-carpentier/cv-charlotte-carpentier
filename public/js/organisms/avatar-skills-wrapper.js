/**
 * Mobile Skills Cards - Simple Toggle System
 * One card open at a time + close buttons
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // Button to Card mapping
  const mapping = {
    'button_languages': 'skills-card-languages-mobile',
    'button_hard_skills': 'skills-card-hard-skills-mobile',
    'button_soft_skills': 'skills-card-soft-skills-mobile',
    'button_interests': 'skills-card-interests-mobile'
  };
  
  // Get all mobile buttons
  const buttons = document.querySelectorAll('.avatar-card-mobile [data-button]');
  
  // Get all mobile containers
  const containers = Object.values(mapping).map(id => document.getElementById(id)).filter(Boolean);
  
  // Hide all cards initially
  function hideAllCards() {
    containers.forEach(container => {
      container.classList.add('hidden');
      container.classList.remove('block');
    });
  }
  
  // Show specific card
  function showCard(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.classList.remove('hidden');
      container.classList.add('block');
    }
  }
  
  // Check if card is visible
  function isCardVisible(containerId) {
    const container = document.getElementById(containerId);
    return container && !container.classList.contains('hidden');
  }
  
  // Setup button click listeners
  buttons.forEach(button => {
    const buttonId = button.getAttribute('data-button');
    const containerId = mapping[buttonId];
    
    if (containerId) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const isCurrentlyVisible = isCardVisible(containerId);
        
        // Hide all cards first
        hideAllCards();
        
        // If current card wasn't visible, show it
        if (!isCurrentlyVisible) {
          showCard(containerId);
        }
        // If it was visible, it stays hidden (toggle off)
      });
    }
  });
  
  // Setup close buttons (burger_x icons)
  containers.forEach(container => {
    const closeButton = container.querySelector('.skills-card-close');
    if (closeButton) {
      closeButton.addEventListener('click', function(e) {
        e.preventDefault();
        container.classList.add('hidden');
        container.classList.remove('block');
      });
    }
  });
  
  // Initialize - hide all cards on load
  hideAllCards();
  
  console.log('Mobile Skills Cards: Initialized successfully! 📱✨');
});