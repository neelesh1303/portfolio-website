/**
 * NEELESH KUMAR TRIPATHI - VS CODE PORTFOLIO WORKSPACE
 * File Manager, Tab Controller, Integrated Terminal, and Command Palette
 */

class VSCodeWorkspace {
  constructor() {
    this.activeFile = 'README.md';
    this.openTabs = ['README.md', 'tech-stack.ts', 'projects.tsx', 'gallery.tsx'];
    
    this.fileMetadata = {
      'README.md': { path: 'neelesh-workspace > README.md', lang: 'Markdown', icon: '📝', iconClass: 'icon-md' },
      'tech-stack.ts': { path: 'neelesh-workspace > src > tech-stack.ts', lang: 'TypeScript', icon: '🔷', iconClass: 'icon-ts' },
      'projects.tsx': { path: 'neelesh-workspace > src > projects.tsx', lang: 'TypeScript React', icon: '⚛️', iconClass: 'icon-ts' },
      'gallery.tsx': { path: 'neelesh-workspace > src > developer-in-action.tsx', lang: 'TypeScript React', icon: '📷', iconClass: 'icon-img' },
      'dsa.cpp': { path: 'neelesh-workspace > competitive > dsa-mastery.cpp', lang: 'C++', icon: '⚡', iconClass: 'icon-cpp' },
      'experience.json': { path: 'neelesh-workspace > career > experience.json', lang: 'JSON', icon: '📦', iconClass: 'icon-json' },
      'resume.pdf': { path: 'neelesh-workspace > docs > resume.pdf', lang: 'PDF Preview', icon: '📄', iconClass: 'icon-md' },
      'contact.sh': { path: 'neelesh-workspace > scripts > contact.sh', lang: 'Shell Script', icon: '🐚', iconClass: 'icon-py' }
    };

    this.terminalHistory = [];
  }

  init() {
    this.setupTreeNavigation();
    this.setupTabs();
    this.setupFolderToggles();
    this.setupTerminal();
    this.setupCommandPalette();
    this.setupActivityBar();
    this.setupPanelTabs();
    this.updateBreadcrumbs(this.activeFile);
    this.updateStatusBar(this.activeFile);
    this.renderLineNumbers();
  }

  // File Tree navigation
  setupTreeNavigation() {
    const treeItems = document.querySelectorAll('.tree-node-item[data-file]');
    treeItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const fileId = item.getAttribute('data-file');
        this.openFile(fileId);
      });
    });
  }

  // Editor Tabs setup
  setupTabs() {
    const tabs = document.querySelectorAll('.editor-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-close')) {
          e.stopPropagation();
          const fileId = tab.getAttribute('data-tab');
          this.closeTab(fileId);
          return;
        }
        const fileId = tab.getAttribute('data-tab');
        this.openFile(fileId);
      });
    });
  }

  openFile(fileId) {
    if (!this.fileMetadata[fileId]) return;
    this.activeFile = fileId;

    // Ensure tab exists in openTabs
    if (!this.openTabs.includes(fileId)) {
      this.openTabs.push(fileId);
      this.renderTabsBar();
    }

    // Highlight active tab
    document.querySelectorAll('.editor-tab').forEach(t => {
      if (t.getAttribute('data-tab') === fileId) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    // Highlight active tree item
    document.querySelectorAll('.tree-node-item[data-file]').forEach(node => {
      if (node.getAttribute('data-file') === fileId) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });

    // Switch visible document pane
    document.querySelectorAll('.editor-document-pane').forEach(pane => {
      if (pane.id === `pane-${fileId.replace('.', '-')}`) {
        pane.style.display = 'block';
      } else {
        pane.style.display = 'none';
      }
    });

    this.updateBreadcrumbs(fileId);
    this.updateStatusBar(fileId);
    this.renderLineNumbers();
  }

  closeTab(fileId) {
    if (this.openTabs.length <= 1) return; // keep at least one tab
    const idx = this.openTabs.indexOf(fileId);
    if (idx !== -1) {
      this.openTabs.splice(idx, 1);
      this.renderTabsBar();
      if (this.activeFile === fileId) {
        const nextTab = this.openTabs[Math.max(0, idx - 1)];
        this.openFile(nextTab);
      }
    }
  }

  renderTabsBar() {
    const tabsBar = document.querySelector('.editor-tabs-bar');
    if (!tabsBar) return;

    tabsBar.innerHTML = this.openTabs.map(fileId => {
      const meta = this.fileMetadata[fileId] || { icon: '📄', lang: '' };
      const isActive = fileId === this.activeFile ? 'active' : '';
      return `
        <div class="editor-tab ${isActive}" data-tab="${fileId}">
          <span class="file-icon">${meta.icon}</span>
          <span>${fileId}</span>
          <span class="tab-close" title="Close (Ctrl+W)">&times;</span>
        </div>
      `;
    }).join('');

    this.setupTabs();
  }

  updateBreadcrumbs(fileId) {
    const meta = this.fileMetadata[fileId];
    const breadcrumbsContainer = document.getElementById('editor-breadcrumbs-text');
    if (breadcrumbsContainer && meta) {
      breadcrumbsContainer.textContent = meta.path;
    }
  }

  updateStatusBar(fileId) {
    const meta = this.fileMetadata[fileId];
    const langElem = document.getElementById('status-language');
    if (langElem && meta) {
      langElem.textContent = meta.lang;
    }
  }

  renderLineNumbers() {
    const activePane = document.querySelector('.editor-document-pane[style*="display: block"]') || document.querySelector('.editor-document-pane');
    if (!activePane) return;

    const gutter = activePane.querySelector('.line-numbers-gutter');
    if (!gutter) return;

    // Generate ~65 line numbers
    let numbers = '';
    for (let i = 1; i <= 65; i++) {
      numbers += `${i}<br>`;
    }
    gutter.innerHTML = numbers;
  }

  // Folder Collapsing in Sidebar
  setupFolderToggles() {
    const folderHeaders = document.querySelectorAll('.tree-node-item.folder-node, .tree-section-header');
    folderHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const arrow = header.querySelector('.folder-arrow');
        const subList = header.nextElementSibling;
        if (subList && (subList.tagName === 'UL' || subList.classList.contains('tree-list'))) {
          const isCollapsed = subList.style.display === 'none';
          subList.style.display = isCollapsed ? 'block' : 'none';
          if (arrow) {
            arrow.textContent = isCollapsed ? '▾' : '▸';
          }
        }
      });
    });
  }

  // Integrated Terminal Logic
  setupTerminal() {
    const input = document.getElementById('vscode-terminal-input');
    const output = document.getElementById('vscode-terminal-output');
    if (!input || !output) return;

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = input.value.trim();
        if (cmd) {
          this.executeTerminalCommand(cmd);
          input.value = '';
        }
      }
    });
  }

  executeTerminalCommand(raw) {
    const output = document.getElementById('vscode-terminal-output');
    if (!output) return;

    const line = document.createElement('div');
    line.innerHTML = `<span class="term-prompt-tag">neelesh@dev-machine:~/portfolio$</span> ${raw}`;
    output.appendChild(line);

    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const resp = document.createElement('div');
    resp.style.color = '#cccccc';
    resp.style.margin = '4px 0 8px 0';

    switch (cmd) {
      case 'help':
        resp.innerHTML = `
Available commands:
  <b>cat skills.json</b>       Inspect complete technical stack
  <b>git status</b>             View repository status & commits
  <b>npm test</b>               Run Jest unit & integration tests
  <b>python gateway.py</b>      Simulate LLM semantic cache routing
  <b>open &lt;file&gt;</b>           Open file in editor (e.g. 'open tech-stack.ts')
  <b>clear</b>                  Clear terminal screen
  <b>hire</b>                   Recruit Neelesh Kumar Tripathi
        `;
        break;

      case 'cat':
        if (args[0] === 'skills.json' || args[0] === 'skills') {
          this.openFile('tech-stack.ts');
          resp.innerHTML = `Opening tech-stack.ts in editor...<br><span style="color:#4ec9b0">Languages:</span> C++, Python, JavaScript, SQL, Java<br><span style="color:#4ec9b0">AI/LLM:</span> Gemini API, Groq, Sentence-Transformers, RAG, Semantic Caching<br><span style="color:#4ec9b0">Backend:</span> FastAPI, Node.js, Express.js, Flask, Redis, MongoDB, MySQL`;
        } else if (args[0] === 'README.md' || args[0] === 'readme') {
          this.openFile('README.md');
          resp.innerHTML = `Opened README.md.`;
        } else {
          resp.innerHTML = `cat: ${args.join(' ')}: No such file`;
        }
        break;

      case 'open':
        if (args[0] && this.fileMetadata[args[0]]) {
          this.openFile(args[0]);
          resp.innerHTML = `Opened ${args[0]}.`;
        } else {
          resp.innerHTML = `Usage: open [README.md | tech-stack.ts | projects.tsx | gallery.tsx | dsa.cpp | resume.pdf]`;
        }
        break;

      case 'git':
        if (args[0] === 'status') {
          resp.innerHTML = `On branch <b>main</b><br>Your branch is up to date with 'origin/main'.<br>nothing to commit, working tree clean`;
        } else if (args[0] === 'log') {
          resp.innerHTML = `
* <b>7c89f1a</b> (HEAD -> main) feat(portfolio): mature VS Code workspace environment
* <b>4b12e8c</b> feat(gateway): implement Sentence-Transformers 0.85 cosine cache
* <b>8e34a01</b> feat(crackd): integrate Gemini RAG interview assistant & Redis caching
* <b>2f99d45</b> feat(finnie): sub-10ms MySQL query latency optimization
          `;
        } else {
          resp.innerHTML = `git: type 'git status' or 'git log'`;
        }
        break;

      case 'npm':
        if (args[0] === 'test') {
          resp.innerHTML = `
PASS src/tests/llm-gateway.test.ts (2.1s)<br>
  ✓ should return 4ms cache hit on cosine similarity >= 0.85 (14 ms)<br>
  ✓ should fallback gracefully to Groq/Gemini on cache miss (92 ms)<br>
PASS src/tests/crackd-rag.test.ts (1.8s)<br>
  ✓ should retrieve grounded interview chunks from MongoDB (18 ms)<br>
  ✓ should validate college email domain before JWT issue (8 ms)<br>
<b style="color:#4ec9b0">Tests: 4 passed, 4 total | Snapshots: 0 | Time: 4.12s</b>
          `;
        } else {
          resp.innerHTML = `npm: run 'npm test'`;
        }
        break;

      case 'python':
        resp.innerHTML = `
[LLM Gateway Optimizer]<br>
Telemetry: Active Provider: Groq (LPU 14ms) | Gemini 1.5 Flash (92ms)<br>
Semantic Cache: SQLite 384-d vector index (Threshold: 0.85)<br>
Status: OPTIMAL (Average query execution latency: 4ms)
        `;
        break;

      case 'hire':
        resp.innerHTML = `
<b style="color:#4ec9b0">Dispatching candidate transmission channel:</b><br>
Email: <a href="mailto:neeleshtripathi36@gmail.com">neeleshtripathi36@gmail.com</a><br>
Phone: <a href="tel:+916387974286">+91 6387974286</a><br>
LinkedIn: <a href="https://linkedin.com/in/neelesh-kumar-tripathi" target="_blank">linkedin.com/in/neelesh-kumar-tripathi</a>
        `;
        break;

      case 'clear':
        output.innerHTML = '';
        return;

      default:
        resp.innerHTML = `command not found: ${cmd}. Type 'help' for available commands.`;
        break;
    }

    output.appendChild(resp);
    output.scrollTop = output.scrollHeight;
  }

  // Command Palette Search (Ctrl+P / Input)
  setupCommandPalette() {
    const searchInput = document.querySelector('.command-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.toLowerCase().trim();
        if (query.includes('skill') || query.includes('tech')) {
          this.openFile('tech-stack.ts');
        } else if (query.includes('project')) {
          this.openFile('projects.tsx');
        } else if (query.includes('dsa') || query.includes('leetcode')) {
          this.openFile('dsa.cpp');
        } else if (query.includes('photo') || query.includes('gallery')) {
          this.openFile('gallery.tsx');
        } else if (query.includes('resume')) {
          this.openFile('resume.pdf');
        } else {
          this.openFile('README.md');
        }
        searchInput.value = '';
        searchInput.blur();
      }
    });

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

  // Activity Bar clicks
  setupActivityBar() {
    const activityBtns = document.querySelectorAll('.activity-btn');
    const sidebar = document.querySelector('.vscode-sidebar');

    activityBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        activityBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const action = btn.getAttribute('data-action');
        if (action === 'explorer') {
          sidebar.classList.toggle('open');
        } else if (action === 'search') {
          document.querySelector('.command-search-input')?.focus();
        } else if (action === 'git') {
          this.openFile('projects.tsx');
        } else if (action === 'extensions') {
          this.openFile('tech-stack.ts');
        }
      });
    });
  }

  // Bottom Panel Tab switcher
  setupPanelTabs() {
    const panelTabs = document.querySelectorAll('.panel-tab');
    panelTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        panelTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.vscodeWorkspace = new VSCodeWorkspace();
  window.vscodeWorkspace.init();
});
