/**
 * =========================
 *     AVATAR-CARD ORGANISM
 *     Clean tooltip zone with smart positioning      
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
  
  activeZone.addEventListener('mouseenter', () => {
    if (window.innerWidth > 768) {
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
    }
  });
  
  activeZone.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'hidden';
  });
  
  activeZone.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) {
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

document.addEventListener('DOMContentLoaded', initAvatarTooltip);