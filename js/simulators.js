/**
 * SYNAPSE // NEELESH.OS - Interactive Simulators Engine
 * 1. LLM Gateway & Semantic Cache Simulator (Sentence-Transformers & Cosine Similarity)
 * 2. Crackd AI Placement Prep & RAG Assistant
 * 3. SignSync DevJams Hackathon Gesture Visualizer & Speech Synthesizer
 * 4. DSA Algorithm Step-by-Step Visualizer
 */

class SimulatorSuite {
  constructor() {
    this.totalQueries = 4;
    this.cacheHits = 3;
    this.tokensSaved = 4120;
    this.usdSaved = 0.0824;

    // Pre-cached semantic database records (simulating Sentence-Transformers all-MiniLM-L6-v2 embeddings)
    this.semanticCacheDB = [
      {
        prompt: "explain quicksort algorithm with time complexity",
        keywords: ["quicksort", "time", "complexity", "algorithm", "partition", "o(n log n)"],
        cachedResponse: "QuickSort is a divide-and-conquer sorting algorithm with an average time complexity of O(n log n) and worst-case O(n²). It selects a 'pivot' element and partitions array elements around the pivot.",
        tokens: 142,
        cost: 0.00021
      },
      {
        prompt: "write express.js jwt authentication middleware",
        keywords: ["express", "jwt", "auth", "middleware", "token", "verify"],
        cachedResponse: "const jwt = require('jsonwebtoken');\nconst auth = (req, res, next) => {\n  const token = req.header('Authorization')?.replace('Bearer ', '');\n  if (!token) return res.status(401).send('Access denied');\n  try {\n    req.user = jwt.verify(token, process.env.JWT_SECRET);\n    next();\n  } catch (ex) { res.status(400).send('Invalid token'); }\n};",
        tokens: 198,
        cost: 0.00030
      },
      {
        prompt: "how to implement redis caching with fallback in node.js",
        keywords: ["redis", "cache", "fallback", "node", "mongo", "query"],
        cachedResponse: "First query Redis with redisClient.get(key). If cache hit, return immediately (~2ms). On cache miss or Redis failure, fallback gracefully to MongoDB query and asynchronously populate Redis with TTL.",
        tokens: 165,
        cost: 0.00025
      }
    ];

    // Hand skeleton keypoint coordinates for gestures (21 standard MediaPipe points)
    this.gesturePoses = {
      "thumbs-up": [
        {x: 240, y: 220}, {x: 210, y: 200}, {x: 200, y: 170}, {x: 200, y: 140}, {x: 200, y: 110}, // Thumb (pointing up)
        {x: 230, y: 170}, {x: 230, y: 190}, {x: 230, y: 205}, {x: 230, y: 215}, // Index curled
        {x: 250, y: 170}, {x: 250, y: 190}, {x: 250, y: 205}, {x: 250, y: 215}, // Middle curled
        {x: 270, y: 175}, {x: 270, y: 195}, {x: 270, y: 210}, {x: 270, y: 220}, // Ring curled
        {x: 290, y: 185}, {x: 290, y: 200}, {x: 290, y: 215}, {x: 290, y: 225}  // Pinky curled
      ],
      "peace": [
        {x: 240, y: 220}, {x: 210, y: 210}, {x: 195, y: 215}, {x: 185, y: 220}, {x: 180, y: 225}, // Thumb tucked
        {x: 225, y: 165}, {x: 215, y: 130}, {x: 205, y: 100}, {x: 195, y: 70},  // Index extended V
        {x: 255, y: 165}, {x: 265, y: 130}, {x: 275, y: 100}, {x: 285, y: 70},  // Middle extended V
        {x: 275, y: 180}, {x: 275, y: 200}, {x: 275, y: 215}, {x: 275, y: 225}, // Ring curled
        {x: 295, y: 190}, {x: 295, y: 205}, {x: 295, y: 215}, {x: 295, y: 225}  // Pinky curled
      ],
      "open-hand": [
        {x: 240, y: 220}, {x: 200, y: 205}, {x: 175, y: 180}, {x: 155, y: 160}, {x: 140, y: 145}, // Thumb spread
        {x: 220, y: 160}, {x: 210, y: 125}, {x: 200, y: 95}, {x: 190, y: 65},  // Index up
        {x: 240, y: 155}, {x: 240, y: 120}, {x: 240, y: 85}, {x: 240, y: 55},  // Middle up
        {x: 260, y: 160}, {x: 270, y: 125}, {x: 280, y: 95}, {x: 290, y: 65},  // Ring up
        {x: 280, y: 170}, {x: 295, y: 140}, {x: 310, y: 110}, {x: 325, y: 80}  // Pinky up
      ],
      "fist": [
        {x: 240, y: 220}, {x: 215, y: 200}, {x: 205, y: 180}, {x: 215, y: 170}, {x: 235, y: 170}, // Thumb over fingers
        {x: 225, y: 180}, {x: 225, y: 200}, {x: 225, y: 215}, {x: 225, y: 225}, // Index
        {x: 245, y: 180}, {x: 245, y: 200}, {x: 245, y: 215}, {x: 245, y: 225}, // Middle
        {x: 265, y: 180}, {x: 265, y: 200}, {x: 265, y: 215}, {x: 265, y: 225}, // Ring
        {x: 285, y: 185}, {x: 285, y: 205}, {x: 285, y: 215}, {x: 285, y: 225}  // Pinky
      ],
      "ily": [
        {x: 240, y: 220}, {x: 200, y: 205}, {x: 175, y: 180}, {x: 155, y: 160}, {x: 140, y: 145}, // Thumb out
        {x: 220, y: 160}, {x: 210, y: 125}, {x: 200, y: 95}, {x: 190, y: 65},  // Index up
        {x: 245, y: 180}, {x: 245, y: 200}, {x: 245, y: 215}, {x: 245, y: 225}, // Middle down
        {x: 265, y: 180}, {x: 265, y: 200}, {x: 265, y: 215}, {x: 265, y: 225}, // Ring down
        {x: 280, y: 170}, {x: 295, y: 140}, {x: 310, y: 110}, {x: 325, y: 80}  // Pinky up
      ]
    };

    // Connections between 21 hand points (palm + 5 fingers)
    this.handConnections = [
      [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8],       // Index
      [0, 9], [9, 10], [10, 11], [11, 12],  // Middle
      [0, 13], [13, 14], [14, 15], [15, 16],// Ring
      [0, 17], [17, 18], [18, 19], [19, 20],// Pinky
      [5, 9], [9, 13], [13, 17]              // Knuckle base
    ];

    this.currentGesture = "peace";
    this.isSortingRunning = false;
    this.sortArray = [38, 72, 14, 95, 48, 62, 29, 84, 51, 19, 90, 42, 67, 33];
  }

  init() {
    this.setupTabNavigation();
    this.setupGatewaySimulator();
    this.setupCrackdRoadmap();
    this.setupSignSyncCanvas();
    this.setupAlgoVisualizer();
  }

  setupTabNavigation() {
    const tabBtns = document.querySelectorAll('.sim-tab-btn');
    const panels = document.querySelectorAll('.sim-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.cyberAudio?.playClick();
        tabBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-tab');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }

        // Redraw canvas if signsync opened
        if (targetId === 'sim-signsync') {
          setTimeout(() => this.drawGesture(this.currentGesture), 50);
        }
      });
    });
  }

  // ==========================================
  // 1. LLM GATEWAY & SEMANTIC CACHING ENGINE
  // ==========================================
  setupGatewaySimulator() {
    const runBtn = document.getElementById('run-gateway-btn');
    const promptInput = document.getElementById('gateway-prompt-input');
    const presetPills = document.querySelectorAll('.preset-pill');

    presetPills.forEach(pill => {
      pill.addEventListener('click', () => {
        window.cyberAudio?.playClick();
        if (promptInput) {
          promptInput.value = pill.getAttribute('data-prompt') || pill.textContent.trim();
        }
      });
    });

    if (runBtn && promptInput) {
      runBtn.addEventListener('click', () => {
        const text = promptInput.value.trim();
        if (!text) return;
        this.executeGatewayRouting(text);
      });
    }
  }

  // Cosine similarity between user prompt tokens and cached DB records
  calculateCosineSimilarity(userText, cachedRecord) {
    const words = userText.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
    if (words.length === 0) return 0;

    let matchScore = 0;
    cachedRecord.keywords.forEach(kw => {
      if (words.includes(kw)) matchScore += 1.0;
      else {
        // partial match
        if (words.some(w => w.includes(kw) || kw.includes(w))) matchScore += 0.5;
      }
    });

    const sim = Math.min(0.98, Math.max(0.12, (matchScore / cachedRecord.keywords.length) * 1.15));
    return parseFloat(sim.toFixed(2));
  }

  executeGatewayRouting(promptText) {
    window.cyberAudio?.playClick();

    // Reset node highlights
    const nodes = document.querySelectorAll('.pipe-node');
    nodes.forEach(n => {
      n.classList.remove('active-route', 'active-cache');
    });

    const nodeIngest = document.getElementById('node-ingest');
    const nodeCache = document.getElementById('node-cache');
    const nodeLlm = document.getElementById('node-llm');
    const nodeResponse = document.getElementById('node-response');

    nodeIngest?.classList.add('active-route');

    // Find closest match in semantic cache DB
    let bestMatch = null;
    let highestSim = 0;

    for (const record of this.semanticCacheDB) {
      const sim = this.calculateCosineSimilarity(promptText, record);
      if (sim > highestSim) {
        highestSim = sim;
        bestMatch = record;
      }
    }

    const similarityFill = document.getElementById('sim-meter-fill');
    const similarityScoreText = document.getElementById('sim-score-text');
    const statusBadge = document.getElementById('gateway-status-badge');
    const routeTierBadge = document.getElementById('gateway-route-tier');
    const latencyVal = document.getElementById('gateway-latency-val');
    const costVal = document.getElementById('gateway-cost-val');
    const outputText = document.getElementById('gateway-output-text');

    // Animate similarity bar
    const simPercent = Math.round(highestSim * 100);
    if (similarityFill) similarityFill.style.width = `${simPercent}%`;
    if (similarityScoreText) similarityScoreText.textContent = `${highestSim.toFixed(2)} (Threshold: 0.85)`;

    setTimeout(() => {
      this.totalQueries++;

      if (highestSim >= 0.85 && bestMatch) {
        // --- CACHE HIT ---
        this.cacheHits++;
        this.tokensSaved += bestMatch.tokens;
        this.usdSaved += bestMatch.cost;

        nodeCache?.classList.add('active-cache');
        nodeResponse?.classList.add('active-cache');

        window.cyberAudio?.playCacheHit();

        if (statusBadge) {
          statusBadge.className = 'monitor-badge badge-hit';
          statusBadge.textContent = 'CACHE HIT (0.85+)';
        }
        if (routeTierBadge) routeTierBadge.textContent = 'SQLite Semantic Cache (Sentence-Transformers all-MiniLM-L6-v2)';
        if (latencyVal) latencyVal.textContent = '4 ms (Fastest)';
        if (costVal) costVal.textContent = '$0.00000 (Saved 100%)';
        if (outputText) outputText.textContent = bestMatch.cachedResponse;
      } else {
        // --- CACHE MISS -> ROUTE TO LLM TIER ---
        window.cyberAudio?.playRoutePulse();

        nodeCache?.classList.add('active-route');
        nodeLlm?.classList.add('active-route');
        nodeResponse?.classList.add('active-route');

        // Dynamic routing logic based on prompt length
        let provider = "Groq LLaMA 3.3 70B (Fast LPU)";
        let latency = 28;
        let cost = 0.00018;

        if (promptText.length > 120) {
          provider = "Google Gemini 1.5 Flash (Deep Reasoning)";
          latency = 94;
          cost = 0.00035;
        }

        if (statusBadge) {
          statusBadge.className = 'monitor-badge badge-miss';
          statusBadge.textContent = 'CACHE MISS -> LLM ROUTED';
        }
        if (routeTierBadge) routeTierBadge.textContent = provider;
        if (latencyVal) latencyVal.textContent = `${latency} ms`;
        if (costVal) costVal.textContent = `$${cost.toFixed(5)}`;
        if (outputText) {
          outputText.textContent = `[Live Response Stream from ${provider}]\nProcessed query: "${promptText}"\nEmbedding computed via Sentence-Transformers and indexed into SQLite with cosine threshold 0.85. Subsequent identical or paraphrased prompts will achieve instantaneous 4ms cache hit rate.`;
        }
      }

      // Update telemetry counters
      const totalQElem = document.getElementById('stat-total-queries');
      const hitRateElem = document.getElementById('stat-hit-rate');
      const tokensSavedElem = document.getElementById('stat-tokens-saved');

      if (totalQElem) totalQElem.textContent = this.totalQueries;
      if (hitRateElem) {
        const rate = Math.round((this.cacheHits / this.totalQueries) * 100);
        hitRateElem.textContent = `${rate}%`;
      }
      if (tokensSavedElem) tokensSavedElem.textContent = this.tokensSaved.toLocaleString();
    }, 280);
  }

  // ==========================================
  // 2. CRACKD AI ROADMAP & RAG ASSISTANT
  // ==========================================
  setupCrackdRoadmap() {
    const companySelect = document.getElementById('crackd-company-select');
    const timelineSelect = document.getElementById('crackd-timeline-select');
    const ragInput = document.getElementById('crackd-rag-input');
    const ragBtn = document.getElementById('crackd-rag-btn');

    const updateRoadmap = () => {
      const company = companySelect ? companySelect.value : 'Google';
      const days = timelineSelect ? timelineSelect.value : '60';
      this.renderCrackdRoadmap(company, days);
    };

    companySelect?.addEventListener('change', updateRoadmap);
    timelineSelect?.addEventListener('change', updateRoadmap);

    ragBtn?.addEventListener('click', () => {
      const q = ragInput ? ragInput.value.trim() : '';
      if (!q) return;
      this.executeRagQuery(q);
    });

    // Initial render
    this.renderCrackdRoadmap('Google', '60');
  }

  renderCrackdRoadmap(company, days) {
    const container = document.getElementById('roadmap-steps-container');
    if (!container) return;

    const data = [
      {
        step: 1,
        title: `Phase 1: Core DSA Foundations & Patterns (${Math.round(days * 0.35)} Days)`,
        desc: `High-frequency ${company} interview problem patterns: Dynamic Programming, Graph Traversals (BFS/DFS, Dijkstra), Two Pointers, and Binary Trees.`,
        tag: 'Google Gemini Roadmap API • Topic Checklist'
      },
      {
        step: 2,
        title: `Phase 2: Low-Level & High-Level System Design (${Math.round(days * 0.35)} Days)`,
        desc: `Architecting scalable distributed systems: Caching strategies with Redis fallback, database indexing (B-Trees), horizontal sharding, and API rate limiting.`,
        tag: 'Architecture Blueprints • Microservices'
      },
      {
        step: 3,
        title: `Phase 3: RAG Senior Interview Archives & Mock Drills (${Math.round(days * 0.30)} Days)`,
        desc: `Senior student interview archives retrieved with Gemini cosine embeddings: Behavioral questions (STAR methodology), college domain checks, and live coding timer.`,
        tag: 'Verified Student Transcripts • Grounded RAG'
      }
    ];

    container.innerHTML = data.map(item => `
      <div class="roadmap-step-card">
        <div class="step-marker">${item.step}</div>
        <div class="step-content">
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
          <span class="step-tag-pill">${item.tag}</span>
        </div>
      </div>
    `).join('');
  }

  executeRagQuery(queryText) {
    window.cyberAudio?.playClick();
    const resultBox = document.getElementById('rag-retrieval-results');
    if (!resultBox) return;

    resultBox.innerHTML = `
      <div class="rag-retrieval-card" style="border-color: var(--accent-cyan); animation: fadeIn 0.3s ease;">
        <span class="rag-score-pill">0.93 Cosine Match</span>
        <h4 style="color: var(--text-primary); font-size: 0.92rem; margin-bottom: 0.4rem;">
          Verified Archive: Senior SDE Candidate Interview Experience
        </h4>
        <p style="color: var(--text-secondary); font-size: 0.82rem; line-height: 1.5;">
          "Candidate was asked: <i>${queryText}</i>. Grounded interview advice: Structure answers around scalability tradeoffs. In round 2, the interviewer focused on cache inconsistency handling when write-heavy workloads hit Redis, and how graceful fallbacks prevent cascade failure."
        </p>
        <div style="margin-top: 0.5rem; font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-accent);">
          Source: NIE Campus Verified Placement Archive #2026-A4
        </div>
      </div>
    `;
  }

  // ==========================================
  // 3. SIGNSYNC GESTURE CANVAS & SPEECH
  // ==========================================
  setupSignSyncCanvas() {
    this.canvas = document.getElementById('gesture-canvas');
    if (!this.canvas) return;
    this.gCtx = this.canvas.getContext('2d');

    const gestureBtns = document.querySelectorAll('.gesture-btn');
    gestureBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.cyberAudio?.playClick();
        gestureBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const gName = btn.getAttribute('data-gesture');
        this.currentGesture = gName;
        this.drawGesture(gName);
        this.updateGestureTranslation(gName);
      });
    });

    const speakBtn = document.getElementById('signsync-speak-btn');
    speakBtn?.addEventListener('click', () => {
      const textElem = document.getElementById('gesture-translation-text');
      if (textElem && 'speechSynthesis' in window) {
        window.cyberAudio?.playClick();
        const utterance = new SpeechSynthesisUtterance(textElem.textContent.trim());
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      }
    });

    // Draw initial pose
    setTimeout(() => {
      this.drawGesture('peace');
    }, 100);
  }

  drawGesture(gestureKey) {
    if (!this.canvas || !this.gCtx) return;
    const w = this.canvas.width = 480;
    const h = this.canvas.height = 280;
    const points = this.gesturePoses[gestureKey] || this.gesturePoses['peace'];

    this.gCtx.clearRect(0, 0, w, h);

    // Subtle background circular radar
    this.gCtx.beginPath();
    this.gCtx.arc(240, 160, 100, 0, Math.PI * 2);
    this.gCtx.strokeStyle = 'rgba(245, 158, 11, 0.15)';
    this.gCtx.lineWidth = 1;
    this.gCtx.setLineDash([4, 6]);
    this.gCtx.stroke();
    this.gCtx.setLineDash([]);

    // Draw skeleton bone connections
    this.handConnections.forEach(([i, j]) => {
      const p1 = points[i];
      const p2 = points[j];
      if (!p1 || !p2) return;

      this.gCtx.beginPath();
      this.gCtx.moveTo(p1.x, p1.y);
      this.gCtx.lineTo(p2.x, p2.y);
      this.gCtx.strokeStyle = 'rgba(0, 229, 255, 0.65)';
      this.gCtx.lineWidth = 2.5;
      this.gCtx.stroke();
    });

    // Draw landmark joint nodes
    points.forEach((pt, index) => {
      this.gCtx.beginPath();
      this.gCtx.arc(pt.x, pt.y, index === 0 ? 6 : 4, 0, Math.PI * 2);
      this.gCtx.fillStyle = index === 0 ? '#f43f5e' : (index % 4 === 0 ? '#f59e0b' : '#00e5ff');
      this.gCtx.shadowColor = '#00e5ff';
      this.gCtx.shadowBlur = 8;
      this.gCtx.fill();
      this.gCtx.shadowBlur = 0;
    });
  }

  updateGestureTranslation(gestureKey) {
    const translations = {
      'peace': { text: '"Peace / Victory"', confidence: '96.4%', intent: 'Greeting / Success' },
      'thumbs-up': { text: '"Good / Understood"', confidence: '98.1%', intent: 'Affirmative Confirmation' },
      'open-hand': { text: '"Hello / Stop"', confidence: '94.8%', intent: 'Attention / Salutation' },
      'fist': { text: '"Strength / Ready"', confidence: '92.3%', intent: 'Determined Action' },
      'ily': { text: '"I Appreciate You"', confidence: '97.2%', intent: 'Gratitude / Warmth' }
    };

    const data = translations[gestureKey] || translations['peace'];
    const textElem = document.getElementById('gesture-translation-text');
    const confElem = document.getElementById('gesture-conf-val');
    const intentElem = document.getElementById('gesture-intent-val');

    if (textElem) textElem.textContent = data.text;
    if (confElem) confElem.textContent = data.confidence;
    if (intentElem) intentElem.textContent = data.intent;
  }

  // ==========================================
  // 4. DSA STEP-BY-STEP ALGORITHM VISUALIZER
  // ==========================================
  setupAlgoVisualizer() {
    this.renderAlgoBars();

    const startBtn = document.getElementById('start-sort-btn');
    const shuffleBtn = document.getElementById('shuffle-sort-btn');
    const algoBtns = document.querySelectorAll('.algo-btn');

    algoBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        window.cyberAudio?.playClick();
        algoBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    shuffleBtn?.addEventListener('click', () => {
      if (this.isSortingRunning) return;
      window.cyberAudio?.playClick();
      this.shuffleArray();
      this.renderAlgoBars();
    });

    startBtn?.addEventListener('click', () => {
      if (this.isSortingRunning) return;
      this.runQuickSort();
    });
  }

  shuffleArray() {
    for (let i = this.sortArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.sortArray[i], this.sortArray[j]] = [this.sortArray[j], this.sortArray[i]];
    }
  }

  renderAlgoBars(comparingIndices = [], sortedIndices = []) {
    const container = document.getElementById('algo-display-container');
    if (!container) return;

    container.innerHTML = this.sortArray.map((val, idx) => {
      const isComp = comparingIndices.includes(idx);
      const isSorted = sortedIndices.includes(idx);
      const classes = `algo-bar ${isComp ? 'comparing' : ''} ${isSorted ? 'sorted' : ''}`;
      return `<div class="${classes}" style="height: ${val * 1.8}px;" title="Value: ${val}"></div>`;
    }).join('');
  }

  async runQuickSort() {
    this.isSortingRunning = true;
    const startBtn = document.getElementById('start-sort-btn');
    if (startBtn) startBtn.disabled = true;

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const partition = async (low, high) => {
      const pivot = this.sortArray[high];
      let i = low - 1;

      for (let j = low; j < high; j++) {
        this.renderAlgoBars([j, high]);
        window.cyberAudio?.playAlgoTone(this.sortArray[j], 100);
        await sleep(90);

        if (this.sortArray[j] < pivot) {
          i++;
          [this.sortArray[i], this.sortArray[j]] = [this.sortArray[j], this.sortArray[i]];
          this.renderAlgoBars([i, j]);
          await sleep(60);
        }
      }

      [this.sortArray[i + 1], this.sortArray[high]] = [this.sortArray[high], this.sortArray[i + 1]];
      this.renderAlgoBars([i + 1, high]);
      await sleep(90);
      return i + 1;
    };

    const quickSort = async (low, high) => {
      if (low < high) {
        const pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
      }
    };

    await quickSort(0, this.sortArray.length - 1);

    // Final celebratory sorted sweep
    for (let i = 0; i < this.sortArray.length; i++) {
      window.cyberAudio?.playAlgoTone(this.sortArray[i], 100);
      this.renderAlgoBars([], Array.from({length: i + 1}, (_, k) => k));
      await sleep(40);
    }

    window.cyberAudio?.playCacheHit();
    this.isSortingRunning = false;
    if (startBtn) startBtn.disabled = false;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.simulators = new SimulatorSuite();
  window.simulators.init();
});
