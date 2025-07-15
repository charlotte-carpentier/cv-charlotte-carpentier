// Tab Navigation - Version avec anti-clignotement scroll cursor
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
  
  // === SCROLL CURSOR (avec anti-clignotement) ===
  const contentContainer = document.querySelector('.tab-sections-content');
  const scrollThumb = document.getElementById('scroll-cursor-thumb');
  const scrollCursor = document.querySelector('.tab-sections-scroll-cursor');
  
  if (contentContainer && scrollThumb && scrollCursor) {
    const DESKTOP_BREAKPOINT = 1024;
    const THUMB_HEIGHT = 56;
    const TRACK_HEIGHT = 525;
    const CURSOR_SPACING = 20;
    let isDragging = false;
    let isInitialized = false; // Flag pour éviter le clignotement

    function isDesktop() {
      return window.innerWidth >= DESKTOP_BREAKPOINT;
    }

    function initializeScrollbar() {
      // Masquer immédiatement pendant l'initialisation
      scrollCursor.classList.add('hidden');
      scrollCursor.classList.remove('ready');
      
      // Attendre un peu que le DOM soit stable
      setTimeout(() => {
        updateScrollbar();
        isInitialized = true;
      }, 100); // Petit délai pour éviter le flash
    }

    function updateScrollbar() {
      if (!isDesktop()) {
        scrollCursor.classList.add('lg:hidden');
        scrollCursor.classList.remove('lg:block', 'ready');
        scrollCursor.classList.add('hidden');
        return;
      }

      const scrollHeight = contentContainer.scrollHeight;
      const clientHeight = contentContainer.clientHeight;
      
      if (scrollHeight <= clientHeight + 10) {
        scrollCursor.classList.add('lg:hidden');
        scrollCursor.classList.remove('lg:block', 'ready');
        scrollCursor.classList.add('hidden');
        return;
      }
      
      // Calculer la position AVANT d'afficher
      const containerWidth = contentContainer.offsetWidth;
      scrollCursor.style.left = `calc(50% + ${containerWidth/2}px + ${CURSOR_SPACING}px)`;
      
      updateThumbPosition();
      
      // Maintenant on peut afficher en toute sécurité
      scrollCursor.classList.remove('lg:hidden', 'hidden');
      scrollCursor.classList.add('lg:block');
      
      // Ajouter la classe ready pour la transition douce
      setTimeout(() => {
        scrollCursor.classList.add('ready');
      }, 50); // Petit délai pour la transition
    }

    function updateThumbPosition() {
      if (isDragging || !isDesktop() || !isInitialized) return;
      
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
    
    // Gestion du resize avec réinitialisation
    window.addEventListener('resize', function() {
      isInitialized = false;
      initializeScrollbar();
    });
    
    // Gestion du changement de hash avec réinitialisation
    window.addEventListener('hashchange', function() {
      isInitialized = false;
      setTimeout(() => {
        initializeScrollbar();
      }, 150); // Délai plus long pour le changement de contenu
    });
    
    // Initialisation au chargement
    initializeScrollbar();
  }
  
  // === INITIALISATION CENTRALISÉE ===
  initCurrentLinks();
  
  console.log('Tab-sections with anti-flicker scroll cursor initialized! 🎯✨');
});