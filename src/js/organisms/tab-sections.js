// Tab Navigation - Version avec gestion centralisée du current
document.addEventListener('DOMContentLoaded', function() {
  
  // === GESTION CENTRALISÉE DU CURRENT ===
  function initCurrentLinks() {
    function updateAllCurrentLinks() {
      const currentHash = window.location.hash || '#portfolio';
      
      console.log('Navigation - Current hash:', currentHash); // DEBUG
      
      // TOUS les liens de navigation (header + tab-menu + mobile)
      const allNavigationLinks = document.querySelectorAll(`
        .header-navigation .link--nav,
        .header-mobile-overlay .link--tab,
        .tab-menu .link--tab
      `);
      
      allNavigationLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (href === currentHash) {
          link.classList.add('current');
          console.log('Navigation - Added current to:', href, link); // DEBUG
        } else {
          link.classList.remove('current');
        }
      });
    }
    
    // Mise à jour au chargement et au changement de hash
    updateAllCurrentLinks();
    window.addEventListener('hashchange', updateAllCurrentLinks);
  }
  
  // === GESTION DES SECTIONS (existant) ===
  
  // Redirection par défaut
  if (!window.location.hash) {
    window.location.hash = '#portfolio';
  }
  
  // Fonction simple pour masquer portfolio
  function hidePortfolioIfNeeded() {
    const hash = window.location.hash;
    const portfolio = document.querySelector('#portfolio[data-default="true"]');
    
    if (portfolio) {
      if (hash && hash !== '#portfolio') {
        portfolio.style.display = 'none';
      } else {
        portfolio.style.display = 'block';
      }
    }
  }
  
  // Au changement d'URL
  window.addEventListener('hashchange', hidePortfolioIfNeeded);
  
  // Au chargement
  hidePortfolioIfNeeded();
  
  // === SCROLL CURSOR (garde ce qui marche) ===
  const contentContainer = document.querySelector('.tab-sections-content');
  const scrollThumb = document.getElementById('scroll-cursor-thumb');
  const scrollCursor = document.querySelector('.tab-sections-scroll-cursor');
  
  if (contentContainer && scrollThumb && scrollCursor) {
    const DESKTOP_BREAKPOINT = 1024;
    const THUMB_HEIGHT = 56;
    const TRACK_HEIGHT = 525;
    const CURSOR_SPACING = 20;
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
      
      if (scrollHeight <= clientHeight + 10) {
        scrollCursor.classList.add('lg:hidden');
        scrollCursor.classList.remove('lg:block');
        return;
      }
      
      scrollCursor.classList.remove('lg:hidden');
      scrollCursor.classList.add('lg:block');
      
      const containerWidth = contentContainer.offsetWidth;
      scrollCursor.style.left = `calc(50% + ${containerWidth/2}px + ${CURSOR_SPACING}px)`;
      
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

    scrollThumb.style.cursor = 'grab';
    
    scrollThumb.addEventListener('mouseenter', function() {
      if (!isDragging) scrollThumb.style.opacity = '0.8';
    });
    
    scrollThumb.addEventListener('mouseleave', function() {
      if (!isDragging) scrollThumb.style.opacity = '1';
    });

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

    contentContainer.addEventListener('scroll', updateThumbPosition);
    window.addEventListener('resize', updateScrollbar);
    window.addEventListener('hashchange', updateScrollbar);
    
    updateScrollbar();
  }
  
  // === INITIALISATION CENTRALISÉE ===
  initCurrentLinks();
  
  console.log('Tab-sections with centralized current management initialized! 🎯');
});