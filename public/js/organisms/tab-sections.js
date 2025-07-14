// Tab Sections Scroll Cursor - Simple & Efficient
document.addEventListener('DOMContentLoaded', function() {
  const contentContainer = document.querySelector('.tab-sections-content');
  const scrollThumb = document.getElementById('scroll-cursor-thumb');
  const scrollCursor = document.querySelector('.tab-sections-scroll-cursor');
  
  if (!contentContainer || !scrollThumb || !scrollCursor) return;

  const DESKTOP_BREAKPOINT = 1024;
  const THUMB_HEIGHT = 56;
  const TRACK_HEIGHT = 525;
  let isDragging = false;

  function isDesktop() {
    return window.innerWidth >= DESKTOP_BREAKPOINT;
  }

  function updateScrollbar() {
    if (!isDesktop()) {
      scrollCursor.classList.add('lg:hidden');
      scrollCursor.classList.remove('lg:block');
      return;
    }

    const scrollHeight = contentContainer.scrollHeight;
    const clientHeight = contentContainer.clientHeight;
    
    // Hide if no scroll needed
    if (scrollHeight <= clientHeight + 10) {
      scrollCursor.classList.add('lg:hidden');
      scrollCursor.classList.remove('lg:block');
      return;
    }
    
    // Show scrollbar
    scrollCursor.classList.remove('lg:hidden');
    scrollCursor.classList.add('lg:block');
    
    // Position scrollbar
    const containerWidth = contentContainer.offsetWidth;
    scrollCursor.style.left = `calc(50% + ${containerWidth/2}px + 12px)`;
    
    updateThumbPosition();
  }

  function updateThumbPosition() {
    if (isDragging || !isDesktop()) return;
    
    const scrollTop = contentContainer.scrollTop;
    const scrollHeight = contentContainer.scrollHeight;
    const clientHeight = contentContainer.clientHeight;
    const contentToScroll = scrollHeight - clientHeight;
    
    if (contentToScroll <= 0) return;
    
    const scrollPercent = scrollTop / contentToScroll;
    const maxTop = TRACK_HEIGHT - THUMB_HEIGHT;
    const newTop = scrollPercent * maxTop;
    
    scrollThumb.style.top = newTop + 'px';
  }

  // Cursor states
  scrollThumb.style.cursor = 'grab';
  
  scrollThumb.addEventListener('mouseenter', function() {
    if (!isDragging) scrollThumb.style.opacity = '0.8';
  });
  
  scrollThumb.addEventListener('mouseleave', function() {
    if (!isDragging) scrollThumb.style.opacity = '1';
  });

  // Drag functionality
  scrollThumb.addEventListener('mousedown', function(e) {
    if (!isDesktop()) return;
    
    isDragging = true;
    scrollThumb.style.cursor = 'grabbing';
    scrollThumb.style.opacity = '0.6';
    
    const startY = e.clientY;
    const startTop = parseInt(scrollThumb.style.top) || 0;
    
    function onMouseMove(e) {
      const deltaY = e.clientY - startY;
      let newTop = startTop + deltaY;
      
      const maxTop = TRACK_HEIGHT - THUMB_HEIGHT;
      newTop = Math.max(0, Math.min(maxTop, newTop));
      
      scrollThumb.style.top = newTop + 'px';
      
      const scrollHeight = contentContainer.scrollHeight;
      const clientHeight = contentContainer.clientHeight;
      const contentToScroll = scrollHeight - clientHeight;
      const scrollPercent = newTop / maxTop;
      const newScrollTop = scrollPercent * contentToScroll;
      
      contentContainer.scrollTop = newScrollTop;
    }
    
    function onMouseUp() {
      isDragging = false;
      scrollThumb.style.cursor = 'grab';
      scrollThumb.style.opacity = '1';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
  });

  // Event listeners
  contentContainer.addEventListener('scroll', updateThumbPosition);
  window.addEventListener('resize', updateScrollbar);
  
  // Initial setup
  updateScrollbar();
});