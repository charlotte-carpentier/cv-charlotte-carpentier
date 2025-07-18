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
        const burgerIconOpen = burgerToggle?.querySelector('.burger-icon-open');
        const burgerIconClose = burgerToggle?.querySelector('.burger-icon-close');
        
        if (!burgerToggle || !mobileOverlay || !burgerIconOpen || !burgerIconClose) {
            console.warn('Header: Mobile menu elements not found');
            return;
        }
        
        // Initialize burger icons styles
        function initBurgerStyles() {
            // Initial state - open icon visible, close icon hidden
            burgerIconOpen.style.opacity = '1';
            burgerIconOpen.style.transition = 'none';
            
            burgerIconClose.style.opacity = '0';
            burgerIconClose.style.transition = 'none';
        }
        
        // Initialize mobile overlay styles
        function initOverlayStyles() {
            // Initial state - overlay hidden
            mobileOverlay.style.display = 'none';
            mobileOverlay.style.opacity = '0';
            mobileOverlay.style.visibility = 'hidden';
            mobileOverlay.style.transform = 'translateY(-5px)';
            mobileOverlay.style.transition = 'opacity 0.3s ease';
            mobileOverlay.style.zIndex = '1';
            
            // Responsive positioning
            if (window.innerWidth <= 639) {
                mobileOverlay.style.top = '75px';
            } else {
                mobileOverlay.style.top = '87px';
            }
        }
        
        // Toggle mobile menu
        function toggleMobileMenu() {
            const isExpanded = burgerToggle.getAttribute('aria-expanded') === 'true';
            
            // Toggle aria-expanded
            burgerToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle burger icons
            if (!isExpanded) {
                // Menu opening
                burgerIconOpen.style.opacity = '0';
                burgerIconClose.style.opacity = '1';
            } else {
                // Menu closing
                burgerIconOpen.style.opacity = '1';
                burgerIconClose.style.opacity = '0';
            }
            
            // Toggle overlay visibility
            if (!isExpanded) {
                // Show overlay
                mobileOverlay.style.display = 'block';
                mobileOverlay.style.opacity = '1';
                mobileOverlay.style.visibility = 'visible';
                mobileOverlay.style.transform = 'translateY(0)';
                mobileOverlay.style.zIndex = '50';
                document.body.style.overflow = 'hidden';
            } else {
                // Hide overlay
                mobileOverlay.style.display = 'none';
                mobileOverlay.style.opacity = '0';
                mobileOverlay.style.visibility = 'hidden';
                mobileOverlay.style.transform = 'translateY(-5px)';
                mobileOverlay.style.zIndex = '1';
                document.body.style.overflow = '';
            }
        }
        
        // Close mobile menu
        function closeMobileMenu() {
            burgerToggle.setAttribute('aria-expanded', 'false');
            
            // Reset burger icons
            burgerIconOpen.style.opacity = '1';
            burgerIconClose.style.opacity = '0';
            
            // Hide overlay
            mobileOverlay.style.display = 'none';
            mobileOverlay.style.opacity = '0';
            mobileOverlay.style.visibility = 'hidden';
            mobileOverlay.style.transform = 'translateY(-5px)';
            mobileOverlay.style.zIndex = '1';
            document.body.style.overflow = '';
        }
        
        // Handle window resize
        function handleResize() {
            // Update overlay positioning
            if (window.innerWidth <= 639) {
                mobileOverlay.style.top = '75px';
            } else {
                mobileOverlay.style.top = '87px';
            }
            
            // Close menu on desktop
            if (window.innerWidth >= 1025) {
                closeMobileMenu();
            }
        }
        
        // Initialize styles
        initBurgerStyles();
        initOverlayStyles();
        
        // Event listeners
        burgerToggle.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking on overlay
        mobileOverlay.addEventListener('click', function(e) {
            if (e.target === mobileOverlay) {
                closeMobileMenu();
            }
        });
        
        // Close menu when clicking on links
        const mobileLinks = mobileOverlay.querySelectorAll('.link--tab');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileOverlay.style.opacity === '1') {
                closeMobileMenu();
            }
        });
        
        // Handle resize
        window.addEventListener('resize', handleResize);
    }
    
    // Contact link active state management
    function initContactActiveState() {
        const contactLink = document.querySelector('.header-navigation .link--nav');
        
        if (!contactLink) {
            console.warn('Header: Contact link not found');
            return;
        }
        
        // Update contact link active state
        function updateContactActiveState() {
            const currentHash = window.location.hash;
            const contactSection = document.querySelector('#contact');
            
            // Check if contact section is currently visible/active
            if (currentHash === '#contact' || 
                (contactSection && contactSection.style.display === 'block')) {
                contactLink.classList.add('current');
                contactLink.setAttribute('aria-current', 'page');
            } else {
                contactLink.classList.remove('current');
                contactLink.removeAttribute('aria-current');
            }
        }
        
        // Initial check
        updateContactActiveState();
        
        // Listen for hash changes
        window.addEventListener('hashchange', updateContactActiveState);
        
        // Listen for tab menu clicks to update state
        const tabMenuLinks = document.querySelectorAll('.tab-menu .link--tab');
        tabMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Small delay to ensure the tab change has occurred
                setTimeout(updateContactActiveState, 100);
            });
        });
        
        // Observer for tab-section visibility changes (fallback)
        if (window.MutationObserver) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && 
                        mutation.attributeName === 'style' &&
                        mutation.target.id === 'contact') {
                        updateContactActiveState();
                    }
                });
            });
            
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                observer.observe(contactSection, { 
                    attributes: true, 
                    attributeFilter: ['style'] 
                });
            }
        }
    }
    
    // Initialize header functionality
    initMobileMenu();
    initContactActiveState();
    
    console.log('Header Charlotte organism initialized successfully! ⚔️✨');
    
});