/* ===========================================================
   @ORGANISMS - ERROR-LAYOUT
   - Halo animations for desktop hover and mobile scroll
   - Fragment reveal system with cursor/scroll following
   - Responsive behavior switching
=========================================================== */

/**
 * Initialize error layout animations and interactions
 */
function initErrorLayout() {
  const errorLayout = document.querySelector('.error-layout--cross-layout');
  if (!errorLayout) return;

  // Initialize based on viewport size
  if (window.innerWidth >= 1024) {
    initDesktopLayout(errorLayout);
  } else {
    initMobileLayout(errorLayout);
  }

  // Handle resize events
  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth >= 1024) {
      cleanupMobileLayout();
      initDesktopLayout(errorLayout);
    } else {
      cleanupDesktopLayout();
      initMobileLayout(errorLayout);
    }
  }, 250));
}

/**
 * Initialize desktop layout with cursor-following halo
 */
function initDesktopLayout(container) {
  const cursorHalo = container.querySelector('.error-layout-halo-cursor');
  const fixedHalo = container.querySelector('.error-layout-halo-fixed');
  
  if (!cursorHalo || !fixedHalo) return;

  // Position fixed halo at center (triptych)
  positionFixedHalo(fixedHalo);

  // Track mouse movement for cursor halo
  const handleMouseMove = (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    positionCursorHalo(cursorHalo, x, y);
    revealFragmentsOnHover(container, x, y);
  };

  container.addEventListener('mousemove', handleMouseMove);
  
  // Store handler for cleanup
  container._desktopHandler = handleMouseMove;
}

/**
 * Initialize mobile layout with scroll-following halo
 */
function initMobileLayout(container) {
  const scrollHalo = container.querySelector('.error-layout-halo-scroll');
  const mobileContainer = container.querySelector('.error-layout-mobile');
  
  if (!scrollHalo || !mobileContainer) return;

  // Render individual fragments in mobile placeholders
  renderMobileFragments(container);

  // Track scroll for halo positioning
  const handleScroll = () => {
    const scrollY = mobileContainer.scrollTop;
    const containerHeight = mobileContainer.clientHeight;
    
    positionScrollHalo(scrollHalo, scrollY, containerHeight);
    revealFragmentsOnScroll(container, scrollY);
  };

  mobileContainer.addEventListener('scroll', handleScroll);
  
  // Initial positioning
  handleScroll();
  
  // Store handler for cleanup
  container._mobileHandler = handleScroll;
  container._mobileContainer = mobileContainer;
}

/**
 * Position fixed halo at triptych center
 */
function positionFixedHalo(halo) {
  const triptych = document.querySelector('.error-layout-triptych');
  if (!triptych) return;

  const rect = triptych.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  halo.style.left = centerX + 'px';
  halo.style.top = centerY + 'px';
  halo.style.opacity = '1';
}

/**
 * Position cursor-following halo
 */
function positionCursorHalo(halo, x, y) {
  halo.style.left = x + 'px';
  halo.style.top = y + 'px';
  halo.style.opacity = '0.8';
}

/**
 * Position scroll-following halo based on scroll position
 */
function positionScrollHalo(halo, scrollY, containerHeight) {
  // Position halo at center of visible area
  const haloY = scrollY + containerHeight / 2;
  
  halo.style.top = haloY + 'px';
  halo.style.opacity = '0.9';
}

/**
 * Reveal fragments on desktop hover
 */
function revealFragmentsOnHover(container, mouseX, mouseY) {
  const fragments = container.querySelectorAll('.error-layout-fragment');
  const haloRadius = 150; // Match CSS halo size
  
  fragments.forEach(fragment => {
    const rect = fragment.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    const fragmentCenterX = rect.left - containerRect.left + rect.width / 2;
    const fragmentCenterY = rect.top - containerRect.top + rect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(mouseX - fragmentCenterX, 2) + 
      Math.pow(mouseY - fragmentCenterY, 2)
    );
    
    // Reveal fragment if within halo radius
    if (distance <= haloRadius) {
      fragment.classList.add('error-layout-fragment-revealed');
    } else {
      fragment.classList.remove('error-layout-fragment-revealed');
    }
  });
}

/**
 * Reveal fragments on mobile scroll
 */
function revealFragmentsOnScroll(container, scrollY) {
  const fragments = container.querySelectorAll('.error-layout-fragment-mobile');
  const revealOffset = window.innerHeight / 2;
  
  fragments.forEach(fragment => {
    const rect = fragment.getBoundingClientRect();
    const fragmentTop = scrollY + rect.top;
    const scrollCenter = scrollY + revealOffset;
    
    // Reveal if fragment is near scroll center
    if (Math.abs(fragmentTop - scrollCenter) < 200) {
      fragment.classList.add('error-layout-fragment-revealed');
    } else {
      fragment.classList.remove('error-layout-fragment-revealed');
    }
  });
}

/**
 * Render individual fragments in mobile placeholders
 */
function renderMobileFragments(container) {
  // This would be handled by the template engine in a real scenario
  // For now, we'll assume fragments are already rendered in placeholders
  console.log('Mobile fragments rendered');
}

/**
 * Cleanup desktop event handlers
 */
function cleanupDesktopLayout() {
  const container = document.querySelector('.error-layout--cross-layout');
  if (container && container._desktopHandler) {
    container.removeEventListener('mousemove', container._desktopHandler);
    delete container._desktopHandler;
  }
}

/**
 * Cleanup mobile event handlers
 */
function cleanupMobileLayout() {
  const container = document.querySelector('.error-layout--cross-layout');
  if (container && container._mobileHandler && container._mobileContainer) {
    container._mobileContainer.removeEventListener('scroll', container._mobileHandler);
    delete container._mobileHandler;
    delete container._mobileContainer;
  }
}

/**
 * Debounce utility for resize events
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// =========================
// INITIALIZATION
// =========================

// Initialize error layout when DOM is ready
document.addEventListener('DOMContentLoaded', initErrorLayout);

// Export for potential external use or testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    initErrorLayout, 
    initDesktopLayout, 
    initMobileLayout 
  };
}