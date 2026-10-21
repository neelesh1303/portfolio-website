/**
 * SYNAPSE // NEELESH.OS - Cyber Terminal (Command Deck)
 * Interactive shell interpreter triggered via Ctrl+K / Cmd+K or UI button
 */

class CyberTerminal {
  constructor() {
    this.modal = document.getElementById('terminal-modal');
    this.input = document.getElementById('terminal-input');
    this.output = document.getElementById('terminal-output');
    this.isOpen = false;
    this.history = [];
    this.historyIndex = -1;
  }

  init() {
    if (!this.modal || !this.input) return;

    // Global keyboard shortcut: Ctrl+K / Cmd+K or Backquote `
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    const openBtns = document.querySelectorAll('.open-terminal-trigger');
    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    const closeBtn = document.getElementById('terminal-close-btn');
    closeBtn?.addEventListener('click', () => this.close());

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    // Command Input Handling
    this.input.addEventListener('keydown', (e) => {
      window.cyberAudio?.playKeypress();

      if (e.key === 'Enter') {
        const cmd = this.input.value.trim();
        if (cmd) {
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          this.executeCommand(cmd);
          this.input.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex] || '';
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      }
    });
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    this.isOpen = true;
    this.modal.classList.add('open');
    window.cyberAudio?.playClick();
    setTimeout(() => this.input.focus(), 150);
  }

  close() {
    this.isOpen = false;
    this.modal.classList.remove('open');
  }

  print(content, className = '') {
    const line = document.createElement('div');
    line.className = `term-line-output ${className}`;
    line.innerHTML = content;
    this.output.appendChild(line);
    this.output.scrollTop = this.output.scrollHeight;
  }

  executeCommand(rawCmd) {
    this.print(`<span class="term-prompt-symbol">guest@neelesh-os:~$</span> <span class="term-command-echo">${rawCmd}</span>`);
    const parts = rawCmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case 'help':
        this.print(`
Available commands:
  <b style="color:var(--accent-cyan)">projects</b>          List featured production systems
  <b style="color:var(--accent-cyan)">skills</b>            Inspect full engineering tech stack
  <b style="color:var(--accent-cyan)">dsa</b>               View problem-solving & competitive metrics
  <b style="color:var(--accent-cyan)">cat resume</b>        Display complete resume details
  <b style="color:var(--accent-cyan)">route &lt;prompt&gt;</b>     Test LLM semantic routing from terminal
  <b style="color:var(--accent-cyan)">theme &lt;name&gt;</b>       Change theme (obsidian, matrix, nebula, light)
  <b style="color:var(--accent-cyan)">contact</b>           Display contact coordinates & social links
  <b style="color:var(--accent-cyan)">sudo hire</b>         Offer a role to Neelesh
  <b style="color:var(--accent-cyan)">clear</b>             Clear terminal screen
        `);
        break;

      case 'cat':
        if (args[0] === 'resume' || args[0] === 'resume.pdf' || args[0] === 'resume.txt') {
          this.print(`
<b style="color:#fff">NEELESH KUMAR TRIPATHI</b>
• BE in Information Science @ The National Institute of Engineering, Mysuru (CGPA: 8.60/10)
• AI Systems & Full-Stack Developer | 500+ DSA Solved (LeetCode Global Rating ~1533)
• Key Projects: Crackd (MERN + Gemini RAG), LLM Cost & Latency Optimizer, FinNIE, SignBridge (VIT 4th)
• Phone: +91 6387974286 | Email: neeleshtripathi36@gmail.com
<a href="#resume-modal" onclick="window.appController?.openResumeModal();" style="color:var(--accent-cyan); text-decoration:underline;">[Click to launch Full High-Res Resume Modal]</a>
          `);
        } else {
          this.print(`cat: file '${args.join(' ')}' not found. Try 'cat resume'`);
        }
        break;

      case 'resume':
        window.appController?.openResumeModal();
        this.print(`Opening full interactive resume viewer...`);
        break;

      case 'projects':
        this.print(`
<b style="color:var(--accent-cyan)">1. LLM Cost & Latency Optimizer Gateway</b>
   Python, FastAPI, Sentence-Transformers, Groq, Gemini, SQLite
   Semantic cache (cosine 0.85), sub-10ms query reuse, multi-tier LLM fallback.

<b style="color:var(--accent-cyan)">2. Crackd – AI Placement Platform</b>
   MERN Stack, MongoDB, JWT, Google Gemini RAG, Redis Cache
   Role-specific prep roadmaps, interview assistance via vector embeddings.

<b style="color:var(--accent-cyan)">3. SignBridge – Sign ↔ Speech Translation</b>
   Python, OpenCV, Whisper, ML Gesture Recognition (80% Acc)
   Ranked 4th / 100+ teams at DevJams VIT.

<b style="color:var(--accent-cyan)">4. FinNIE – Campus Lost & Found</b>
   Flask, MySQL (~10ms latency), Flask-Limiter, Keyword Search.
        `);
        break;

      case 'skills':
        this.print(`
<b style="color:var(--accent-cyan)">Languages:</b> C, C++, Python, JavaScript, SQL, Java
<b style="color:var(--accent-cyan)">AI / LLM:</b> Gemini API, Groq, OpenRouter, RAG, Semantic Caching, Embeddings
<b style="color:var(--accent-cyan)">Backend:</b> Node.js, Express.js, FastAPI, Flask, RESTful APIs, JWT Auth
<b style="color:var(--accent-cyan)">Databases:</b> MongoDB, MySQL, SQLite, Redis
<b style="color:var(--accent-cyan)">DevOps:</b> Git, GitHub Actions, Docker, Jest, Supertest, Postman
        `);
        break;

      case 'dsa':
        this.print(`
<b style="color:var(--accent-green)">DSA & COMPETITIVE PROGRAMMING STATS:</b>
• Solved 500+ Data Structures & Algorithms problems
• LeetCode Global Rating ~1533
• Core Proficiencies: Graphs (BFS/DFS, Dijkstra), DP, Trees & BST, Two Pointers, Tries
• Profile: <a href="https://codolio.com/profile/neelesh1303" target="_blank" style="color:var(--accent-cyan)">codolio.com/profile/neelesh1303</a>
        `);
        break;

      case 'route':
        const testPrompt = args.join(' ') || "explain quicksort algorithm";
        this.print(`Routing prompt through Sentence-Transformers vectorizer...`);
        if (window.simulators) {
          window.simulators.executeGatewayRouting(testPrompt);
        }
        this.print(`Simulated gateway executed. Check simulator lab for visual telemetry.`);
        break;

      case 'theme':
        const chosen = (args[0] || '').toLowerCase();
        if (['obsidian', 'matrix', 'nebula', 'light'].includes(chosen)) {
          window.appController?.setTheme(chosen);
          this.print(`Theme switched to: <b style="color:var(--accent-cyan)">${chosen}</b>`);
        } else {
          this.print(`Usage: theme [obsidian | matrix | nebula | light]`);
        }
        break;

      case 'contact':
        this.print(`
<b style="color:var(--accent-cyan)">CONTACT NEELESH KUMAR TRIPATHI:</b>
• Email:    <a href="mailto:neeleshtripathi36@gmail.com" style="color:#fff">neeleshtripathi36@gmail.com</a>
• Phone:    <a href="tel:+916387974286" style="color:#fff">+91 6387974286</a>
• LinkedIn: <a href="https://linkedin.com/in/neelesh-kumar-tripathi" target="_blank" style="color:var(--accent-cyan)">linkedin.com/in/neelesh-kumar-tripathi</a>
• GitHub:   <a href="https://github.com/neelesh1303" target="_blank" style="color:var(--accent-cyan)">github.com/neelesh1303</a>
        `);
        break;

      case 'sudo':
        if (args[0] === 'hire' || args[0] === 'hire-neelesh') {
          window.cyberAudio?.playCacheHit();
          this.print(`
<b style="color:var(--accent-green)">[ACCESS GRANTED: ROOT CANDIDATE MATCH]</b>
🎉 Congratulations! You made the best engineering hire decision of 2026!
Dispatching fast-track recruitment channel...
          `);
          setTimeout(() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            this.close();
          }, 1200);
        } else {
          this.print(`sudo: unauthorized command '${args.join(' ')}'`);
        }
        break;

      case 'clear':
        this.output.innerHTML = '';
        break;

      default:
        this.print(`Command not recognized: '${command}'. Type <b style="color:var(--accent-cyan)">help</b> for available commands.`);
        break;
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.cyberTerminal = new CyberTerminal();
  window.cyberTerminal.init();
});
