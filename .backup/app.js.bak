/**
 * NEELESH KUMAR TRIPATHI — PORTFOLIO CONTROLLER
 * 1. Fixed Atmospheric 5-Photo Background Cross-Fade & Dynamic Opacity Controller
 * 2. Subtle Interactive Particle Constellation Canvas Overlay
 * 3. Interactive Project Accordion (Architecture Brief, Metrics & Tech Stack)
 * 4. Top Dynamic Reading Progress Bar
 * 5. Animated Metrics Counter on Viewport Entry
 * 6. Dynamic Marquee Scroll Velocity
 * 7. Cyber Terminal Deck (Ctrl+K) with Direct Resume Download Command
 * 8. Mobile Navigation Drawer & Smooth Scrolling
 */

document.addEventListener("DOMContentLoaded", () => {
  initBackgroundScrollController();
  initInteractiveParticleCanvas();
  initProjectAccordion();
  initScrollReadingProgress();
  initMetricsCounterAnimation();
  initMarqueeVelocity();
  initCyberTerminal();
  initHeaderScroll();
  initMobileMenu();
  initSmoothScroll();
  initYear();
});

/**
 * 1. Background Canvas Scroll Controller
 * - Increases background opacity as user scrolls down
 * - Seamlessly cross-fades between the 5 authentic photos based on active section:
 *   Layer 0: neelesh_laptop.jpg (Hero & Statement)
 *   Layer 1: neelesh_pov_laptop.jpg (Tech Stack)
 *   Layer 2: neelesh_stairs.jpg (Projects / Work)
 *   Layer 3: neelesh_cafe.jpg (DSA & Metrics)
 *   Layer 4: neelesh_bike.jpg (Footer & Contact)
 */
function initBackgroundScrollController() {
  const canvas = document.getElementById("fixedBgCanvas");
  const bgLayers = document.querySelectorAll(".bg-canvas-layer");
  const contentBlocks = document.querySelectorAll(".section-content-block[data-bg-index]");

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

    // Top photo on hero has rich opacity (0.50); subsequent photos scale smoothly
    const heroOpacity = 0.50;
    const targetOpacity = 0.40 + Math.pow(scrollProgress, 0.85) * 0.18;
    canvas.style.setProperty("--current-bg-opacity", targetOpacity.toFixed(3));

    // Detect which section is currently centered in viewport
    const viewportCenter = window.innerHeight * 0.45;
    let newIndex = 0;

    contentBlocks.forEach((block) => {
      const rect = block.getBoundingClientRect();
      if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
        newIndex = parseInt(block.getAttribute("data-bg-index"), 10);
      }
    });

    // When scrolled near bottom of page, activate last layer (neelesh_bike.jpg)
    if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 100) {
      newIndex = Math.min(4, bgLayers.length - 1);
    }

    if (newIndex !== currentActiveIndex && newIndex >= 0 && newIndex < bgLayers.length) {
      currentActiveIndex = newIndex;
      bgLayers.forEach((layer, idx) => {
        if (idx === currentActiveIndex) {
          layer.classList.add("active");
        } else {
          layer.classList.remove("active");
        }
      });
    }

    // Apply exact opacities
    bgLayers.forEach((layer, idx) => {
      if (layer.classList.contains("active")) {
        const op = idx === 0 ? heroOpacity : targetOpacity;
        layer.style.opacity = op.toFixed(3);
      } else {
        layer.style.opacity = "0";
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  updateBackground();
}

/**
 * 2. High-Density Dynamic Interactive Particle Constellation Canvas
 * - Generates 150-180 responsive constellation nodes + 60 twinkling micro-stars (200+ dots total)
 * - Dynamic cursor energy filaments that connect nearby particles directly to the mouse
 * - Fluid vortex deflection & kinetic air-wake on mouse sweep
 * - Real-time scroll velocity impulse that surges particles as you navigate sections
 * - Interactive click shockwaves and 12-particle energetic spark bursts
 * - Multi-tiered neon cyber palette (Electric Cyan, Cyber Blue, Azure, Luminous White)
 */
function initInteractiveParticleCanvas() {
  const canvas = document.getElementById("interactiveCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  const particles = [];
  const microDots = [];
  const shockwaves = [];
  const burstSparks = [];

  const mouse = {
    x: -2000,
    y: -2000,
    lastX: -2000,
    lastY: -2000,
    vx: 0,
    vy: 0,
    radius: 165,
    active: false,
  };

  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  let scrollImpulseY = 0;

  // Modern Neon Palette tailored for Neelesh's AI & Systems theme
  const palette = [
    { r: 0, g: 242, b: 254 },    // Electric Cyan
    { r: 56, g: 189, b: 248 },   // Sky / Cyber Blue
    { r: 96, g: 165, b: 250 },   // Deep Neon Azure
    { r: 129, g: 140, b: 248 },  // Electric Indigo
    { r: 255, g: 255, b: 255 },  // Pure Starlight White
  ];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    seedParticles();
  }

  function seedParticles() {
    particles.length = 0;
    microDots.length = 0;

    // High density: scaled dynamically to screen area
    const isMobile = width < 768;
    const mainCount = isMobile
      ? Math.max(Math.floor((width * height) / 9500), 75)
      : Math.min(Math.max(Math.floor((width * height) / 7200), 120), 185);

    const ambientCount = Math.floor(mainCount * 0.45); // Additional ~50-80 ambient micro-dots

    // 1. Interactive Constellation Nodes
    for (let i = 0; i < mainCount; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)];
      const baseSpeed = isMobile ? 0.45 : 0.65;
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 0.6 + 0.3) * baseSpeed;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        baseVx: Math.cos(angle) * speed,
        baseVy: Math.sin(angle) * speed,
        radius: Math.random() * 1.8 + 1.2,
        color: color,
        alpha: Math.random() * 0.45 + 0.35,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.03 + 0.015,
        isHub: Math.random() < 0.12, // 12% of nodes are glowing energy hubs
      });
    }

    // 2. Micro Twinkling Stars (Adds rich celestial depth)
    for (let i = 0; i < ambientCount; i++) {
      microDots.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 0.9 + 0.6,
        baseAlpha: Math.random() * 0.35 + 0.15,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.04 + 0.02,
      });
    }
  }

  window.addEventListener("resize", resize);
  resize();

  // Mouse Movement & Kinetic Wake Tracking
  window.addEventListener("mousemove", (e) => {
    mouse.active = true;
    mouse.vx = (e.clientX - mouse.lastX) * 0.2;
    mouse.vy = (e.clientY - mouse.lastY) * 0.2;
    mouse.lastX = mouse.x;
    mouse.lastY = mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    mouse.active = false;
    mouse.x = -2000;
    mouse.y = -2000;
  });

  // Touch Support for Mobile
  window.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches[0]) {
      mouse.active = true;
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener("touchend", () => {
    mouse.active = false;
    mouse.x = -2000;
    mouse.y = -2000;
  });

  // Scroll Fade: Dots solely on opening Hero page, smoothly fading on scroll down
  function updateCanvasScrollFade() {
    const heroEl = document.getElementById("hero") || document.getElementById("heroWrapper");
    const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight;
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Fades smoothly from 1.0 down to 0 as user scrolls through the Hero section
    const fadeDistance = heroHeight * 0.70;
    const canvasOpacity = Math.max(0, Math.min(1, 1 - (currentScrollY / fadeDistance)));
    canvas.style.opacity = canvasOpacity.toFixed(3);
    canvas.style.visibility = canvasOpacity > 0 ? "visible" : "hidden";
  }

  // Scroll Velocity & Fade: Makes dots react smoothly and fade on scroll
  window.addEventListener("scroll", () => {
    updateCanvasScrollFade();

    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    const deltaY = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    // Cap impulse to keep motion natural and smooth
    scrollImpulseY = Math.max(Math.min(-deltaY * 0.045, 2.5), -2.5);

    particles.forEach((p) => {
      p.vy += scrollImpulseY * (p.radius / 2.5);
    });
  }, { passive: true });

  updateCanvasScrollFade();

  // Interactive Click: Expanding Double Shockwave + 12 Radial Sparks
  window.addEventListener("click", (e) => {
    // 1. Dual Shockwave Rings
    shockwaves.push({
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      maxRadius: 180,
      alpha: 0.8,
      speed: 5.5,
    });

    // 2. Energetic Radial Sparks
    const sparkCount = 12;
    for (let k = 0; k < sparkCount; k++) {
      const angle = (Math.PI * 2 * k) / sparkCount + (Math.random() - 0.5) * 0.4;
      const speed = Math.random() * 4.5 + 2.5;
      burstSparks.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: Math.random() * 0.035 + 0.025,
        radius: Math.random() * 1.6 + 1.2,
      });
    }

    // 3. Impart direct impulse to particles near click
    particles.forEach((p) => {
      const dx = p.x - e.clientX;
      const dy = p.y - e.clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200 && dist > 2) {
        const force = (1 - dist / 200) * 8.0;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    });
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // 1. RENDER & UPDATE SHOCKWAVES
    for (let s = shockwaves.length - 1; s >= 0; s--) {
      const sw = shockwaves[s];
      sw.radius += sw.speed;
      sw.alpha *= 0.94;

      // Outer ring
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 242, 254, ${sw.alpha * 0.5})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Inner faint harmonic ring
      if (sw.radius > 20) {
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius * 0.65, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(96, 165, 250, ${sw.alpha * 0.35})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }

      if (sw.alpha < 0.015 || sw.radius > sw.maxRadius) {
        shockwaves.splice(s, 1);
      }
    }

    // 2. RENDER & UPDATE BURST SPARKS
    for (let b = burstSparks.length - 1; b >= 0; b--) {
      const sp = burstSparks[b];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.vx *= 0.96;
      sp.vy *= 0.96;
      sp.life -= sp.decay;

      if (sp.life <= 0) {
        burstSparks.splice(b, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.radius * sp.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 242, 254, ${sp.life * 0.9})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#00f2fe";
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 3. RENDER AMBIENT TWINKLING MICRO-DOTS
    for (let m = 0; m < microDots.length; m++) {
      const md = microDots[m];
      md.x += md.vx;
      md.y += md.vy;
      md.phase += md.speed;

      if (md.x < 0) md.x = width;
      if (md.x > width) md.x = 0;
      if (md.y < 0) md.y = height;
      if (md.y > height) md.y = 0;

      const alpha = md.baseAlpha + Math.sin(md.phase) * 0.2;
      ctx.beginPath();
      ctx.arc(md.x, md.y, md.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(186, 230, 253, ${Math.max(alpha, 0.05).toFixed(3)})`;
      ctx.fill();
    }

    // 4. DRAW CONSTELLATION CONNECTION LINES
    const maxDist = width < 768 ? 95 : 125;
    const maxDistSq = maxDist * maxDist;
    const pLen = particles.length;

    for (let i = 0; i < pLen; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < pLen; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dsq = dx * dx + dy * dy;

        if (dsq < maxDistSq) {
          const dist = Math.sqrt(dsq);
          const factor = 1 - dist / maxDist;
          const alpha = factor * factor * 0.20; // Crisp quadratic alpha falloff

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }
    }

    // 5. DRAW DYNAMIC ENERGY FILAMENTS TO MOUSE CURSOR
    if (mouse.active) {
      const mouseMaxDist = 160;
      const mouseMaxDistSq = mouseMaxDist * mouseMaxDist;

      for (let i = 0; i < pLen; i++) {
        const p = particles[i];
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dsq = dx * dx + dy * dy;

        if (dsq < mouseMaxDistSq) {
          const dist = Math.sqrt(dsq);
          const factor = 1 - dist / mouseMaxDist;
          const beamAlpha = (factor * 0.38).toFixed(3);

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${beamAlpha})`;
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }
      }

      // Small glowing beacon around cursor
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 242, 254, 0.75)";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#00f2fe";
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 6. UPDATE & RENDER INTERACTIVE CONSTELLATION PARTICLES
    for (let i = 0; i < pLen; i++) {
      const p = particles[i];

      // Mouse Proximity Deflection & Tangential Vortex
      if (mouse.active) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 1) {
          const force = (1 - dist / mouse.radius);
          // Radial repulsion
          const repelX = -(dx / dist) * force * 1.8;
          const repelY = -(dy / dist) * force * 1.8;

          // Gentle tangential swirl
          const swirlX = -(dy / dist) * force * 0.6;
          const swirlY = (dx / dist) * force * 0.6;

          p.vx += repelX + swirlX;
          p.vy += repelY + swirlY;
        }
      }

      // Natural damping & return to drift
      p.x += p.vx;
      p.y += p.vy;
      p.vx = p.vx * 0.98 + p.baseVx * 0.02;
      p.vy = p.vy * 0.98 + p.baseVy * 0.02;

      // Screen Wrapping with smooth re-entry
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      // Pulsing brightness
      p.pulsePhase += p.pulseSpeed;
      const pulseMod = Math.sin(p.pulsePhase) * 0.15;
      const currentAlpha = Math.max(Math.min(p.alpha + pulseMod, 0.85), 0.20);
      const c = p.color;

      // Glowing Hub Nodes have a radial aura
      if (p.isHub) {
        const glowRad = p.radius * 3.5;
        const radGrad = ctx.createRadialGradient(p.x, p.y, p.radius * 0.5, p.x, p.y, glowRad);
        radGrad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${(currentAlpha * 0.6).toFixed(3)})`);
        radGrad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRad, 0, Math.PI * 2);
        ctx.fillStyle = radGrad;
        ctx.fill();
      }

      // Draw Main Dot Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${currentAlpha.toFixed(3)})`;
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

/**
 * 3. Interactive Project Accordion
 * Click any project row to expand its architectural brief & all technologies
 */
function initProjectAccordion() {
  const accordionItems = document.querySelectorAll(".project-accordion-item");

  accordionItems.forEach((item) => {
    const header = item.querySelector(".project-accordion-header");
    const toggleIcon = item.querySelector(".toggle-icon");
    const toggleText = item.querySelector(".toggle-text");

    if (!header) return;

    function toggleAccordion() {
      const isExpanded = item.classList.contains("is-expanded");

      if (isExpanded) {
        item.classList.remove("is-expanded");
        header.setAttribute("aria-expanded", "false");
        if (toggleIcon) toggleIcon.innerHTML = "+";
        if (toggleText) toggleText.textContent = "View Architecture";
      } else {
        item.classList.add("is-expanded");
        header.setAttribute("aria-expanded", "true");
        if (toggleIcon) toggleIcon.innerHTML = "&minus;";
        if (toggleText) toggleText.textContent = "Close Architecture";
      }
    }

    header.addEventListener("click", toggleAccordion);

    header.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleAccordion();
      }
    });
  });
}

/**
 * 4. Top Reading Progress Bar
 */
function initScrollReadingProgress() {
  const progress = document.getElementById("scrollProgress");
  if (!progress) return;

  window.addEventListener(
    "scroll",
    () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const pct = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        progress.style.width = pct + "%";
      }
    },
    { passive: true }
  );
}

/**
 * 5. Animated Numbers on DSA & Metrics Viewport Entry
 */
function initMetricsCounterAnimation() {
  const dsaSection = document.getElementById("dsa");
  if (!dsaSection) return;

  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateStatCounters();
          observer.unobserve(dsaSection);
        }
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(dsaSection);

  function animateStatCounters() {
    const statItem = document.querySelector('.dsa-big-stat[data-target="500"]');
    if (!statItem) return;

    let current = 0;
    const target = 500;
    const duration = 1200;
    const stepTime = 25;
    const increment = Math.ceil(target / (duration / stepTime));

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
        statItem.textContent = "500+";
      } else {
        statItem.textContent = current + "+";
      }
    }, stepTime);
  }
}

/**
 * 6. Dynamic Marquee Velocity Tracking
 */
function initMarqueeVelocity() {
  const marqueeTrack = document.querySelector(".hero-marquee-track");
  if (!marqueeTrack) return;

  let lastScrollY = window.pageYOffset;
  let scrollTimeout = 0;

  window.addEventListener(
    "scroll",
    () => {
      const currentScrollY = window.pageYOffset;
      const delta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      if (delta > 2) {
        marqueeTrack.style.animationDuration = "14s";
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          marqueeTrack.style.animationDuration = "28s";
        }, 150);
      }
    },
    { passive: true }
  );
}

/**
 * 7. Cyber Terminal Command Deck (Ctrl+K)
 */
function initCyberTerminal() {
  const modal = document.getElementById("terminalModal");
  const input = document.getElementById("terminalInput");
  const output = document.getElementById("terminalOutput");
  const triggerBtn = document.getElementById("terminalTriggerBtn");
  const closeBtn = document.getElementById("terminalCloseBtn");
  const closeX = document.getElementById("terminalCloseX");

  if (!modal || !input) return;

  const history = [];
  let historyIdx = -1;

  function open() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => input.focus(), 120);
  }

  function close() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (triggerBtn) triggerBtn.addEventListener("click", open);
  if (closeBtn) closeBtn.addEventListener("click", close);
  if (closeX) closeX.addEventListener("click", close);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (modal.classList.contains("open")) close();
      else open();
    } else if (e.key === "Escape" && modal.classList.contains("open")) {
      close();
    }
  });

  function printLine(html) {
    if (!output) return;
    const div = document.createElement("div");
    div.className = "term-line-output";
    div.innerHTML = html;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  }

  function execute(cmd) {
    const raw = cmd.trim();
    if (!raw) return;
    const lower = raw.toLowerCase();

    printLine(`<span class="terminal-prompt">neelesh@dev:~$</span> ${escapeHTML(raw)}`);

    switch (lower) {
      case "help":
        printLine(`
          <strong>AVAILABLE COMMANDS:</strong><br/>
          &bull; <span class="term-accent">resume</span> &mdash; Download official resume PDF directly<br/>
          &bull; <span class="term-accent">projects</span> &mdash; Overview of Crackd, LLM Gateway, SignBridge, FinNIE<br/>
          &bull; <span class="term-accent">crackd</span> &mdash; Placement ecosystem &amp; Gemini RAG details<br/>
          &bull; <span class="term-accent">gateway</span> &mdash; LLM Cost &amp; Latency Optimizer Gateway<br/>
          &bull; <span class="term-accent">skills</span> &mdash; Breakdown of 6 engineering technical domains<br/>
          &bull; <span class="term-accent">metrics</span> &mdash; DSA problem count, ratings, and CGPA<br/>
          &bull; <span class="term-accent">contact</span> &mdash; Email, phone, LinkedIn, GitHub channels<br/>
          &bull; <span class="term-accent">clear</span> &mdash; Clean terminal output screen<br/>
          &bull; <span class="term-accent">exit</span> &mdash; Close terminal deck
        `);
        break;

      case "resume":
      case "cv":
        printLine(`
          <span class="term-accent">Starting direct download of Neelesh_Kumar_Tripathi_Resume.pdf...</span><br/>
          File: assets/Neelesh_Kumar_Tripathi_Resume.pdf (77 KB)
        `);
        const a = document.createElement("a");
        a.href = "assets/Neelesh_Kumar_Tripathi_Resume.pdf";
        a.download = "Neelesh_Kumar_Tripathi_Resume.pdf";
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        break;

      case "whoami":
        printLine(`
          <strong>NEELESH KUMAR TRIPATHI</strong><br/>
          Information Science @ The National Institute of Engineering, Mysuru (CGPA: 8.60 / 10).<br/>
          500+ DSA problems solved across LeetCode (~1533 rating) and Codolio.<br/>
          Passionate about building production distributed backends, LLM gateways, and dense semantic caching.
        `);
        break;

      case "projects":
        printLine(`
          <strong>PRODUCTION PROJECTS:</strong><br/>
          1. <strong>Crackd:</strong> MERN AI Placement Assistance Platform (Gemini RAG + Redis Cache)<br/>
             Live Demo: <a href="https://crackd-placement-assistance-platfor.vercel.app/" target="_blank" class="term-accent">crackd-placement-assistance-platfor.vercel.app ↗</a><br/>
          2. <strong>LLM Cost Optimizer:</strong> ~4ms Latency, 100% Token Savings, Sentence-Transformers &amp; Groq<br/>
             Source: <a href="https://github.com/neelesh1303/LLM_COST_AND_LATENCY_OPTIMIZER" target="_blank" class="term-accent">github.com/neelesh1303/... ↗</a><br/>
          3. <strong>SignBridge:</strong> DevJams VIT 4th Winner, 30+ FPS Skeleton Tracking, Whisper ASR<br/>
             Source: <a href="https://github.com/neelesh1303" target="_blank" class="term-accent">github.com/neelesh1303 ↗</a><br/>
          4. <strong>FinNIE:</strong> Campus Item Locator with MySQL (~10ms) &amp; Rate-Limiting<br/>
             Source: <a href="https://github.com/neelesh1303/FinNIE-lost-and-found-item-tracker" target="_blank" class="term-accent">github.com/neelesh1303/... ↗</a>
        `);
        break;

      case "skills":
        printLine(`
          <strong>CORE TECHNICAL SKILLS:</strong><br/>
          &bull; <strong>Languages:</strong> C++17 (STL), Python 3.x, JavaScript (ES6+), SQL, Java, C, NumPy, Pydantic<br/>
          &bull; <strong>AI/LLM:</strong> Google Gemini API, Sentence-Transformers, Semantic Vector Caching, RAG, Groq LPUs<br/>
          &bull; <strong>Backend:</strong> FastAPI, Node.js, Express.js, Flask, RESTful APIs, JWT Auth, Flask-Limiter<br/>
          &bull; <strong>Databases:</strong> Redis (Cache-Aside), MongoDB, MySQL (~10ms), SQLite Vector Store<br/>
          &bull; <strong>DevOps/Tools:</strong> Git, GitHub Actions (CI/CD), Jest, Supertest, Postman, Vercel, Render
        `);
        break;

      case "metrics":
        printLine(`
          <strong>ACHIEVEMENTS &amp; METRICS:</strong><br/>
          &bull; <strong>500+</strong> Problems Solved across LeetCode, GFG &amp; Codolio<br/>
          &bull; <strong>~1533</strong> LeetCode Global Contest Rating<br/>
          &bull; <strong>4th Rank</strong> out of 100+ national teams at DevJams VIT Hackathon<br/>
          &bull; <strong>8.60 / 10</strong> CGPA in Information Science @ NIE Mysuru
        `);
        break;

      case "contact":
        printLine(`
          <strong>DIRECT CONTACT:</strong><br/>
          &bull; Email: <a href="mailto:neeleshtripathi36@gmail.com" class="term-accent">neeleshtripathi36@gmail.com</a><br/>
          &bull; Phone: <a href="tel:+916387974286" class="term-accent">+91 6387974286</a><br/>
          &bull; LinkedIn: <a href="https://linkedin.com/in/neelesh-kumar-tripathi" target="_blank" class="term-accent">linkedin.com/in/neelesh-kumar-tripathi ↗</a><br/>
          &bull; GitHub: <a href="https://github.com/neelesh1303" target="_blank" class="term-accent">github.com/neelesh1303 ↗</a><br/>
          &bull; Codolio: <a href="https://codolio.com/profile/neelesh1303" target="_blank" class="term-accent">codolio.com/profile/neelesh1303 ↗</a>
        `);
        break;

      case "clear":
        output.innerHTML = `
          <div class="term-line-output system-banner">
            Screen cleared. Type <span class="term-accent">help</span> for commands or <span class="term-accent">ESC</span> to exit.
          </div>
        `;
        break;

      case "esc":
      case "escape":
      case "exit":
      case "quit":
      case "close":
        close();
        break;

      default:
        printLine(`Command not recognized: <span class="term-accent">${escapeHTML(raw)}</span>. Type <span class="term-accent">help</span> or <span class="term-accent">resume</span>.`);
        break;
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, (tag) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    }[tag] || tag));
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const val = input.value;
      if (val.trim()) {
        history.push(val);
        historyIdx = history.length;
        execute(val);
        input.value = "";
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIdx > 0) {
        historyIdx--;
        input.value = history[historyIdx] || "";
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx < history.length - 1) {
        historyIdx++;
        input.value = history[historyIdx] || "";
      } else {
        historyIdx = history.length;
        input.value = "";
      }
    }
  });
}

/**
 * 8. Header background blur on scroll
 */
function initHeaderScroll() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 40) {
            header.classList.add("scrolled");
          } else {
            header.classList.remove("scrolled");
          }
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
}

/**
 * 9. Mobile Navigation Drawer Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobileMenuBtn");
  const closeBtn = document.getElementById("mobileCloseBtn");
  const drawer = document.getElementById("mobileDrawer");
  const drawerLinks = document.querySelectorAll(".mobile-nav-link");

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add("open");
    toggleBtn.classList.add("active");
    toggleBtn.setAttribute("aria-expanded", "true");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    toggleBtn.classList.remove("active");
    toggleBtn.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  toggleBtn.addEventListener("click", () => {
    if (drawer.classList.contains("open")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  drawerLinks.forEach((link) => link.addEventListener("click", closeDrawer));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) {
      closeDrawer();
    }
  });
}

/**
 * 10. Smooth Anchor Scrolling with Header Offset
 */
function initSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.getElementById("siteHeader")?.offsetHeight || 70;
        const targetPosition =
          targetEl.getBoundingClientRect().top + window.pageYOffset - (headerHeight - 8);

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

/**
 * 11. Year Auto-Updater
 */
function initYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
}
