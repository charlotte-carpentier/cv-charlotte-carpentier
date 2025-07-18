/**
 * =========================
 *     AVATAR-CARD ORGANISM
 *     Event-driven avatar button management
 * =========================
 */

// Initialize avatar button functionality
function initAvatarButtons() {
  // Get all avatar button containers (mobile only) - CORRIGÉ !
  const avatarButtonContainers = document.querySelectorAll('.avatar-card-mobile .avatar-card-button');
  
  console.log(`🎯 Avatar Card: Found ${avatarButtonContainers.length} button containers`);
  
  avatarButtonContainers.forEach(container => {
    const buttonId = container.getAttribute('data-button');
    const actualButton = container.querySelector('button'); // Le vrai bouton généré par renderButton
    
    console.log(`📱 Setting up button container: ${buttonId}`, { hasButton: !!actualButton });
    
    if (buttonId && actualButton) {
      actualButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        console.log(`🎯 Avatar Card: Button clicked - ${buttonId}`);
        
        // Emit custom event for skills card to listen
        const skillsToggleEvent = new CustomEvent('avatar:skillsToggle', {
          detail: { buttonId: buttonId },
          bubbles: true
        });
        
        document.dispatchEvent(skillsToggleEvent);
        console.log(`📡 Event dispatched: avatar:skillsToggle with buttonId: ${buttonId}`);
      });
    } else {
      console.warn(`❌ Button container problem:`, { buttonId, hasButton: !!actualButton });
    }
  });
}

// Handle responsive behavior
function handleAvatarResize() {
  const isMobile = window.innerWidth < 640;
  
  if (isMobile) {
    // Mobile: emit hide all skills event on resize
    const hideAllEvent = new CustomEvent('avatar:hideAllSkills', {
      bubbles: true
    });
    document.dispatchEvent(hideAllEvent);
    console.log('📱 Avatar Card: Emitted hideAllSkills on mobile resize');
  } else {
    // Desktop/Tablet: emit show all skills event
    const showAllEvent = new CustomEvent('avatar:showAllSkills', {
      bubbles: true
    });
    document.dispatchEvent(showAllEvent);
    console.log('🖥️ Avatar Card: Emitted showAllSkills on desktop resize');
  }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎯 Avatar Card: Initializing...');
  
  // DEBUG: Check if avatar container exists
  const avatarContainer = document.querySelector('.avatar-card-mobile');
  console.log('📱 Avatar mobile container found:', !!avatarContainer);
  
  if (avatarContainer) {
    const buttonContainers = avatarContainer.querySelectorAll('.avatar-card-button');
    console.log('🔍 Button containers found:', buttonContainers.length);
    
    buttonContainers.forEach((container, index) => {
      const dataButton = container.getAttribute('data-button');
      const actualButton = container.querySelector('button');
      console.log(`  ${index + 1}. data-button="${dataButton}", has button: ${!!actualButton}`);
    });
  }
  
  // Initialize button functionality
  initAvatarButtons();
  
  // Handle window resize for responsive behavior
  window.addEventListener('resize', handleAvatarResize);
  
  // Initial state setup based on screen size
  handleAvatarResize();
  
  console.log('🎯 Avatar Card: Fully initialized! ✨');
});