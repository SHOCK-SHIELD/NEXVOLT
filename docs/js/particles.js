/**
 * ShockShield - Particle System
 * Electrical hazard themed animated background
 */

class ParticleSystem {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.lightnings = [];
    this.nodes = [];
    this.animationId = null;
    
    this.options = {
      particleCount: 80,
      nodeCount: 15,
      maxConnections: 3,
      connectionDistance: 150,
      particleSpeed: 0.3,
      lightningChance: 0.002,
      colors: {
        primary: '#FFD700',
        secondary: '#FF6B00',
        danger: '#FF0033',
        accent: '#00E676'
      },
      ...options
    };

    this.resize();
    this.init();
    this.animate();
    
    window.addEventListener('resize', Utils.debounce(() => this.resize(), 250));
  }

  init() {
    this.createParticles();
    this.createNodes();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    this.ctx.scale(dpr, dpr);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.options.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * this.options.particleSpeed,
        vy: (Math.random() - 0.5) * this.options.particleSpeed,
        radius: Math.random() * 2 + 0.5,
        color: Math.random() > 0.7 ? this.options.colors.secondary : this.options.colors.primary,
        opacity: Math.random() * 0.5 + 0.2,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01
      });
    }
  }

  createNodes() {
    this.nodes = [];
    for (let i = 0; i < this.options.nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 8 + 4,
        color: Math.random() > 0.5 ? this.options.colors.primary : this.options.colors.secondary,
        pulsePhase: Math.random() * Math.PI * 2,
        connections: []
      });
    }
  }

  updateConnections() {
    this.nodes.forEach(node => {
      node.connections = [];
      this.nodes.forEach(otherNode => {
        if (node === otherNode) return;
        const dx = otherNode.x - node.x;
        const dy = otherNode.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.options.connectionDistance) {
          node.connections.push({ node: otherNode, distance: dist });
        }
      });
      
      // Sort by distance and keep only maxConnections
      node.connections.sort((a, b) => a.distance - b.distance);
      node.connections = node.connections.slice(0, this.options.maxConnections);
    });
  }

  createLightning(x, y) {
    const segments = Math.floor(Math.random() * 5) + 3;
    const points = [{ x, y }];
    
    for (let i = 1; i <= segments; i++) {
      const lastPoint = points[points.length - 1];
      const angle = (Math.random() - 0.5) * Math.PI * 0.8;
      const length = Math.random() * 30 + 20;
      
      points.push({
        x: lastPoint.x + Math.cos(angle) * length,
        y: lastPoint.y + Math.sin(angle) * length
      });
    }
    
    this.lightnings.push({
      points,
      life: 1,
      decay: Math.random() * 0.05 + 0.08,
      color: Math.random() > 0.5 ? this.options.colors.primary : this.options.colors.secondary,
      width: Math.random() * 2 + 1
    });
  }

  updateParticles() {
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulsePhase += p.pulseSpeed;
      p.opacity = 0.2 + Math.sin(p.pulsePhase) * 0.3;
      
      // Wrap around screen
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.height + 10;
      if (p.y > this.height + 10) p.y = -10;
    });
  }

  updateNodes() {
    this.nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      node.pulsePhase += 0.02;
      
      // Bounce off edges
      if (node.x < node.radius || node.x > this.width - node.radius) {
        node.vx *= -1;
        node.x = Math.max(node.radius, Math.min(this.width - node.radius, node.x));
      }
      if (node.y < node.radius || node.y > this.height - node.radius) {
        node.vy *= -1;
        node.y = Math.max(node.radius, Math.min(this.height - node.radius, node.y));
      }
    });
    
    this.updateConnections();
  }

  updateLightnings() {
    this.lightnings = this.lightnings.filter(lightning => {
      lightning.life -= lightning.decay;
      return lightning.life > 0;
    });
  }

  renderParticles() {
    this.particles.forEach(p => {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.hexToRgba(p.color, p.opacity);
      this.ctx.fill();
      
      // Glow effect for larger particles
      if (p.radius > 1.5) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        gradient.addColorStop(0, this.hexToRgba(p.color, p.opacity * 0.3));
        gradient.addColorStop(1, this.hexToRgba(p.color, 0));
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
      }
    });
  }

  renderNodes() {
    // Render connections first
    this.nodes.forEach(node => {
      node.connections.forEach(conn => {
        const other = conn.node;
        const opacity = 0.15 * (1 - conn.distance / this.options.connectionDistance);
        
        this.ctx.beginPath();
        this.ctx.moveTo(node.x, node.y);
        this.ctx.lineTo(other.x, other.y);
        this.ctx.strokeStyle = this.hexToRgba(node.color, opacity);
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      });
    });
    
    // Render nodes
    this.nodes.forEach(node => {
      const pulseRadius = node.radius + Math.sin(node.pulsePhase) * 2;
      
      // Outer glow
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, pulseRadius * 2, 0, Math.PI * 2);
      const gradient = this.ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, pulseRadius * 2);
      gradient.addColorStop(0, this.hexToRgba(node.color, 0.2));
      gradient.addColorStop(1, this.hexToRgba(node.color, 0));
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      
      // Core
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.hexToRgba(node.color, 0.8);
      this.ctx.fill();
      
      // Inner highlight
      this.ctx.beginPath();
      this.ctx.arc(node.x - pulseRadius * 0.3, node.y - pulseRadius * 0.3, pulseRadius * 0.3, 0, Math.PI * 2);
      this.ctx.fillStyle = this.hexToRgba('#FFFFFF', 0.4);
      this.ctx.fill();
    });
  }

  renderLightnings() {
    this.lightnings.forEach(lightning => {
      if (lightning.points.length < 2) return;
      
      this.ctx.beginPath();
      this.ctx.moveTo(lightning.points[0].x, lightning.points[0].y);
      
      for (let i = 1; i < lightning.points.length; i++) {
        this.ctx.lineTo(lightning.points[i].x, lightning.points[i].y);
      }
      
      this.ctx.strokeStyle = this.hexToRgba(lightning.color, lightning.life);
      this.ctx.lineWidth = lightning.width;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.stroke();
      
      // Glow
      this.ctx.strokeStyle = this.hexToRgba(lightning.color, lightning.life * 0.3);
      this.ctx.lineWidth = lightning.width * 4;
      this.ctx.stroke();
    });
  }

  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  animate() {
    // Clear with trail effect
    this.ctx.fillStyle = 'rgba(10, 14, 23, 0.15)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.updateParticles();
    this.updateNodes();
    this.updateLightnings();
    
    this.renderNodes();
    this.renderParticles();
    this.renderLightnings();
    
    // Random lightning
    if (Math.random() < this.options.lightningChance) {
      this.createLightning(
        Math.random() * this.width,
        Math.random() * this.height * 0.3
      );
    }
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.resize);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    window.particleSystem = new ParticleSystem(canvas);
  }
});

// Reduced motion support
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
      canvas.style.display = 'none';
    }
  });
}