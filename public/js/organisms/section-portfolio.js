// Portfolio Carousel Navigation - Version corrigée pour tablet
document.addEventListener('DOMContentLoaded', function() {
  
  // Trouve le bon carousel selon le layout visible
  function findActiveCarousel() {
    const layouts = ['.home-layout__sm', '.home-layout__md', '.home-layout__lg', '.home-layout__xl'];
    
    for (const layout of layouts) {
      const layoutElement = document.querySelector(layout);
      if (layoutElement && window.getComputedStyle(layoutElement).display !== 'none') {
        return layoutElement.querySelector('#portfolio-carousel');
      }
    }
    
    // Fallback pour usage standalone
    return document.querySelector('#portfolio-carousel');
  }
  
  const carousel = findActiveCarousel();
  if (!carousel) return;
  
  const dots = carousel.closest('.section-portfolio').querySelectorAll('.portfolio-dot');
  
  if (!carousel || dots.length === 0) return;
  
  // Get carousel items
  const items = carousel.querySelectorAll('.section-portfolio-item');
  
  // Mouse drag pour desktop/tablet
  let isDragging = false;
  let startX;
  let scrollLeft;
  
  // Set initial cursor
  carousel.style.cursor = 'grab';
  
  carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    scrollLeft = carousel.scrollLeft;
    carousel.style.cursor = 'grabbing';
  });
  
  carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = startX - x;
    carousel.scrollLeft = scrollLeft + walk;
  });
  
  carousel.addEventListener('mouseup', () => {
    isDragging = false;
    carousel.style.cursor = 'grab';
  });
  
  carousel.addEventListener('mouseleave', () => {
    isDragging = false;
    carousel.style.cursor = 'grab';
  });
  
  // Dots management - tout dans le JS
  function setDotStyles() {
    dots.forEach((dot, index) => {
      // Style par défaut
      dot.style.backgroundColor = '#ffffff';
      dot.style.border = '3px solid #000000';
    });
  }
  
  function updateActiveDot() {
    const scrollLeft = carousel.scrollLeft;
    const itemWidth = items[0]?.offsetWidth || 0;
    const gap = 16; // gap-4 = 16px
    const containerWidth = carousel.offsetWidth;
    
    // Calcul pour déterminer quelle image on voit le plus
    let currentIndex = 0;
    let maxVisiblePixels = 0;
    
    items.forEach((item, index) => {
      const itemLeft = index * (itemWidth + gap);
      const itemRight = itemLeft + itemWidth;
      
      const visibleLeft = Math.max(itemLeft, scrollLeft);
      const visibleRight = Math.min(itemRight, scrollLeft + containerWidth);
      const visiblePixels = Math.max(0, visibleRight - visibleLeft);
      
      if (visiblePixels > maxVisiblePixels) {
        maxVisiblePixels = visiblePixels;
        currentIndex = index;
      }
    });
    
    // Sécurité
    currentIndex = Math.max(0, Math.min(currentIndex, dots.length - 1));
    
    // Reset tous les dots
    dots.forEach(dot => {
      dot.style.backgroundColor = '#ffffff';
    });
    
    // Active le dot courant
    if (dots[currentIndex]) {
      dots[currentIndex].style.backgroundColor = '#c4ffcb';
    }
  }
  
  // Handle dot clicks
  dots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
      const itemWidth = items[0]?.offsetWidth || 0;
      const gap = 16;
      const scrollPosition = index * (itemWidth + gap);
      
      carousel.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      
      // Force l'activation du dot cliqué
      dots.forEach(d => {
        d.style.backgroundColor = '#ffffff';
      });
      dot.style.backgroundColor = '#c4ffcb';
    });
  });
  
  // Listen to scroll events
  let scrollTimeout;
  carousel.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveDot, 50);
  });
  
  // Initialize dots
  setDotStyles();
  if (dots[0]) {
    dots[0].style.backgroundColor = '#c4ffcb';
  }
});