/**
 * SVG Loader Utility - ULTRA OPTIMIZED VERSION
 * 
 * Features:
 * - Smart caching system
 * - Critical SVG preloading
 * - Smooth transitions
 * - Zero layout shift
 * - Performance monitoring
 * 
 * @version 6.0 - Ultra Performance
 */

// SVG cache to avoid duplicate requests
const svgCache = new Map();
const loadingPromises = new Map();

// Critical SVGs that should be preloaded immediately
const CRITICAL_SVGS = [
  '/assets/icons/interface/list.svg',
  '/assets/icons/interface/x.svg',
  '/assets/icons/interface/envelope-simple.svg',
  '/assets/icons/interface/device-mobile.svg',
  '/assets/icons/interface/map-pin.svg'
];

/**
 * Preload critical SVGs for instant display
 */
function preloadCriticalSVGs() {
  CRITICAL_SVGS.forEach(path => {
    if (!svgCache.has(path) && !loadingPromises.has(path)) {
      const promise = fetch(path)
        .then(response => {
          if (response.ok) return response.text();
          throw new Error(`HTTP ${response.status}`);
        })
        .then(content => {
          svgCache.set(path, content);
          loadingPromises.delete(path);
          return content;
        })
        .catch(err => {
          console.warn(`Failed to preload ${path}:`, err);
          loadingPromises.delete(path);
        });
      
      loadingPromises.set(path, promise);
    }
  });
}

/**
 * Load SVG with performance optimizations
 */
async function loadSVG(element) {
  const svgPath = element.getAttribute('data-svg-src');
  const originalClasses = element.className || '';
  
  try {
    let svgContent;
    
    // Check cache first
    if (svgCache.has(svgPath)) {
      svgContent = svgCache.get(svgPath);
    } 
    // Check if already loading
    else if (loadingPromises.has(svgPath)) {
      svgContent = await loadingPromises.get(svgPath);
    } 
    // Load fresh
    else {
      const promise = fetch(svgPath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.text();
        })
        .then(content => {
          svgCache.set(svgPath, content);
          return content;
        });
      
      loadingPromises.set(svgPath, promise);
      svgContent = await promise;
      loadingPromises.delete(svgPath);
    }
    
    // Parse SVG
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svg = svgDoc.querySelector('svg');
    
    if (!svg) {
      throw new Error('No SVG element found in content');
    }
    
    // Transfer classes and ensure proper styling
    const existingClasses = svg.getAttribute('class') || '';
    svg.setAttribute('class', `${existingClasses} ${originalClasses}`.trim());
    
    // Ensure color inheritance for your SVGs
    if (!svg.getAttribute('fill') || svg.getAttribute('fill') === 'currentColor') {
      svg.setAttribute('fill', 'currentColor');
    }
    
    // Apply dimensions from container
    const computedStyle = window.getComputedStyle(element);
    const width = computedStyle.width;
    const height = computedStyle.height;
    
    if (width && width !== 'auto') svg.style.width = width;
    if (height && height !== 'auto') svg.style.height = height;
    
    // Smooth transition setup
    svg.style.opacity = '0';
    svg.style.transition = 'opacity 200ms ease-out';
    
    // Replace element
    const parent = element.parentNode;
    parent.replaceChild(svg, element);
    
    // Trigger smooth fade-in
    requestAnimationFrame(() => {
      svg.style.opacity = '1';
    });
    
  } catch (error) {
    console.error(`SVG loading failed for ${svgPath}:`, error);
    
    // Enhanced fallback with proper styling
    const fallback = document.createElement('div');
    fallback.className = originalClasses;
    fallback.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%; opacity: 0.3;">
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1"/>
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3"/>
      </svg>
    `;
    fallback.setAttribute('aria-label', 'Icon failed to load');
    fallback.title = `Failed to load: ${svgPath}`;
    
    element.parentNode.replaceChild(fallback, element);
  }
}

/**
 * Process all pending SVG elements
 */
function loadAllSVGs() {
  const elements = document.querySelectorAll('[data-svg-src]:not([data-svg-loading])');
  
  // Batch process for better performance
  const promises = Array.from(elements).map(element => {
    element.setAttribute('data-svg-loading', 'true');
    return loadSVG(element);
  });
  
  // Optional: Log performance
  if (promises.length > 0) {
    Promise.all(promises).then(() => {
      console.log(`✅ Loaded ${promises.length} SVG icons`);
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Start preloading critical SVGs immediately
  preloadCriticalSVGs();
  
  // Load visible SVGs
  loadAllSVGs();

  // Observer for dynamically added content (optimized)
  const observer = new MutationObserver(mutations => {
    let hasNewSVGs = false;
    
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          if (node.hasAttribute?.('data-svg-src') || 
              node.querySelector?.('[data-svg-src]')) {
            hasNewSVGs = true;
            break;
          }
        }
      }
      if (hasNewSVGs) break;
    }
    
    if (hasNewSVGs) {
      // Debounce for performance
      clearTimeout(observer.timeoutId);
      observer.timeoutId = setTimeout(loadAllSVGs, 50);
    }
  });

  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
  
  // Performance monitoring (optional)
  if (performance.mark) {
    performance.mark('svg-loader-ready');
  }
});