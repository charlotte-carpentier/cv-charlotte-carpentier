/**
 * =========================
 *     SKILLS-CARD
 *     Pas de JS spécifique dans le wrapper original
 *     Juste la fonction closeSkillsCard appelée par avatar-card
 * =========================
 */

// Fonction globale pour fermer les cartes (appelée par les boutons close)
function closeSkillsCard(cardName) {
  const container = document.querySelector(`[data-skills="${cardName}"]`);
  if (container) {
    container.classList.add('hidden');
    container.classList.remove('block');
  }
}

// Export pour utilisation globale
window.closeSkillsCard = closeSkillsCard;

console.log('Skills Card: Minimal JS loaded! 🎯✨');