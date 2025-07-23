document.addEventListener('DOMContentLoaded', () => {
  const defaultHash = '#portfolio';

  // Gestion de la redirection ?tab=merci vers #merci
  function handleTabRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    
    if (tab === 'merci') {
      // Remove the URL parameter and redirect to #merci
      const url = new URL(window.location);
      url.searchParams.delete('tab');
      window.history.replaceState({}, '', url.pathname + url.search + '#merci');
    }
  }

  // Detecte le layout actif (sm, md, lg, xl ou standalone)
  function getCurrentActiveLayout() {
    if (!document.querySelector('.home-layout')) return 'standalone';

    return ['sm', 'md', 'lg', 'xl'].find(layout => {
      const el = document.querySelector(`.home-layout__${layout}`);
      return el && window.getComputedStyle(el).display !== 'none';
    }) || 'standalone';
  }

  // Retourne les sélecteurs adaptés au layout actif
  function getSelectors() {
    const activeLayout = getCurrentActiveLayout();
    let prefix = '';
    
    // Contexte spécifique selon le layout
    if (activeLayout === 'sm') {
      prefix = '.home-layout__sm ';
    } else if (activeLayout === 'md') {
      prefix = '.home-layout__md ';
    } else if (activeLayout === 'lg') {
      prefix = '.home-layout__lg ';
    } else if (activeLayout === 'xl') {
      prefix = '.home-layout__xl ';
    }
    // standalone garde prefix vide

    return {
      allSections: `${prefix}.tab-section-item`,
      navLinks: `${prefix}.header-navigation .link--nav, ${prefix}.header-mobile-overlay .link--tab, ${prefix}.tab-menu .link--tab, #mobile-overlay .link--tab`,
      contentContainer: `${prefix}.tab-sections-content`,
      scrollCursor: `${prefix}.tab-sections-scroll-cursor`,
      scrollThumb: `${prefix}#scroll-cursor-thumb`
    };
  }

  // Met à jour les liens pour refléter le hash actif
  function updateCurrentLinks() {
    const currentHash = window.location.hash || defaultHash;
    const { navLinks } = getSelectors();

    document.querySelectorAll(navLinks).forEach(link => {
      link.classList.toggle('current', link.getAttribute('href') === currentHash);
    });
  }

  // Affiche la section correspondante, cache les autres
  function updateSections() {
    const hash = window.location.hash || defaultHash;
    const { allSections } = getSelectors();

    const sections = document.querySelectorAll(allSections);
    if (sections.length === 0) {
      console.warn('⚠️ No sections found with selector:', allSections);
    }

    sections.forEach(section => {
      const isDefault = section.hasAttribute('data-default');
      if (hash === `#${section.id}` || (isDefault && (hash === defaultHash || !window.location.hash))) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });

    // Mettre à jour le scroll cursor après changement de section
    updateScrollCursor();
  }

  // Gestion du scroll cursor avec accessibilité complète
  function updateScrollCursor() {
    const { contentContainer, scrollCursor, scrollThumb } = getSelectors();
    
    const contentEl = document.querySelector(contentContainer);
    const cursorEl = document.querySelector(scrollCursor);
    const thumbEl = document.querySelector(scrollThumb);

    if (!contentEl || !cursorEl || !thumbEl) return;

    // Vérifier si le contenu est scrollable
    const isScrollable = contentEl.scrollHeight > contentEl.clientHeight;
    
    if (!isScrollable) {
      cursorEl.style.opacity = '0';
      cursorEl.setAttribute('aria-hidden', 'true');
      return;
    }

    cursorEl.style.opacity = '1';
    cursorEl.setAttribute('aria-hidden', 'false');

    // Configuration accessibilité du thumb
    thumbEl.setAttribute('tabindex', '0');
    thumbEl.setAttribute('role', 'scrollbar');
    thumbEl.setAttribute('aria-label', 'Barre de défilement vertical');
    thumbEl.setAttribute('aria-orientation', 'vertical');
    
    // Calculer la position du thumb
    function updateThumbPosition() {
      const scrollRatio = contentEl.scrollTop / (contentEl.scrollHeight - contentEl.clientHeight);
      const trackHeight = 525;
      const thumbHeight = 56;
      const maxThumbTop = trackHeight - thumbHeight;
      
      const thumbTop = scrollRatio * maxThumbTop;
      thumbEl.style.top = `${thumbTop}px`;
      
      // Mettre à jour aria-valuenow
      const percentage = Math.round(scrollRatio * 100);
      thumbEl.setAttribute('aria-valuenow', percentage);
      thumbEl.setAttribute('aria-valuemin', '0');
      thumbEl.setAttribute('aria-valuemax', '100');
      thumbEl.setAttribute('aria-valuetext', `${percentage}% défilé`);
    }

    // Variables pour le drag
    let isDragging = false;
    let startY = 0;
    let startThumbTop = 0;
    
    // Respecter prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const speedMultiplier = prefersReducedMotion ? 1 : 1; // Ratio 1:1 accessible
    
    // Curseur par défaut
    thumbEl.style.cursor = 'grab';
    
    // Support clavier
    thumbEl.addEventListener('keydown', (e) => {
      const trackHeight = 525;
      const thumbHeight = 56;
      const maxThumbTop = trackHeight - thumbHeight;
      const contentHeight = contentEl.scrollHeight - contentEl.clientHeight;
      const currentThumbTop = parseInt(thumbEl.style.top) || 0;
      
      let newThumbTop = currentThumbTop;
      
      switch(e.key) {
        case 'ArrowUp':
          newThumbTop = Math.max(0, currentThumbTop - 20); // Petit incrément
          break;
        case 'ArrowDown':
          newThumbTop = Math.min(maxThumbTop, currentThumbTop + 20); // Petit incrément
          break;
        case 'PageUp':
          newThumbTop = Math.max(0, currentThumbTop - 100); // Grand incrément
          break;
        case 'PageDown':
          newThumbTop = Math.min(maxThumbTop, currentThumbTop + 100); // Grand incrément
          break;
        case 'Home':
          newThumbTop = 0; // Début
          break;
        case 'End':
          newThumbTop = maxThumbTop; // Fin
          break;
        default:
          return; // Ignorer les autres touches
      }
      
      e.preventDefault();
      
      // Appliquer le nouveau scroll
      thumbEl.style.top = `${newThumbTop}px`;
      const scrollRatio = newThumbTop / maxThumbTop;
      contentEl.scrollTop = scrollRatio * contentHeight;
      updateThumbPosition(); // Mettre à jour aria-valuenow
    });
    
    thumbEl.addEventListener('mousedown', (e) => {
      isDragging = true;
      thumbEl.style.cursor = 'grabbing';
      
      // Mémoriser la position de départ
      startY = e.clientY;
      startThumbTop = parseInt(thumbEl.style.top) || 0;
      
      e.preventDefault();
      e.stopPropagation();
    });

    // Focus management
    thumbEl.addEventListener('focus', () => {
      thumbEl.style.outline = '2px solid #4a7c59';
      thumbEl.style.outlineOffset = '2px';
    });

    thumbEl.addEventListener('blur', () => {
      thumbEl.style.outline = 'none';
    });

    // Écouter le scroll du contenu (sans conflit avec le drag)
    contentEl.addEventListener('scroll', () => {
      if (!isDragging) { // Seulement si pas en train de dragger
        updateThumbPosition();
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      // Calculer le déplacement depuis le début du drag
      const deltaY = e.clientY - startY;
      const adjustedDelta = deltaY * speedMultiplier; // Ratio 1:1 accessible
      const newThumbTop = startThumbTop + adjustedDelta;
      
      // Contraintes
      const trackHeight = 525;
      const thumbHeight = 56;
      const maxThumbTop = trackHeight - thumbHeight;
      const clampedThumbTop = Math.max(0, Math.min(newThumbTop, maxThumbTop));
      
      // Mettre à jour la position du thumb
      thumbEl.style.top = `${clampedThumbTop}px`;
      
      // Calculer et appliquer le scroll correspondant
      const scrollRatio = clampedThumbTop / maxThumbTop;
      const contentHeight = contentEl.scrollHeight - contentEl.clientHeight;
      const newScrollTop = scrollRatio * contentHeight;
      
      contentEl.scrollTop = newScrollTop;
      updateThumbPosition(); // Mettre à jour aria-valuenow
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        thumbEl.style.cursor = 'grab';
      }
    });

    // Position initiale
    updateThumbPosition();
  }

  // Debug helper pour vérifier le contexte actuel
  function debugCurrentLayout() {
    const activeLayout = getCurrentActiveLayout();
    const selectors = getSelectors();
    console.log(`🔍 Active layout: ${activeLayout}`);
    console.log(`🔍 Selectors:`, selectors);
    console.log(`🔍 Found sections:`, document.querySelectorAll(selectors.allSections).length);
  }

  // Gestion de la redirection avant initialisation
  handleTabRedirect();

  // Init hash par défaut
  if (!window.location.hash) {
    window.location.hash = defaultHash;
  }

  // Initialisation à la charge
  updateCurrentLinks();
  updateSections();
  debugCurrentLayout();

  // Mise à jour au changement de hash
  window.addEventListener('hashchange', () => {
    updateCurrentLinks();
    updateSections();
  });

  // Réinitialisation au resize (layout peut changer)
  window.addEventListener('resize', () => {
    updateCurrentLinks();
    updateSections();
    updateScrollCursor();
    debugCurrentLayout();
  });

  console.log('Tab navigation + scroll cursor ready! 🚀');
});