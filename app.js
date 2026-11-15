/**
 * ShockShield - Community Electrical Safety Platform
 * Frontend Application Logic
 * Team NexVolt | Hacknauts 2.0
 */

// ========================================
// UTILITY FUNCTIONS
// ========================================

const Utils = {
  generateId: () => Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
  
  formatRelativeTime: (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  },
  
  formatNumber: (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  },
  
  debounce: (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  },
  
  throttle: (fn, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  sanitize: (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },
  
  randomItem: (arr) => arr[Math.floor(Math.random() * arr.length)],
  
  shuffle: (arr) => [...arr].sort(() => Math.random() - 0.5),
  
  storage: {
    get: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(`shockshield_${key}`);
        return item ? JSON.parse(item) : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(`shockshield_${key}`, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },
    remove: (key) => {
      try {
        localStorage.removeItem(`shockshield_${key}`);
        return true;
      } catch {
        return false;
      }
    }
  },
  
  animateCounter: (element, target, duration = 2000, formatter = null) => {
    const start = parseInt(element.textContent.replace(/[^\d]/g, '')) || 0;
    const startTime = performance.now();
    
    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(start + (target - start) * eased);
      
      if (formatter) {
        element.textContent = formatter(current);
      } else {
        element.textContent = current.toLocaleString();
      }
      
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }
};

// ========================================
// APPLICATION STATE
// ========================================

const AppState = {
  currentUser: null,
  posts: [],
  filters: {
    type: 'all',
    severity: 'all',
    sortBy: 'recent',
    search: ''
  },
  userCredits: 0,
  userStats: {
    reports: 0,
    hypes: 0,
    resolved: 0
  },
  
  init: () => {
    AppState.currentUser = Utils.storage.get('currentUser');
    AppState.posts = Utils.storage.get('posts', []);
    AppState.userCredits = Utils.storage.get('userCredits', 0);
    AppState.userStats = Utils.storage.get('userStats', { reports: 0, hypes: 0, resolved: 0 });
    
    if (AppState.posts.length === 0) {
      AppState.posts = AppState.generateSamplePosts();
      Utils.storage.set('posts', AppState.posts);
    }
  },
  
  generateSamplePosts: () => {
    const hazardTypes = ['exposed-wires', 'transformer', 'theft', 'illegal', 'streetlight', 'substation'];
    const severities = ['critical', 'high', 'medium', 'low'];
    const statuses = ['reported', 'review', 'dispatched', 'resolved'];
    const locations = [
      { lat: 12.9716, lng: 77.5946, name: 'Bangalore, Karnataka' },
      { lat: 28.7041, lng: 77.1025, name: 'Delhi, NCR' },
      { lat: 19.0760, lng: 72.8777, name: 'Mumbai, Maharashtra' },
      { lat: 13.0827, lng: 80.2707, name: 'Chennai, Tamil Nadu' },
      { lat: 22.5726, lng: 88.3639, name: 'Kolkata, West Bengal' },
      { lat: 17.3850, lng: 78.4867, name: 'Hyderabad, Telangana' }
    ];
    
    const samplePosts = [];
    const now = Date.now();
    
    for (let i = 0; i < 25; i++) {
      const location = Utils.randomItem(locations);
      const lat = location.lat + (Math.random() - 0.5) * 0.1;
      const lng = location.lng + (Math.random() - 0.5) * 0.1;
      
      samplePosts.push({
        id: Utils.generateId(),
        type: Utils.randomItem(hazardTypes),
        severity: Utils.randomItem(severities),
        status: Utils.randomItem(statuses),
        title: AppState.getHazardTitle(Utils.randomItem(hazardTypes)),
        description: 'Sample hazard description for demonstration purposes.',
        location: { lat, lng, name: location.name },
        timestamp: now - Math.random() * 7 * 24 * 60 * 60 * 1000,
        hypes: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 20),
        reporter: {
          name: `Citizen ${i + 1}`,
          avatar: `C${i + 1}`,
          isAnonymous: Math.random() > 0.7
        },
        hasVoice: Math.random() > 0.7,
        hasImage: Math.random() > 0.5
      });
    }
    
    return samplePosts.sort((a, b) => b.timestamp - a.timestamp);
  },
  
  getHazardTitle: (type) => {
    const titles = {
      'exposed-wires': 'Exposed Live Wires',
      'transformer': 'Transformer Burst',
      'theft': 'Electricity Theft',
      'illegal': 'Illegal Power Source',
      'streetlight': 'Streetlight Fault',
      'substation': 'Substation Issue'
    };
    return titles[type] || 'Electrical Hazard';
  },
  
  getHazardIcon: (type) => {
    const icons = {
      'exposed-wires': '⚡',
      'transformer': '🔥',
      'theft': '🔌',
      'illegal': '⚠️',
      'streetlight': '💡',
      'substation': '🏭'
    };
    return icons[type] || '⚡';
  },
  
  getSeverityColor: (severity) => {
    const colors = {
      'critical': 'var(--electric-coral)',
      'high': 'var(--electric-amber)',
      'medium': 'var(--electric-gold)',
      'low': 'var(--electric-emerald)'
    };
    return colors[severity] || 'var(--electric-cyan)';
  },
  
  getStatusColor: (status) => {
    const colors = {
      'reported': 'var(--electric-coral)',
      'review': 'var(--electric-gold)',
      'dispatched': 'var(--electric-cyan)',
      'resolved': 'var(--electric-emerald)'
    };
    return colors[status] || 'var(--electric-cyan)';
  }
};

// ========================================
// AUTHENTICATION MODULE
// ========================================

const Auth = {
  init: () => {
    const authPrompt = document.getElementById('authPrompt');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const guestBtn = document.getElementById('guestLoginBtn');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    const socialBtns = document.querySelectorAll('.social-auth-btn');
    
    if (Auth.isLoggedIn()) {
      Auth.updateUI();
      return;
    }
    
    if (guestBtn) {
      guestBtn.addEventListener('click', () => Auth.guestLogin());
    }
    
    if (switchToRegister) {
      switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        Auth.showRegister();
      });
    }
    
    if (switchToLogin) {
      switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        Auth.showLogin();
      });
    }
    
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const remember = document.getElementById('rememberMe').checked;
        Auth.login(email, password, remember);
      });
    }
    
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const role = document.querySelector('input[name="role"]:checked').value;
        Auth.register(name, email, password, role);
      });
    }
    
    socialBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        Toast.info(`${btn.dataset.provider} auth coming soon!`);
      });
    });
    
    const portalCards = document.querySelectorAll('.portal-card');
    portalCards.forEach(card => {
      card.addEventListener('click', () => {
        portalCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const role = card.dataset.role;
        document.querySelectorAll('input[name="role"]').forEach(r => {
          r.checked = r.value === role;
        });
      });
    });
  },
  
  isLoggedIn: () => !!sessionStorage.getItem('shockshield_session'),
  
  getCurrentUser: () => {
    try {
      const session = sessionStorage.getItem('shockshield_session');
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  },
  
  login: (email, password, remember) => {
    const user = {
      id: Utils.generateId(),
      name: email.split('@')[0],
      email,
      role: 'citizen',
      credits: 150,
      stats: { reports: 12, hypes: 45, resolved: 8 },
      avatar: email.charAt(0).toUpperCase(),
      joinedAt: Date.now() - 30 * 24 * 60 * 60 * 1000
    };
    
    sessionStorage.setItem('shockshield_session', JSON.stringify(user));
    if (remember) localStorage.setItem('shockshield_remember', email);
    
    AppState.currentUser = user;
    Auth.updateUI();
    Toast.success(`Welcome back, ${user.name}!`);
    Modal.closeAll();
    
    if (window.location.pathname.includes('register.html')) {
      setTimeout(() => window.location.href = 'feed.html', 1000);
    }
  },
  
  register: (name, email, password, role) => {
    const user = {
      id: Utils.generateId(),
      name,
      email,
      role,
      credits: 100,
      stats: { reports: 0, hypes: 0, resolved: 0 },
      avatar: name.charAt(0).toUpperCase(),
      joinedAt: Date.now()
    };
    
    sessionStorage.setItem('shockshield_session', JSON.stringify(user));
    AppState.currentUser = user;
    Auth.updateUI();
    Toast.success(`Welcome to ShockShield, ${name}!`);
    Modal.closeAll();
    
    if (window.location.pathname.includes('register.html')) {
      setTimeout(() => window.location.href = 'feed.html', 1000);
    }
  },
  
  guestLogin: () => {
    const guestId = 'guest_' + Utils.generateId();
    const user = {
      id: guestId,
      name: 'Guest User',
      email: `${guestId}@shockshield.local`,
      role: 'guest',
      credits: 0,
      stats: { reports: 0, hypes: 0, resolved: 0 },
      avatar: 'G',
      joinedAt: Date.now(),
      isGuest: true
    };
    
    sessionStorage.setItem('shockshield_session', JSON.stringify(user));
    AppState.currentUser = user;
    Auth.updateUI();
    Toast.success('Guest access granted. Limited features available.');
    Modal.closeAll();
  },
  
  logout: () => {
    sessionStorage.removeItem('shockshield_session');
    AppState.currentUser = null;
    Auth.updateUI();
    Toast.info('Logged out successfully');
  },
  
  updateUI: () => {
    const user = Auth.getCurrentUser();
    const authButtons = document.querySelectorAll('.auth-required');
    const guestButtons = document.querySelectorAll('.guest-only');
    const userNameElements = document.querySelectorAll('.user-name');
    const userCreditElements = document.querySelectorAll('.user-credits');
    const userAvatarElements = document.querySelectorAll('.user-avatar');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userMenu = document.getElementById('userMenu');
    
    if (user) {
      authButtons.forEach(btn => btn.style.display = 'inline-flex');
      guestButtons.forEach(btn => btn.style.display = 'none');
      userNameElements.forEach(el => el.textContent = user.name);
      userCreditElements.forEach(el => el.textContent = Utils.formatNumber(user.credits));
      userAvatarElements.forEach(el => el.textContent = user.avatar);
      
      if (loginBtn) loginBtn.style.display = 'none';
      if (registerBtn) registerBtn.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'inline-flex';
      if (userMenu) userMenu.style.display = 'block';
    } else {
      authButtons.forEach(btn => btn.style.display = 'none');
      guestButtons.forEach(btn => btn.style.display = 'inline-flex');
      
      if (loginBtn) loginBtn.style.display = 'inline-flex';
      if (registerBtn) registerBtn.style.display = 'inline-flex';
      if (logoutBtn) logoutBtn.style.display = 'none';
      if (userMenu) userMenu.style.display = 'none';
    }
  },
  
  showLogin: () => {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('authPrompt').style.display = 'none';
  },
  
  showRegister: () => {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('authPrompt').style.display = 'none';
  }
};

// ========================================
// MODAL MODULE
// ========================================

const Modal = {
  init: () => {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        Modal.closeAll();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') Modal.closeAll();
    });
    
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => Modal.closeAll());
    });
    
    document.querySelectorAll('[data-modal-open]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.modalOpen;
        Modal.open(modalId);
      });
    });
  },
  
  open: (modalId) => {
    const overlay = document.getElementById('modalOverlay');
    const modal = document.getElementById(modalId);
    
    if (overlay && modal) {
      overlay.classList.add('active');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length) focusable[0].focus();
    }
  },
  
  close: (modalId) => {
    const overlay = document.getElementById('modalOverlay');
    const modal = document.getElementById(modalId);
    
    if (overlay && modal) {
      overlay.classList.remove('active');
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },
  
  closeAll: () => {
    document.querySelectorAll('.modal-overlay, .modal').forEach(el => el.classList.remove('active'));
    document.body.style.overflow = '';
  }
};

// ========================================
// TOAST MODULE
// ========================================

const Toast = {
  container: null,
  
  init: () => {
    Toast.container = document.getElementById('toastContainer');
    if (!Toast.container) {
      Toast.container = document.createElement('div');
      Toast.container.id = 'toastContainer';
      Toast.container.className = 'toast-container';
      document.body.appendChild(Toast.container);
    }
  },
  
  show: (message, type = 'info', duration = 4000) => {
    if (!Toast.container) Toast.init();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
      error: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
      warning: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
      info: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };
    
    toast.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-message">${Utils.sanitize(message)}</div>
      <button class="toast-close" aria-label="Dismiss">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;
    
    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.style.animation = 'slideUp 0.2s ease-in reverse, slideRight 0.2s ease-in reverse';
      setTimeout(() => toast.remove(), 200);
    });
    
    Toast.container.appendChild(toast);
    
    if (duration > 0) {
      setTimeout(() => {
        if (toast.parentNode) {
          toast.style.animation = 'slideUp 0.3s ease-in reverse, slideRight 0.3s ease-in reverse';
          setTimeout(() => toast.remove(), 300);
        }
      }, duration);
    }
    
    return toast;
  },
  
  success: (msg, duration) => Toast.show(msg, 'success', duration),
  error: (msg, duration) => Toast.show(msg, 'error', duration),
  warning: (msg, duration) => Toast.show(msg, 'warning', duration),
  info: (msg, duration) => Toast.show(msg, 'info', duration)
};

// ========================================
// FEED MODULE
// ========================================

const Feed = {
  init: () => {
    Feed.renderPosts();
    Feed.bindEvents();
    Feed.animateStats();
  },
  
  bindEvents: () => {
    const createPostBtn = document.getElementById('createPostBtn');
    const postFormCard = document.getElementById('postFormCard');
    const cancelPostBtn = document.getElementById('cancelPostBtn');
    const postForm = document.getElementById('postForm');
    
    if (createPostBtn) {
      createPostBtn.addEventListener('click', () => {
        if (!Auth.isLoggedIn()) {
          Modal.open('authModal');
          return;
        }
        if (postFormCard) postFormCard.style.display = 'block';
        createPostBtn.style.display = 'none';
      });
    }
    
    if (cancelPostBtn) {
      cancelPostBtn.addEventListener('click', () => {
        if (postFormCard) postFormCard.style.display = 'none';
        if (createPostBtn) createPostBtn.style.display = 'inline-flex';
        if (postForm) postForm.reset();
      });
    }
    
    if (postForm) {
      postForm.addEventListener('submit', (e) => Feed.handlePostSubmit(e));
    }
    
    const typeFilter = document.getElementById('typeFilter');
    const severityFilter = document.getElementById('severityFilter');
    const sortFilter = document.getElementById('sortFilter');
    const searchInput = document.getElementById('searchInput');
    
    [typeFilter, severityFilter, sortFilter].forEach(filter => {
      if (filter) filter.addEventListener('change', () => Feed.renderPosts());
    });
    
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce(() => Feed.renderPosts(), 300));
    }
    
    const rewardsBtn = document.getElementById('rewardsBtn');
    if (rewardsBtn) {
      rewardsBtn.addEventListener('click', () => Modal.open('rewardsModal'));
    }
  },
  
  handlePostSubmit: (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const user = Auth.getCurrentUser();
    
    const post = {
      id: Utils.generateId(),
      type: formData.get('hazardType'),
      severity: formData.get('severity'),
      status: 'reported',
      title: formData.get('title'),
      description: formData.get('description'),
      location: {
        lat: parseFloat(formData.get('lat')) || 0,
        lng: parseFloat(formData.get('lng')) || 0,
        name: formData.get('locationName') || 'Unknown Location'
      },
      timestamp: Date.now(),
      hypes: 0,
      comments: 0,
      reporter: {
        name: user.name,
        avatar: user.avatar,
        isAnonymous: formData.get('anonymous') === 'on'
      },
      hasVoice: false,
      hasImage: false
    };
    
    AppState.posts.unshift(post);
    Utils.storage.set('posts', AppState.posts);
    
    Feed.awardCredits(10, 'New hazard report');
    
    Feed.renderPosts();
    e.target.reset();
    document.getElementById('postFormCard').style.display = 'none';
    document.getElementById('createPostBtn').style.display = 'inline-flex';
    
    Toast.success('Hazard reported successfully! +10 credits');
  },
  
  awardCredits: (amount, reason) => {
    AppState.userCredits += amount;
    Utils.storage.set('userCredits', AppState.userCredits);
    
    const user = Auth.getCurrentUser();
    if (user) {
      user.credits = AppState.userCredits;
      sessionStorage.setItem('shockshield_session', JSON.stringify(user));
      Auth.updateUI();
    }
    
    Feed.showCreditAnimation(amount, reason);
  },
  
  showCreditAnimation: (amount, reason) => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 100px; right: 20px; z-index: 9000;
      background: var(--grad-electric); color: var(--text-on-electric);
      padding: 16px 24px; border-radius: 12px;
      box-shadow: var(--shadow-glow);
      display: flex; align-items: center; gap: 12px;
      animation: slideRight 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;
    notification.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 6v6l4 2"></path>
      </svg>
      <div>
        <div style="font-weight: 700; font-size: 1.1rem;">+${amount} Credits</div>
        <div style="font-size: 0.8rem; opacity: 0.9;">${reason}</div>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = 'slideRight 0.3s ease-in reverse';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },
  
  renderPosts: () => {
    const feedList = document.getElementById('feedList');
    if (!feedList) return;
    
    let filtered = [...AppState.posts];
    
    const typeFilter = document.getElementById('typeFilter');
    const severityFilter = document.getElementById('severityFilter');
    const sortFilter = document.getElementById('sortFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (typeFilter && typeFilter.value !== 'all') {
      filtered = filtered.filter(p => p.type === typeFilter.value);
    }
    
    if (severityFilter && severityFilter.value !== 'all') {
      filtered = filtered.filter(p => p.severity === severityFilter.value);
    }
    
    if (searchInput && searchInput.value.trim()) {
      const query = searchInput.value.trim().toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.location.name.toLowerCase().includes(query)
      );
    }
    
    const sortBy = sortFilter ? sortFilter.value : 'recent';
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.timestamp - b.timestamp);
        break;
      case 'hype':
        filtered.sort((a, b) => b.hypes - a.hypes);
        break;
      case 'urgent':
        filtered.sort((a, b) => {
          const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return severityOrder[b.severity] - severityOrder[a.severity];
        });
        break;
    }
    
    feedList.innerHTML = filtered.map(post => Feed.createPostCard(post)).join('');
    Feed.bindPostEvents();
  },
  
  createPostCard: (post) => {
    const user = Auth.getCurrentUser();
    const hasHyped = user && post.hypedBy && post.hypedBy.includes(user.id);
    
    return `
      <article class="post-card reveal" data-post-id="${post.id}" data-type="${post.type}" data-severity="${post.severity}">
        <div class="post-header">
          <div class="post-hazard-info">
            <span class="hazard-icon">${AppState.getHazardIcon(post.type)}</span>
            <div class="hazard-meta">
              <h3 class="post-title">${Utils.sanitize(post.title)}</h3>
              <p class="post-type">${AppState.getHazardTitle(post.type)}</p>
            </div>
          </div>
          <div class="post-badges">
            <span class="badge severity-${post.severity}">${post.severity}</span>
            <span class="badge status-${post.status}">${post.status}</span>
          </div>
        </div>
        
        <p class="post-description">${Utils.sanitize(post.description)}</p>
        
        <div class="post-meta">
          <div class="post-location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${Utils.sanitize(post.location.name)}
          </div>
          <div class="post-time">${Utils.formatRelativeTime(post.timestamp)}</div>
        </div>
        
        ${post.hasImage ? `
          <div class="post-image">
            <div class="image-placeholder">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              <span>Hazard Photo</span>
            </div>
          </div>
        ` : ''}
        
        ${post.hasVoice ? `
          <div class="post-voice">
            <button class="voice-play-btn" data-post-id="${post.id}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              <span>Voice Note</span>
              <span class="voice-duration">0:45</span>
            </button>
          </div>
        ` : ''}
        
        <div class="post-actions">
          <button class="btn btn-ghost hype-btn ${hasHyped ? 'hyped' : ''}" data-post-id="${post.id}" ${!user ? 'disabled' : ''}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${hasHyped ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            <span>${post.hypes}</span>
          </button>
          <button class="btn btn-ghost comment-btn" data-post-id="${post.id}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>${post.comments}</span>
          </button>
          <button class="btn btn-ghost share-btn" data-post-id="${post.id}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
          </button>
        </div>
      </article>
    `;
  },
  
  bindPostEvents: () => {
    document.querySelectorAll('.hype-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const postId = btn.dataset.postId;
        Feed.toggleHype(postId, btn);
      });
    });
    
    document.querySelectorAll('.comment-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const postId = btn.dataset.postId;
        Feed.openComments(postId);
      });
    });
    
    document.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const postId = btn.dataset.postId;
        Feed.sharePost(postId);
      });
    });
    
    document.querySelectorAll('.voice-play-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.classList.toggle('playing');
        const icon = btn.querySelector('svg');
        if (btn.classList.contains('playing')) {
          icon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
        } else {
          icon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"></polygon>';
        }
      });
    });
    
    document.querySelectorAll('.post-card').forEach(card => {
      card.addEventListener('click', () => {
        const postId = card.dataset.postId;
        Feed.openPostDetail(postId);
      });
    });
  },
  
  toggleHype: (postId, btn) => {
    const post = AppState.posts.find(p => p.id === postId);
    const user = Auth.getCurrentUser();
    
    if (!post || !user) return;
    
    if (!post.hypedBy) post.hypedBy = [];
    
    const hasHyped = post.hypedBy.includes(user.id);
    
    if (hasHyped) {
      post.hypes = Math.max(0, post.hypes - 1);
      post.hypedBy = post.hypedBy.filter(id => id !== user.id);
      btn.classList.remove('hyped');
    } else {
      post.hypes++;
      post.hypedBy.push(user.id);
      btn.classList.add('hyped');
      
      Feed.awardCredits(5, 'Hyped a hazard report');
      
      btn.style.animation = 'hypeBurst 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => btn.style.animation = '', 400);
    }
    
    btn.querySelector('span').textContent = post.hypes;
    Utils.storage.set('posts', AppState.posts);
  },
  
  openComments: (postId) => {
    const post = AppState.posts.find(p => p.id === postId);
    if (!post) return;
    
    Modal.open('commentsModal');
    Feed.renderComments(postId);
  },
  
  renderComments: (postId) => {
    const container = document.getElementById('commentsList');
    if (!container) return;
    
    const comments = [
      { id: 1, author: 'Rahul K.', avatar: 'R', text: 'Reported this too! Very dangerous spot.', time: '2h ago', likes: 5 },
      { id: 2, author: 'City Power Dept.', avatar: 'CP', text: 'Team dispatched. ETA 30 mins.', time: '1h ago', likes: 12, official: true },
      { id: 3, author: 'Anita S.', avatar: 'A', text: 'Thanks for reporting. Kids play nearby.', time: '45m ago', likes: 3 }
    ];
    
    container.innerHTML = comments.map(c => `
      <div class="comment ${c.official ? 'official' : ''}">
        <div class="comment-avatar">${c.avatar}</div>
        <div class="comment-content">
          <div class="comment-header">
            <strong>${Utils.sanitize(c.author)}</strong>
            <span class="comment-time">${c.time}</span>
          </div>
          <p>${Utils.sanitize(c.text)}</p>
          <div class="comment-actions">
            <button class="comment-like" data-comment-id="${c.id}">👍 ${c.likes}</button>
            <button class="comment-reply">Reply</button>
          </div>
        </div>
      </div>
    `).join('');
  },
  
  sharePost: (postId) => {
    const post = AppState.posts.find(p => p.id === postId);
    if (!post) return;
    
    const url = `${window.location.origin}/feed.html#${postId}`;
    
    if (navigator.share) {
      navigator.share({
        title: `ShockShield: ${post.title}`,
        text: `${post.description}\nLocation: ${post.location.name}`,
        url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        Toast.success('Link copied to clipboard!');
      });
    }
  },
  
  openPostDetail: (postId) => {
    window.location.href = `feed.html#${postId}`;
  },
  
  animateStats: () => {
    document.querySelectorAll('.counter').forEach(counter => {
      const target = parseInt(counter.dataset.count) || 0;
      Utils.animateCounter(counter, target);
    });
  },
  
  renderVouchers: () => {
    const container = document.getElementById('vouchersGrid');
    if (!container) return;
    
    const vouchers = [
      { id: 'amazon', name: 'Amazon', icon: '📦', cost: 500, desc: '₹500 Gift Card' },
      { id: 'flipkart', name: 'Flipkart', icon: '🛒', cost: 500, desc: '₹500 Gift Card' },
      { id: 'zomato', name: 'Zomato', icon: '🍔', cost: 300, desc: '₹300 Credits' },
      { id: 'swiggy', name: 'Swiggy', icon: '🍕', cost: 300, desc: '₹300 Credits' },
      { id: 'uber', name: 'Uber', icon: '🚗', cost: 400, desc: '₹400 Ride Credit' },
      { id: 'paytm', name: 'Paytm', icon: '💳', cost: 250, desc: '₹250 Wallet Cash' },
      { id: 'googleplay', name: 'Google Play', icon: '🎮', cost: 350, desc: '₹350 Play Credit' },
      { id: 'apple', name: 'Apple', icon: '🍎', cost: 350, desc: '₹350 App Store Credit' }
    ];
    
    const user = Auth.getCurrentUser();
    const userCredits = user ? user.credits : 0;
    
    container.innerHTML = vouchers.map(v => `
      <div class="reward-card ${userCredits < v.cost ? 'locked' : ''}" data-voucher="${v.id}" data-cost="${v.cost}">
        <div class="reward-icon">${v.icon}</div>
        <div class="reward-info">
          <h4>${v.name}</h4>
          <p>${v.desc}</p>
        </div>
        <div class="reward-cost">
          <span class="cost-value">${v.cost}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
        </div>
        ${userCredits < v.cost ? '<span class="lock-badge">Locked</span>' : ''}
      </div>
    `).join('');
    
    container.querySelectorAll('.reward-card:not(.locked)').forEach(card => {
      card.addEventListener('click', () => Feed.redeemVoucher(card.dataset.voucher, parseInt(card.dataset.cost)));
    });
  },
  
  redeemVoucher: (voucherId, cost) => {
    const user = Auth.getCurrentUser();
    if (!user || user.credits < cost) return;
    
    user.credits -= cost;
    AppState.userCredits = user.credits;
    sessionStorage.setItem('shockshield_session', JSON.stringify(user));
    Utils.storage.set('userCredits', AppState.userCredits);
    Auth.updateUI();
    
    Toast.success(`Redeemed ${voucherId} voucher! -${cost} credits`);
    Feed.renderVouchers();
  },
  
  renderLeaderboard: (category = 'reporters') => {
    const container = document.getElementById('leaderboardList');
    if (!container) return;
    
    const leaders = [
      { rank: 1, name: 'Priya Sharma', avatar: 'PS', reports: 47, hypes: 123, credits: 2450, badge: '🏆' },
      { rank: 2, name: 'Officer Singh', avatar: 'OS', reports: 42, hypes: 98, credits: 2180, badge: '🥈' },
      { rank: 3, name: 'Anita Reddy', avatar: 'AR', reports: 38, hypes: 87, credits: 1950, badge: '🥉' },
      { rank: 4, name: 'Rahul Kumar', avatar: 'RK', reports: 35, hypes: 76, credits: 1820 },
      { rank: 5, name: 'Meera Patel', avatar: 'MP', reports: 31, hypes: 65, credits: 1640 },
      { rank: 6, name: 'Amit Joshi', avatar: 'AJ', reports: 28, hypes: 54, credits: 1480 },
      { rank: 7, name: 'Sneha Gupta', avatar: 'SG', reports: 25, hypes: 48, credits: 1320 },
      { rank: 8, name: 'Vikram Rao', avatar: 'VR', reports: 22, hypes: 41, credits: 1180 },
      { rank: 9, name: 'Deepak Verma', avatar: 'DV', reports: 19, hypes: 35, credits: 1050 },
      { rank: 10, name: 'Kavya Nair', avatar: 'KN', reports: 16, hypes: 29, credits: 920 }
    ];
    
    container.innerHTML = leaders.map(l => `
      <div class="leaderboard-item ${l.rank <= 3 ? 'top-3' : ''}">
        <div class="leaderboard-rank">${l.badge || `#${l.rank}`}</div>
        <div class="leaderboard-avatar">${l.avatar}</div>
        <div class="leaderboard-info">
          <div class="leaderboard-name">${Utils.sanitize(l.name)}</div>
          <div class="leaderboard-stats">
            <span>📍 ${l.reports} reports</span>
            <span>⚡ ${l.hypes} hypes</span>
          </div>
        </div>
        <div class="leaderboard-score">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
          ${Utils.formatNumber(l.credits)}
        </div>
      </div>
    `).join('');
  }
};

// ========================================
// MAP MODULE
// ========================================

const MapModule = {
  map: null,
  userLocationMarker: null,
  userLocationCircle: null,
  
  init: () => {
    if (!document.getElementById('map')) return;
    console.log('Map module loaded');
  }
};

// ========================================
// HERO VISUAL STATS
// ========================================

function initHeroVisualStats() {
  animateHeroStats();
}

function animateHeroStats() {
  const stats = [
    { id: 'flowActive', target: 247 },
    { id: 'flowReview', target: 89 },
    { id: 'flowDispatched', target: 34 },
    { id: 'flowResolved', target: 189 }
  ];
  stats.forEach((stat, index) => {
    const element = document.getElementById(stat.id);
    if (!element) return;
    setTimeout(() => animateValue(element, 0, stat.target, 1500), index * 200);
  });
}

function animateValue(element, start, end, duration) {
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * eased);
    element.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ========================================
// THEME MANAGEMENT
// ========================================

function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  
  const savedTheme = localStorage.getItem('shockshield_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.classList.add('theme-transitioning');
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('shockshield_theme', newTheme);
    
    themeToggle.classList.add('electric-active');
    setTimeout(() => themeToggle.classList.remove('electric-active'), 300);
    
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 500);
    
    Toast.success(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} mode`, 2000);
  });
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('shockshield_theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  });
}

// ========================================
// HERO FIELD ANIMATIONS
// ========================================

function initHeroField() {
  const heroField = document.querySelector('.hero-field');
  if (!heroField) return;
  
  const energyParticles = heroField.querySelector('#energyParticles');
  const arcLightning = heroField.querySelector('#arcLightning');
  
  if (energyParticles) {
    generateEnergyParticles(energyParticles);
  }
  
  if (arcLightning) {
    generateArcLightning(arcLightning);
  }
  
  const electricBall = document.getElementById('electricBall');
  if (electricBall) {
    initElectricBallInteraction(electricBall);
  }
}

function generateEnergyParticles(container) {
  const particleColors = [
    'var(--electric-cyan)',
    'var(--electric-blue)',
    'var(--electric-gold)',
    'var(--electric-emerald)',
    'var(--electric-violet)'
  ];
  
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'energy-particle';
    particle.style.cssText = `
      left: ${Math.random() * 100}%;
      --particle-color: ${particleColors[Math.floor(Math.random() * particleColors.length)]};
      animation-delay: ${Math.random() * 6}s;
      animation-duration: ${4 + Math.random() * 4}s;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
    `;
    container.appendChild(particle);
  }
  
  setInterval(() => {
    if (container.children.length < particleCount) {
      const particle = document.createElement('div');
      particle.className = 'energy-particle';
      particle.style.cssText = `
        left: ${Math.random() * 100}%;
        --particle-color: ${particleColors[Math.floor(Math.random() * particleColors.length)]};
        animation-delay: 0s;
        animation-duration: ${4 + Math.random() * 4}s;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
      `;
      container.appendChild(particle);
      setTimeout(() => particle.remove(), 8000);
    }
  }, 500);
}

function generateArcLightning(container) {
  const boltColors = [
    'var(--electric-cyan)',
    'var(--electric-blue)',
    'var(--electric-gold)',
    'var(--electric-violet)'
  ];
  
  const strike = () => {
    const bolt = document.createElement('div');
    bolt.className = 'arc-bolt';
    const color = boltColors[Math.floor(Math.random() * boltColors.length)];
    const x = 10 + Math.random() * 80;
    const jitter = (Math.random() - 0.5) * 20;
    
    bolt.style.cssText = `
      left: ${x}%;
      top: ${-20 + Math.random() * 20}%;
      --bolt-color: ${color};
      --jitter: ${jitter}px;
      height: ${80 + Math.random() * 120}px;
      animation-duration: ${0.2 + Math.random() * 0.3}s;
    `;
    container.appendChild(bolt);
    setTimeout(() => bolt.remove(), 500);
  };
  
  const scheduleStrike = () => {
    strike();
    setTimeout(scheduleStrike, 800 + Math.random() * 1500);
  };
  
  scheduleStrike();
}

function initElectricBallInteraction(ball) {
  let isHovered = false;
  let mouseX = 0;
  let mouseY = 0;
  let ballX = 0;
  let ballY = 0;
  let animationId = null;
  
  ball.addEventListener('mouseenter', () => {
    isHovered = true;
    ball.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
  });
  
  ball.addEventListener('mouseleave', () => {
    isHovered = false;
    ball.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    ballX = 0;
    ballY = 0;
  });
  
  ball.addEventListener('mousemove', (e) => {
    if (!isHovered) return;
    
    const rect = ball.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX = (e.clientX - centerX) / (rect.width / 2) * 15;
    mouseY = (e.clientY - centerY) / (rect.height / 2) * 15;
  });
  
  function animateBall() {
    if (isHovered) {
      ballX += (mouseX - ballX) * 0.1;
      ballY += (mouseY - ballY) * 0.1;
      ball.style.transform = `translate(${ballX}px, ${ballY}px) scale(1.03)`;
    } else {
      ballX *= 0.9;
      ballY *= 0.9;
      
      if (Math.abs(ballX) > 0.1 || Math.abs(ballY) > 0.1) {
        ball.style.transform = `translate(${ballX}px, ${ballY}px)`;
      }
    }
    
    animationId = requestAnimationFrame(animateBall);
  }
  
  animateBall();
  
  ball.addEventListener('click', () => {
    ball.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
    ball.style.transform = 'scale(0.95)';
    ball.style.boxShadow = `
      0 0 150px rgba(0, 102, 255, 0.8),
      0 0 250px rgba(0, 212, 255, 0.5),
      0 0 400px rgba(0, 102, 255, 0.3),
      inset 0 -50px 100px rgba(0, 0, 0, 0.5),
      inset 0 50px 100px rgba(0, 212, 255, 0.2)
    `;
    
    setTimeout(() => {
      ball.style.transition = '';
      ball.style.transform = '';
      ball.style.boxShadow = '';
    }, 150);
  });
  
  window.addEventListener('beforeunload', () => {
    if (animationId) cancelAnimationFrame(animationId);
  });
}

// ========================================
// CUSTOM CURSOR
// ========================================

function initCustomCursor() {
  if (window.innerWidth <= 1024) return;
  
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.innerHTML = `
    <div class="cursor-ring"></div>
    <div class="cursor-dot"></div>
    <div class="cursor-trail"></div>
  `;
  document.body.appendChild(cursor);
  
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let isVisible = false;
  let animationId = null;
  let lastMoveTime = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    lastMoveTime = Date.now();
    
    if (!isVisible) {
      isVisible = true;
      cursor.classList.add('visible');
    }
  });
  
  document.addEventListener('mouseleave', () => {
    isVisible = false;
    cursor.classList.remove('visible');
    cursor.classList.remove('hover');
    cursor.classList.remove('click');
  });
  
  const interactiveSelectors = 'a, button, .btn, .card, .feature-card, .stat, .testimonial-card, .team-card, .hero-visual .live-btn, .custom-cursor-target';
  let hoverTimer = null;
  
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(interactiveSelectors);
    if (target) {
      cursor.classList.add('hover');
      if (hoverTimer) clearTimeout(hoverTimer);
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(interactiveSelectors);
    if (target) {
      hoverTimer = setTimeout(() => {
        cursor.classList.remove('hover');
      }, 100);
    }
  });
  
  document.addEventListener('mousedown', () => {
    cursor.classList.add('click');
  });
  
  document.addEventListener('mouseup', () => {
    cursor.classList.remove('click');
  });
  
  function animateCursor() {
    const easing = 0.2;
    cursorX += (mouseX - cursorX) * easing;
    cursorY += (mouseY - cursorY) * easing;
    
    cursor.style.transform = `translate(${cursorX - 12}px, ${cursorY - 12}px)`;
    
    if (Date.now() - lastMoveTime > 3000 && isVisible) {
      isVisible = false;
      cursor.classList.remove('visible');
    }
    
    animationId = requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
  
  window.addEventListener('beforeunload', () => {
    if (animationId) cancelAnimationFrame(animationId);
  });
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) {
    cursor.style.display = 'none';
  }
  
  mediaQuery.addEventListener('change', (e) => {
    cursor.style.display = e.matches ? 'none' : '';
  });
}

// ========================================
// ELECTRIC CLICK EFFECT
// ========================================

function initElectricClickEffect() {
  document.querySelectorAll('.btn').forEach(btn => {
    if (!btn.classList.contains('btn-electric-click')) {
      btn.classList.add('btn-electric-click');
      
      const wave = document.createElement('div');
      wave.className = 'electric-wave';
      btn.appendChild(wave);
      
      const arc = document.createElement('div');
      arc.className = 'electric-arc';
      btn.appendChild(arc);
      
      const particles = document.createElement('div');
      particles.className = 'electric-particles';
      btn.appendChild(particles);
    }
    
    btn.addEventListener('mousedown', () => {
      btn.classList.add('electric-arc');
    });
    
    btn.addEventListener('click', () => {
      btn.classList.add('electric-active');
      btn.classList.add('electric-particles');
      setTimeout(() => {
        btn.classList.remove('electric-active');
        btn.classList.remove('electric-arc');
        btn.classList.remove('electric-particles');
      }, 400);
    });
  });
}

// ========================================
// GPS LOCATION BUTTON
// ========================================

function initLocationButton() {
  const locationBtn = document.getElementById('useCurrentLocationHero');
  const mapLocationBtn = document.getElementById('userLocationBtn');
  
  const handleLocationClick = (btn) => {
    if (!navigator.geolocation) {
      Toast.error('Geolocation is not supported by your browser');
      return;
    }
    
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; margin-right: 8px;"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg> Locating...';
    btn.disabled = true;
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationInput = document.getElementById('location');
        
        if (locationInput) {
          locationInput.value = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
          locationInput.focus();
        }
        
        if (window.MapModule && window.MapModule.map) {
          window.MapModule.map.setView([latitude, longitude], 16);
          if (window.MapModule.userLocationMarker) window.MapModule.map.removeLayer(window.MapModule.userLocationMarker);
          if (window.MapModule.userLocationCircle) window.MapModule.map.removeLayer(window.MapModule.userLocationCircle);
          
          window.MapModule.userLocationMarker = L.marker([latitude, longitude], {
            icon: L.divIcon({
              html: '<div style="width: 28px; height: 28px; background: var(--grad-electric); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-glow); border: 3px solid var(--bg-deep);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v2M12 20v2M2 12h2M20 12h2"></path></svg></div>',
              className: 'cluster-marker',
              iconSize: L.point(34, 34),
              iconAnchor: L.point(17, 17)
            })
          }).addTo(window.MapModule.map);
          
          window.MapModule.userLocationCircle = L.circle([latitude, longitude], {
            radius: position.coords.accuracy || 50,
            color: 'var(--electric-cyan)',
            fillColor: 'var(--electric-cyan)',
            fillOpacity: 0.1,
            weight: 1
          }).addTo(window.MapModule.map);
        }
        
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        Toast.success(`Location captured! 📍 (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
      },
      (error) => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        let msg = 'Unable to get location';
        if (error.code === error.PERMISSION_DENIED) msg = 'Location permission denied. Please enable in browser settings.';
        else if (error.code === error.TIMEOUT) msg = 'Location request timed out.';
        Toast.error(msg);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };
  
  if (locationBtn) {
    locationBtn.addEventListener('click', () => handleLocationClick(locationBtn));
  }
  
  if (mapLocationBtn) {
    mapLocationBtn.addEventListener('click', () => handleLocationClick(mapLocationBtn));
  }
}

// ========================================
// SCROLL PROGRESS
// ========================================

function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.id = 'scrollProgress';
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', Utils.throttle(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;
    progressBar.style.transform = `scaleX(${scrollPercent})`;
  }, 16));
}

// ========================================
// ENHANCED SCROLL ANIMATIONS
// ========================================

function initEnhancedScrollAnimations() {
  const observerOptions = { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 };
  
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale', '.reveal-rotate', '.stagger-children', '.text-reveal', '.image-reveal', '.counter-scroll', '.line-draw', '.count-up'].forEach(selector => {
    document.querySelectorAll(selector).forEach(el => scrollObserver.observe(el));
  });
  
  window.addEventListener('scroll', Utils.throttle(() => {
    const scrolled = window.scrollY;
    document.querySelectorAll('.hero-arc').forEach((orb, index) => {
      const speed = 0.05 + index * 0.02;
      orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
    document.querySelectorAll('.floating-icon').forEach((icon, index) => {
      const speed = 0.03 + index * 0.01;
      icon.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.005}deg)`;
    });
    document.querySelectorAll('.electric-bolt').forEach((bolt, index) => {
      const speed = 0.05 + index * 0.02;
      bolt.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }, 16));
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  Modal.init();
  Auth.init();
  
  initTheme();
  
  if (document.getElementById('feedList')) {
    Feed.init();
  } else {
    Feed.animateStats();
  }
  
  const observerOptions = { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 };
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .stagger-children, .text-reveal, .image-reveal').forEach(el => {
    scrollObserver.observe(el);
  });
  
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
  }
  
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', Utils.throttle(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, 50));
  }
  
  const cancelPostBtn = document.getElementById('cancelPostBtn');
  if (cancelPostBtn) {
    cancelPostBtn.addEventListener('click', () => {
      const postFormCard = document.getElementById('postFormCard');
      const authPrompt = document.getElementById('authPrompt');
      if (postFormCard && authPrompt) {
        postFormCard.style.display = 'none';
        authPrompt.style.display = 'block';
      }
    });
  }
  
  const rewardsModal = document.getElementById('rewardsModal');
  if (rewardsModal) {
    rewardsModal.addEventListener('shown.bs.modal', () => {
      Feed.renderVouchers();
      Feed.renderLeaderboard('reporters');
    });
  }
  
  initElectricClickEffect();
  
  if (document.getElementById('heroVisual')) {
    initHeroVisualStats();
  }
  
  initHeroField();
  initLocationButton();
  initCustomCursor();
  initScrollProgress();
  initEnhancedScrollAnimations();
  
  window.Feed = Feed;
  window.Auth = Auth;
  window.Modal = Modal;
  window.Toast = Toast;
  window.AppState = AppState;
  window.Utils = Utils;
});

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1);
  if (hash && document.getElementById('feedList')) {
    const postCard = document.querySelector(`.post-card[data-post-id="${hash}"]`);
    if (postCard) {
      postCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      postCard.style.boxShadow = '0 0 0 3px var(--electric-cyan)';
      setTimeout(() => postCard.style.boxShadow = '', 2000);
    }
  }
});

const style = document.createElement('style');
style.textContent = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes hypeBurst {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
`;
document.head.appendChild(style);