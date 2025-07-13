// Portfolio Carousel Navigation
document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.getElementById('portfolio-carousel');
  const dots = document.querySelectorAll('.portfolio-dot');
  
  if (!carousel || dots.length === 0) return;
  
  // Get carousel items
  const items = carousel.querySelectorAll('.section-portfolio-item');
  
  // Update active dot based on scroll position
  function updateActiveDot() {
    const scrollLeft = carousel.scrollLeft;
    const itemWidth = items[0]?.offsetWidth || 0;
    const gap = 16; // gap-4 = 16px
    const currentIndex = Math.round(scrollLeft / (itemWidth + gap));
    
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
    });
  });
  
  // Listen to scroll events
  carousel.addEventListener('scroll', updateActiveDot);
  
  // Initialize first dot as active
  if (dots[0]) {
    dots[0].classList.add('active');
  }
});