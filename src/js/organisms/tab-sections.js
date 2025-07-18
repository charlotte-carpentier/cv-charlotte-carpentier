document.addEventListener('DOMContentLoaded', () => {
  const defaultHash = '#portfolio';

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
      prefix = '.home-layout__lg .lg-tab-sections-wrapper ';
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
  }

  // Debug helper pour vérifier le contexte actuel
  function debugCurrentLayout() {
    const activeLayout = getCurrentActiveLayout();
    const selectors = getSelectors();
    console.log(`🔍 Active layout: ${activeLayout}`);
    console.log(`🔍 Selectors:`, selectors);
    console.log(`🔍 Found sections:`, document.querySelectorAll(selectors.allSections).length);
  }

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
    debugCurrentLayout();
  });

  console.log('Tab navigation ready! 🚀');
});