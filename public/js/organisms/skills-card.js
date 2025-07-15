/**
 * =========================
 *     SKILLS-CARD ORGANISM
 *     Event-driven skills cards management + Close buttons + Full autonomy
 * =========================
 */

// Button to Card mapping - UTILISE data-skills POST-MIGRATION
const SKILLS_MAPPING = {
  'button_languages': 'languages_card',
  'button_hard_skills': 'hard_skills_card',
  'button_soft_skills': 'soft_skills_card',
  'button_interests': 'interests_card'
};

// Get all skills card containers - UTILISE data-skills
function getSkillsContainers() {
  return Object.values(SKILLS_MAPPING)
    .map(skillsName => document.querySelector(`[data-skills="${skillsName}"]`))
    .filter(Boolean);
}

// Hide all skills cards
function hideAllSkillsCards() {
  getSkillsContainers().forEach(container => {
    container.classList.add('hidden');
    container.classList.remove('block', 'visible');
  });
}

// Show specific skills card - UTILISE data-skills
function showSkillsCard(skillsName) {
  const container = document.querySelector(`[data-skills="${skillsName}"]`);
  if (container) {
    container.classList.remove('hidden');
    container.classList.add('block', 'visible');
  }
}

// Check if skills card is visible - UTILISE data-skills
function isSkillsCardVisible(skillsName) {
  const container = document.querySelector(`[data-skills="${skillsName}"]`);
  console.log(`🔍 isSkillsCardVisible(${skillsName}):`, {
    container,
    exists: !!container,
    classes: container ? container.className : 'NO CONTAINER',
    hasHidden: container ? container.classList.contains('hidden') : 'NO CONTAINER',
    result: container ? !container.classList.contains('hidden') : null
  });
  return container ? !container.classList.contains('hidden') : null;
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

// EVENT LISTENERS - Listen to avatar events - UTILISE data-skills
document.addEventListener('avatar:skillsToggle', function(e) {
  const { buttonId } = e.detail;
  const skillsName = SKILLS_MAPPING[buttonId];
  
  console.log(`🎯 Skills Card: Received event for ${buttonId} → ${skillsName}`);
  
  if (skillsName) {
    const container = document.querySelector(`[data-skills="${skillsName}"]`);
    console.log(`📦 Container found:`, container);
    
    const isCurrentlyVisible = isSkillsCardVisible(skillsName);
    console.log(`👁️ Currently visible:`, isCurrentlyVisible);
    
    // Hide all cards first
    hideAllSkillsCards();
    
    // If current card wasn't visible, show it
    if (!isCurrentlyVisible) {
      showSkillsCard(skillsName);
      console.log(`✅ Showing ${skillsName}`);
    } else {
      console.log(`❌ Was visible, now hidden`);
    }
  } else {
    console.log(`❌ No skills name found for ${buttonId}`);
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