/**
 * ShockShield - Authentication Pages JavaScript
 * Form validation, password strength, and auth interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initRegisterForm();
  initPasswordToggles();
  initPasswordStrength();
  initSocialButtons();
  initMobileMenu();
  initNavbarScroll();
});

let validator = null;

// ========================================
// REGISTER FORM
// ========================================
function initRegisterForm() {
  const form = document.getElementById('registerForm');
  const submitBtn = document.getElementById('submitBtn');
  
  if (!form) return;

  // Validation rules
  const rules = {
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s'-]+$/,
      message: 'First name can only contain letters, spaces, hyphens, and apostrophes'
    },
    lastName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s'-]+$/,
      message: 'Last name can only contain letters, spaces, hyphens, and apostrophes'
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address'
    },
    phone: {
      required: true,
      pattern: /^[0-9]{10}$/,
      message: 'Please enter a valid 10-digit phone number'
    },
    password: {
      required: true,
      minLength: 8,
      custom: (value) => calculatePasswordStrength(value) > 0
    },
    confirmPassword: {
      required: true,
      custom: (value, form) => value === form.querySelector('[name="password"]').value,
      message: 'Passwords do not match'
    },
    terms: {
      required: true
    }
  };

  validator = new FormValidator(form, rules);

  // Handle valid submission
  form.addEventListener('form:valid', async (e) => {
    const formData = e.detail;
    await handleRegistration(formData, submitBtn);
  });

  // Handle invalid submission
  form.addEventListener('form:invalid', (e) => {
    Toast.error('Please fix the errors above', 'Validation Failed');
    // Focus first error
    const firstError = form.querySelector('.error');
    if (firstError) {
      firstError.focus();
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

async function handleRegistration(formData, submitBtn) {
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  const btnSuccess = submitBtn.querySelector('.btn-success');
  
  // Show loading state
  submitBtn.disabled = true;
  btnText.style.opacity = '0.7';
  btnLoading.style.display = 'inline-flex';
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate success (in real app, check response)
  const success = true;
  
  if (success) {
    // Show success state
    btnLoading.style.display = 'none';
    btnSuccess.style.display = 'inline-flex';
    btnText.textContent = 'Account Created!';
    submitBtn.classList.add('success');
    
    Toast.success('Your account has been created successfully!', 'Welcome to ShockShield');
    
    // Show success modal after brief delay
    setTimeout(() => {
      showSuccessModal();
    }, 800);
  } else {
    // Show error state
    btnLoading.style.display = 'none';
    btnText.style.opacity = '1';
    btnText.textContent = 'Create Account';
    submitBtn.disabled = false;
    
    Toast.error('Registration failed. Please try again.', 'Error');
  }
}

function showSuccessModal() {
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management
    const closeBtn = modal.querySelector('.btn');
    if (closeBtn) closeBtn.focus();
  }
}

// Close modal handlers
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    closeAllModals();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllModals();
  }
});

function closeAllModals() {
  document.querySelectorAll('.modal-overlay.active').forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';
}

// ========================================
// PASSWORD TOGGLES
// ========================================
function initPasswordToggles() {
  document.querySelectorAll('.password-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.closest('.input-with-toggle').querySelector('input');
      const eyeOpen = toggle.querySelector('.eye-open');
      const eyeClosed = toggle.querySelector('.eye-closed');
      
      if (input.type === 'password') {
        input.type = 'text';
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = 'inline-block';
        toggle.setAttribute('aria-label', 'Hide password');
      } else {
        input.type = 'password';
        eyeOpen.style.display = 'inline-block';
        eyeClosed.style.display = 'none';
        toggle.setAttribute('aria-label', 'Show password');
      }
    });
  });
}

// ========================================
// PASSWORD STRENGTH METER
// ========================================
function initPasswordStrength() {
  const passwordInput = document.getElementById('password');
  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');
  
  if (!passwordInput || !strengthFill || !strengthText) return;

  passwordInput.addEventListener('input', () => {
    const strength = calculatePasswordStrength(passwordInput.value);
    updateStrengthUI(strength, strengthFill, strengthText);
  });

  // Also check on paste
  passwordInput.addEventListener('paste', () => {
    setTimeout(() => {
      const strength = calculatePasswordStrength(passwordInput.value);
      updateStrengthUI(strength, strengthFill, strengthText);
    }, 0);
  });
}

function calculatePasswordStrength(password) {
  let score = 0;
  
  if (!password) return 0;
  
  // Length
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Character variety
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  
  // Bonus for mixed case + numbers + symbols
  if (/[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) {
    score += 1;
  }
  
  return Math.min(score, 4); // Max 4 levels
}

function updateStrengthUI(strength, fill, text) {
  const levels = [
    { class: '', text: 'Password strength', color: '' },
    { class: 'weak', text: 'Weak - Add more characters', color: 'var(--color-hazard-critical)' },
    { class: 'fair', text: 'Fair - Mix uppercase, numbers, symbols', color: 'var(--color-hazard-inprogress)' },
    { class: 'good', text: 'Good - Strong password', color: 'var(--color-hazard-verified)' },
    { class: 'strong', text: 'Excellent - Very secure', color: 'var(--color-hazard-solved)' }
  ];
  
  const level = levels[strength] || levels[0];
  
  fill.className = `strength-fill ${level.class}`;
  fill.style.backgroundColor = level.color;
  text.textContent = level.text;
  text.style.color = level.color || 'var(--color-text-tertiary)';
}

// ========================================
// SOCIAL BUTTONS
// ========================================
function initSocialButtons() {
  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.dataset.provider;
      Toast.info(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`, 'Feature Preview');
    });
  });
}

// ========================================
// NAVBAR SCROLL (shared with landing)
// ========================================
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let ticking = false;

  function updateNavbar() {
    if (window.pageYOffset > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });
}

// ========================================
// MOBILE MENU (shared with landing)
// ========================================
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ========================================
// ANIMATE STAT NUMBERS ON AUTH PAGE
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const statNumbers = document.querySelectorAll('.brand-stat-number[data-count]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count, 10);
        Utils.animateNumber(entry.target, target, 1500);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => observer.observe(stat));
});