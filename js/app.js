/**
 * NEELESH KUMAR TRIPATHI — PORTFOLIO CONTROLLER
 * 1. High-Performance Dev Commands & Particle Collision Engine
 *    - Floating dev command tokens (git push, docker up, fastapi, etc.) & glowing dots
 *    - Converges and collides into center hero portrait to form the photo
 *    - Impact shockwaves, burst sparks, and filter unblur reveal
 *    - Ambient post-collision drifting with kinetic mouse interactivity
 *    - Replay collision trigger (button & terminal command)
 * 2. Project Architecture Drawer Toggle
 * 3. Top Dynamic Reading Progress Bar
 * 4. Animated Numerical Metrics Counter
 * 5. Interactive Cyber Terminal (Ctrl+K) with Crimson Theme & Custom Commands
 * 6. Mobile Navigation Drawer & Smooth Scrolling
 */

document.addEventListener("DOMContentLoaded", () => {
  initDevCommandCanvas();
  initProjectArchitectureToggles();
  initScrollReadingProgress();
  initMetricsCounterAnimation();
  initCyberTerminal();
  initMobileMenu();
  initSmoothScroll();
  initYear();
});

/* ==========================================================================
   1. DEV COMMANDS & PARTICLE COLLISION ENGINE
   ========================================================================== */
function initDevCommandCanvas() {
  const canvas = document.getElementById("devCommandCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const photoImg = document.getElementById("heroPhotoImg");
  const scanBeam = document.querySelector(".portrait-scanline-beam");
  const burstFx = document.getElementById("collisionBurstFx");
  const statusLabel = document.getElementById("statusLabel");
  const statusDot = document.getElementById("statusIndicatorDot");
  const recollideBtn = document.getElementById("recollideBtn");

  let width = 0;
  let height = 0;
  let dpr = 1;

  // Short, authentic dev commands aligned with resume stack
  const COMMAND_LIST = [
    "git push", "fastapi dev", "redis-cli", "O(log N)", "npm run dev",
    "curl -X POST", "SELECT *", "g++ -O3", "dijkstra()", "pip install",
    "uvicorn", "jwt.sign()", "pydantic", "async def", "res.json()",
    "vector<int>", "git commit", "cosine_sim()", "gemini-1.5", "groq LPU",
    "MongoDB", "MySQL", "SQLite", "Express", "Python 3.x", "C++ STL",
    "GitHub Actions", "Redis cache", "RAG pipeline", "FastAPI", "Jest test",
    "Supertest", "RESTful API", "NumPy", "Sentence-Transformers", "OpenRouter"
  ];

  const particles = [];
  const shockwaves = [];
  const burstSparks = [];

  const mouse = {
    x: -3000,
    y: -3000,
    radius: 140,
    active: false,
  };

  // State: "floating" -> "colliding" -> "impact" -> "ambient"
  let animState = "floating";
  let stateTimer = 0;
  let targetX = 0;
  let targetY = 0;
  let isCollided = false;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    updateTargetCoords();
  }

  function updateTargetCoords() {
    if (photoImg) {
      const rect = photoImg.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;
    } else {
      targetX = width / 2;
      targetY = height * 0.45;
    }
  }

  function createParticles() {
    particles.length = 0;
    const isMobile = width < 768;
    const commandCount = isMobile ? 22 : 38;
    const dotCount = isMobile ? 45 : 85;

    // 1. Text Command Particles
    for (let i = 0; i < commandCount; i++) {
      const text = COMMAND_LIST[i % COMMAND_LIST.length];
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.6 + 0.35;

      particles.push({
        type: "command",
        text: text,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: Math.random() * 0.45 + 0.45,
        targetAlpha: 0.85,
        color: i % 3 === 0 ? "#ef233c" : (i % 3 === 1 ? "#ff4d6d" : "#ffffff"),
        collided: false,
        size: isMobile ? 10 : 12,
      });
    }

    // 2. Glowing Dot Particles
    for (let i = 0; i < dotCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.8 + 0.4;
      const isCrimson = Math.random() > 0.3;

      particles.push({
        type: "dot",
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 2 + 1.2,
        alpha: Math.random() * 0.5 + 0.3,
        color: isCrimson ? "rgba(239, 35, 60," : "rgba(255, 255, 255,",
        collided: false,
      });
    }
  }

  let convergenceTimeout = null;

  function triggerAssemblySequence() {
    animState = "floating";
    stateTimer = performance.now();
    isCollided = false;

    if (photoImg) {
      photoImg.classList.remove("photo-assembled");
    }
    if (statusLabel) statusLabel.textContent = "Dev Commands Floating...";
    if (statusDot) statusDot.style.background = "#ff4d6d";

    createParticles();

    // Clear any pending convergence timeout
    if (convergenceTimeout) clearTimeout(convergenceTimeout);

    // After 650ms of floating, begin convergence towards center photo
    setTimeout(() => {
      animState = "colliding";
      if (statusLabel) statusLabel.textContent = "Colliding into Portrait...";
      if (statusDot) statusDot.style.background = "#ef233c";

      // Safety timeout: ensure collision triggers within 1.8s
      convergenceTimeout = setTimeout(() => {
        if (!isCollided) {
          onPhotoCollided();
        }
      }, 1800);
    }, 650);
  }

  function onPhotoCollided() {
    if (isCollided) return;
    isCollided = true;
    animState = "impact";
    if (convergenceTimeout) clearTimeout(convergenceTimeout);

    // 1. Reveal Center Photo with Filter, Glow and Scale Transition
    if (photoImg) {
      photoImg.classList.add("photo-assembled");
    }
    if (scanBeam) {
      scanBeam.classList.remove("scan");
      void scanBeam.offsetWidth; // Trigger reflow
      scanBeam.classList.add("scan");
    }
    if (burstFx) {
      burstFx.classList.remove("active");
      void burstFx.offsetWidth;
      burstFx.classList.add("active");
    }

    // 2. Canvas Shockwave Rings Expanding Outward
    shockwaves.push({
      x: targetX,
      y: targetY,
      radius: 15,
      maxRadius: 320,
      alpha: 1.0,
      speed: 11,
      color: "239, 35, 60"
    });
    shockwaves.push({
      x: targetX,
      y: targetY,
      radius: 8,
      maxRadius: 240,
      alpha: 0.9,
      speed: 8,
      color: "255, 255, 255"
    });

    // 3. Spawn explosive burst sparks
    for (let i = 0; i < 36; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 10 + 4;
      burstSparks.push({
        x: targetX,
        y: targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 2.5 + 1.5,
        alpha: 1.0,
        decay: Math.random() * 0.03 + 0.02,
        color: Math.random() > 0.4 ? "#ef233c" : "#ffffff"
      });
    }

    if (statusLabel) statusLabel.textContent = "⚡ Assembled • Dev Commands Online";
    if (statusDot) statusDot.style.background = "#10b981";

    // 4. "after colliding the photo must appear and then the dots (commands) must again start floating dynamically back"
    // Disperse particles radially outward from collision center back across the canvas
    setTimeout(() => {
      animState = "ambient";

      particles.forEach((p, idx) => {
        const angle = (idx / particles.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
        // Strong outward burst velocity so they spread back across the screen dynamically
        const burstSpeed = p.type === "command"
          ? (Math.random() * 4.5 + 2.8)
          : (Math.random() * 6.5 + 3.8);

        p.vx = Math.cos(angle) * burstSpeed;
        p.vy = Math.sin(angle) * burstSpeed;
        p.x = targetX + Math.cos(angle) * (Math.random() * 30 + 15);
        p.y = targetY + Math.sin(angle) * (Math.random() * 30 + 15);
        p.collided = false;
        p.alpha = p.type === "command" ? (Math.random() * 0.35 + 0.55) : (Math.random() * 0.4 + 0.35);
      });
    }, 280);
  }

  // Animation Loop (60 FPS)
  function animate() {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, width, height);

    // Dynamic target update in case of scroll or resize
    updateTargetCoords();

    // 1. Draw Shockwave Rings
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.radius += sw.speed;
      sw.alpha -= 0.025;

      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
        shockwaves.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${sw.color}, ${sw.alpha * 0.8})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // 2. Draw Burst Sparks
    for (let i = burstSparks.length - 1; i >= 0; i--) {
      const sp = burstSparks[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.vx *= 0.94;
      sp.vy *= 0.94;
      sp.alpha -= sp.decay;

      if (sp.alpha <= 0) {
        burstSparks.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
      ctx.fillStyle = sp.color;
      ctx.globalAlpha = sp.alpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = sp.color;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    // 3. Update & Draw Particles
    let collidedCount = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (animState === "floating" || animState === "ambient") {
        // Natural dynamic ambient drift
        p.x += p.vx;
        p.y += p.vy;

        // Bounce at screen boundaries with clean rebound
        if (p.x < 15) { p.x = 15; p.vx = Math.abs(p.vx); }
        if (p.x > width - 15) { p.x = width - 15; p.vx = -Math.abs(p.vx); }
        if (p.y < 15) { p.y = 15; p.vy = Math.abs(p.vy); }
        if (p.y > height - 15) { p.y = height - 15; p.vy = -Math.abs(p.vy); }

        // Interactive mouse deflection
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.hypot(mdx, mdy);
          if (mdist < mouse.radius && mdist > 0) {
            const force = (mouse.radius - mdist) / mouse.radius;
            p.vx += (mdx / mdist) * force * 1.5;
            p.vy += (mdy / mdist) * force * 1.5;
          }
        }

        // Smooth cruise velocity governor: gracefully settle high burst speeds into steady dynamic floating drift
        const currentSpeed = Math.hypot(p.vx, p.vy);
        const cruiseSpeed = p.type === "command" ? 0.75 : 0.95;
        if (currentSpeed > cruiseSpeed) {
          p.vx *= 0.985;
          p.vy *= 0.985;
        } else if (currentSpeed < 0.35) {
          p.vx *= 1.04;
          p.vy *= 1.04;
        }

      } else if (animState === "colliding") {
        // High-velocity gravitational vortex pull toward center portrait
        const dx = targetX - p.x;
        const dy = targetY - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 35) {
          const pull = Math.min(18, Math.max(3.5, (dist / width) * 25));
          const swirl = (dist / width) * 4;

          p.vx += (dx / dist) * pull * 0.08 + (-dy / dist) * swirl * 0.04;
          p.vy += (dy / dist) * pull * 0.08 + (dx / dist) * swirl * 0.04;

          p.vx *= 0.94;
          p.vy *= 0.94;

          p.x += p.vx * 1.6;
          p.y += p.vy * 1.6;
        } else {
          // Inside collision radius!
          p.collided = true;
          collidedCount++;
          // Float tightly inside the portrait area
          p.x += (Math.random() - 0.5) * 1.5;
          p.y += (Math.random() - 0.5) * 1.5;
        }
      }

      // Draw Particle
      if (p.type === "command") {
        // Draw Dev Command Text
        ctx.font = `600 ${p.size}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;

        // Draw indicator dot
        ctx.beginPath();
        ctx.arc(p.x - 6, p.y - 3, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ef233c";
        ctx.shadowBlur = 6;
        ctx.shadowColor = "#ef233c";
        ctx.fill();
        ctx.shadowBlur = 0;

        // Text label
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, p.x, p.y);
        ctx.globalAlpha = 1;

      } else {
        // Draw Glowing Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.shadowBlur = p.color.includes("239") ? 7 : 3;
        ctx.shadowColor = p.color.includes("239") ? "#ef233c" : "#ffffff";
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Check if majority of particles converged
    if (animState === "colliding" && collidedCount >= particles.length * 0.75) {
      onPhotoCollided();
    }
  }

  // Event Listeners
  window.addEventListener("resize", () => {
    resize();
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener("mouseleave", () => {
    mouse.active = false;
  });

  window.addEventListener("click", (e) => {
    // Shockwave ripple on click
    shockwaves.push({
      x: e.clientX,
      y: e.clientY,
      radius: 10,
      maxRadius: 160,
      alpha: 0.85,
      speed: 8,
      color: "239, 35, 60"
    });
  });

  if (recollideBtn) {
    recollideBtn.addEventListener("click", () => {
      triggerAssemblySequence();
    });
  }

  // Expose global assemble trigger for terminal CLI
  window.triggerPhotoCollision = triggerAssemblySequence;

  // Initialize
  resize();
  triggerAssemblySequence();
  animate();
}

/* ==========================================================================
   2. PROJECT ARCHITECTURE DRAWER TOGGLES
   ========================================================================== */
function initProjectArchitectureToggles() {
  const toggleBtns = document.querySelectorAll(".toggle-arch-btn");
  if (!toggleBtns.length) return;

  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const drawer = document.getElementById(targetId);
      if (!drawer) return;

      const isExpanded = drawer.classList.contains("expanded");
      const icon = btn.querySelector(".toggle-icon");
      const textSpan = btn.querySelector("span:first-child");

      if (isExpanded) {
        drawer.classList.remove("expanded");
        btn.setAttribute("aria-expanded", "false");
        if (icon) icon.textContent = "+";
        if (textSpan) textSpan.textContent = "View Architecture";
      } else {
        drawer.classList.add("expanded");
        btn.setAttribute("aria-expanded", "true");
        if (icon) icon.textContent = "−";
        if (textSpan) textSpan.textContent = "Hide Architecture";
      }
    });
  });
}

/* ==========================================================================
   3. READING PROGRESS BAR
   ========================================================================== */
function initScrollReadingProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;

  let ticking = false;

  function updateProgress() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    bar.style.width = Math.min(Math.max(progress, 0), 100) + "%";
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateProgress();
}

/* ==========================================================================
   4. ANIMATED METRICS COUNTER
   ========================================================================== */
function initMetricsCounterAnimation() {
  const counters = document.querySelectorAll("[data-target]");
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseInt(el.getAttribute("data-target"), 10);
        if (isNaN(targetVal)) return;

        let start = 0;
        const duration = 1600;
        const startTime = performance.now();

        function step(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(easeProgress * targetVal);

          el.textContent = current + "+";

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = targetVal + "+";
          }
        }

        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach((c) => observer.observe(c));
}

/* ==========================================================================
   5. INTERACTIVE CYBER TERMINAL (CTRL+K)
   ========================================================================== */
function initCyberTerminal() {
  const modal = document.getElementById("terminalModal");
  const input = document.getElementById("terminalInput");
  const output = document.getElementById("terminalOutput");
  const triggerBtn = document.getElementById("terminalTriggerBtn");
  const closeBtn = document.getElementById("terminalCloseBtn");
  const closeX = document.getElementById("terminalCloseX");

  if (!modal || !input || !output) return;

  let isOpen = false;

  function openTerminal() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    isOpen = true;
    setTimeout(() => input.focus(), 100);
  }

  function closeTerminal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    isOpen = false;
  }

  if (triggerBtn) triggerBtn.addEventListener("click", openTerminal);
  if (closeBtn) closeBtn.addEventListener("click", closeTerminal);
  if (closeX) closeX.addEventListener("click", closeTerminal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeTerminal();
  });

  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (isOpen) closeTerminal();
      else openTerminal();
    } else if (e.key === "Escape" && isOpen) {
      closeTerminal();
    }
  });

  function printLine(html) {
    const line = document.createElement("div");
    line.className = "term-line-output";
    line.innerHTML = html;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function executeCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    printLine(`<span class="terminal-prompt">neelesh@dev:~$</span> ${escapeHTML(raw)}`);

    switch (cmd) {
      case "help":
        printLine(`
Available System Commands:
  &bull; <span class="term-accent">collide</span> or <span class="term-accent">assemble</span> &mdash; Replay Dev Command Particle Collision
  &bull; <span class="term-accent">projects</span> &mdash; View production architectures &amp; live links
  &bull; <span class="term-accent">skills</span> &mdash; Inspect C++, Python, Gemini API &amp; systems stack
  &bull; <span class="term-accent">metrics</span> &mdash; View LeetCode rating &amp; problem breakdown
  &bull; <span class="term-accent">resume</span> &mdash; Download official resume (PDF)
  &bull; <span class="term-accent">contact</span> &mdash; Reach out via email, phone, or LinkedIn
  &bull; <span class="term-accent">clear</span> &mdash; Clean terminal output screen
  &bull; <span class="term-accent">exit</span> &mdash; Close terminal deck
        `);
        break;

      case "collide":
      case "assemble":
        printLine(`[INFO] Re-triggering Dev Commands Collision sequence...`);
        if (typeof window.triggerPhotoCollision === "function") {
          window.triggerPhotoCollision();
        }
        break;

      case "projects":
        printLine(`
[01] Crackd &mdash; AI Placement &amp; Roadmap Platform (MERN, Gemini RAG, Redis Cache)
     <a href="https://crackd-placement-assistance-platfor.vercel.app/" target="_blank" style="color:#ef233c;text-decoration:underline;">Live App ↗</a> | <a href="https://github.com/neelesh1303/Crackd-Placement-Assistance-Platform/" target="_blank" style="color:#a1a1aa;text-decoration:underline;">GitHub ↗</a>

[02] LLM Cost Optimizer &mdash; Multi-Tier Gateway (FastAPI, Sentence-Transformers, Groq)
     <a href="https://github.com/neelesh1303/LLM_COST_AND_LATENCY_OPTIMIZER" target="_blank" style="color:#ef233c;text-decoration:underline;">GitHub Repo ↗</a> (~4ms cache latency, $0 token cost)

[03] SignBridge &mdash; Bidirectional Sign &harr; Speech AI (DevJams VIT 4th Winner)
     <a href="https://github.com/neelesh1303" target="_blank" style="color:#ef233c;text-decoration:underline;">GitHub Repo ↗</a> (OpenCV, MediaPipe, Whisper ASR)

[04] FinNIE &mdash; Campus Lost &amp; Found Tracker (Flask, MySQL, ~10ms query latency)
     <a href="https://github.com/neelesh1303/FinNIE-lost-and-found-item-tracker" target="_blank" style="color:#ef233c;text-decoration:underline;">GitHub Repo ↗</a>
        `);
        break;

      case "skills":
        printLine(`
Engineering Capabilities:
  &bull; Core: C++ (STL), Python 3.x, JavaScript (ES6+), SQL, Java, C
  &bull; AI / LLM: Gemini API, Sentence-Transformers, Groq LPUs, RAG, Semantic Caching
  &bull; Backend: FastAPI, Express.js, Node.js, Flask, REST APIs, JWT Auth
  &bull; Databases: Redis (Cache-Aside), MongoDB, MySQL (~10ms), SQLite Vector Store
  &bull; DevOps: Git, GitHub Actions (CI/CD), Docker, Jest, Supertest, Postman
        `);
        break;

      case "metrics":
        printLine(`
Algorithmic &amp; Academic Metrics:
  &bull; 500+ DSA Problems Solved (LeetCode, GeeksforGeeks, Codolio)
  &bull; ~1533 LeetCode Global Contest Rating
  &bull; 4th Place at DevJams VIT National Hackathon (100+ teams)
  &bull; 8.60 / 10 CGPA @ The National Institute of Engineering, Mysuru
        `);
        break;

      case "resume":
      case "cv":
        printLine(`[SUCCESS] Initiating resume PDF download: <span class="term-accent">Neelesh_Kumar_Tripathi_Resume.pdf</span>`);
        const dlLink = document.createElement("a");
        dlLink.href = "assets/Neelesh_Kumar_Tripathi_Resume.pdf";
        dlLink.download = "Neelesh_Kumar_Tripathi_Resume.pdf";
        dlLink.target = "_blank";
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
        break;

      case "contact":
        printLine(`
Direct Channels:
  &bull; Email: <a href="mailto:neeleshtripathi36@gmail.com" style="color:#ef233c;">neeleshtripathi36@gmail.com</a>
  &bull; Phone: <a href="tel:+916387974286" style="color:#ef233c;">+91 6387974286</a>
  &bull; LinkedIn: <a href="https://linkedin.com/in/neelesh-kumar-tripathi" target="_blank" style="color:#ef233c;">linkedin.com/in/neelesh-kumar-tripathi</a>
  &bull; GitHub: <a href="https://github.com/neelesh1303" target="_blank" style="color:#ef233c;">github.com/neelesh1303</a>
  &bull; Codolio: <a href="https://codolio.com/profile/neelesh1303" target="_blank" style="color:#ef233c;">codolio.com/profile/neelesh1303</a>
        `);
        break;

      case "clear":
      case "cls":
        output.innerHTML = "";
        break;

      case "exit":
      case "quit":
        closeTerminal();
        break;

      case "":
        break;

      default:
        printLine(`Command not recognized: <span style="color:#ef233c;">${escapeHTML(raw)}</span>. Type <span class="term-accent">help</span> for commands.`);
        break;
    }
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const val = input.value;
      input.value = "";
      executeCommand(val);
    }
  });

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
}

/* ==========================================================================
   6. MOBILE MENU & SMOOTH SCROLLING
   ========================================================================== */
function initMobileMenu() {
  const btn = document.getElementById("mobileMenuBtn");
  const drawer = document.getElementById("mobileDrawer");
  const closeBtn = document.getElementById("mobileCloseBtn");
  const links = document.querySelectorAll(".mobile-nav-link");

  if (!btn || !drawer) return;

  function open() {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    btn.setAttribute("aria-expanded", "true");
  }

  function close() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", open);
  if (closeBtn) closeBtn.addEventListener("click", close);

  links.forEach(l => l.addEventListener("click", close));
}

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });
}

function initYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
