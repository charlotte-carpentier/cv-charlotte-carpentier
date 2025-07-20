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
  
  // SUPPRIMÉ: Plus de resize listener ni d'état initial setup
  // Ces fonctions étaient responsables de la fermeture des cartes au scroll
  
  console.log('🎯 Avatar Card: Fully initialized! ✨');
});