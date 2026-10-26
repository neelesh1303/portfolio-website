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
 * 2. Subtle Interactive Particle Constellation Canvas
 * Floats gently over the photos without obscuring them, reacts to mouse
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
  const mouse = { x: -1000, y: -1000, radius: 140, isDown: false };
  const shockwaves = [];

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
    const count = width < 768 ? 30 : 60;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.35 + 0.15,
      });
    }
  }

  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  window.addEventListener("click", (e) => {
    shockwaves.push({
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      maxRadius: 150,
      alpha: 0.6,
    });
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Shockwaves
    for (let s = shockwaves.length - 1; s >= 0; s--) {
      const sw = shockwaves[s];
      sw.radius += 4;
      sw.alpha *= 0.94;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 242, 254, ${sw.alpha * 0.3})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (sw.alpha < 0.02 || sw.radius > sw.maxRadius) {
        shockwaves.splice(s, 1);
      }
    }

    // Connect lines
    const maxDist = 110;
    const maxDistSq = maxDist * maxDist;

    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dsq = dx * dx + dy * dy;

        if (dsq < maxDistSq) {
          const dist = Math.sqrt(dsq);
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    // Particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Mouse deflection
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius && dist > 1) {
        const force = (1 - dist / mouse.radius) * 1.5;
        p.vx -= (dx / dist) * force * 0.25;
        p.vy -= (dy / dist) * force * 0.25;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.vy *= 0.99;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 242, 254, ${p.alpha})`;
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

      case "exit":
      case "quit":
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
