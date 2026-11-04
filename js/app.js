/* ==========================================================================
   NEELESH KUMAR TRIPATHI — PORTFOLIO
   Intro computer (npm install portfolio) → scroll-zoom into the screen →
   editorial hero, statement word-fill, work list preview, proof counters,
   capability → tools filter, journey progress, terminal (Ctrl+K)
   ========================================================================== */

const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initClock();
  initCursor();
  initScrollProgress();
  initHeader();
  initPortrait();
  initStatement();
  initWorkList();
  initProjectModal();
  initProof();
  initCapabilities();
  initJourney();
  initReveals();
  initContactTitle();
  initCopy();
  initTerminal();
  initIntro(enterSite);
});

/* ==========================================================================
   INTRO — a computer that types `npm install portfolio`; once it is ready
   the camera dives into its screen on its own and the site takes over.
   ========================================================================== */
const ZOOM_MS = 2600;

function initIntro(onEnter) {
  const intro = $("#intro");
  // deep links (e.g. #work) and reduced motion go straight to the site
  if (!intro || reducedMotion || (location.hash && location.hash !== "#intro")) {
    if (intro) intro.remove();
    onEnter();
    return;
  }

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  document.body.classList.add("is-locked");

  const stage = $("#introStage");
  const computer = $("#computer");
  const screen = $("#screen");
  const paper = $("#screenPaper");
  const pct = $("#introPct");
  const keyboard = $("#keyboard");
  const fading = [$(".stand-neck"), $(".stand-base"), $(".desk-shadow"), keyboard, $(".monitor-chin")];

  // geometry measured with no transform applied (transform-origin 0 0)
  let g = null;
  let p = 0;
  let entered = false;
  let zooming = false;

  buildKeyboard(keyboard);
  runBootScript($("#screenBody"), keyboard, pct, () => {
    intro.classList.add("is-ready");
    setTimeout(zoom, 650);
  });

  const measure = () => {
    computer.style.transformOrigin = "0 0";
    computer.style.transform = "none";
    const vw = innerWidth;
    const vh = innerHeight;
    const c = computer.getBoundingClientRect();
    const s = screen.getBoundingClientRect();
    const base = Math.min(1, (vw - 32) / c.width, (vh * 0.8) / c.height);
    const sx = s.left - c.left + s.width / 2;
    const sy = s.top - c.top + s.height / 2;
    // at rest the machine sits centred in the viewport at scale `base`
    // (its layout box can be wider than a phone screen, so don't trust its position)
    const restLeft = vw / 2 - (base * c.width) / 2;
    const restTop = vh / 2 - (base * c.height) / 2;
    g = {
      base,
      left: c.left,
      top: c.top,
      sx,
      sy,
      start: { x: restLeft + base * sx, y: restTop + base * sy },
      end: { x: vw / 2, y: vh / 2 },
      // final scale makes the screen overfill the viewport
      kmax: Math.max(vw / (base * s.width), vh / (base * s.height)) * 1.08,
    };
    update();
  };

  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function update() {
    if (!g) return;
    const z = easeInOut(clamp(p / 0.78));
    const S = g.base * (1 + (g.kmax - 1) * z);
    // keep the screen centre on a straight path from its resting spot to the viewport centre
    const cx = g.start.x + (g.end.x - g.start.x) * z;
    const cy = g.start.y + (g.end.y - g.start.y) * z;
    computer.style.transform = `translate(${cx - g.left - S * g.sx}px, ${cy - g.top - S * g.sy}px) scale(${S})`;
    stage.style.setProperty("--p", p.toFixed(4));
    paper.style.opacity = clamp((p - 0.34) / 0.26).toFixed(3);
    fading.forEach((el) => el && (el.style.opacity = (1 - clamp(p / 0.3)).toFixed(3)));
    // the stage dissolves while the hero is still rising into place beneath it
    stage.style.opacity = (1 - clamp((p - 0.58) / 0.26)).toFixed(3);
    intro.classList.toggle("is-gone", p >= 0.85);

    if (!entered && p > 0.56) {
      entered = true;
      onEnter();
    }
  }

  // plays the dive into the screen on a timeline, then removes the intro
  function zoom() {
    if (zooming) return;
    zooming = true;
    const start = performance.now();
    const tick = (now) => {
      p = clamp((now - start) / ZOOM_MS);
      update();
      if (p < 1) return requestAnimationFrame(tick);
      document.body.classList.remove("is-locked");
      window.removeEventListener("resize", measure);
      intro.remove();
    };
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", measure);
  $("#introSkip").addEventListener("click", zoom);

  // fonts change the computer's box, so measure once they are ready
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(measure);
  measure();
}

function buildKeyboard(el) {
  if (!el) return;
  const rows = [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "⌫"],
    ["⇥", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["⇪", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "⏎"],
    ["⇧", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "⇧"],
    ["fn", "⌃", "⌥", "⌘", " ", "⌘", "⌥", "◂", "▸"],
  ];
  const wide = new Set(["⌫", "⇥", "⇪", "⏎", "⇧"]);
  el.innerHTML = rows
    .map(
      (r) =>
        `<div class="kb-row">${r
          .map((k) => {
            const cls = k === " " ? "key is-space" : wide.has(k) ? "key is-wide" : "key";
            const data = k === " " ? "space" : k;
            return `<span class="${cls}" data-k="${data}">${k === " " ? "" : k}</span>`;
          })
          .join("")}</div>`
    )
    .join("");
}

function pressKey(keyboard, ch) {
  if (!keyboard) return;
  const k = ch === " " ? "space" : ch === "\n" ? "⏎" : ch.toLowerCase();
  const key = keyboard.querySelector(`[data-k="${CSS.escape(k)}"]`);
  if (!key) return;
  key.classList.add("is-down");
  setTimeout(() => key.classList.remove("is-down"), 110);
}

async function runBootScript(body, keyboard, pct, done) {
  const PROMPT = '<span class="t-user">neelesh@portfolio</span> <span class="t-path">~ %</span> ';

  const line = (html = "", cls = "") => {
    const el = document.createElement("div");
    el.className = `sl ${cls}`.trim();
    el.innerHTML = html;
    body.appendChild(el);
    while (body.children.length > 15) body.firstElementChild.remove();
    return el;
  };

  const type = async (text) => {
    const el = line(PROMPT + '<span class="typed"></span><span class="caret"></span>');
    const typed = $(".typed", el);
    await sleep(500);
    for (const ch of text) {
      typed.textContent += ch;
      pressKey(keyboard, ch);
      await sleep(42 + Math.random() * 50);
    }
    await sleep(260);
    pressKey(keyboard, "\n");
    $(".caret", el).remove();
  };

  const setPct = (n) => {
    if (pct) pct.textContent = String(Math.round(n)).padStart(3, "0");
  };

  line('<span class="t-dim">Last login: ' + new Date().toDateString() + " on ttys001</span>");
  await type("npm install portfolio");

  line('<span class="t-dim">npm</span> <span class="t-tag">http</span> <span class="t-dim">fetch GET 200 registry.npmjs.org/@neelesh/portfolio</span>');

  // animated progress bar
  const bar = line("");
  const W = 26;
  for (let i = 0; i <= 100; i += 2) {
    const fill = Math.round((i / 100) * W);
    bar.innerHTML = `<span class="t-dim">[</span>${"█".repeat(fill)}${"░".repeat(W - fill)}<span class="t-dim">]</span> ${String(i).padStart(3, " ")}% <span class="t-dim">resolving dependencies</span>`;
    setPct(i * 0.6);
    await sleep(18);
  }

  const deps = ["cpp-stl", "python", "javascript", "fastapi", "express", "redis", "mongodb", "gemini-rag"];
  for (let i = 0; i < deps.length; i++) {
    line(`<span class="t-plus">+</span> ${deps[i]}`);
    setPct(60 + ((i + 1) / deps.length) * 30);
    await sleep(85);
  }

  line('added <span class="t-ok">4 projects</span> <span class="t-dim">· crackd · llm-optimizer · signbridge · finnie</span>');
  await sleep(120);
  line('added <span class="t-ok">500+</span> solved problems <span class="t-dim">· cgpa@8.60</span>');
  await sleep(120);
  line('<span class="t-dim">audited 1 developer ·</span> found <span class="t-ok">0 vulnerabilities</span>');
  setPct(100);

  await type("npm run start");
  line('<span class="t-dim">&gt; portfolio@2027.0.0 start</span>');
  await sleep(200);
  line('<span class="t-ok">✓ ready</span> <span class="t-dim">— launching portfolio…</span><span class="caret"></span>');
  done();
}

/* ==========================================================================
   ENTER — hero entrance (Web Animations)
   ========================================================================== */
let hasEntered = false;
function enterSite() {
  if (hasEntered) return;
  hasEntered = true;
  document.body.classList.add("is-entered");
  moveSegPill();

  if (reducedMotion) {
    $$("[data-count]").forEach((el) => setCount(el, 1));
    return;
  }

  $$(".hero .t-inner").forEach((el, i) =>
    el.animate([{ transform: "translateY(110%)" }, { transform: "translateY(0)" }], {
      duration: 1000,
      delay: 120 + i * 110,
      easing: EASE,
      fill: "both",
    })
  );

  $("#heroPhoto").animate(
    [
      { opacity: 0, transform: "translate3d(0, 40px, 0)", filter: "blur(14px)" },
      { opacity: 1, transform: "translate3d(0, 0, 0)", filter: "blur(0)" },
    ],
    { duration: 1300, easing: EASE, fill: "both" }
  ).onfinish = (e) => {
    // hand the transform back to the scroll-driven drift
    e.target.effect.target.style.opacity = "1";
    e.target.cancel();
  };

  $$(".hero .h-in").forEach((el, i) =>
    el.animate(
      [
        { opacity: 0, transform: "translateY(14px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 900, delay: 380 + i * 55, easing: EASE, fill: "both" }
    )
  );

  const prog = $("#featureProgress");
  if (prog) {
    prog.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(0.62)" }], {
      duration: 1600,
      delay: 900,
      easing: EASE,
      fill: "both",
    });
  }

  setTimeout(() => $$("[data-count]").forEach((el) => countUp(el, 1400)), 600);
  setTimeout(demoPortraitSpotlight, 1500);
}

function setCount(el, t) {
  const target = parseFloat(el.dataset.count ?? el.dataset.countOnView);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  el.textContent = (target * t).toFixed(decimals);
}

function countUp(el, duration = 1400) {
  if (reducedMotion) return setCount(el, 1);
  const start = performance.now();
  const tick = (now) => {
    const t = clamp((now - start) / duration);
    setCount(el, 1 - Math.pow(1 - t, 4));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ==========================================================================
   HEADER — sliding segmented pill, active section, live IST clock
   ========================================================================== */
function moveSegPill(target) {
  const nav = $("#segNav");
  const pill = $("#segPill");
  if (!nav || !pill) return;
  const link = target || $(".seg-link.is-active", nav) || $(".seg-link", nav);
  const n = nav.getBoundingClientRect();
  const r = link.getBoundingClientRect();
  if (!r.width) return;
  pill.style.left = r.left - n.left + "px";
  pill.style.width = r.width + "px";
  $$(".seg-link", nav).forEach((l) => l.classList.toggle("is-pilled", l === link));
}

function initHeader() {
  const header = $("#siteHeader");
  const nav = $("#segNav");
  const links = $$(".seg-link", nav);

  // paper sections need dark header text; dark sections need light text
  const paperSections = $$(".intro, .hero, .stack, .contact");
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 30);
    const y = 50;
    header.classList.toggle(
      "on-paper",
      paperSections.some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= y && r.bottom > y;
      })
    );
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  links.forEach((l) => l.addEventListener("pointerenter", () => moveSegPill(l)));
  nav.addEventListener("pointerleave", () => moveSegPill());
  window.addEventListener("resize", () => moveSegPill());
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => moveSegPill());

  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        const map = { statement: "hero", proof: "work", contact: "journey" };
        const key = map[id] || id;
        links.forEach((l) => l.classList.toggle("is-active", l.dataset.nav === key));
        if (!nav.matches(":hover")) moveSegPill();
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  ["hero", "statement", "work", "proof", "stack", "journey", "contact"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });

  $("#brandPlate").addEventListener("click", () => window.dispatchEvent(new CustomEvent("terminal:open")));
}

function initClock() {
  const els = [$("#headerClock"), $("#introClock")].filter(Boolean);
  const fmt = () => {
    try {
      const t = new Date().toLocaleTimeString("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
      });
      els.forEach((el) => (el.textContent = `IST ${t}`));
    } catch {
      /* time zone unsupported: keep placeholder */
    }
  };
  fmt();
  setInterval(fmt, 15000);
}

function initScrollProgress() {
  const bar = $("#scrollProgress");
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
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
   CURSOR
   ========================================================================== */
function initCursor() {
  if (!finePointer || reducedMotion) return;
  const cur = $("#cursor");
  const label = $("#cursorLabel");
  document.body.classList.add("has-cursor");
  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let cx = x;
  let cy = y;

  window.addEventListener("pointermove", (e) => {
    x = e.clientX;
    y = e.clientY;
  });
  (function follow() {
    cx += (x - cx) * 0.22;
    cy += (y - cy) * 0.22;
    cur.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(follow);
  })();

  document.addEventListener("pointerover", (e) => {
    const labelled = e.target.closest("[data-cursor]");
    const interactive = e.target.closest("a, button, [role='button'], input");
    cur.classList.toggle("is-label", !!labelled);
    cur.classList.toggle("is-hover", !!interactive && !labelled);
    label.textContent = labelled ? labelled.dataset.cursor : "";
  });
  document.addEventListener("pointerleave", () => cur.classList.add("is-hidden"));
  document.addEventListener("pointerenter", () => cur.classList.remove("is-hidden"));
}

/* ==========================================================================
   HERO PORTRAIT — mono photo, colour spotlight at the pointer, scroll drift
   ========================================================================== */
function initPortrait() {
  const wrap = $("#heroPhoto");
  const portrait = $("#portrait");
  const hero = $("#hero");
  if (!wrap || !portrait) return;

  const setSpot = (clientX, clientY) => {
    const r = portrait.getBoundingClientRect();
    portrait.style.setProperty("--mx", ((clientX - r.left) / r.width) * 100 + "%");
    portrait.style.setProperty("--my", ((clientY - r.top) / r.height) * 100 + "%");
  };

  hero.addEventListener("pointermove", (e) => {
    if (e.target.closest(".brand-plate")) return;
    const r = portrait.getBoundingClientRect();
    const inside = e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom;
    setSpot(e.clientX, e.clientY);
    portrait.classList.toggle("is-lit", inside);
  });
  hero.addEventListener("pointerleave", () => portrait.classList.remove("is-lit"));
  if (!finePointer) {
    wrap.addEventListener("pointerdown", (e) => {
      setSpot(e.clientX, e.clientY);
      portrait.classList.add("is-lit");
      setTimeout(() => portrait.classList.remove("is-lit"), 1500);
    });
  }

  if (reducedMotion) return;
  let ticking = false;
  const drift = () => {
    ticking = false;
    const r = hero.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    wrap.style.setProperty("--drift", (-r.top * 0.12).toFixed(1) + "px");
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(drift);
      }
    },
    { passive: true }
  );
}

function demoPortraitSpotlight() {
  const portrait = $("#portrait");
  if (!portrait || reducedMotion || portrait.classList.contains("is-lit")) return;
  portrait.style.setProperty("--mx", "52%");
  portrait.style.setProperty("--my", "36%");
  portrait.classList.add("is-lit");
  setTimeout(() => {
    if (!portrait.matches(":hover")) portrait.classList.remove("is-lit");
  }, 1600);
}

/* ==========================================================================
   STATEMENT — words fill grey → white in reading order as it scrolls
   ========================================================================== */
function initStatement() {
  const el = $("#statementText");
  if (!el) return;
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(" ");
  const spans = $$(".w", el);
  const from = [0x6f, 0x6f, 0x6f];
  const to = [0xf4, 0xf4, 0xf4];
  const SOFT = 3;

  const paint = (filled) => {
    spans.forEach((s, i) => {
      const t = clamp((filled - i) / SOFT);
      const c = from.map((f, k) => Math.round(f + (to[k] - f) * t));
      s.style.color = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
    });
  };

  if (reducedMotion) return paint(spans.length + SOFT);

  let ticking = false;
  const update = () => {
    ticking = false;
    const r = el.getBoundingClientRect();
    const q = clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.45));
    paint(q * (spans.length + SOFT));
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
   WORK LIST — floating preview that trails the cursor
   ========================================================================== */
function initWorkList() {
  const list = $("#workList");
  const preview = $("#workPreview");
  if (!list || !preview || !finePointer) return;
  const img = $("img", preview);
  let x = 0;
  let y = 0;
  let px = 0;
  let py = 0;
  let active = false;

  list.addEventListener("pointermove", (e) => {
    x = e.clientX;
    y = e.clientY;
    const row = e.target.closest(".work-row");
    if (row && img.getAttribute("src") !== row.dataset.img) img.src = row.dataset.img;
    if (row && !active) {
      px = x;
      py = y;
    }
    active = !!row;
    preview.classList.toggle("is-on", active);
  });
  list.addEventListener("pointerleave", () => {
    active = false;
    preview.classList.remove("is-on");
  });

  (function follow() {
    px += (x - px) * 0.14;
    py += (y - py) * 0.14;
    preview.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%)`;
    requestAnimationFrame(follow);
  })();
}

/* ==========================================================================
   PROJECT MODAL
   ========================================================================== */
function initProjectModal() {
  const modal = $("#projectModal");
  const content = $("#modalContent");
  const img = $("#modalImg");
  const closeBtn = $(".modal-close", modal);
  const rows = $$("[data-project]");
  let lastFocus = null;

  const open = (row) => {
    content.replaceChildren($(".work-details", row).content.cloneNode(true));
    img.src = row.dataset.img;
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

  rows.forEach((row) => {
    row.addEventListener("click", () => open(row));
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(row);
      }
    });
  });
  $$("[data-open]").forEach((btn) => btn.addEventListener("click", () => open(rows[+btn.dataset.open])));
  $$("[data-close]", modal).forEach((el) => el.addEventListener("click", close));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* ==========================================================================
   PROOF PANEL — counters, disc pop and meter when it enters
   ========================================================================== */
function initProof() {
  const panel = $("#proofPanel");
  if (!panel) return;
  const run = () => {
    panel.classList.add("is-counted");
    $$("[data-count-on-view]", panel).forEach((el) => countUp(el, 1500));
    if (reducedMotion) return;
    $$(".p-disc", panel).forEach((d, i) =>
      d.animate([{ transform: "scale(0.4)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], {
        duration: 700,
        delay: 150 + i * 90,
        easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        fill: "both",
      })
    );
  };
  if (!("IntersectionObserver" in window)) return run();
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      run();
    },
    { threshold: 0.35 }
  );
  io.observe(panel);
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
   JOURNEY PROGRESS
   ========================================================================== */
function initJourney() {
  const track = $("#journeyTrack");
  if (!track) return;
  const steps = $$(".step", track);
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = track.getBoundingClientRect();
    const vh = innerHeight;
    const p = reducedMotion ? 1 : clamp((vh * 0.8 - r.top) / (r.height + vh * 0.25));
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
   REVEALS + CONTACT TITLE
   ========================================================================== */
function initReveals() {
  const items = $$(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .forEach((entry, i) => {
          io.unobserve(entry.target);
          setTimeout(() => entry.target.classList.add("in"), i * 80);
        });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  items.forEach((el) => io.observe(el));
}

function initContactTitle() {
  const title = $("#contactTitle");
  if (!title) return;
  const lines = $$(".t-inner", title);
  if (reducedMotion || !("IntersectionObserver" in window)) {
    lines.forEach((l) => (l.style.transform = "none"));
    return;
  }
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      lines.forEach((el, i) =>
        el.animate([{ transform: "translateY(110%)" }, { transform: "translateY(0)" }], {
          duration: 1100,
          delay: i * 120,
          easing: EASE,
          fill: "both",
        })
      );
    },
    { threshold: 0.3 }
  );
  io.observe(title);
}

/* ==========================================================================
   COPY EMAIL + TOAST
   ========================================================================== */
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
  <span class="term-accent">goto</span> <span class="term-muted">&lt;hero|work|stack|journey|contact&gt;</span>
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
[02] LLM Cost &amp; Latency Optimizer — FastAPI gateway, semantic cache + provider fallback
     ${link("https://github.com/neelesh1303/LLM_COST_AND_LATENCY_OPTIMIZER", "github ↗")}
[03] SignBridge — Sign ↔ speech AI, 4th at DevJams VIT (100+ teams)
     ${link("https://github.com/neelesh1303/MAJOR_PROJECT_SignBridge", "github ↗")}
[04] FinNIE — Campus lost &amp; found (Flask, MySQL, rate limiting)
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
