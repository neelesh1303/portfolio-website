/**
 * NEELESH KUMAR TRIPATHI — PORTFOLIO CONTROLLER
 * Interactive Project Accordion, Dynamic Scroll Background Blending & Mobile Nav
 */

document.addEventListener('DOMContentLoaded', () => {
  initProjectAccordion();
  initBackgroundScrollController();
  initMobileMenu();
  initHeaderScroll();
  initSmoothScroll();
});

/**
 * 1. Interactive Project Accordion
 * Click any project row to expand its architectural brief & all technologies
 */
function initProjectAccordion() {
  const accordionItems = document.querySelectorAll('.project-accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.project-accordion-header');
    const toggleIcon = item.querySelector('.toggle-icon');

    if (!header) return;

    function toggleAccordion() {
      const isExpanded = item.classList.contains('is-expanded');

      // Toggle current item
      if (isExpanded) {
        item.classList.remove('is-expanded');
        header.setAttribute('aria-expanded', 'false');
        if (toggleIcon) toggleIcon.innerHTML = '+';
      } else {
        item.classList.add('is-expanded');
        header.setAttribute('aria-expanded', 'true');
        if (toggleIcon) toggleIcon.innerHTML = '&minus;';
      }
    }

    header.addEventListener('click', toggleAccordion);

    // Keyboard accessibility
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordion();
      }
    });
  });
}

/**
 * 2. Background Canvas Scroll Controller
 * - Increases background opacity as user scrolls down (0.18 -> 0.56)
 * - Seamlessly cross-fades between the 5 background photos based on active section
 */
function initBackgroundScrollController() {
  const canvas = document.getElementById('fixedBgCanvas');
  const bgLayers = document.querySelectorAll('.bg-canvas-layer');
  const contentBlocks = document.querySelectorAll('.section-content-block[data-bg-index]');

  if (!canvas || bgLayers.length === 0) return;

  let currentActiveIndex = 0;
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateBackground();
        ticking = false;
      });
      ticking = true;
    }
  }

  function updateBackground() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;

    // Top photo on hero has higher opacity as requested (0.50)
    // Subsequent section photos have rich opacity (0.38 - 0.56)
    const heroOpacity = 0.50;
    const targetOpacity = 0.38 + (Math.pow(scrollProgress, 0.85) * 0.18);
    canvas.style.setProperty('--current-bg-opacity', targetOpacity.toFixed(3));

    // Detect which section is currently centered in viewport
    const triggerPoint = window.innerHeight * 0.42;
    let newIndex = 0;

    contentBlocks.forEach(block => {
      const rect = block.getBoundingClientRect();
      if (rect.top <= triggerPoint && rect.bottom >= triggerPoint) {
        newIndex = parseInt(block.getAttribute('data-bg-index'), 10);
      }
    });

    // At the bottom of the page -> activate last layer (layer 4 - bike photo)
    if (scrollProgress > 0.86) {
      newIndex = Math.min(4, bgLayers.length - 1);
    }

    if (newIndex !== currentActiveIndex && newIndex >= 0 && newIndex < bgLayers.length) {
      currentActiveIndex = newIndex;
      bgLayers.forEach((layer, idx) => {
        if (idx === currentActiveIndex) {
          layer.classList.add('active');
        } else {
          layer.classList.remove('active');
        }
      });
    }

    // Apply exact opacities
    bgLayers.forEach((layer, idx) => {
      if (layer.classList.contains('active')) {
        const op = (idx === 0) ? heroOpacity : targetOpacity;
        layer.style.opacity = op.toFixed(3);
      } else {
        layer.style.opacity = '0';
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Initial calculation on load
  updateBackground();
}

/**
 * 3. Mobile Navigation Drawer Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('mobileCloseBtn');
  const drawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/**
 * 4. Header background blur on scroll
 */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * 5. Smooth Anchor Scrolling with Header Offset
 */
function initSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.getElementById('siteHeader')?.offsetHeight || 70;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - (headerHeight - 8);

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
