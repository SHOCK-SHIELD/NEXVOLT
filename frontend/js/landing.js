/**
 * ShockShield - Landing Page JavaScript
 * Interactive features and animations for the landing page
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroStats();
  initMobileMenu();
  initSmoothScroll();
  initParallaxEffects();
  initFeatureCardHover();
  initStepCardAnimations();
  initMapPreviewInteractions();
  initTeamCardAnimations();
});

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  let ticking = false;

  function updateNavbar() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
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
// HERO STATS COUNTER ANIMATION
// ========================================
function initHeroStats() {
  const statNumbers = document.querySelectorAll('.hero-stats .stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateStats();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsContainer = document.querySelector('.hero-stats');
  if (statsContainer) {
    observer.observe(statsContainer);
  }

  function animateStats() {
    statNumbers.forEach((stat, index) => {
      const target = parseInt(stat.dataset.count, 10);
      setTimeout(() => {
        Utils.animateNumber(stat, target, 2000);
      }, index * 200);
    });
  }
}

// ========================================
// MOBILE MENU TOGGLE
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

  // Close menu when clicking a link
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      menuBtn.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navbar = document.getElementById('navbar');
        const offset = navbar ? navbar.offsetHeight : 80;
        Utils.scrollToElement(target, offset);
      }
    });
  });
}

// ========================================
// PARALLAX EFFECTS
// ========================================
function initParallaxEffects() {
  const hero = document.querySelector('.hero');
  const heroGlows = document.querySelectorAll('.hero-glow');
  const lightningBolt = document.getElementById('lightningBolt');
  
  if (!hero) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.pageYOffset;
    const heroHeight = hero.offsetHeight;
    const progress = scrollY / heroHeight;

    // Only animate while hero is visible
    if (progress < 1.5) {
      heroGlows.forEach((glow, index) => {
        const speed = 0.3 + index * 0.1;
        const yOffset = scrollY * speed;
        glow.style.transform = `translateY(${yOffset}px)`;
      });

      if (lightningBolt) {
        const rotate = scrollY * 0.05;
        lightningBolt.style.transform = `translate(-50%, -50%) rotate(${rotate}deg)`;
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

// ========================================
// FEATURE CARD HOVER EFFECTS
// ========================================
function initFeatureCardHover() {
  const cards = document.querySelectorAll('.feature-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ========================================
// STEP CARD ANIMATIONS
// ========================================
function initStepCardAnimations() {
  const stepCards = document.querySelectorAll('.step-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

  stepCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 200}ms`;
    observer.observe(card);
  });
}

// ========================================
// MAP PREVIEW INTERACTIONS
// ========================================
function initMapPreviewInteractions() {
  const markers = document.querySelectorAll('.preview-marker');
  const mapPlaceholder = document.querySelector('.map-placeholder');
  
  if (!mapPlaceholder) return;

  // Add click handlers for markers
  markers.forEach(marker => {
    marker.addEventListener('click', () => {
      const title = marker.getAttribute('title');
      if (title) {
        Toast.info(`Viewing details for: ${title}`, 'Hazard Details');
      }
    });

    // Keyboard accessibility
    marker.setAttribute('tabindex', '0');
    marker.setAttribute('role', 'button');
    marker.setAttribute('aria-label', marker.getAttribute('title') || 'Hazard marker');
    
    marker.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        marker.click();
      }
    });
  });

  // Map placeholder click - navigate to full map
  mapPlaceholder.addEventListener('click', (e) => {
    if (e.target === mapPlaceholder || e.target.closest('.map-preview-bg')) {
      window.location.href = 'map.html';
    }
  });

  // Add hover effect to map
  mapPlaceholder.addEventListener('mousemove', (e) => {
    const rect = mapPlaceholder.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mapPlaceholder.style.setProperty('--mouse-x', `${x}px`);
    mapPlaceholder.style.setProperty('--mouse-y', `${y}px`);
  });
}

// ========================================
// STEPS PROGRESS SCROLL INDICATOR
// ========================================
function initStepsProgress() {
  const section = document.getElementById('how-it-works');
  const progressFill = document.getElementById('stepsProgressFill');
  const progressMarkers = document.querySelectorAll('.step-marker');
  const progressWrapper = document.getElementById('stepsProgressWrapper');
  
  if (!section || !progressFill || !progressMarkers.length) {
    return;
  }
  
  let ticking = false;
  
  function updateProgress() {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    
    // Calculate progress based on section visibility
    // Start when top of section reaches bottom of viewport
    // End when bottom of section reaches top of viewport
    const startOffset = windowHeight * 0.8; // Start when 80% from top
    const endOffset = windowHeight * 0.2;   // End when 20% from top
    
    const progressStart = sectionTop - startOffset;
    const progressEnd = sectionTop + sectionHeight - endOffset;
    const progressRange = progressEnd - progressStart;
    
    let progress = 0;
    
    if (sectionTop < startOffset && sectionTop + sectionHeight > endOffset) {
      // Section is in the progress zone
      progress = Math.max(0, Math.min(1, (startOffset - sectionTop) / progressRange));
    } else if (sectionTop <= endOffset) {
      progress = 1;
    }
    
    // Update progress fill
    progressFill.style.width = `${progress * 100}%`;
    
    // Update step markers based on progress
    const stepThresholds = [0.15, 0.5, 0.85]; // 15%, 50%, 85%
    
    progressMarkers.forEach((marker, index) => {
      const threshold = stepThresholds[index];
      const step = index + 1;
      
      if (progress >= threshold) {
        marker.classList.add('active');
        marker.classList.remove('completed');
      } else {
        marker.classList.remove('active');
      }
      
      // Mark as completed if past the next threshold
      if (index < 2 && progress >= stepThresholds[index + 1]) {
        marker.classList.add('completed');
      } else {
        marker.classList.remove('completed');
      }
    });
    
    ticking = false;
  }
  
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', onScroll, { passive: true });
  
  // Initial check
  updateProgress();
}

// Initialize steps progress
document.addEventListener('DOMContentLoaded', () => {
  initStepsProgress();
});
function initTeamCardAnimations() {
  const teamCards = document.querySelectorAll('.team-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  teamCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 150}ms`;
    observer.observe(card);
  });

  // Add 3D tilt effect
  teamCards.forEach(card => {
    const avatar = card.querySelector('.team-avatar');
    
    card.addEventListener('mousemove', (e) => {
      if (!avatar) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 30;
      const rotateY = (centerX - x) / 30;
      
      avatar.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      if (avatar) {
        avatar.style.transform = '';
      }
    });
  });
}

// ========================================
// CTA BUTTON INTERACTIONS
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const ctaButtons = document.querySelectorAll('.cta-actions .btn');
  
  ctaButtons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-4px) scale(1.02)';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
    
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'translateY(0) scale(0.98)';
    });
    
    btn.addEventListener('mouseup', () => {
      btn.style.transform = 'translateY(-4px) scale(1.02)';
    });
  });
});

// ========================================
// SCROLL REVEAL FOR SECTIONS
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

  sections.forEach(section => {
    observer.observe(section);
  });
});

// ========================================
// KEYBOARD NAVIGATION SUPPORT
// ========================================
document.addEventListener('keydown', (e) => {
  // Skip to main content
  if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
    const mainContent = document.querySelector('main') || document.querySelector('.hero');
    if (mainContent) {
      mainContent.focus();
    }
  }
});

// ========================================
// PERFORMANCE MONITORING
// ========================================
if ('PerformanceObserver' in window) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log(`LCP: ${entry.startTime}ms`);
      }
      if (entry.entryType === 'first-input') {
        console.log(`FID: ${entry.processingStart - entry.startTime}ms`);
      }
    }
  });
  
  try {
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
    observer.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    // Not supported
  }
}

// ========================================
// ERROR HANDLING
// ========================================
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  // Could send to error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled rejection:', e.reason);
  // Could send to error tracking service
});

// ========================================
// LANGUAGE SWITCHER
// ========================================
const translations = {
  en: {
    // Navigation
    'nav.features': 'Features',
    'nav.how-it-works': 'How It Works',
    'nav.hazard-map': 'Hazard Map',
    'nav.team': 'Team',
    'nav.signup': 'Sign Up',
    'nav.live-feed': 'Live Feed',
    
    // Hero
    'hero.badge.hacknauts': 'HackNauts 2.0 Project',
    'hero.badge.team': 'Team NexVolt',
    'hero.title.1': 'Community-Powered',
    'hero.title.2': 'Electrical Safety',
    'hero.title.3': 'Platform',
    'hero.desc': 'Report, track, and resolve electrical hazards in your neighborhood. Empower communities to protect lives through real-time hazard mapping and municipal collaboration.',
    'hero.stat.1.label': 'Hazards Reported',
    'hero.stat.2.label': 'Issues Resolved',
    'hero.stat.3.label': 'Active Responders',
    'hero.stat.4.label': 'Cities Covered',
    'hero.btn.join': 'Join the Movement',
    'hero.btn.feed': 'View Live Feed',
    'hero.trust.label': 'Trusted by communities across',
    
    // Features
    'features.tag': 'Key Features',
    'features.title': 'Everything You Need for Electrical Safety',
    'features.desc': 'Built for communities, responders, and municipalities to work together',
    'feature.1.title': 'Instant Hazard Reporting',
    'feature.1.desc': 'Snap a photo, add location, and report electrical hazards in seconds. GPS auto-capture ensures precise location tagging.',
    'feature.1.highlights': ['Photo upload with EXIF data', 'Auto GPS location capture', 'Hazard categorization'],
    'feature.2.title': 'Live Community Feed',
    'feature.2.desc': 'Instagram-style feed showing real-time hazard reports from your area. Like, share, and prioritize critical issues.',
    'feature.2.highlights': ['Real-time updates', 'Priority voting system', 'Status tracking'],
    'feature.3.title': 'Interactive Hazard Map',
    'feature.3.desc': 'OpenStreetMap-powered live map showing your location and nearby hazards with color-coded status markers.',
    'feature.3.highlights': ['Live location tracking', 'Color-coded status', 'Radius filtering'],
    'feature.4.title': 'Municipal Responder Dashboard',
    'feature.4.desc': 'Dedicated portal for municipal corporations to view, assign, and track hazard resolution with SLA monitoring.',
    'feature.4.highlights': ['Assignment workflow', 'SLA tracking', 'Resolution analytics'],
    'feature.5.title': 'Community Engagement',
    'feature.5.desc': 'Gamified safety participation with badges, leaderboards, and community challenges to encourage active reporting.',
    'feature.5.highlights': ['Achievement badges', 'Local leaderboards', 'Safety challenges'],
    'feature.6.title': 'Smart Notifications',
    'feature.6.desc': 'Real-time alerts for hazards near you, status updates on your reports, and emergency broadcasts from authorities.',
    'feature.6.highlights': ['Geofenced alerts', 'Status change notifications', 'Emergency broadcasts'],
    
    // How it Works
    'how.tag': 'How It Works',
    'how.title': 'Three Steps to Safer Streets',
    'how.desc': 'Simple process, powerful impact',
    'step.1.title': 'Spot & Report',
    'step.1.desc': 'See a dangerous electrical situation? Open the app, snap a photo, select the hazard type, and submit. Your GPS location is captured automatically.',
    'step.1.tags': ['Photo Upload', 'Auto-Location', 'Category Tags'],
    'step.2.title': 'Community Verification',
    'step.2.desc': 'Your report appears on the live feed. Community members can verify, upvote critical issues, and add comments. Higher engagement = faster response.',
    'step.2.tags': ['Upvote System', 'Comments', 'Verification'],
    'step.3.title': 'Rapid Resolution',
    'step.3.desc': 'Municipal responders see prioritized issues on their dashboard. Track progress in real-time: Assigned → In Progress → Resolved. Get notified when fixed.',
    'step.3.tags': ['Live Tracking', 'Status Updates', 'Resolution Proof'],
    
    // Map Preview
    'map.tag': 'Live Hazard Map',
    'map.title': 'Real-Time Electrical Hazard Visualization',
    'map.desc': 'OpenStreetMap-powered interactive map with live location and color-coded hazard markers',
    'map.legend.title': 'Hazard Status Legend',
    'map.legend.unsolved': 'Unsolved / Critical',
    'map.legend.inprogress': 'Under Progress',
    'map.legend.solved': 'Resolved',
    'map.legend.user': 'Your Location',
    'map.features.title': 'Map Features',
    'map.features.list': ['Live GPS location tracking', 'Color-coded hazard markers', 'Filter by status/radius/type', 'Cluster grouping for dense areas', 'Click for details & navigation', 'Real-time status updates'],
    'map.cta': 'Explore Live Hazard Map',
    
    // Team
    'team.tag': 'Team NexVolt',
    'team.title': 'Meet the Innovators',
    'team.desc': 'Four passionate developers building safer communities',
    'team.captain': 'Captain',
    'team.backend': 'Backend',
    'team.debug': 'Debug',
    'team.db': 'Database',
    
    // CTA
    'cta.title': 'Ready to Make Your Community Safer?',
    'cta.desc': 'Join thousands of citizens reporting electrical hazards and saving lives. Every report matters.',
    'cta.btn.start': 'Get Started Free',
    'cta.btn.feed': 'Browse Live Feed',
    'cta.note': 'No credit card required • Instant access • Community driven',
    
    // Footer
    'footer.tagline': 'Empowering communities to eliminate electrical hazards through technology and collaboration.',
    'footer.platform': 'Platform',
    'footer.resources': 'Resources',
    'footer.legal': 'Legal',
    'footer.contact': 'Contact Us',
    'footer.live-feed': 'Live Feed',
    'footer.hazard-map': 'Hazard Map',
    'footer.register': 'Register',
    'footer.responder': 'Responder Portal',
    'footer.api': 'API Docs',
    'footer.safety': 'Safety Guidelines',
    'footer.hazards101': 'Electrical Hazards 101',
    'footer.forum': 'Community Forum',
    'footer.help': 'Help Center',
    'footer.blog': 'Blog',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.cookies': 'Cookie Policy',
    'footer.data': 'Data Protection',
    'footer.team': 'Team NexVolt',
    'footer.hacknauts': 'HackNauts 2.0',
    'footer.copyright': '© 2025 ShockShield - Team NexVolt. Built for HackNauts 2.0.',
    'footer.made': 'Made with ⚡ for safer communities',
    
    // Language
    'lang.current': 'English',
    'lang.en': 'English',
    'lang.hi': 'Hindi',
    'lang.pa': 'Punjabi',
  },
  hi: {
    // Navigation
    'nav.features': 'विशेषताएं',
    'nav.how-it-works': 'यह कैसे काम करता है',
    'nav.hazard-map': 'खतरा मानचित्र',
    'nav.team': 'टीम',
    'nav.signup': 'साइन अप',
    'nav.live-feed': 'लाइव फीड',
    
    // Hero
    'hero.badge.hacknauts': 'हैकनॉट्स 2.0 परियोजना',
    'hero.badge.team': 'टीम नेक्सवोल्ट',
    'hero.title.1': 'समुदाय-संचालित',
    'hero.title.2': 'विद्युत सुरक्षा',
    'hero.title.3': 'प्लेटफॉर्म',
    'hero.desc': 'अपने पड़ोस में विद्युत खतरों की रिपोर्ट करें, ट्रैक करें और हल करें। रीयल-टाइम खतरा मैपिंग और नगरपालिका सहयोग के माध्यम से समुदायों को जीवन बचाने के लिए सशक्त बनाएं।',
    'hero.stat.1.label': 'रिपोर्ट किए गए खतरे',
    'hero.stat.2.label': 'हल किए गए मुद्दे',
    'hero.stat.3.label': 'सक्रिय प्रतिक्रियाकर्ता',
    'hero.stat.4.label': 'कवर किए गए शहर',
    'hero.btn.join': 'आंदोलन में शामिल हों',
    'hero.btn.feed': 'लाइव फीड देखें',
    'hero.trust.label': 'समुदायों द्वारा भरोसा किया गया',
    
    // Features
    'features.tag': 'मुख्य विशेषताएं',
    'features.title': 'विद्युत सुरक्षा के लिए आपको जो कुछ भी चाहिए',
    'features.desc': 'समुदायों, प्रतिक्रियाकर्ताओं और नगरपालिकाओं के लिए एक साथ काम करने के लिए बनाया गया',
    'feature.1.title': 'तत्काल खतरा रिपोर्टिंग',
    'feature.1.desc': 'एक फोटो लें, स्थान जोड़ें, और सेकंडों में विद्युत खतरों की रिपोर्ट करें। GPS ऑटो-कैप्चर सटीक स्थान टैगिंग सुनिश्चित करता है।',
    'feature.1.highlights': ['EXIF डेटा के साथ फोटो अपलोड', 'ऑटो GPS स्थान कैप्चर', 'खतरा वर्गीकरण'],
    'feature.2.title': 'लाइव कम्युनिटी फीड',
    'feature.2.desc': 'आपके क्षेत्र से रीयल-टाइम खतरे की रिपोर्ट दिखाने वाला इंस्टाग्राम-स्टाइल फीड। महत्वपूर्ण मुद्दों को लाइक, शेयर और प्राथमिकता दें।',
    'feature.2.highlights': ['रीयल-टाइम अपडेट', 'प्राथमिकता मतदान प्रणाली', 'स्थिति ट्रैकिंग'],
    'feature.3.title': 'इंटरैक्टिव खतरा मानचित्र',
    'feature.3.desc': 'ओपनस्ट्रीटमैप-संचालित लाइव मानचित्र जो आपके स्थान और रंग-कोडित स्थिति मार्कर के साथ आस-पास के खतरों को दिखाता है।',
    'feature.3.highlights': ['लाइव स्थान ट्रैकिंग', 'रंग-कोडित स्थिति', 'त्रिज्या फ़िल्टरिंग'],
    'feature.4.title': 'नगरपालिका प्रतिक्रियाकर्ता डैशबोर्ड',
    'feature.4.desc': 'नगर निगमों के लिए समर्पित पोर्टल खतरों को देखने, असाइन करने और SLA मॉनिटरिंग के साथ समाधान ट्रैक करने के लिए।',
    'feature.4.highlights': ['असाइनमेंट वर्कफ़्लो', 'SLA ट्रैकिंग', 'समाधान विश्लेषण'],
    'feature.5.title': 'सामुदायिक सहभागिता',
    'feature.5.desc': 'सक्रिय रिपोर्टिंग को प्रोत्साहित करने के लिए बैज, लीडरबोर्ड और सामुदायिक चुनौतियों के साथ गेमिफाइड सुरक्षा भागीदारी।',
    'feature.5.highlights': ['उपलब्धि बैज', 'स्थानीय लीडरबोर्ड', 'सुरक्षा चुनौतियां'],
    'feature.6.title': 'स्मार्ट सूचनाएं',
    'feature.6.desc': 'आपके पास खतरों के लिए रीयल-टाइम अलर्ट, आपकी रिपोर्ट पर स्थिति अपडेट, और अधिकारियों से आपातकालीन प्रसारण।',
    'feature.6.highlights': ['जियोफेंस्ड अलर्ट', 'स्थिति परिवर्तन सूचनाएं', 'आपातकालीन प्रसारण'],
    
    // How it Works
    'how.tag': 'यह कैसे काम करता है',
    'how.title': 'सुरक्षित सड़कों के लिए तीन चरण',
    'how.desc': 'सरल प्रक्रिया, शक्तिशाली प्रभाव',
    'step.1.title': 'देखें और रिपोर्ट करें',
    'step.1.desc': 'खतरनाक विद्युत स्थिति देखी? ऐप खोलें, फोटो लें, खतरे का प्रकार चुनें, और सबमिट करें। आपका GPS स्थान स्वचालित रूप से कैप्चर हो जाता है।',
    'step.1.tags': ['फोटो अपलोड', 'ऑटो-स्थान', 'श्रेणी टैग'],
    'step.2.title': 'सामुदायिक सत्यापन',
    'step.2.desc': 'आपकी रिपोर्ट लाइव फीड पर दिखाई देती है। समुदाय के सदस्य सत्यापित कर सकते हैं, महत्वपूर्ण मुद्दों को अपवोट कर सकते हैं, और टिप्पणियां जोड़ सकते हैं। अधिक सहभागिता = तेज़ प्रतिक्रिया।',
    'step.2.tags': ['अपवोट सिस्टम', 'टिप्पणियां', 'सत्यापन'],
    'step.3.title': 'त्वरित समाधान',
    'step.3.desc': 'नगरपालिका प्रतिक्रियाकर्ता अपने डैशबोर्ड पर प्राथमिकता वाले मुद्दे देखते हैं। रीयल-टाइम में प्रगति ट्रैक करें: असाइन किया गया → प्रगति पर → हल किया गया। ठीक होने पर सूचना प्राप्त करें।',
    'step.3.tags': ['लाइव ट्रैकिंग', 'स्थिति अपडेट', 'समाधान प्रमाण'],
    
    // Map Preview
    'map.tag': 'लाइव खतरा मानचित्र',
    'map.title': 'रीयल-टाइम विद्युत खतरा विज़ुअलाइज़ेशन',
    'map.desc': 'लाइव स्थान और रंग-कोडित खतरा मार्कर के साथ ओपनस्ट्रीटमैप-संचालित इंटरैक्टिव मानचित्र',
    'map.legend.title': 'खतरा स्थिति लीजेंड',
    'map.legend.unsolved': 'अनसुलझा / गंभीर',
    'map.legend.inprogress': 'प्रगति पर',
    'map.legend.solved': 'हल किया गया',
    'map.legend.user': 'आपका स्थान',
    'map.features.title': 'मानचित्र विशेषताएं',
    'map.features.list': ['लाइव GPS स्थान ट्रैकिंग', 'रंग-कोडित खतरा मार्कर', 'स्थिति/त्रिज्या/प्रकार से फ़िल्टर करें', 'घने क्षेत्रों के लिए क्लस्टर ग्रुपिंग', 'विवरण और नेविगेशन के लिए क्लिक करें', 'रीयल-टाइम स्थिति अपडेट'],
    'map.cta': 'लाइव खतरा मानचित्र देखें',
    
    // Team
    'team.tag': 'टीम नेक्सवोल्ट',
    'team.title': 'नवप्रवर्तकों से मिलें',
    'team.desc': 'सुरक्षित समुदायों का निर्माण करने वाले चार जुनूनी डेवलपर्स',
    'team.captain': 'कप्तान',
    'team.backend': 'बैकएंड',
    'team.debug': 'डीबग',
    'team.db': 'डेटाबेस',
    
    // CTA
    'cta.title': 'क्या आप अपने समुदाय को सुरक्षित बनाने के लिए तैयार हैं?',
    'cta.desc': 'विद्युत खतरों की रिपोर्ट करने और जीवन बचाने वाले हजारों नागरिकों से जुड़ें। हर रिपोर्ट मायने रखती है।',
    'cta.btn.start': 'मुफ्त में शुरू करें',
    'cta.btn.feed': 'लाइव फीड ब्राउज़ करें',
    'cta.note': 'क्रेडिट कार्ड की आवश्यकता नहीं • त्वरित पहुंच • समुदाय संचालित',
    
    // Footer
    'footer.tagline': 'प्रौद्योगिकी और सहयोग के माध्यम से समुदायों को विद्युत खतरों को खत्म करने के लिए सशक्त बनाना।',
    'footer.platform': 'प्लेटफॉर्म',
    'footer.resources': 'संसाधन',
    'footer.legal': 'कानूनी',
    'footer.contact': 'संपर्क करें',
    'footer.live-feed': 'लाइव फीड',
    'footer.hazard-map': 'खतरा मानचित्र',
    'footer.register': 'रजिस्टर',
    'footer.responder': 'प्रतिक्रियाकर्ता पोर्टल',
    'footer.api': 'API डॉक्स',
    'footer.safety': 'सुरक्षा दिशानिर्देश',
    'footer.hazards101': 'विद्युत खतरे 101',
    'footer.forum': 'सामुदायिक मंच',
    'footer.help': 'सहायता केंद्र',
    'footer.blog': 'ब्लॉग',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'सेवा की शर्तें',
    'footer.cookies': 'कुकी नीति',
    'footer.data': 'डेटा सुरक्षा',
    'footer.team': 'टीम नेक्सवोल्ट',
    'footer.hacknauts': 'हैकनॉट्स 2.0',
    'footer.copyright': '© 2025 शॉकशील्ड - टीम नेक्सवोल्ट। हैकनॉट्स 2.0 के लिए बनाया गया।',
    'footer.made': '⚡ के साथ सुरक्षित समुदायों के लिए बनाया गया',
    
    // Language
    'lang.current': 'हिन्दी',
    'lang.en': 'English',
    'lang.hi': 'हिन्दी',
    'lang.pa': 'ਪੰਜਾਬੀ',
  },
  pa: {
    // Navigation
    'nav.features': 'ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ',
    'nav.how-it-works': 'ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ',
    'nav.hazard-map': 'ਖਤਰਾ ਮੈਪ',
    'nav.team': 'ਟੀਮ',
    'nav.signup': 'ਸਾਇਨ ਅੱਪ',
    'nav.live-feed': 'ਲਾਈਵ ਫੀਡ',
    
    // Hero
    'hero.badge.hacknauts': 'ਹੈਕਨਾਟਸ 2.0 ਪ੍ਰੋਜੈਕਟ',
    'hero.badge.team': 'ਟੀਮ ਨੈਕਸਵੋਲਟ',
    'hero.title.1': 'ਕਮਿਊਨਿਟੀ-ਚਲਿਤ',
    'hero.title.2': 'ਵਿਦ্যুਤ ਸੁਰੱਖਿਆ',
    'hero.title.3': 'ਪਲੇਟਫਾਰਮ',
    'hero.desc': 'ਆਪਣੇ ਮੁਹੱਲੇ ਵਿੱਚ ਵਿਦ্যুਤ ਖਤਰਿਆਂ ਦੀ ਰਿਪੋਰਟ ਕਰੋ, ਟਰੈਕ ਕਰੋ ਅਤੇ ਹੱਲ ਕਰੋ। ਰਿਅਲ-ਟਾਈਮ ਖਤਰਾ ਮੈਪਿੰਗ ਅਤੇ ਮੁਨਸਿਪਲ ਸਹਿਯੋਗ ਦੁਆਰਾ ਕਮਿਊਨਿਟੀਆਂ ਨੂੰ ਜ਼ਿੰਦਗੀਆਂ ਬਚਾਉਣ ਲਈ ਸਸ਼ਕਤ ਬਣਾਓ।',
    'hero.stat.1.label': 'ਰਿਪੋਰਟ ਕੀਤੇ ਗਏ ਖਤਰੇ',
    'hero.stat.2.label': 'ਹੱਲ ਕੀਤੇ ਗਏ ਮੁੱਦੇ',
    'hero.stat.3.label': 'ਸਰਗਰਮ ਰਿਸਪਾਂਡਰ',
    'hero.stat.4.label': 'ਕਵਰ ਕੀਤੇ ਗਏ ਸ਼ਹਿਰ',
    'hero.btn.join': 'ਲਹਿਰ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ',
    'hero.btn.feed': 'ਲਾਈਵ ਫੀਡ ਵੇਖੋ',
    'hero.trust.label': 'ਕਮਿਊਨਿਟੀਆਂ ਦੁਆਰਾ ਭਰੋਸਾ ਕੀਤਾ ਗਿਆ',
    
    // Features
    'features.tag': 'ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ',
    'features.title': 'ਵਿਦ্যুਤ ਸੁਰੱਖਿਆ ਲਈ ਤੁਹਾਨੂੰ ਜੋ ਕੁਝ ਚਾਹੀਦਾ ਹੈ',
    'features.desc': 'ਕਮਿਊਨਿਟੀਆਂ, ਰਿਸਪਾਂਡਰਾਂ ਅਤੇ ਮੁਨਸਿਪਲਿਟੀਆਂ ਦੇ ਇਕੱਠੇ ਕੰਮ ਕਰਨ ਲਈ ਬਣਾਇਆ ਗਿਆ',
    'feature.1.title': 'ਤੁਰੰਤ ਖਤਰਾ ਰਿਪੋਰਟਿੰਗ',
    'feature.1.desc': 'ਤਸਵੀਰ ਲਓ, ਲੋਕੇਸ਼ਨ ਜੋੜੋ, ਅਤੇ ਸਕੰਡਾਂ ਵਿੱਚ ਵਿਦ্যুਤ ਖਤਰਿਆਂ ਦੀ ਰਿਪੋਰਟ ਕਰੋ। GPS ਆਟੋ-ਕੈਪਚਰ ਸਹੀ ਲੋਕੇਸ਼ਨ ਟੈਗਿੰਗ ਯਕੀਨੀ ਬਣਾਉਂਦਾ ਹੈ।',
    'feature.1.highlights': ['EXIF ਡੇਟਾ ਨਾਲ ਫੋਟੋ ਅਪਲੋਡ', 'ਆਟੋ GPS ਲੋਕੇਸ਼ਨ ਕੈਪਚਰ', 'ਖਤਰਾ ਵਰਗੀਕਰਨ'],
    'feature.2.title': 'ਲਾਈਵ ਕਮਿਊਨਿਟੀ ਫੀਡ',
    'feature.2.desc': 'ਤੁਹਾਡੇ ਖੇਤਰ ਤੋਂ ਰੀਅਲ-ਟਾਈਮ ਖਤਰੇ ਦੀ ਰਿਪੋਰਟਾਂ ਦਿਖਾਉਣ ਵਾਲਾ ਇੰਸਟਾਗ੍ਰਾਮ-ਸ਼ੈਲੀ ਫੀਡ। ਮਹੱਤਵਪੂਰਨ ਮੁੱਦਿਆਂ ਨੂੰ ਲਾਇਕ, ਸ਼ੇਅਰ ਅਤੇ ਪਹਿਲੇ ਪਹਿਲ ਕਰੋ।',
    'feature.2.highlights': ['ਰੀਅਲ-ਟਾਈਮ ਅਪਡੇਟ', 'ਪਹਿਲੇ ਪਹਿਲ ਵੋਟਿੰਗ ਸਿਸਟਮ', 'ਸਥਿਤੀ ਟਰੈਕਿੰਗ'],
    'feature.3.title': 'ਇੰਟਰੈਕਟਿਵ ਖਤਰਾ ਮੈਪ',
    'feature.3.desc': 'ਓਪਨਸਟਰੀਟਮੈਪ-ਸੰਚਾਲਿਤ ਲਾਈਵ ਮੈਪ ਜੋ ਤੁਹਾਡੇ ਲੋਕੇਸ਼ਨ ਅਤੇ ਰੰਗ-ਕੋਡਡ ਸਥਿਤੀ ਮਾਰਕਰਾਂ ਨਾਲ ਨੇੜੇ ਦੇ ਖਤਰਿਆਂ ਨੂੰ ਦਿਖਾਉਂਦਾ ਹੈ।',
    'feature.3.highlights': ['ਲਾਈਵ ਲੋਕੇਸ਼ਨ ਟਰੈਕਿੰਗ', 'ਰੰਗ-ਕੋਡਡ ਸਥਿਤੀ', 'ਰੇਡੀਅਸ ਫਿਲਟਰਿੰਗ'],
    'feature.4.title': 'ਮੁਨਸਿਪਲ ਰਿਸਪਾਂਡਰ ਡੈਸ਼ਬੋਰਡ',
    'feature.4.desc': 'ਮੁਨਸਿਪਲ ਨਿਗਮਾਂ ਲਈ ਸਮਰਪਿਤ ਪੋਰਟਲ ਖਤਰਿਆਂ ਨੂੰ ਵੇਖਣ, ਨਿਯੁਕਤ ਕਰਨ ਅਤੇ SLA ਮਾਨਿਟਰਿੰਗ ਨਾਲ ਹੱਲ ਨੂੰ ਟਰੈਕ ਕਰਨ ਲਈ।',
    'feature.4.highlights': ['ਨਿਯੁਕਤੀ ਵਰਕਫਲੋ', 'SLA ਟਰੈਕਿੰਗ', 'ਹੱਲ ਵਿਸ਼ਲੇਸ਼ਣ'],
    'feature.5.title': 'ਕਮਿਊਨਿਟੀ ਏਂਗੇਜਮੈਂਟ',
    'feature.5.desc': 'ਬੈਜ, ਲੀਡਰਬੋਰਡ ਅਤੇ ਕਮਿਊਨਿਟੀ ਚੁਣੌਤੀਆਂ ਨਾਲ ਗੇਮੀਫਾਈਡ ਸੁਰੱਖਿਆ ਭਾਗੀਦਾਰੀ ਜੋ ਸਰਗਰਮ ਰਿਪੋਰਟਿੰਗ ਨੂੰ ਉਤਸ਼ਾਹਿਤ ਕਰਦੀ ਹੈ।',
    'feature.5.highlights': ['ਪ੍ਰਾਪਤੀ ਬੈਜ', 'ਸਥਾਨਕ ਲੀਡਰਬੋਰਡ', 'ਸੁਰੱਖਿਆ ਚੁਣੌਤੀਆਂ'],
    'feature.6.title': 'ਸਮਾਰਟ ਸੂਚਨਾਵਾਂ',
    'feature.6.desc': 'ਤੁਹਾਡੇ ਨੇੜੇ ਖਤਰਿਆਂ ਲਈ ਰੀਅਲ-ਟਾਈਮ ਅਲਰਟ, ਤੁਹਾਡੀ ਰਿਪੋਰਟਾਂ ਤੇ ਸਥਿਤੀ ਅਪਡੇਟ, ਅਤੇ ਅਧਿਕਾਰੀਆਂ ਤੋਂ ਐਮਰਜੈਂਸੀ ਪ੍ਰਸਾਰ।',
    'feature.6.highlights': ['ਜੀਓਫੇਂਸਡ ਅਲਰਟ', 'ਸਥਿਤੀ ਬਦਲਾਅ ਸੂਚਨਾਵਾਂ', 'ਐਮਰਜੈਂਸੀ ਪ੍ਰਸਾਰ'],
    
    // How it Works
    'how.tag': 'ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ',
    'how.title': 'ਸੁਰੱਖਿਅਤ ਸੜਕਾਂ ਲਈ ਤਿੰਨ ਕਦਮ',
    'how.desc': 'ਸਧਾਰਨ ਪ੍ਰਕਿਰਿਆ, ਜ਼ਬਰਦਸਤ ਪ੍ਰਭਾਵ',
    'step.1.title': 'ਦੇਖੋ ਅਤੇ ਰਿਪੋਰਟ ਕਰੋ',
    'step.1.desc': 'ਖਤਰਨਾਕ ਵਿਦ্যুਤ ਸਥਿਤੀ ਦੇਖੀ? ਐਪ ਖੋਲ੍ਹੋ, ਤਸਵੀਰ ਲਓ, ਖਤਰੇ ਦਾ ਪ੍ਰਕਾਰ ਚੁਣੋ, ਅਤੇ ਸਬਮਿਟ ਕਰੋ। ਤੁਹਾਡਾ GPS ਲੋਕੇਸ਼ਨ ਆਪਣੇ ਆਪ ਕੈਪਚਰ ਹੋ ਜਾਂਦਾ ਹੈ।',
    'step.1.tags': ['ਫੋਟੋ ਅਪਲੋਡ', 'ਆਟੋ-ਲੋਕੇਸ਼ਨ', 'ਸ਼੍ਰੇਣੀ ਟੈਗ'],
    'step.2.title': 'ਕਮਿਊਨਿਟੀ ਵੈਰੀਫਿਕੇਸ਼ਨ',
    'step.2.desc': 'ਤੁਹਾਡੀ ਰਿਪੋਰਟ ਲਾਈਵ ਫੀਡ ਤੇ ਦਿਖਾਈ ਦਿੰਦੀ ਹੈ। ਕਮਿਊਨਿਟੀ ਦੇ ਸਦੱਸ ਯਕੀਨੀ ਬਣਾ ਸਕਦੇ ਹਨ, ਮਹੱਤਵਪੂਰਨ ਮੁੱਦਿਆਂ ਨੂੰ ਅਪਵੋਟ ਕਰ ਸਕਦੇ ਹਨ, ਅਤੇ ਟਿੱਪਣੀਆਂ ਜੋੜ ਸਕਦੇ ਹਨ। ਵਧੀਆ ਏਂਗੇਜਮੈਂਟ = ਤੇਜ਼ ਜਵਾਬਦੇਹੀ।',
    'step.2.tags': ['ਅਪਵੋਟ ਸਿਸਟਮ', 'ਟਿੱਪਣੀਆਂ', 'ਵੈਰੀਫਿਕੇਸ਼ਨ'],
    'step.3.title': 'ਤੁਰੰਤ ਹੱਲ',
    'step.3.desc': 'ਮੁਨਸਿਪਲ ਰਿਸਪਾਂਡਰ ਆਪਣੇ ਡੈਸ਼ਬੋਰਡ ਤੇ ਪਹਿਲੇ ਪਹਿਲ ਦੇ ਮੁੱਦੇ ਦੇਖਦੇ ਹਨ। ਰੀਅਲ-ਟਾਈਮ ਵਿੱਚ ਪ੍ਰਗਤੀ ਟਰੈਕ ਕਰੋ: ਨਿਯੁਕਤ ਕੀਤਾ → ਪ੍ਰਗਤੀ \u2019ਤੇ → ਹੱਲ ਕੀਤਾ। ਠੀਕ ਹੋਣ \u2019ਤੇ ਸੂਚਨਾ ਪ੍ਰਾਪਤ ਕਰੋ।',
    'step.3.tags': ['ਲਾਈਵ ਟਰੈਕਿੰਗ', 'ਸਥਿਤੀ ਅਪਡੇਟ', 'ਹੱਲ ਦਾ ਸਬੂਤ'],
    
    // Map Preview
    'map.tag': 'ਲਾਈਵ ਖਤਰਾ ਮੈਪ',
    'map.title': 'ਰੀਅਲ-ਟਾਈਮ ਵਿਦ্যুਤ ਖਤਰਾ ਵਿੱਜ਼ੂਅਲਾਈਜ਼ੇਸ਼ਨ',
    'map.desc': 'ਲਾਈਵ ਲੋਕੇਸ਼ਨ ਅਤੇ ਰੰਗ-ਕੋਡਡ ਖਤਰਾ ਮਾਰਕਰਾਂ ਨਾਲ ਓਪਨਸਟਰੀਟਮੈਪ-ਸੰਚਾਲਿਤ ਇੰਟਰੈਕਟਿਵ ਮੈਪ',
    'map.legend.title': 'ਖਤਰਾ ਸਥਿਤੀ ਲੀਜੈਂਡ',
    'map.legend.unsolved': 'ਹਲ ਨਹੀਂ ਕੀਤਾ / ਗੰਭੀਰ',
    'map.legend.inprogress': 'ਪ੍ਰਗਤੀ \u2019ਤੇ',
    'map.legend.solved': 'ਹੱਲ ਕੀਤਾ ਗਿਆ',
    'map.legend.user': 'ਤੁਹਾਡਾ ਲੋਕੇਸ਼ਨ',
    'map.features.title': 'ਮੈਪ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ',
    'map.features.list': ['ਲਾਈਵ GPS ਲੋਕੇਸ਼ਨ ਟਰੈਕਿੰਗ', 'ਰੰਗ-ਕੋਡਡ ਖਤਰਾ ਮਾਰਕਰ', 'ਸਥਿਤੀ/ਰੇਡੀਅਸ/ਪ੍ਰਕਾਰ ਅਨੁਸਾਰ ਫਿਲਟਰ ਕਰੋ', 'ਘਣੇ ਖੇਤਰਾਂ ਲਈ ਕਲਸਟਰ ਗਰੁਪਿੰਗ', 'ਵੇਰਵੇ ਅਤੇ ਨੈਵੀਗੇਸ਼ਨ ਲਈ ਕਲਿੱਕ ਕਰੋ', 'ਰੀਅਲ-ਟਾਈਮ ਸਥਿਤੀ ਅਪਡੇਟ'],
    'map.cta': 'ਲਾਈਵ ਖਤਰਾ ਮੈਪ ਵੇਖੋ',
    
    // Team
    'team.tag': 'ਟੀਮ ਨੈਕਸਵੋਲਟ',
    'team.title': 'ਨਵਪ੍ਰਵਰਤਕਾਂ ਨਾਲ ਮਿਲੋ',
    'team.desc': 'ਸੁਰੱਖਿਅਤ ਕਮਿਊਨਿਟੀਆਂ ਬਣਾਉਣ ਵਾਲੇ ਚਾਰ ਜ਼ੁਨੂਨੀ ਡਿਵੈਲਪਰ',
    'team.captain': 'ਕੈਪਟਨ',
    'team.backend': 'ਬੈਕਐਂਡ',
    'team.debug': 'ਡੀਬਗ',
    'team.db': 'ਡੇਟਾਬੇਸ',
    
    // CTA
    'cta.title': 'ਕੀ ਤੁਸੀਂ ਆਪਣੀ ਕਮਿਊਨਿਟੀ ਨੂੰ ਸੁਰੱਖਿਅਤ ਬਣਾਉਣ ਲਈ ਤਿਆਰ ਹੋ?',
    'cta.desc': 'ਵਿਦ্যুਤ ਖਤਰਿਆਂ ਦੀ ਰਿਪੋਰਟ ਕਰਨ ਅਤੇ ਜ਼ਿੰਦਗੀਆਂ ਬਚਾਉਣ ਵਾਲੇ ਹਜਾਰਾਂ ਨਾਗਰਿਕਾਂ ਨਾਲ ਜੁੜੋ। ਹਰ ਰਿਪੋਰਟ ਮਹੱਤਵਪੂਰਨ ਹੈ।',
    'cta.btn.start': 'ਮੁਫ਼ਤ ਸ਼ੁਰੂ ਕਰੋ',
    'cta.btn.feed': 'ਲਾਈਵ ਫੀਡ ব্রਾਊਜ਼ ਕਰੋ',
    'cta.note': 'ਕ੍ਰੈਡਿਟ ਕਾਰਡ ਦੀ ਲੋੜ ਨਹੀਂ • ਤੁਰੰਤ ਪਹੁੰਚ • ਕਮਿਊਨਿਟੀ ਚਲਿਤ',
    
    // Footer
    'footer.tagline': 'ਟੈਕਨਾਲੋਜੀ ਅਤੇ ਸਹਿਯੋਗ ਦੁਆਰਾ ਕਮਿਊਨਿਟੀਆਂ ਨੂੰ ਵਿਦ্যুਤ ਖਤਰਿਆਂ ਨੂੰ ਖਤਮ ਕਰਨ ਲਈ ਸਸ਼ਕਤ ਬਣਾਉਣਾ।',
    'footer.platform': 'ਪਲੇਟਫਾਰਮ',
    'footer.resources': 'ਸਰੋਤ',
    'footer.legal': 'ਕਾਨੂੰਨੀ',
    'footer.contact': 'ਸੰਪਰਕ ਕਰੋ',
    'footer.live-feed': 'ਲਾਈਵ ਫੀਡ',
    'footer.hazard-map': 'ਖਤਰਾ ਮੈਪ',
    'footer.register': 'ਰਜਿਸਟਰ',
    'footer.responder': 'ਰਿਸਪਾਂਡਰ ਪੋਰਟਲ',
    'footer.api': 'API ਡਾਕਸ',
    'footer.safety': 'ਸੁਰੱਖਿਆ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼',
    'footer.hazards101': 'ਵਿਦ্যুਤ ਖਤਰੇ 101',
    'footer.forum': 'ਕਮਿਊਨਿਟੀ ਮੰਚ',
    'footer.help': 'ਮਦਦ ਕੇਂਦਰ',
    'footer.blog': 'ਬਲੌਗ',
    'footer.privacy': 'ਗੋਪਨੀਯਤਾ ਨੀਤੀ',
    'footer.terms': 'ਸੇਵਾ ਦੀਆਂ ਸ਼ਰਤਾਂ',
    'footer.cookies': 'ਕੁਕੀ ਨੀਤੀ',
    'footer.data': 'ਡੇਟਾ ਸੁਰੱਖਿਆ',
    'footer.team': 'ਟੀਮ ਨੈਕਸਵੋਲਟ',
    'footer.hacknauts': 'ਹੈਕਨਾਟਸ 2.0',
    'footer.copyright': '© 2025 ਸ਼ੌਕਸ਼ੀਲਡ - ਟੀਮ ਨੈਕਸਵੋਲਟ। ਹੈਕਨਾਟਸ 2.0 ਲਈ ਬਣਾਇਆ ਗਿਆ।',
    'footer.made': '⚡ ਨਾਲ ਸੁਰੱਖਿਅਤ ਕਮਿਊਨਿਟੀਆਂ ਲਈ ਬਣਾਇਆ ਗਿਆ',
    
    // Language
    'lang.current': 'ਪੰਜਾਬੀ',
    'lang.en': 'English',
    'lang.hi': 'हिन्दी',
    'lang.pa': 'ਪੰਜਾਬੀ',
  }
};

let currentLang = localStorage.getItem('language') || 'en';

function initLanguageSwitcher() {
  const trigger = document.getElementById('langTrigger');
  const dropdown = document.getElementById('langDropdown');
  const currentLangEl = document.querySelector('.lang-current');
  const options = document.querySelectorAll('.lang-option');
  
  if (!trigger || !dropdown) {
    console.warn('Language switcher elements not found');
    return;
  }
  
  let isOpen = false;
  
  // Set initial language
  applyLanguage(currentLang);
  updateLangUI(currentLang);
  
  function toggleDropdown() {
    isOpen = !isOpen;
    dropdown.hidden = !isOpen;
    trigger.setAttribute('aria-expanded', isOpen);
    
    if (isOpen) {
      // Position dropdown
      const triggerRect = trigger.getBoundingClientRect();
      dropdown.style.position = 'fixed';
      dropdown.style.top = `${triggerRect.bottom + 4}px`;
      dropdown.style.left = `${triggerRect.left}px`;
      dropdown.style.minWidth = `${triggerRect.width}px`;
      dropdown.style.maxWidth = 'calc(100vw - 32px)';
      dropdown.style.zIndex = '99999';
      
      // Force reflow for transition
      dropdown.offsetHeight;
      
      // Add scroll/resize listeners
      window.addEventListener('scroll', positionDropdown, { passive: true });
      window.addEventListener('resize', positionDropdown, { passive: true });
      
      // Focus first option
      setTimeout(() => {
        const firstOption = dropdown.querySelector('.lang-option');
        if (firstOption) firstOption.focus();
      }, 0);
    } else {
      // Clean up
      dropdown.style.position = '';
      dropdown.style.top = '';
      dropdown.style.left = '';
      dropdown.style.minWidth = '';
      dropdown.style.maxWidth = '';
      dropdown.style.zIndex = '';
      
      window.removeEventListener('scroll', positionDropdown);
      window.removeEventListener('resize', positionDropdown);
      
      trigger.focus();
    }
  }
  
  function positionDropdown() {
    if (!isOpen) return;
    const triggerRect = trigger.getBoundingClientRect();
    dropdown.style.top = `${triggerRect.bottom + 4}px`;
    dropdown.style.left = `${triggerRect.left}px`;
    dropdown.style.minWidth = `${triggerRect.width}px`;
  }
  
  // Toggle dropdown
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
  });
  
  // Prevent dropdown clicks from closing
  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  // Handle option selection
  dropdown.addEventListener('click', (e) => {
    const option = e.target.closest('.lang-option');
    if (!option) return;
    
    e.stopPropagation();
    const lang = option.dataset.lang;
    if (lang !== currentLang) {
      currentLang = lang;
      localStorage.setItem('language', lang);
      applyLanguage(lang);
      updateLangUI(lang);
      toggleDropdown();
      Toast.success(`Language changed to ${translations[lang]['lang.current']}`, 'Language Updated');
    }
  });
  
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isOpen && !trigger.contains(e.target) && !dropdown.contains(e.target)) {
      toggleDropdown();
    }
  });
  
  // Keyboard navigation
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (isOpen) toggleDropdown();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown();
    }
  });
  
  dropdown.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleDropdown();
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (isOpen) positionDropdown();
  }, { passive: true });
}

function applyLanguage(lang) {
  const t = translations[lang];
  if (!t) return;
  
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });
  
  // Update document lang attribute
  document.documentElement.lang = lang;
}

function updateLangUI(lang) {
  const t = translations[lang];
  if (!t) return;
  
  const trigger = document.getElementById('langTrigger');
  const currentLangEl = document.querySelector('.lang-current');
  const options = document.querySelectorAll('.lang-option');
  
  if (currentLangEl) {
    currentLangEl.textContent = t['lang.current'];
  }
  
  options.forEach(option => {
    const optionLang = option.dataset.lang;
    const isSelected = optionLang === lang;
    option.setAttribute('aria-selected', isSelected);
    if (isSelected) {
      option.classList.add('selected');
    } else {
      option.classList.remove('selected');
    }
  });
}

// Add data-i18n attributes to existing elements
function addI18nAttributes() {
  const mappings = {
    // Nav
    'a[href="#features"]': 'nav.features',
    'a[href="#how-it-works"]': 'nav.how-it-works',
    'a[href="#map-preview"]': 'nav.hazard-map',
    'a[href="#team"]': 'nav.team',
    'a[href="register.html"]': 'nav.signup',
    'a[href="feed.html"]': 'nav.live-feed',
    
    // Hero
    '.hero-badge span:nth-child(2)': 'hero.badge.hacknauts',
    '.hero-badge span:nth-child(4)': 'hero.badge.team',
    '.hero-title .title-line:nth-child(1)': 'hero.title.1',
    '.hero-title .title-line:nth-child(2)': 'hero.title.2',
    '.hero-title .title-line:nth-child(3)': 'hero.title.3',
    '.hero-description': 'hero.desc',
    '.stat-label:nth-of-type(1)': 'hero.stat.1.label',
    '.stat-label:nth-of-type(2)': 'hero.stat.2.label',
    '.stat-label:nth-of-type(3)': 'hero.stat.3.label',
    '.stat-label:nth-of-type(4)': 'hero.stat.4.label',
    '.hero-actions .btn-primary .btn-text': 'hero.btn.join',
    '.hero-actions .btn-outline .btn-text': 'hero.btn.feed',
    '.trust-label': 'hero.trust.label',
    
    // Features
    '.features .section-tag': 'features.tag',
    '.features .section-title': 'features.title',
    '.features .section-description': 'features.desc',
    
    // Feature 1
    '.features-grid .feature-card:nth-child(1) .feature-title': 'feature.1.title',
    '.features-grid .feature-card:nth-child(1) .feature-description': 'feature.1.desc',
    
    // Feature 2
    '.features-grid .feature-card:nth-child(2) .feature-title': 'feature.2.title',
    '.features-grid .feature-card:nth-child(2) .feature-description': 'feature.2.desc',
    
    // Feature 3
    '.features-grid .feature-card:nth-child(3) .feature-title': 'feature.3.title',
    '.features-grid .feature-card:nth-child(3) .feature-description': 'feature.3.desc',
    
    // Feature 4
    '.features-grid .feature-card:nth-child(4) .feature-title': 'feature.4.title',
    '.features-grid .feature-card:nth-child(4) .feature-description': 'feature.4.desc',
    
    // Feature 5
    '.features-grid .feature-card:nth-child(5) .feature-title': 'feature.5.title',
    '.features-grid .feature-card:nth-child(5) .feature-description': 'feature.5.desc',
    
    // Feature 6
    '.features-grid .feature-card:nth-child(6) .feature-title': 'feature.6.title',
    '.features-grid .feature-card:nth-child(6) .feature-description': 'feature.6.desc',
    
    // How it works
    '.how-it-works .section-tag': 'how.tag',
    '.how-it-works .section-title': 'how.title',
    '.how-it-works .section-description': 'how.desc',
    '.step-card:nth-child(1) .step-title': 'step.1.title',
    '.step-card:nth-child(1) .step-description': 'step.1.desc',
    '.step-card:nth-child(2) .step-title': 'step.2.title',
    '.step-card:nth-child(2) .step-description': 'step.2.desc',
    '.step-card:nth-child(3) .step-title': 'step.3.title',
    '.step-card:nth-child(3) .step-description': 'step.3.desc',
    
    // Map
    '.map-preview .section-tag': 'map.tag',
    '.map-preview .section-title': 'map.title',
    '.map-preview .section-description': 'map.desc',
    '.map-legend h4': 'map.legend.title',
    '.legend-item:nth-child(1) span:last-child': 'map.legend.unsolved',
    '.legend-item:nth-child(2) span:last-child': 'map.legend.inprogress',
    '.legend-item:nth-child(3) span:last-child': 'map.legend.solved',
    '.legend-item:nth-child(4) span:last-child': 'map.legend.user',
    '.map-features-preview h4': 'map.features.title',
    '.map-cta .btn-text': 'map.cta',
    
    // Team
    '.team .section-tag': 'team.tag',
    '.team .section-title': 'team.title',
    '.team .section-description': 'team.desc',
    '.role-badge.captain-badge': 'team.captain',
    '.role-badge.backend-badge': 'team.backend',
    '.role-badge.debug-badge': 'team.debug',
    '.role-badge.db-badge': 'team.db',
    
    // CTA
    '.cta-title': 'cta.title',
    '.cta-description': 'cta.desc',
    '.cta-actions .btn-primary .btn-text': 'cta.btn.start',
    '.cta-actions .btn-outline .btn-text': 'cta.btn.feed',
    '.cta-note': 'cta.note',
    
    // Footer
    '.footer-tagline': 'footer.tagline',
    '.footer-links:nth-child(2) h4': 'footer.platform',
    '.footer-links:nth-child(3) h4': 'footer.resources',
    '.footer-links:nth-child(4) h4': 'footer.legal',
    '.footer-contact h4': 'footer.contact',
    '.copyright': 'footer.copyright',
    '.made-with': 'footer.made',
  };
  
  Object.entries(mappings).forEach(([selector, key]) => {
    const el = document.querySelector(selector);
    if (el) {
      el.dataset.i18n = key;
    }
  });
  
  // Feature highlights - need special handling
  const featureHighlights = {
    1: 'feature.1.highlights',
    2: 'feature.2.highlights',
    3: 'feature.3.highlights',
    4: 'feature.4.highlights',
    5: 'feature.5.highlights',
    6: 'feature.6.highlights',
  };
  
  Object.entries(featureHighlights).forEach(([index, key]) => {
    const items = document.querySelectorAll(`.features-grid .feature-card:nth-child(${index}) .feature-highlights li`);
    items.forEach((item, i) => {
      item.dataset.i18n = `${key}.${i}`;
    });
  });
  
  // Step tags
  const stepTags = {
    1: 'step.1.tags',
    2: 'step.2.tags',
    3: 'step.3.tags',
  };
  
  Object.entries(stepTags).forEach(([index, key]) => {
    const items = document.querySelectorAll(`.step-card:nth-child(${index}) .detail-tag`);
    items.forEach((item, i) => {
      item.dataset.i18n = `${key}.${i}`;
    });
  });
  
  // Map features
  const mapFeatures = document.querySelectorAll('.map-features-list li');
  mapFeatures.forEach((item, i) => {
    item.dataset.i18n = `map.features.list.${i}`;
  });
  
  // Team member bios - we'll skip these for brevity
  
  // Apply current language after adding attributes
  applyLanguage(currentLang);
}

// Initialize language switcher on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Add i18n attributes first
  addI18nAttributes();
  
  // Initialize switcher
  initLanguageSwitcher();
  
  // Apply saved language
  applyLanguage(currentLang);
  updateLangUI(currentLang);
});