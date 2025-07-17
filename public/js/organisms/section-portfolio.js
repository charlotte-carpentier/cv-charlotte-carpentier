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
  
  // Update active dot based on scroll position
  function updateActiveDot() {
    const scrollLeft = carousel.scrollLeft;
    const itemWidth = items[0]?.offsetWidth || 0;
    const gap = 16; // gap-4 = 16px
    const containerWidth = carousel.offsetWidth;
    
    // Calcul pour déterminer quelle image on voit le plus (en pixels)
    let currentIndex = 0;
    let maxVisiblePixels = 0;
    
    items.forEach((item, index) => {
      const itemLeft = index * (itemWidth + gap);
      const itemRight = itemLeft + itemWidth;
      
      // Calcul des pixels visibles de cet élément
      const visibleLeft = Math.max(itemLeft, scrollLeft);
      const visibleRight = Math.min(itemRight, scrollLeft + containerWidth);
      const visiblePixels = Math.max(0, visibleRight - visibleLeft);
      
      // Si on voit plus de pixels de cet élément que le précédent
      if (visiblePixels > maxVisiblePixels) {
        maxVisiblePixels = visiblePixels;
        currentIndex = index;
      }
    });
    
    // Sécurité : s'assurer que l'index est dans les limites
    currentIndex = Math.max(0, Math.min(currentIndex, dots.length - 1));
    
    // Remove active class from all dots
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current dot
    if (dots[currentIndex]) {
      dots[currentIndex].classList.add('active');
    }
  }
  
  // Handle dot clicks
  dots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
      const itemWidth = items[0]?.offsetWidth || 0;
      const gap = 16; // gap-4 = 16px
      const scrollPosition = index * (itemWidth + gap);
      
      carousel.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      
      // Force l'activation du dot cliqué
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });
  
  // Listen to scroll events avec throttling
  let scrollTimeout;
  carousel.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveDot, 50);
  });
  
  // Initialize first dot as active
  if (dots[0]) {
    dots[0].classList.add('active');
  }
});