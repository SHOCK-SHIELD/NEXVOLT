/**
 * ShockShield - Main JavaScript Module
 * Shared utilities and components across all pages
 */

// ========================================
// UTILITY FUNCTIONS
// ========================================

const Utils = {
  // Debounce function
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  },

  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Generate unique ID
  generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Format date
  formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };
    return new Date(date).toLocaleDateString('en-IN', defaultOptions);
  },

  // Format relative time
  formatRelativeTime(date) {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return this.formatDate(date, { hour: undefined, minute: undefined });
  },

  // Format number with animation
  animateNumber(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.floor(start + (target - start) * eased);
      
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    
    requestAnimationFrame(update);
  },

  // Check if element is in viewport
  isInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * (1 - threshold) &&
      rect.bottom >= 0
    );
  },

  // Smooth scroll to element
  scrollToElement(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    });
  },

  // Copy to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    }
  },

  // Get query params
  getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  },

  // Set query params
  setQueryParams(params, replace = false) {
    const url = new URL(window.location);
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === undefined || params[key] === '') {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, params[key]);
      }
    });
    if (replace) {
      window.history.replaceState({}, '', url);
    } else {
      window.history.pushState({}, '', url);
    }
  }
};

// ========================================
// TOAST NOTIFICATION SYSTEM
// ========================================

class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    this.container = document.querySelector('.toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  show(message, type = 'info', title = '', duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
      success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
      error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
      warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content">
        ${title ? `<div class="toast-title">${this.escapeHtml(title)}</div>` : ''}
        <div class="toast-message">${this.escapeHtml(message)}</div>
      </div>
      <button class="toast-close" aria-label="Dismiss">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this.remove(toast));

    this.container.appendChild(toast);

    // Auto remove
    if (duration > 0) {
      setTimeout(() => this.remove(toast), duration);
    }

    return toast;
  }

  remove(toast) {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    });
  }

  success(message, title = 'Success') {
    return this.show(message, 'success', title);
  }

  error(message, title = 'Error') {
    return this.show(message, 'error', title);
  }

  warning(message, title = 'Warning') {
    return this.show(message, 'warning', title);
  }

  info(message, title = 'Info') {
    return this.show(message, 'info', title);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// ========================================
// MODAL MANAGER
// ========================================

class ModalManager {
  constructor() {
    this.modals = new Map();
    this.activeModal = null;
    this.init();
  }

  init() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.close(this.activeModal);
      }
    });

    // Close on overlay click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        const modalId = e.target.dataset.modalId;
        if (modalId) this.close(modalId);
      }
    });
  }

  register(modalId, modalElement) {
    this.modals.set(modalId, modalElement);
    modalElement.dataset.modalId = modalId;
  }

  open(modalId) {
    const modal = this.modals.get(modalId);
    if (!modal) return;

    const overlay = modal.closest('.modal-overlay');
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.activeModal = modalId;
      
      // Focus management
      const focusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
    }
  }

  close(modalId) {
    const modal = this.modals.get(modalId);
    if (!modal) return;

    const overlay = modal.closest('.modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      this.activeModal = null;
    }
  }

  closeAll() {
    this.modals.forEach((_, id) => this.close(id));
  }
}

// ========================================
// FORM VALIDATION
// ========================================

class FormValidator {
  constructor(formElement, rules = {}) {
    this.form = formElement;
    this.rules = rules;
    this.errors = new Map();
    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.form.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.validateAll()) {
      this.form.dispatchEvent(new CustomEvent('form:valid', { detail: new FormData(this.form) }));
    } else {
      this.form.dispatchEvent(new CustomEvent('form:invalid', { detail: this.errors }));
    }
  }

  validateAll() {
    this.errors.clear();
    let isValid = true;

    this.form.querySelectorAll('input, textarea, select').forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(input) {
    const name = input.name;
    const rules = this.rules[name];
    if (!rules) return true;

    const value = input.value.trim();
    let error = null;

    if (rules.required && !value) {
      error = `${this.getFieldLabel(input)} is required`;
    } else if (value && rules.minLength && value.length < rules.minLength) {
      error = `${this.getFieldLabel(input)} must be at least ${rules.minLength} characters`;
    } else if (value && rules.maxLength && value.length > rules.maxLength) {
      error = `${this.getFieldLabel(input)} must not exceed ${rules.maxLength} characters`;
    } else if (value && rules.pattern && !rules.pattern.test(value)) {
      error = rules.message || `${this.getFieldLabel(input)} is invalid`;
    } else if (value && rules.custom && !rules.custom(value, this.form)) {
      error = rules.message || `${this.getFieldLabel(input)} is invalid`;
    }

    if (error) {
      this.showError(input, error);
      this.errors.set(name, error);
      return false;
    } else {
      this.clearError(input);
      this.errors.delete(name);
      return true;
    }
  }

  showError(input, message) {
    input.classList.add('error');
    let errorEl = input.parentNode.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'form-error';
      input.parentNode.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  clearError(input) {
    input.classList.remove('error');
    const errorEl = input.parentNode.querySelector('.form-error');
    if (errorEl) errorEl.remove();
  }

  getFieldLabel(input) {
    const label = input.closest('.form-group').querySelector('.form-label');
    return label ? label.textContent.replace('*', '').trim() : input.name;
  }

  getErrors() {
    return Object.fromEntries(this.errors);
  }

  setErrors(errors) {
    Object.entries(errors).forEach(([name, message]) => {
      const input = this.form.querySelector(`[name="${name}"]`);
      if (input) this.showError(input, message);
    });
    this.errors = new Map(Object.entries(errors));
  }

  reset() {
    this.errors.clear();
    this.form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    this.form.querySelectorAll('.form-error').forEach(el => el.remove());
    this.form.reset();
  }
}

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================

class AnimationObserver {
  constructor(options = {}) {
    this.options = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1,
      ...options
    };
    this.observer = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            this.observer.unobserve(entry.target);
          }
        });
      }, this.options);
    }
  }

  observe(element) {
    if (this.observer) {
      this.observer.observe(element);
    } else {
      element.classList.add('animate-in');
    }
  }

  observeAll(selector) {
    document.querySelectorAll(selector).forEach(el => this.observe(el));
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// ========================================
// SCROLL PROGRESS INDICATOR
// ========================================

class ScrollProgress {
  constructor() {
    this.bar = null;
    this.init();
  }

  init() {
    this.bar = document.createElement('div');
    this.bar.className = 'scroll-progress-bar';
    this.bar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: var(--gradient-primary);
      z-index: 9999;
      transform-origin: left;
      transform: scaleX(0);
      pointer-events: none;
    `;
    document.body.appendChild(this.bar);

    window.addEventListener('scroll', Utils.throttle(() => this.update(), 16));
  }

  update() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollTop / docHeight;
    this.bar.style.transform = `scaleX(${progress})`;
  }
}

// ========================================
// THEME MANAGER
// ========================================

class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    document.documentElement.setAttribute('data-theme', this.theme);
    
    const toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) {
      toggle.addEventListener('click', () => this.toggle());
      this.updateToggleIcon(toggle);
    }
  }

  toggle() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
    
    const toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) this.updateToggleIcon(toggle);
  }

  updateToggleIcon(toggle) {
    const icon = toggle.querySelector('svg');
    if (icon) {
      if (this.theme === 'dark') {
        icon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
      } else {
        icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
      }
    }
  }
}

// ========================================
// LAZY LOAD IMAGES
// ========================================

class LazyLoader {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            img.classList.add('loaded');
            this.observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });
    }
  }

  observe(img) {
    if (this.observer) {
      this.observer.observe(img);
    } else {
      this.load(img);
    }
  }

  observeAll(selector = 'img[data-src]') {
    document.querySelectorAll(selector).forEach(img => this.observe(img));
  }

  load(img) {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
      img.removeAttribute('data-srcset');
    }
    img.classList.add('loaded');
  }
}

// ========================================
// GLOBAL INSTANCES
// ========================================

window.Utils = Utils;
window.Toast = new ToastManager();
window.Modal = new ModalManager();
window.AnimationObserver = new AnimationObserver();
window.LazyLoader = new LazyLoader();
window.ThemeManager = new ThemeManager();
window.ScrollProgress = new ScrollProgress();

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize lazy loading
  window.LazyLoader.observeAll();
  
  // Initialize animations
  window.AnimationObserver.observeAll('[data-aos], .feature-card, .step-card, .team-card, .stat-item');
  
  // Add loaded class to body for CSS transitions
  document.body.classList.add('loaded');
  
  // Handle anchor links smoothly
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        Utils.scrollToElement(target, 80);
      }
    });
  });
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Utils,
    ToastManager,
    ModalManager,
    FormValidator,
    AnimationObserver,
    ScrollProgress,
    ThemeManager,
    LazyLoader
  };
}