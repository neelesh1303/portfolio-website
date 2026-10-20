/**
 * SYNAPSE // NEELESH.OS - Quantum Neural Particle Constellation
 * Interactive force field, synaptic filament lines, and click shockwaves.
 */

class NeuralConstellation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.particles = [];
    this.shockwaves = [];
    this.mouse = {
      x: -1000,
      y: -1000,
      radius: 160,
      isDown: false
    };

    this.accentColor = '#00e5ff';
    this.secondaryColor = '#a855f7';
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    window.addEventListener('click', (e) => {
      this.createShockwave(e.clientX, e.clientY);
    });

    this.createParticles();
    this.updateColors();
    this.animate();
  }

  updateColors() {
    const computed = getComputedStyle(document.documentElement);
    this.accentColor = computed.getPropertyValue('--accent-cyan').trim() || '#00e5ff';
    this.secondaryColor = computed.getPropertyValue('--accent-purple').trim() || '#a855f7';
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    if (this.particles.length > 0) {
      this.createParticles();
    }
  }

  createParticles() {
    this.particles = [];
    // Responsive count: ~70 on desktop, ~35 on mobile for 60fps performance
    const count = this.width < 768 ? 36 : 75;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        originX: 0,
        originY: 0,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulseVal: Math.random() * Math.PI,
        colorTier: Math.random() > 0.3 ? 1 : 2
      });
    }
  }

  createShockwave(x, y) {
    this.shockwaves.push({
      x: x,
      y: y,
      radius: 5,
      maxRadius: 180,
      alpha: 0.8,
      speed: 6
    });

    // Displace particles near shockwave
    this.particles.forEach(p => {
      const dx = p.x - x;
      const dy = p.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150 && dist > 0) {
        const force = (150 - dist) / 150;
        p.vx += (dx / dist) * force * 5;
        p.vy += (dy / dist) * force * 5;
      }
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += sw.speed;
      sw.alpha -= 0.025;

      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
        this.shockwaves.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(0, 229, 255, ${sw.alpha * 0.5})`;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }

    // Update and draw particles
    const connectDist = this.width < 768 ? 95 : 135;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Natural drift
      p.x += p.vx;
      p.y += p.vy;

      // Friction to stabilize velocity after mouse shock
      p.vx *= 0.985;
      p.vy *= 0.985;

      // Keep minimum velocity
      if (Math.abs(p.vx) < 0.2) p.vx += (Math.random() - 0.5) * 0.1;
      if (Math.abs(p.vy) < 0.2) p.vy += (Math.random() - 0.5) * 0.1;

      // Bounce at boundary
      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      if (p.x > this.width) { p.x = this.width; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      if (p.y > this.height) { p.y = this.height; p.vy *= -1; }

      // Mouse interactive force field (gentle gravitation / deflection)
      const mdx = this.mouse.x - p.x;
      const mdy = this.mouse.y - p.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

      if (mdist < this.mouse.radius) {
        const force = (this.mouse.radius - mdist) / this.mouse.radius;
        // Float towards mouse gently
        p.vx += (mdx / mdist) * force * 0.25;
        p.vy += (mdy / mdist) * force * 0.25;
      }

      // Pulse alpha
      p.pulseVal += p.pulseSpeed;
      const currentAlpha = p.alpha + Math.sin(p.pulseVal) * 0.25;
      const clampedAlpha = Math.max(0.1, Math.min(0.9, currentAlpha));

      // Draw node point
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.colorTier === 1 
        ? `rgba(0, 229, 255, ${clampedAlpha})` 
        : `rgba(168, 85, 247, ${clampedAlpha})`;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.colorTier === 1 ? this.accentColor : this.secondaryColor;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      // Synaptic connection filaments
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectDist) {
          const lineAlpha = (1 - dist / connectDist) * 0.28;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(0, 229, 255, ${lineAlpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.neuralCanvas = new NeuralConstellation('neural-canvas');
});
