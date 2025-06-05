/**
 * Button States Manager
 * 
 * Handles dynamic state changes for buttons with data-state-* attributes.
 * Supports hover, focus, active and disabled states.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Sélectionne tous les boutons avec l'attribut data-state-default
  document.querySelectorAll("button[data-state-default]").forEach(button => {
    if (button.disabled) return;

    button.addEventListener("focus", () => {
      button.setAttribute("data-focused", "true");
      updateButtonState(button, "focus");
    });

    button.addEventListener("blur", () => {
      button.removeAttribute("data-focused");
      updateButtonState(button, "default");
    });

    button.addEventListener("mouseover", () => {
      const newState = button.hasAttribute("data-focused") ? "focus" : "hover";
      updateButtonState(button, newState);
    });

    button.addEventListener("mouseout", () => {
      const newState = button.hasAttribute("data-focused") ? "focus" : "default";
      updateButtonState(button, newState);
    });

    button.addEventListener("mousedown", () => {
      updateButtonState(button, "active");
    });

    button.addEventListener("mouseup", () => {
      const newState = button.hasAttribute("data-focused") ? "focus" : "hover";
      updateButtonState(button, newState);
    });
  });
});

/**
 * Met à jour l'état visuel du bouton en appliquant les classes appropriées.
 * 
 * @param {HTMLElement} button - Le bouton à mettre à jour
 * @param {string} state - L'état à appliquer ('default', 'hover', 'focus', 'active')
 */
function updateButtonState(button, state) {
  // Récupérer les classes de base (tout sauf les classes d'état)
  const baseClasses = getBaseClasses(button);
  
  // Récupérer les classes pour le nouvel état
  const stateClasses = button.dataset[`state${state.charAt(0).toUpperCase() + state.slice(1)}`] || '';
  
  // Appliquer les classes en remplaçant complètement la liste de classes
  button.className = `${baseClasses} ${stateClasses}`;
}

/**
 * Extrait les classes de base d'un bouton (celles qui ne sont pas liées aux états).
 * 
 * @param {HTMLElement} button - Le bouton dont on veut extraire les classes de base
 * @return {string} Les classes de base du bouton
 */
function getBaseClasses(button) {
  // Cette fonction préserve les classes de base et de mise en page
  return button.classList.value.split(' ')
    .filter(cls => 
      !button.dataset.stateDefault?.includes(cls) && 
      !button.dataset.stateHover?.includes(cls) && 
      !button.dataset.stateFocus?.includes(cls) && 
      !button.dataset.stateActive?.includes(cls)
    )
    .join(' ');
}