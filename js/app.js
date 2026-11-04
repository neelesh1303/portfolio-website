/* ==========================================================================
   NEELESH KUMAR TRIPATHI — PORTFOLIO
   Interactions: preloader, cursor, reveals, scramble text, counters,
   spotlight colour reveals, card tilt, project modal, capability filter,
   gallery, journey progress, terminal (Ctrl+K)
   ========================================================================== */

const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initHeader();
  initMobileMenu();
  initScrollProgress();
  initAmbient();
  initCursor();
  initMagnetic();
  initPortrait();
  initWorkCards();
  initProjectModal();
  initCapabilities();
  initCodeCard();
  initHeroField();
  initJourney();
  initCta();
  initCopy();
  initTerminal();
  runPreloader(() => {
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
    $$("[data-scramble-load]").forEach((el, i) => setTimeout(() => scramble(el), 150 + i * 120));
    initReveals();
    initRoleRotator();
    demoPortraitSpotlight();
  });
});

/* ==========================================================================
   PRELOADER
   ========================================================================== */
function runPreloader(done) {
  const loader = $("#preloader");
  const bar = $("#preloaderBar");
  const count = $("#preloaderCount");
  if (!loader || reducedMotion) {
    if (loader) loader.classList.add("is-done");
    done();
    return;
  }

  const duration = 1100;
  const start = performance.now();
  function tick(now) {
    const t = clamp((now - start) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    bar.style.transform = `scaleX(${eased})`;
    count.textContent = String(Math.round(eased * 100)).padStart(3, "0");
    if (t < 1) requestAnimationFrame(tick);
    else {
      loader.classList.add("is-done");
      setTimeout(done, 250);
    }
  }
  requestAnimationFrame(tick);
}

/* ==========================================================================
   SCRAMBLE TEXT
   ========================================================================== */
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*<>/";

function scramble(el) {
  if (reducedMotion) return;
  const final = el.dataset.final || el.textContent;
  el.dataset.final = final;
  const frames = 22;
  let frame = 0;

  function step() {
    let out = "";
    for (let i = 0; i < final.length; i++) {
      const ch = final[i];
      const settleAt = (i / final.length) * frames * 0.75 + frames * 0.25;
      if (ch === " " || frame >= settleAt) out += ch;
      else out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }
    el.textContent = out;
    frame++;
    if (frame <= frames) requestAnimationFrame(() => setTimeout(step, 28));
    else el.textContent = final;
  }
  step();
}

/* ==========================================================================
   SCROLL REVEALS (staggered per batch)
   ========================================================================== */
function initReveals() {
  const items = $$(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      visible.forEach((entry, i) => {
        const el = entry.target;
        io.unobserve(el);
        setTimeout(() => {
          el.classList.add("in");
          if (el.hasAttribute("data-scramble")) scramble(el);
        }, i * 90);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  items.forEach((el) => io.observe(el));

  // stat counters start when the stats panel appears
  const counters = $$("[data-count]");
  const cio = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        cio.unobserve(entry.target);
        countUp(entry.target);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => cio.observe(el));
}

function countUp(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const t = clamp((now - start) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = (target * eased).toFixed(decimals);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ==========================================================================
   HERO ROLE TYPEWRITER
   ========================================================================== */
function initRoleRotator() {
  const el = $("#roleRotator");
  if (!el) return;
  const roles = [
    "AI Systems Engineer",
    "Distributed Backend Developer",
    "LLM Gateway Builder",
    "Competitive Programmer",
    "Open to Remote · Onsite · Hybrid",
  ];
  if (reducedMotion) return;

  let r = 0;
  let c = roles[0].length;
  let deleting = true;
  let wait = 1800;

  function loop() {
    const word = roles[r];
    if (deleting) {
      c--;
      el.textContent = word.slice(0, c);
      if (c === 0) {
        deleting = false;
        r = (r + 1) % roles.length;
        wait = 250;
      } else wait = 28;
    } else {
      const next = roles[r];
      c++;
      el.textContent = next.slice(0, c);
      if (c === next.length) {
        deleting = true;
        wait = 2200;
      } else wait = 55;
    }
    setTimeout(loop, wait);
  }
  setTimeout(loop, wait);
}

/* ==========================================================================
   HEADER, ACTIVE NAV, MOBILE MENU, SCROLL PROGRESS
   ========================================================================== */
function initHeader() {
  const header = $("#siteHeader");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const links = $$(".nav-link");
  const sections = links.map((l) => document.getElementById(l.dataset.nav)).filter(Boolean);
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.classList.toggle("is-active", l.dataset.nav === entry.target.id));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => io.observe(s));
}

function initMobileMenu() {
  const toggle = $("#menuToggle");
  const menu = $("#mobileMenu");
  if (!toggle || !menu) return;

  const set = (open) => {
    document.body.classList.toggle("menu-open", open);
    document.body.classList.toggle("is-locked", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.setAttribute("aria-hidden", String(!open));
  };

  toggle.addEventListener("click", () => set(!document.body.classList.contains("menu-open")));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => set(false)));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") set(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 920) set(false);
  });

  const termBtn = $("#mobileTerminalBtn");
  if (termBtn) {
    termBtn.addEventListener("click", () => {
      set(false);
      window.dispatchEvent(new CustomEvent("terminal:open"));
    });
  }
}

function initScrollProgress() {
  const bar = $("#scrollProgress");
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();
}

/* ==========================================================================
   AMBIENT SPOTLIGHT + CUSTOM CURSOR + MAGNETIC BUTTONS
   ========================================================================== */
function initAmbient() {
  if (!finePointer) return;
  const root = document.documentElement;
  let raf = 0;
  window.addEventListener("pointermove", (e) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      root.style.setProperty("--mx", e.clientX + "px");
      root.style.setProperty("--my", e.clientY + "px");
    });
  });
}

function initCursor() {
  if (!finePointer || reducedMotion) return;
  const dot = $("#cursorDot");
  const ring = $("#cursorRing");
  const label = $("#cursorLabel");
  document.body.classList.add("has-cursor");

  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let rx = x;
  let ry = y;

  window.addEventListener("pointermove", (e) => {
    x = e.clientX;
    y = e.clientY;
    dot.style.transform = `translate(${x}px, ${y}px)`;
  });

  (function follow() {
    rx += (x - rx) * 0.18;
    ry += (y - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(follow);
  })();

  document.addEventListener("pointerover", (e) => {
    const labelled = e.target.closest("[data-cursor]");
    const interactive = e.target.closest("a, button, [role='button'], .shot, .cap, input");
    ring.classList.toggle("is-label", !!labelled);
    ring.classList.toggle("is-hover", !!interactive && !labelled);
    label.textContent = labelled ? labelled.dataset.cursor : "";
  });

  document.addEventListener("pointerleave", () => {
    dot.classList.add("is-hidden");
    ring.classList.add("is-hidden");
  });
  document.addEventListener("pointerenter", () => {
    dot.classList.remove("is-hidden");
    ring.classList.remove("is-hidden");
  });
}

function initMagnetic() {
  if (!finePointer || reducedMotion) return;
  $$(".magnetic").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.25}px, ${dy * 0.35}px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });
}

/* ==========================================================================
   HERO PORTRAIT — studio light that follows the pointer + parallax
   ========================================================================== */
function initPortrait() {
  const visual = $("#heroVisual");
  const portrait = $("#portrait");
  if (!visual || !portrait) return;

  const setSpot = (clientX, clientY) => {
    const r = portrait.getBoundingClientRect();
    portrait.style.setProperty("--mx", ((clientX - r.left) / r.width) * 100 + "%");
    portrait.style.setProperty("--my", ((clientY - r.top) / r.height) * 100 + "%");
  };

  visual.addEventListener("pointermove", (e) => {
    setSpot(e.clientX, e.clientY);
    portrait.classList.add("is-lit");
  });
  visual.addEventListener("pointerleave", () => portrait.classList.remove("is-lit"));
  visual.addEventListener("pointerdown", (e) => {
    setSpot(e.clientX, e.clientY);
    portrait.classList.add("is-lit");
  });
  if (!finePointer) {
    visual.addEventListener("pointerup", () => setTimeout(() => portrait.classList.remove("is-lit"), 1400));
  }

  if (finePointer && !reducedMotion) {
    window.addEventListener("pointermove", (e) => {
      const px = (e.clientX / innerWidth - 0.5) * -18;
      const py = (e.clientY / innerHeight - 0.5) * -12;
      portrait.style.setProperty("--px", px + "px");
      portrait.style.setProperty("--py", py + "px");
    });
  }
}

function demoPortraitSpotlight() {
  const portrait = $("#portrait");
  if (!portrait || reducedMotion) return;
  setTimeout(() => {
    portrait.style.setProperty("--mx", "52%");
    portrait.style.setProperty("--my", "38%");
    portrait.classList.add("is-lit");
    setTimeout(() => {
      if (!portrait.matches(":hover")) portrait.classList.remove("is-lit");
    }, 1800);
  }, 900);
}

/* ==========================================================================
   WORK CARDS — spotlight colour reveal + 3D tilt
   ========================================================================== */
function initWorkCards() {
  const cards = $$(".work-card");

  cards.forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty("--mx", x + "px");
      card.style.setProperty("--my", y + "px");
      if (finePointer && !reducedMotion) {
        card.style.setProperty("--rx", (0.5 - y / r.height) * 6 + "deg");
        card.style.setProperty("--ry", (x / r.width - 0.5) * 8 + "deg");
      }
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });

  // Touch screens have no hover: reveal colour on the card nearest the centre of the screen
  if (!finePointer && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-center", entry.isIntersecting);
          if (entry.isIntersecting) {
            entry.target.style.setProperty("--mx", "50%");
            entry.target.style.setProperty("--my", "45%");
          }
        });
      },
      { rootMargin: "-38% 0px -38% 0px" }
    );
    cards.forEach((c) => io.observe(c));
  }
}

/* ==========================================================================
   PROJECT MODAL
   ========================================================================== */
function initProjectModal() {
  const modal = $("#projectModal");
  const content = $("#modalContent");
  const img = $("#modalImg");
  const closeBtn = $(".modal-close", modal);
  let lastFocus = null;

  const open = (card) => {
    const tpl = $(".work-details", card);
    content.replaceChildren(tpl.content.cloneNode(true));
    img.src = $(".work-img-color", card).src;
    lastFocus = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    $(".modal-panel", modal).scrollTop = 0;
    setTimeout(() => closeBtn.focus(), 50);
  };

  const close = () => {
    if (!modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  };

  $$("[data-project]").forEach((card) => {
    card.addEventListener("click", () => open(card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(card);
      }
    });
  });

  $$("[data-close]", modal).forEach((el) => el.addEventListener("click", close));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* ==========================================================================
   CAPABILITIES → TOOLS HIGHLIGHT
   ========================================================================== */
function initCapabilities() {
  const caps = $$(".cap");
  const panel = $("#toolsPanel");
  if (!caps.length || !panel) return;
  const tools = $$(".tool", panel);
  let pinned = null;

  const show = (domain) => {
    caps.forEach((c) => c.classList.toggle("is-active", c.dataset.domain === domain));
    panel.classList.toggle("is-filtering", !!domain);
    tools.forEach((t) => t.classList.toggle("is-lit", !!domain && t.dataset.d.split(" ").includes(domain)));
  };

  caps.forEach((cap) => {
    if (finePointer) {
      cap.addEventListener("pointerenter", () => show(cap.dataset.domain));
      cap.addEventListener("pointerleave", () => show(pinned));
    }
    cap.addEventListener("focus", () => show(cap.dataset.domain));
    cap.addEventListener("blur", () => show(pinned));
    cap.addEventListener("click", () => {
      pinned = pinned === cap.dataset.domain ? null : cap.dataset.domain;
      show(pinned);
    });
  });
}

/* ==========================================================================
   CODE CARD — wrap each line so they type in one after another on reveal
   ========================================================================== */
function initCodeCard() {
  const code = $("#codeCard code");
  if (!code) return;
  code.innerHTML = code.innerHTML
    .split("\n")
    .map((line, i) => `<span class="code-line" style="transition-delay:${0.25 + i * 0.07}s">${line || " "}</span>`)
    .join("\n");
}

/* ==========================================================================
   HERO PARTICLE FIELD — drifting ice motes that link up near the cursor
   ========================================================================== */
function initHeroField() {
  const canvas = $("#heroField");
  if (!canvas || reducedMotion) return;
  const ctx = canvas.getContext("2d");
  const hero = $("#hero");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;
  let points = [];
  let visible = true;
  const mouse = { x: -9999, y: -9999 };

  const resize = () => {
    w = hero.clientWidth;
    h = hero.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(clamp((w * h) / 16000, 30, 90));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.4 + 0.4,
    }));
  };

  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  hero.addEventListener("pointerleave", () => {
    mouse.x = mouse.y = -9999;
  });

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) requestAnimationFrame(frame);
  }).observe(hero);

  function frame() {
    if (!visible) return;
    ctx.clearRect(0, 0, w, h);
    for (const p of points) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // gentle push away from the cursor
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 14000) {
        p.x += dx * 0.012;
        p.y += dy * 0.012;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(170, 215, 255, 0.55)";
      ctx.fill();
    }

    // link points that are close to each other and to the cursor
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      const am = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (am > 220) continue;
      for (let j = i + 1; j < points.length; j++) {
        const b = points[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          ctx.strokeStyle = `rgba(143, 208, 255, ${(1 - d / 120) * (1 - am / 220) * 0.5})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(frame);
  }

  resize();
  let rt = 0;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(resize, 150);
  });
}

/* ==========================================================================
   JOURNEY PROGRESS LINE
   ========================================================================== */
function initJourney() {
  const track = $("#journey-track");
  if (!track) return;
  const steps = $$(".step", track);
  let ticking = false;

  const update = () => {
    ticking = false;
    const r = track.getBoundingClientRect();
    const vh = window.innerHeight;
    const p = clamp((vh * 0.8 - r.top) / (r.height + vh * 0.25), 0, 1);
    track.style.setProperty("--p", p.toFixed(3));
    steps.forEach((s, i) => s.classList.toggle("is-on", p >= i / steps.length + 0.02));
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", update);
  update();
}

/* ==========================================================================
   CTA LIGHT + COPY EMAIL + TOAST
   ========================================================================== */
function initCta() {
  const cta = $("#cta");
  if (!cta || !finePointer) return;
  cta.addEventListener("pointermove", (e) => {
    const r = cta.getBoundingClientRect();
    cta.style.setProperty("--mx", e.clientX - r.left + "px");
    cta.style.setProperty("--my", e.clientY - r.top + "px");
  });
}

function initCopy() {
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      toast("Email copied to clipboard");
    });
  });
}

let toastTimer = 0;
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("is-show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-show"), 2200);
}

/* ==========================================================================
   TERMINAL (CTRL+K)
   ========================================================================== */
function initTerminal() {
  const modal = $("#terminalModal");
  const input = $("#terminalInput");
  const output = $("#terminalOutput");
  if (!modal || !input || !output) return;

  const history = [];
  let histIdx = 0;
  let isOpen = false;

  const open = () => {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    isOpen = true;
    setTimeout(() => input.focus(), 100);
  };
  const close = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    isOpen = false;
  };

  $("#terminalTriggerBtn").addEventListener("click", open);
  $("#terminalClose").addEventListener("click", close);
  window.addEventListener("terminal:open", open);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      isOpen ? close() : open();
    } else if (e.key === "Escape" && isOpen) close();
  });

  const print = (html) => {
    const line = document.createElement("div");
    line.className = "term-line";
    line.innerHTML = html;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  };

  const link = (href, text, external = true) =>
    `<a href="${href}"${external ? ' target="_blank" rel="noopener"' : ""}>${text}</a>`;

  const goto = (id) => {
    const el = document.getElementById(id);
    if (!el) return false;
    close();
    el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    return true;
  };

  const commands = {
    help: () =>
      print(`Available commands:
  <span class="term-accent">about</span>      who I am
  <span class="term-accent">projects</span>   production systems &amp; links
  <span class="term-accent">skills</span>     languages, AI, backend, data, devops
  <span class="term-accent">metrics</span>    DSA &amp; academic numbers
  <span class="term-accent">contact</span>    email, phone &amp; socials
  <span class="term-accent">resume</span>     download CV (PDF)
  <span class="term-accent">goto</span> <span class="term-muted">&lt;work|capabilities|about|journey|contact&gt;</span>
  <span class="term-accent">clear</span>      clean the screen
  <span class="term-accent">exit</span>       close terminal`),

    about: () =>
      print(`Neelesh Kumar Tripathi — Aspiring Software Developer &amp; AI Engineer
B.E. Information Science @ NIE Mysore (CGPA 8.60) · Mysuru, India
Builds distributed backends, LLM gateways and algorithmic systems.
Looking for Remote · Onsite · Hybrid roles in India.`),

    whoami: () => commands.about(),

    projects: () =>
      print(`[01] Crackd — AI placement &amp; roadmap platform (MERN, Gemini RAG, Redis)
     ${link("https://crackd-placement-assistance-platfor.vercel.app/", "live ↗")}  ${link("https://github.com/neelesh1303/Crackd-Placement-Assistance-Platform/", "github ↗")}
[02] LLM Cost &amp; Latency Optimizer — FastAPI gateway, ~4ms cache hits at $0
     ${link("https://github.com/neelesh1303/LLM_COST_AND_LATENCY_OPTIMIZER", "github ↗")}
[03] SignBridge — Sign ↔ speech AI, 4th at DevJams VIT (100+ teams)
     ${link("https://github.com/neelesh1303", "github ↗")}
[04] FinNIE — Campus lost &amp; found (Flask, MySQL, ~10ms queries)
     ${link("https://github.com/neelesh1303/FinNIE-lost-and-found-item-tracker", "github ↗")}`),

    skills: () =>
      print(`Languages  C++ (STL), Python, JavaScript, SQL, Java, C, NumPy, Pydantic
AI / LLM   Gemini API, Groq, OpenRouter, RAG, Embeddings, Semantic Caching
Backend    Node.js, Express.js, FastAPI, Flask, REST APIs, JWT Auth
Data       Redis, MongoDB, MySQL, SQLite
Tooling    Git, GitHub Actions, Jest, Supertest, Postman, Vercel, Render`),

    metrics: () =>
      print(`500+    DSA problems solved (LeetCode, GeeksforGeeks, Codolio)
~1533   LeetCode contest rating
4th     DevJams VIT national hackathon (100+ teams)
8.60    CGPA @ The National Institute of Engineering, Mysuru`),

    contact: () =>
      print(`email     ${link("mailto:neeleshtripathi36@gmail.com", "neeleshtripathi36@gmail.com", false)}
phone     ${link("tel:+916387974286", "+91 6387974286", false)}
linkedin  ${link("https://linkedin.com/in/neelesh-kumar-tripathi", "linkedin.com/in/neelesh-kumar-tripathi")}
github    ${link("https://github.com/neelesh1303", "github.com/neelesh1303")}
codolio   ${link("https://codolio.com/profile/neelesh1303", "codolio.com/profile/neelesh1303")}`),

    resume: () => {
      print(`Downloading <span class="term-accent">Neelesh_Kumar_Tripathi_Resume.pdf</span> …`);
      const a = document.createElement("a");
      a.href = "assets/Neelesh_Kumar_Tripathi_Resume.pdf";
      a.download = "Neelesh_Kumar_Tripathi_Resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
    cv: () => commands.resume(),

    github: () => window.open("https://github.com/neelesh1303", "_blank", "noopener"),
    linkedin: () => window.open("https://linkedin.com/in/neelesh-kumar-tripathi", "_blank", "noopener"),

    "sudo hire-me": () =>
      print(`[sudo] permission granted ✓
Opening a direct line… ${link("mailto:neeleshtripathi36@gmail.com", "neeleshtripathi36@gmail.com", false)}`),

    clear: () => output.replaceChildren(),
    cls: () => commands.clear(),
    exit: () => close(),
    quit: () => close(),
  };

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase().replace(/\s+/g, " ");
    if (!cmd) return;
    history.push(raw);
    histIdx = history.length;
    print(`<span class="terminal-prompt">~$</span> ${escapeHTML(raw)}`);

    if (cmd.startsWith("goto ")) {
      if (!goto(cmd.slice(5))) print(`No section named "${escapeHTML(cmd.slice(5))}".`);
      return;
    }
    if (commands[cmd]) commands[cmd]();
    else print(`command not found: ${escapeHTML(raw)} — type <span class="term-accent">help</span>`);
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      run(input.value);
      input.value = "";
    } else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      histIdx = Math.max(0, histIdx - 1);
      input.value = history[histIdx];
    } else if (e.key === "ArrowDown" && history.length) {
      e.preventDefault();
      histIdx = Math.min(history.length, histIdx + 1);
      input.value = history[histIdx] || "";
    }
  });

  $$("#terminalChips button").forEach((b) => b.addEventListener("click", () => run(b.dataset.cmd)));
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
}

function initYear() {
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
}
