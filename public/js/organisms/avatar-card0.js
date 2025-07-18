/**
 * =========================
 *     AVATAR-CARD ORGANISM
 *     Clean tooltip zone with smart positioning + Mobile Skills Interaction      
 * =========================
 */

function initAvatarTooltip() {
  const avatarContainer = document.querySelector('.avatar-tooltip-container');
  
  if (!avatarContainer) return;
  
  const tooltip = avatarContainer.querySelector('.tooltip-popup');
  if (!tooltip) return;
  
  const activeZone = document.createElement('div');
  activeZone.style.position = 'absolute';
  activeZone.style.top = '10px';
  activeZone.style.left = '85px';
  activeZone.style.width = '180px';
  activeZone.style.height = '650px';
  activeZone.style.zIndex = '2';
  activeZone.style.cursor = 'default';
  activeZone.style.pointerEvents = 'auto';
  
  avatarContainer.appendChild(activeZone);
  
  activeZone.addEventListener('mouseenter', (e) => {
    if (window.innerWidth >= 1024) {
      // Désactiver toutes les transitions temporairement
      tooltip.style.transition = 'none';
      
      // Positionner immédiatement
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const margin = 20;
      
      let x = e.clientX + 15;
      let y = e.clientY + 15;
      
      if (y + tooltipRect.height > viewportHeight - margin) {
        y = e.clientY - tooltipRect.height - 15;
      }
      
      if (x + tooltipRect.width > viewportWidth - margin) {
        x = e.clientX - tooltipRect.width - 15;
      }
      
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
      
      // Réactiver les transitions après un micro-délai
      requestAnimationFrame(() => {
        tooltip.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
      });
    }
  });
  
  activeZone.addEventListener('mouseleave', () => {
    // Réactiver les transitions pour le fade out
    tooltip.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'hidden';
  });
  
  activeZone.addEventListener('mousemove', (e) => {
    if (window.innerWidth >= 1024) {
      // Désactiver transitions pour un suivi fluide
      tooltip.style.transition = 'none';
      
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const margin = 20;
      
      let x = e.clientX + 15;
      let y = e.clientY + 15;
      
      if (y + tooltipRect.height > viewportHeight - margin) {
        y = e.clientY - tooltipRect.height - 15;
      }
      
      if (x + tooltipRect.width > viewportWidth - margin) {
        x = e.clientX - tooltipRect.width - 15;
      }
      
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
    }
  });
  
  avatarContainer.style.pointerEvents = 'none';

  const img = avatarContainer.querySelector('img');
  if (img) {
    img.style.pointerEvents = 'none';
  }
}

/**
 * Mobile Skills Cards Interaction - EVENT DELEGATION PATTERN
 * Avatar buttons emit custom events for skills cards
 */
function initMobileSkillsInteraction() {
  // Only run on mobile
  function isMobile() {
    return window.innerWidth < 640;
  }
  
  if (!isMobile()) return;
  
  // Get all mobile buttons - Avatar-card buttons only
  const buttons = document.querySelectorAll('.avatar-card-mobile .avatar-card-button[data-button] .button');
  
  // Setup button click listeners - EMIT EVENTS ONLY
  buttons.forEach(button => {
    const buttonContainer = button.closest('[data-button]');
    const buttonId = buttonContainer ? buttonContainer.getAttribute('data-button') : null;
    
    if (buttonId) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Emit custom event for skills cards to listen
        const skillsEvent = new CustomEvent('avatar:skillsToggle', {
          detail: {
            buttonId: buttonId,
            timestamp: Date.now()
          },
          bubbles: true
        });
        
        // Dispatch from document for global listening
        document.dispatchEvent(skillsEvent);
      });
    }
  });
  
  console.log('Avatar Card: Mobile button events initialized! 📱✨');
}

// Handle responsive changes
function handleResize() {
  if (window.innerWidth >= 640) {
    // Desktop/tablet - emit event to show all skills cards
    const showAllEvent = new CustomEvent('avatar:showAllSkills', {
      detail: { reason: 'responsive-desktop' },
      bubbles: true
    });
    document.dispatchEvent(showAllEvent);
  } else {
    // Mobile - reinitialize button interaction
    initMobileSkillsInteraction();
    
    // Emit event to hide all skills cards initially
    const hideAllEvent = new CustomEvent('avatar:hideAllSkills', {
      detail: { reason: 'responsive-mobile' },
      bubbles: true
    });
    document.dispatchEvent(hideAllEvent);
  }
}

// Initialize both systems
document.addEventListener('DOMContentLoaded', function() {
  initAvatarTooltip();
  initMobileSkillsInteraction();
  
  // Handle window resize for responsive behavior
  window.addEventListener('resize', handleResize);
});