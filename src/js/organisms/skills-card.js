/**
 * =========================
 *     SKILLS-CARD ORGANISM
 *     Event-driven skills cards management + Close buttons + Full autonomy
 * =========================
 */

// Button to Card mapping
const SKILLS_MAPPING = {
  'button_languages': 'skills-card-languages-mobile',
  'button_hard_skills': 'skills-card-hard-skills-mobile',
  'button_soft_skills': 'skills-card-soft-skills-mobile',
  'button_interests': 'skills-card-interests-mobile'
};

// Get all skills card containers
function getSkillsContainers() {
  return Object.values(SKILLS_MAPPING)
    .map(id => document.getElementById(id))
    .filter(Boolean);
}

// Hide all skills cards
function hideAllSkillsCards() {
  getSkillsContainers().forEach(container => {
    container.classList.add('hidden');
    container.classList.remove('block', 'visible');
  });
}

// Show specific skills card
function showSkillsCard(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.classList.remove('hidden');
    container.classList.add('block', 'visible');
  }
}

// Check if skills card is visible
function isSkillsCardVisible(containerId) {
  const container = document.getElementById(containerId);
  return container && !container.classList.contains('hidden');
}

// Show all skills cards (for desktop/tablet)
function showAllSkillsCards() {
  getSkillsContainers().forEach(container => {
    container.classList.remove('hidden');
    container.classList.add('block', 'visible');
  });
}

// Initialize mobile state based on screen size
function initializeResponsiveState() {
  if (window.innerWidth < 640) {
    // Mobile - hide all initially (COMME AVANT)
    hideAllSkillsCards();
  } else {
    // Desktop/Tablet - show all (COMME AVANT)
    showAllSkillsCards();
  }
}

// Handle responsive changes
function handleSkillsResize() {
  initializeResponsiveState();
}

// EVENT LISTENERS - Listen to avatar events
document.addEventListener('avatar:skillsToggle', function(e) {
  const { buttonId } = e.detail;
  const containerId = SKILLS_MAPPING[buttonId];
  
  if (containerId) {
    const isCurrentlyVisible = isSkillsCardVisible(containerId);
    
    // Hide all cards first
    hideAllSkillsCards();
    
    // If current card wasn't visible, show it
    if (!isCurrentlyVisible) {
      showSkillsCard(containerId);
    }
    // If it was visible, it stays hidden (toggle off)
    
    console.log(`Skills Card: Toggled ${containerId} (was visible: ${isCurrentlyVisible}) 🎯`);
  }
});

document.addEventListener('avatar:hideAllSkills', function(e) {
  hideAllSkillsCards();
  console.log('Skills Card: Hidden all cards 🙈');
});

document.addEventListener('avatar:showAllSkills', function(e) {
  showAllSkillsCards();
  console.log('Skills Card: Shown all cards 👁️');
});

// Close button functionality - MIGRÉ depuis avatar-skills-wrapper
function initCloseButtons() {
  getSkillsContainers().forEach(container => {
    const closeButton = container.querySelector('.skills-card-close');
    if (closeButton) {
      closeButton.addEventListener('click', function(e) {
        e.preventDefault();
        container.classList.add('hidden');
        container.classList.remove('block', 'visible');
        
        console.log(`Skills Card: Closed ${container.id} via close button ❌`);
      });
    }
  });
}

// Fonction globale pour fermeture externe (maintenue pour compatibilité)
function closeSkillsCard(cardName) {
  const container = document.querySelector(`[data-skills="${cardName}"]`);
  if (container) {
    container.classList.add('hidden');
    container.classList.remove('block', 'visible');
    
    console.log(`Skills Card: Closed ${cardName} via external call ❌`);
  }
}

// Export pour utilisation globale (maintenu pour compatibilité)
window.closeSkillsCard = closeSkillsCard;

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
  
  // Setup close buttons
  initCloseButtons();
  
  // Initialize responsive state
  initializeResponsiveState();
  
  // Handle window resize for responsive behavior
  window.addEventListener('resize', handleSkillsResize);
  
  console.log('Skills Card: Fully autonomous system initialized! 🎯✨');
});