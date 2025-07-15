/* 
=========================
    HEADER ORGANISM JS
      v1.0 - Charlotte       
=========================
*/

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu functionality
    function initMobileMenu() {
        const burgerToggle = document.getElementById('burger-toggle');
        const mobileOverlay = document.getElementById('mobile-overlay');
        
        if (!burgerToggle || !mobileOverlay) {
            console.warn('Header: Mobile menu elements not found');
            return;
        }
        
        // Toggle mobile menu
        function toggleMobileMenu() {
            const isExpanded = burgerToggle.getAttribute('aria-expanded') === 'true';
            
            // Toggle aria-expanded (pour l'animation des icônes)
            burgerToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle overlay visibility
            if (!isExpanded) {
                mobileOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scroll
            } else {
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = ''; // Restore scroll
            }
        }
        
        // Close mobile menu
        function closeMobileMenu() {
            burgerToggle.setAttribute('aria-expanded', 'false');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Event listeners
        burgerToggle.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking on overlay
        mobileOverlay.addEventListener('click', function(e) {
            if (e.target === mobileOverlay) {
                closeMobileMenu();
            }
        });
        
        // Close menu when clicking on links (laisser la navigation se faire naturellement)
        const mobileLinks = mobileOverlay.querySelectorAll('.link--tab');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Juste fermer le menu, laisser la navigation :target se faire
                closeMobileMenu();
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileOverlay.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Close menu on window resize to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 1025) { // Desktop breakpoint
                closeMobileMenu();
            }
        });
    }
    
    // SUPPRIMÉ : initActiveLinks() - maintenant géré dans tab-sections.js
    // SUPPRIMÉ : initSmoothScroll() - remplacé par la navigation :target
    
    // Initialize header functionality
    initMobileMenu();
    
    console.log('Header Charlotte organism initialized successfully! ⚔️✨');
    
});