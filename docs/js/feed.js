/**
 * ShockShield - Feed Page JavaScript
 * Live hazard feed, reporting, interactions, and modals
 */

// ========================================
// MOCK DATA
// ========================================

const MOCK_POSTS = [
  {
    id: '1',
    author: {
      id: 'u1',
      name: 'Priya Sharma',
      initials: 'PS',
      verified: true,
      avatar: null
    },
    location: 'Sector 12, Dwarka, New Delhi',
    coordinates: { lat: 28.5921, lng: 77.0460 },
    type: 'live-wire',
    severity: 'critical',
    status: 'unsolved',
    description: 'Live wire sparking dangerously on Main Road near Metro Pillar 345. Multiple pedestrians at risk. Wire fell from transformer during last night\'s storm. Urgent attention needed!',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=450&fit=crop',
    timestamp: Date.now() - 1000 * 60 * 15,
    likes: 47,
    liked: false,
    verified: false,
    comments: [
      { id: 'c1', author: { name: 'Rajesh K', initials: 'RK' }, text: 'Just saw this too! Very dangerous.', time: Date.now() - 1000 * 60 * 10 },
      { id: 'c2', author: { name: 'Municipal Corp', initials: 'MC', verified: true }, text: 'Team dispatched. ETA 20 minutes.', time: Date.now() - 1000 * 60 * 5 }
    ],
    shares: 12,
    priority: 95
  },
  {
    id: '2',
    author: {
      id: 'u2',
      name: 'Amit Kumar',
      initials: 'AK',
      verified: false,
      avatar: null
    },
    location: 'MG Road, Bangalore',
    coordinates: { lat: 12.9758, lng: 77.6013 },
    type: 'transformer',
    severity: 'high',
    status: 'inprogress',
    description: 'Transformer exploded near Brigade Road junction. Loud bang heard, smoke visible. Power out in surrounding buildings. BESCOM team on site.',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=450&fit=crop',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    likes: 89,
    liked: true,
    verified: true,
    comments: [
      { id: 'c3', author: { name: 'BESCOM Official', initials: 'BO', verified: true }, text: 'Replacement transformer arriving in 2 hours. Power restored to 60% area.', time: Date.now() - 1000 * 60 * 30 }
    ],
    shares: 23,
    priority: 78
  },
  {
    id: '3',
    author: {
      id: 'u3',
      name: 'Sneha Reddy',
      initials: 'SR',
      verified: true,
      avatar: null
    },
    location: 'Banjara Hills, Hyderabad',
    coordinates: { lat: 17.4126, lng: 78.4070 },
    type: 'illegal',
    severity: 'medium',
    status: 'solved',
    description: 'Illegal power connection found in construction site behind GVK Mall. Multiple unauthorized wires tapping main line. Reported to TSSPDCL.',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=450&fit=crop',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    likes: 156,
    liked: false,
    verified: true,
    comments: [
      { id: 'c4', author: { name: 'TSSPDCL', initials: 'TS', verified: true }, text: 'Illegal connection removed. FIR filed against contractor. Thank you for reporting.', time: Date.now() - 1000 * 60 * 60 * 12 }
    ],
    shares: 34,
    priority: 65
  },
  {
    id: '4',
    author: {
      id: 'u4',
      name: 'Vikram Singh',
      initials: 'VS',
      verified: false,
      avatar: null
    },
    location: 'Andheri East, Mumbai',
    coordinates: { lat: 19.1197, lng: 72.8465 },
    type: 'sparking',
    severity: 'high',
    status: 'unsolved',
    description: 'Street light pole sparking violently near WEH Metro Station. Rain making it worse. Cars and pedestrians passing dangerously close.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=450&fit=crop',
    timestamp: Date.now() - 1000 * 60 * 60 * 3,
    likes: 67,
    liked: false,
    verified: false,
    comments: [
      { id: 'c5', author: { name: 'Local Resident', initials: 'LR' }, text: 'My kids walk this route to school. Please fix ASAP!', time: Date.now() - 1000 * 60 * 60 }
    ],
    shares: 18,
    priority: 72
  },
  {
    id: '5',
    author: {
      id: 'u5',
      name: 'Anjali Mehta',
      initials: 'AM',
      verified: true,
      avatar: null
    },
    location: 'Salt Lake, Kolkata',
    coordinates: { lat: 22.5855, lng: 88.4243 },
    type: 'exposed',
    severity: 'medium',
    status: 'inprogress',
    description: 'Open junction box on footpath near City Centre Mall. Exposed live wires at knee height. Children playing nearby. CESC notified.',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=450&fit=crop',
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    likes: 43,
    liked: true,
    verified: true,
    comments: [],
    shares: 9,
    priority: 58
  },
  {
    id: '6',
    author: {
      id: 'u6',
      name: 'Rohit Gupta',
      initials: 'RG',
      verified: false,
      avatar: null
    },
    location: 'Koramangala, Bangalore',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    type: 'theft',
    severity: 'low',
    status: 'verified',
    description: 'Suspected meter tampering in residential complex. Multiple units showing unusually low readings. BESCOM inspection scheduled.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    likes: 28,
    liked: false,
    verified: true,
    comments: [
      { id: 'c6', author: { name: 'Society Secretary', initials: 'SS' }, text: 'We\'re coordinating with BESCOM for a full audit.', time: Date.now() - 1000 * 60 * 60 * 24 }
    ],
    shares: 5,
    priority: 35
  }
];

const HAZARD_TYPES = {
  'live-wire': { label: 'Live Wire', icon: '🔴', color: '#FF0033' },
  'transformer': { label: 'Transformer Burst', icon: '⚡', color: '#FF4400' },
  'illegal': { label: 'Illegal Connection', icon: '🔌', color: '#FFB800' },
  'sparking': { label: 'Sparking Equipment', icon: '💥', color: '#FF0033' },
  'exposed': { label: 'Exposed Cable', icon: '⚠️', color: '#00B4D8' },
  'theft': { label: 'Electricity Theft', icon: '🔓', color: '#8B5CF6' },
  'other': { label: 'Other', icon: '📋', color: '#64748B' }
};

const SEVERITY_LEVELS = {
  low: { label: 'Low', color: '#00E676' },
  medium: { label: 'Medium', color: '#00B4D8' },
  high: { label: 'High', color: '#FFB800' },
  critical: { label: 'Critical', color: '#FF0033' }
};

const STATUS_LABELS = {
  unsolved: 'Unsolved',
  inprogress: 'In Progress',
  solved: 'Resolved',
  verified: 'Verified'
};

// ========================================
// STATE MANAGEMENT
// ========================================

let posts = [...MOCK_POSTS];
let filteredPosts = [...posts];
let currentFilters = {
  location: 'nearby',
  status: 'all',
  type: 'all',
  sort: 'priority'
};
let displayedCount = 6;
let userLocation = null;

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initFeed();
  initFilters();
  initReportModal();
  initLoadMore();
  initSidebar();
  requestUserLocation();
});

function initNavbar() {
  const navbar = document.getElementById('navbar');
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
// FEED RENDERING
// ========================================

function initFeed() {
  applyFilters();
  renderPosts();
  updateTrending();
  updateUserStats();
}

function applyFilters() {
  filteredPosts = posts.filter(post => {
    // Status filter
    if (currentFilters.status !== 'all' && post.status !== currentFilters.status) {
      return false;
    }
    
    // Type filter
    if (currentFilters.type !== 'all' && post.type !== currentFilters.type) {
      return false;
    }
    
    // Location filter would need geolocation - simplified for demo
    return true;
  });

  // Sort
  switch (currentFilters.sort) {
    case 'recent':
      filteredPosts.sort((a, b) => b.timestamp - a.timestamp);
      break;
    case 'oldest':
      filteredPosts.sort((a, b) => a.timestamp - b.timestamp);
      break;
    case 'critical':
      filteredPosts.sort((a, b) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      });
      break;
    case 'priority':
    default:
      filteredPosts.sort((a, b) => b.priority - a.priority);
      break;
  }
}

function renderPosts() {
  const container = document.getElementById('feedPosts');
  const emptyState = document.getElementById('emptyState');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  
  if (!container) return;

  const postsToShow = filteredPosts.slice(0, displayedCount);
  
  if (postsToShow.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    loadMoreBtn.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  loadMoreBtn.style.display = filteredPosts.length > displayedCount ? 'block' : 'none';

  container.innerHTML = postsToShow.map(post => renderPost(post)).join('');
  
  // Add event listeners to new posts
  attachPostEvents();
}

function renderPost(post) {
  const typeInfo = HAZARD_TYPES[post.type];
  const severityInfo = SEVERITY_LEVELS[post.severity];
  const statusInfo = STATUS_LABELS[post.status];
  const timeAgo = Utils.formatRelativeTime(post.timestamp);
  
  const priorityClass = post.priority >= 80 ? 'priority-critical' : post.priority >= 60 ? 'priority-high' : '';
  
  return `
    <article class="feed-post ${priorityClass}" data-post-id="${post.id}">
      <header class="post-header">
        <div class="post-avatar">
          ${post.author.avatar 
            ? `<img src="${post.author.avatar}" alt="" class="post-avatar-img">`
            : `<div class="post-avatar-initials">${post.author.initials}</div>`
          }
        </div>
        <div class="post-author">
          <div class="post-author-name">
            ${post.author.name}
            ${post.author.verified ? '<svg class="post-author-verified" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
          </div>
          <div class="post-meta">
            <span class="post-time">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              ${timeAgo}
            </span>
            <span class="post-location">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              ${post.location}
            </span>
          </div>
        </div>
        <div class="post-status">
          <span class="status-badge ${post.status} ${post.severity === 'critical' ? 'critical' : ''}">${statusInfo}</span>
        </div>
      </header>
      
      <div class="post-image">
        <img src="${post.image}" alt="${post.description.substring(0, 100)}" loading="lazy">
        <div class="post-image-badge">
          <span class="hazard-type-badge ${post.type}">${typeInfo.icon} ${typeInfo.label}</span>
        </div>
      </div>
      
      <div class="post-content">
        <p class="post-description">${post.description}</p>
        
        <div class="post-tags">
          <span class="post-tag">Severity: ${severityInfo.label}</span>
          <span class="post-tag">Type: ${typeInfo.label}</span>
          ${post.verified ? '<span class="post-tag" style="color: var(--color-hazard-verified); border-color: var(--color-hazard-verified);">✓ Verified</span>' : ''}
        </div>
        
        <div class="post-actions">
          <button class="action-btn ${post.liked ? 'liked' : ''}" data-action="like" data-post-id="${post.id}" aria-label="${post.liked ? 'Unlike' : 'Like'} this report">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${post.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span class="action-count">${post.likes}</span>
          </button>
          
          <button class="action-btn" data-action="comment" data-post-id="${post.id}" aria-label="View comments">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span class="action-count">${post.comments.length}</span>
          </button>
          
          <button class="action-btn ${post.verified ? 'verified' : ''}" data-action="verify" data-post-id="${post.id}" aria-label="${post.verified ? 'Verified' : 'Verify'} this report">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span class="action-count">${post.verified ? 'Verified' : 'Verify'}</span>
          </button>
          
          <div class="post-divider"></div>
          
          <button class="action-btn post-share" data-action="share" data-post-id="${post.id}" aria-label="Share">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            <span class="action-count">${post.shares}</span>
          </button>
        </div>
        
        ${post.comments.length > 0 ? `
        <div class="post-comments-preview">
          <div class="comments-preview-header">
            <span>${post.comments.length} comment${post.comments.length !== 1 ? 's' : ''}</span>
            <button class="view-comments-btn" data-action="view-comments" data-post-id="${post.id}">View all</button>
          </div>
          ${post.comments.slice(0, 2).map(comment => `
            <div class="comment-preview">
              <div class="comment-avatar">${comment.author.initials}</div>
              <div class="comment-content">
                <div class="comment-author">${comment.author.name}${comment.author.verified ? ' <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}</div>
                <div class="comment-text">${comment.text}</div>
              </div>
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
    </article>
  `;
}

function attachPostEvents() {
  // Like buttons
  document.querySelectorAll('[data-action="like"]').forEach(btn => {
    btn.addEventListener('click', handleLike);
  });
  
  // Comment buttons
  document.querySelectorAll('[data-action="comment"], [data-action="view-comments"]').forEach(btn => {
    btn.addEventListener('click', () => openPostModal(btn.dataset.postId));
  });
  
  // Verify buttons
  document.querySelectorAll('[data-action="verify"]').forEach(btn => {
    btn.addEventListener('click', handleVerify);
  });
  
  // Share buttons
  document.querySelectorAll('[data-action="share"]').forEach(btn => {
    btn.addEventListener('click', handleShare);
  });
  
  // Click on post to open detail
  document.querySelectorAll('.feed-post').forEach(post => {
    post.addEventListener('click', (e) => {
      if (!e.target.closest('.action-btn')) {
        openPostModal(post.dataset.postId);
      }
    });
  });
}

function handleLike(e) {
  const postId = e.currentTarget.dataset.postId;
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  
  const icon = e.currentTarget.querySelector('svg');
  const count = e.currentTarget.querySelector('.action-count');
  
  if (post.liked) {
    post.likes--;
    post.liked = false;
    e.currentTarget.classList.remove('liked');
    icon.setAttribute('fill', 'none');
  } else {
    post.likes++;
    post.liked = true;
    e.currentTarget.classList.add('liked');
    icon.setAttribute('fill', 'currentColor');
    
    // Add heart animation
    e.currentTarget.style.animation = 'scaleIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    setTimeout(() => e.currentTarget.style.animation = '', 300);
  }
  
  count.textContent = post.likes;
  post.priority = calculatePriority(post);
  
  Toast.success(post.liked ? 'Report prioritized!' : 'Like removed', 'Community Action');
}

function handleVerify(e) {
  const postId = e.currentTarget.dataset.postId;
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  
  if (!post.verified) {
    post.verified = true;
    e.currentTarget.classList.add('verified');
    e.currentTarget.querySelector('.action-count').textContent = 'Verified';
    Toast.success('Report marked as verified', 'Verification');
  }
}

function handleShare(e) {
  const postId = e.currentTarget.dataset.postId;
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  
  const shareUrl = `${window.location.origin}/feed.html?post=${postId}`;
  
  if (navigator.share) {
    navigator.share({
      title: `Electrical Hazard: ${HAZARD_TYPES[post.type].label}`,
      text: post.description.substring(0, 200),
      url: shareUrl
    });
  } else {
    Utils.copyToClipboard(shareUrl);
    Toast.success('Link copied to clipboard!', 'Shared');
  }
  
  post.shares++;
  e.currentTarget.querySelector('.action-count').textContent = post.shares;
}

function openPostModal(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  
  const modal = document.getElementById('postModal');
  const title = document.getElementById('postModalTitle');
  const body = document.getElementById('postModalBody');
  
  title.textContent = `${HAZARD_TYPES[post.type].icon} ${HAZARD_TYPES[post.type].label}`;
  body.innerHTML = renderPostDetail(post);
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Attach events for modal
  attachModalEvents(post);
}

function renderPostDetail(post) {
  const typeInfo = HAZARD_TYPES[post.type];
  const severityInfo = SEVERITY_LEVELS[post.severity];
  const statusInfo = STATUS_LABELS[post.status];
  const timeAgo = Utils.formatRelativeTime(post.timestamp);
  const fullDate = Utils.formatDate(post.timestamp, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  
  return `
    <div class="post-detail">
      <div class="post-detail-header">
        <img src="${post.image}" alt="${post.description}">
      </div>
      <div class="post-detail-content">
        <div class="post-detail-meta">
          <span class="hazard-type-badge ${post.type}">${typeInfo.icon} ${typeInfo.label}</span>
          <span class="status-badge ${post.status}">${statusInfo}</span>
          <span class="post-tag" style="background: ${severityInfo.color}20; border-color: ${severityInfo.color}60; color: ${severityInfo.color}">Severity: ${severityInfo.label}</span>
        </div>
        
        <div class="post-author-detail" style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-lg); padding-bottom: var(--space-lg); border-bottom: 1px solid var(--color-border-primary);">
          <div class="post-avatar" style="width: 56px; height: 56px;">
            ${post.author.avatar 
              ? `<img src="${post.author.avatar}" alt="" class="post-avatar-img">`
              : `<div class="post-avatar-initials" style="font-size: var(--text-xl);">${post.author.initials}</div>`
            }
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: var(--space-sm);">
              <span style="font-weight: 600; font-size: var(--text-lg);">${post.author.name}</span>
              ${post.author.verified ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-hazard-verified);"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
            </div>
            <div style="display: flex; align-items: center; gap: var(--space-md); font-size: var(--text-sm); color: var(--color-text-tertiary); margin-top: var(--space-xs);">
              <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${timeAgo}</span>
              <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> ${post.location}</span>
            </div>
          </div>
        </div>
        
        <div class="post-description" style="font-size: var(--text-lg); line-height: 1.8; margin-bottom: var(--space-xl);">${post.description}</p>
        
        <div class="post-detail-actions">
          <button class="btn btn-primary action-btn-detail" data-action="like">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${post.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>${post.likes} ${post.liked ? 'Prioritized' : 'Prioritize'}</span>
          </button>
          <button class="btn btn-secondary action-btn-detail" data-action="share">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            <span>Share</span>
          </button>
          <button class="btn btn-secondary action-btn-detail" data-action="navigate">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>Navigate</span>
          </button>
        </div>
        
        <div class="post-comments">
          <div class="comments-header">
            <h3 style="font-size: var(--text-xl);">Comments (${post.comments.length})</h3>
          </div>
          
          <form class="comment-form" id="commentForm" data-post-id="${post.id}">
            <input type="text" class="form-input" placeholder="Add a comment..." required maxlength="300">
            <button type="submit" class="btn btn-primary">Post</button>
          </form>
          
          <div class="comment-list">
            ${post.comments.map(comment => `
              <div class="comment">
                <div class="comment-avatar">${comment.author.initials}</div>
                <div class="comment-body">
                  <div class="comment-header">
                    <span class="comment-author">${comment.author.name}${comment.author.verified ? ' <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-hazard-verified);"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}</span>
                    <span class="comment-time">${Utils.formatRelativeTime(comment.time)}</span>
                  </div>
                  <p class="comment-text">${comment.text}</p>
                </div>
              </div>
            `).join('')}
            ${post.comments.length === 0 ? '<p style="text-align: center; color: var(--color-text-tertiary); padding: var(--space-xl);">No comments yet. Be the first to discuss!</p>' : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

function attachModalEvents(post) {
  const modal = document.getElementById('postModal');
  
  // Like in modal
  modal.querySelector('[data-action="like"]').addEventListener('click', (e) => {
    e.stopPropagation();
    handleLike({ currentTarget: e.currentTarget, stopPropagation: () => {} });
    // Update modal UI
    const btn = modal.querySelector('[data-action="like"]');
    const icon = btn.querySelector('svg');
    if (post.liked) {
      btn.classList.remove('liked');
      icon.setAttribute('fill', 'none');
      btn.querySelector('span').textContent = `${post.likes} Prioritize`;
    } else {
      btn.classList.add('liked');
      icon.setAttribute('fill', 'currentColor');
      btn.querySelector('span').textContent = `${post.likes} Prioritized`;
    }
  });
  
  // Share in modal
  modal.querySelector('[data-action="share"]').addEventListener('click', (e) => {
    e.stopPropagation();
    handleShare({ currentTarget: e.currentTarget, stopPropagation: () => {} });
  });
  
  // Navigate
  modal.querySelector('[data-action="navigate"]').addEventListener('click', (e) => {
    e.stopPropagation();
    const url = `https://www.openstreetmap.org/?mlat=${post.coordinates.lat}&mlon=${post.coordinates.lng}#map=18/${post.coordinates.lat}/${post.coordinates.lng}`;
    window.open(url, '_blank');
  });
  
  // Comment form
  const commentForm = modal.querySelector('#commentForm');
  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = commentForm.querySelector('input');
      const text = input.value.trim();
      if (!text) return;
      
      const newComment = {
        id: Utils.generateId('c'),
        author: { name: 'You', initials: 'Y', verified: false },
        text,
        time: Date.now()
      };
      
      post.comments.unshift(newComment);
      input.value = '';
      
      // Re-render comments
      const commentList = modal.querySelector('.comment-list');
      commentList.innerHTML = post.comments.map(comment => `
        <div class="comment">
          <div class="comment-avatar">${comment.author.initials}</div>
          <div class="comment-body">
            <div class="comment-header">
              <span class="comment-author">${comment.author.name}${comment.author.verified ? ' <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-hazard-verified);"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}</span>
              <span class="comment-time">${Utils.formatRelativeTime(comment.time)}</span>
            </div>
            <p class="comment-text">${comment.text}</p>
          </div>
        </div>
      `).join('');
      
      // Update count
      modal.querySelector('.comments-header h3').textContent = `Comments (${post.comments.length})`;
      Toast.success('Comment added!', 'Discussion');
    });
  }
  
  // Close modal
  modal.querySelector('#closePostModal').addEventListener('click', closePostModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePostModal();
  });
}

function closePostModal() {
  const modal = document.getElementById('postModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ========================================
// FILTERS
// ========================================

function initFilters() {
  const locationFilter = document.getElementById('locationFilter');
  const statusFilter = document.getElementById('statusFilter');
  const typeFilter = document.getElementById('typeFilter');
  const sortBy = document.getElementById('sortBy');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  
  [locationFilter, statusFilter, typeFilter, sortBy].forEach(select => {
    select.addEventListener('change', () => {
      currentFilters.location = locationFilter.value;
      currentFilters.status = statusFilter.value;
      currentFilters.type = typeFilter.value;
      currentFilters.sort = sortBy.value;
      displayedCount = 6;
      applyFilters();
      renderPosts();
    });
  });
  
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      locationFilter.value = 'nearby';
      statusFilter.value = 'all';
      typeFilter.value = 'all';
      sortBy.value = 'priority';
      currentFilters = { location: 'nearby', status: 'all', type: 'all', sort: 'priority' };
      displayedCount = 6;
      applyFilters();
      renderPosts();
    });
  }
}

// ========================================
// LOAD MORE
// ========================================

function initLoadMore() {
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (!loadMoreBtn) return;
  
  loadMoreBtn.addEventListener('click', () => {
    displayedCount += 6;
    renderPosts();
    
    // Smooth scroll to new posts
    setTimeout(() => {
      const postsContainer = document.getElementById('feedPosts');
      const newPosts = postsContainer.querySelectorAll('.feed-post:nth-child(n+' + (displayedCount - 5) + ')');
      if (newPosts.length > 0) {
        newPosts[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  });
}

// ========================================
// SIDEBAR
// ========================================

function updateUserStats() {
  // Mock user stats
  const stats = {
    reports: posts.filter(p => p.author.id === 'current-user').length || Math.floor(Math.random() * 10) + 1,
    likes: posts.filter(p => p.liked).length,
    verified: posts.filter(p => p.verified && p.author.id === 'current-user').length || Math.floor(Math.random() * 5),
    rank: '#' + (Math.floor(Math.random() * 5000) + 1000).toLocaleString()
  };
  
  document.getElementById('userReports').textContent = stats.reports;
  document.getElementById('userLikes').textContent = stats.likes;
  document.getElementById('userVerified').textContent = stats.verified;
  document.getElementById('userRank').textContent = stats.rank;
}

function updateTrending() {
  const trendingList = document.getElementById('trendingList');
  if (!trendingList) return;
  
  // Sort by priority and take top 5
  const trending = [...posts].sort((a, b) => b.priority - a.priority).slice(0, 5);
  
  trendingList.innerHTML = trending.map((post, index) => `
    <div class="trending-item">
      <div class="trending-rank top-${index + 1}">${index + 1}</div>
      <div class="trending-info">
        <div class="trending-type">
          <span class="trending-type-icon ${post.type}"></span>
          ${HAZARD_TYPES[post.type].label}
        </div>
        <div class="trending-location">${post.location}</div>
      </div>
      <div class="trending-stats">
        <span class="trending-stat">
          <svg viewBox="0 0 24 24" fill="${post.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          ${post.likes}
        </span>
        <span class="trending-stat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          ${post.comments.length}
        </span>
      </div>
    </div>
  `).join('');
}

// ========================================
// REPORT MODAL
// ========================================

let currentStep = 1;
let reportData = {
  photo: null,
  location: null,
  coordinates: null,
  type: null,
  description: null,
  severity: 'low'
};

function initReportModal() {
  const modal = document.getElementById('reportModal');
  const openBtn = document.getElementById('openReportModal');
  const closeBtn = document.getElementById('closeReportModal');
  const reportCardBtn = document.getElementById('reportCard');
  const reportHazardBtn = document.getElementById('reportHazardBtn');
  const form = document.getElementById('reportForm');
  const nextBtn = document.getElementById('nextStep');
  const prevBtn = document.getElementById('prevStep');
  const submitBtn = document.getElementById('submitReport');
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const photoInput = document.getElementById('hazardPhoto');
  const photoPreview = document.getElementById('photoPreview');
  const getLocationBtn = document.getElementById('getLocationBtn');
  const locationInput = document.getElementById('hazardLocation');
  const locationStatus = document.getElementById('locationStatus');
  const descriptionInput = document.getElementById('hazardDescription');
  const descCount = document.getElementById('descCount');
  const severityOptions = document.querySelectorAll('.severity-option input');
  const typeSelect = document.getElementById('hazardType');
  
  // Open modal
  [openBtn, reportCardBtn, reportHazardBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        resetReportForm();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        goToStep(1);
      });
    }
  });
  
  // Close modal
  [closeBtn, modal].forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === modal || e.target === closeBtn || e.target.closest('.modal-close')) {
        closeReportModal();
      }
    });
  });
  
  // Step navigation
  nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      goToStep(currentStep + 1);
    }
  });
  
  prevBtn.addEventListener('click', () => {
    goToStep(currentStep - 1);
  });
  
  // Step indicators
  stepIndicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
      const step = parseInt(indicator.dataset.step);
      if (step <= currentStep || validateStep(currentStep)) {
        goToStep(step);
      }
    });
  });
  
  // Photo upload
  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        Toast.error('File too large. Maximum 10MB.', 'Upload Error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        reportData.photo = e.target.result;
        photoPreview.innerHTML = `
          <div class="file-preview-item">
            <img src="${reportData.photo}" alt="Hazard photo">
            <button type="button" class="file-preview-remove" aria-label="Remove photo">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        `;
        photoPreview.querySelector('.file-preview-remove').addEventListener('click', () => {
          reportData.photo = null;
          photoInput.value = '';
          photoPreview.innerHTML = '';
        });
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Get location
  getLocationBtn.addEventListener('click', () => {
    getCurrentLocation();
  });
  
  // Description counter
  descriptionInput.addEventListener('input', () => {
    descCount.textContent = descriptionInput.value.length;
  });
  
  // Severity selection
  severityOptions.forEach(input => {
    input.addEventListener('change', () => {
      reportData.severity = input.value;
    });
  });
  
  // Type selection
  typeSelect.addEventListener('change', () => {
    reportData.type = typeSelect.value;
  });
  
  // Form submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (validateStep(3)) {
      await submitReport();
    }
  });
  
  // Location input
  locationInput.addEventListener('input', () => {
    reportData.location = locationInput.value;
  });
}

function closeReportModal() {
  const modal = document.getElementById('reportModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
  resetReportForm();
}

function resetReportForm() {
  currentStep = 1;
  reportData = {
    photo: null,
    location: null,
    coordinates: null,
    type: null,
    description: null,
    severity: 'low'
  };
  
  const form = document.getElementById('reportForm');
  form.reset();
  document.getElementById('photoPreview').innerHTML = '';
  document.getElementById('descCount').textContent = '0';
  document.getElementById('locationStatus').textContent = 'Click "Use GPS" to auto-detect your location';
  
  goToStep(1);
}

function goToStep(step) {
  // Hide all steps
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  
  // Show target step
  const targetStep = document.querySelector(`.form-step[data-step="${step}"]`);
  if (targetStep) {
    targetStep.classList.add('active');
  }
  
  // Update navigation
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextStep');
  const submitBtn = document.getElementById('submitReport');
  
  prevBtn.style.display = step > 1 ? 'inline-flex' : 'none';
  nextBtn.style.display = step < 3 ? 'inline-flex' : 'none';
  submitBtn.style.display = step === 3 ? 'inline-flex' : 'none';
  
  // Update indicators
  document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
    const indicatorStep = index + 1;
    indicator.classList.toggle('active', indicatorStep === step);
    indicator.classList.toggle('completed', indicatorStep < step);
  });
  
  // Update review step
  if (step === 3) {
    updateReviewStep();
  }
  
  currentStep = step;
}

function validateStep(step) {
  switch (step) {
    case 1:
      if (!reportData.photo) {
        Toast.error('Please upload a photo of the hazard', 'Photo Required');
        return false;
      }
      if (!reportData.coordinates) {
        Toast.error('Please set your location using GPS', 'Location Required');
        return false;
      }
      return true;
    case 2:
      if (!reportData.type) {
        Toast.error('Please select a hazard type', 'Type Required');
        return false;
      }
      if (!reportData.description || reportData.description.length < 20) {
        Toast.error('Please provide a detailed description (minimum 20 characters)', 'Description Required');
        return false;
      }
      return true;
    case 3:
      const terms = document.querySelector('[name="terms"]');
      if (!terms.checked) {
        Toast.error('You must confirm the report is accurate', 'Confirmation Required');
        return false;
      }
      return true;
    default:
      return true;
  }
}

function updateReviewStep() {
  const typeInfo = HAZARD_TYPES[reportData.type];
  const severityInfo = SEVERITY_LEVELS[reportData.severity];
  
  document.getElementById('reviewPhoto').innerHTML = reportData.photo 
    ? `<img src="${reportData.photo}" alt="Hazard photo" style="width: 100%; height: 100%; object-fit: cover;">`
    : '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--color-text-tertiary);">No photo</div>';
  
  document.getElementById('reviewLocation').textContent = reportData.location || 'Not set';
  document.getElementById('reviewType').innerHTML = typeInfo ? `${typeInfo.icon} ${typeInfo.label}` : 'Not selected';
  document.getElementById('reviewSeverity').innerHTML = `<span style="color: ${severityInfo.color}; font-weight: 600;">${severityInfo.label}</span>`;
  document.getElementById('reviewDescription').textContent = reportData.description || 'Not provided';
}

function getCurrentLocation() {
  const locationInput = document.getElementById('hazardLocation');
  const locationStatus = document.getElementById('locationStatus');
  const getLocationBtn = document.getElementById('getLocationBtn');
  const latInput = document.getElementById('hazardLat');
  const lngInput = document.getElementById('hazardLng');
  
  if (!navigator.geolocation) {
    Toast.error('Geolocation is not supported by your browser', 'Error');
    return;
  }
  
  getLocationBtn.disabled = true;
  getLocationBtn.innerHTML = `
    <svg class="spinner" width="16" height="16" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round">
        <animateTransform attributeName="transform" type="rotate" dur="1s" from="0 12 12" to="360 12 12" repeatCount="indefinite"/>
      </circle>
    </svg>
    Locating...
  `;
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      reportData.coordinates = { lat: latitude, lng: longitude };
      latInput.value = latitude;
      lngInput.value = longitude;
      
      // Reverse geocode (simplified - in real app use a geocoding service)
      const locationStr = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
      reportData.location = locationStr;
      locationInput.value = locationStr;
      locationStatus.textContent = 'Location captured successfully!';
      locationStatus.style.color = 'var(--color-hazard-solved)';
      
      getLocationBtn.disabled = false;
      getLocationBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2"></path>
        </svg>
        Update Location
      `;
      
      Toast.success('Location captured!', 'GPS');
    },
    (error) => {
      let message = 'Unable to retrieve location';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = 'Location permission denied. Please enable in browser settings.';
          break;
        case error.POSITION_UNAVAILABLE:
          message = 'Location information unavailable.';
          break;
        case error.TIMEOUT:
          message = 'Location request timed out.';
          break;
      }
      Toast.error(message, 'GPS Error');
      locationStatus.textContent = message;
      locationStatus.style.color = 'var(--color-hazard-critical)';
      
      getLocationBtn.disabled = false;
      getLocationBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2"></path>
        </svg>
        Try Again
      `;
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

async function submitReport() {
  const submitBtn = document.getElementById('submitReport');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  
  submitBtn.disabled = true;
  btnText.style.opacity = '0.7';
  btnLoading.style.display = 'inline-flex';
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Create new post
  const newPost = {
    id: Utils.generateId('p'),
    author: {
      id: 'current-user',
      name: 'You',
      initials: 'Y',
      verified: false,
      avatar: null
    },
    location: reportData.location,
    coordinates: reportData.coordinates,
    type: reportData.type,
    severity: reportData.severity,
    status: 'unsolved',
    description: reportData.description,
    image: reportData.photo,
    timestamp: Date.now(),
    likes: 0,
    liked: false,
    verified: false,
    comments: [],
    shares: 0,
    priority: calculatePriority({
      likes: 0,
      comments: [],
      verified: false,
      severity: reportData.severity,
      timestamp: Date.now()
    })
  };
  
  posts.unshift(newPost);
  filteredPosts.unshift(newPost);
  displayedCount = Math.min(displayedCount + 1, filteredPosts.length);
  
  btnLoading.style.display = 'none';
  btnText.textContent = 'Report Submitted!';
  submitBtn.classList.add('success');
  
  Toast.success('Hazard reported successfully! Your report is now live.', 'Report Submitted');
  
  setTimeout(() => {
    closeReportModal();
    renderPosts();
    updateTrending();
    updateUserStats();
  }, 1500);
}

function calculatePriority(post) {
  let priority = 0;
  
  // Base priority from likes and comments
  priority += post.likes * 0.5;
  priority += post.comments.length * 2;
  
  // Severity multiplier
  const severityMultiplier = { low: 1, medium: 1.5, high: 2, critical: 3 };
  priority *= severityMultiplier[post.severity] || 1;
  
  // Verified bonus
  if (post.verified) priority += 20;
  
  // Recency bonus (higher for newer posts)
  const hoursOld = (Date.now() - post.timestamp) / (1000 * 60 * 60);
  if (hoursOld < 1) priority += 30;
  else if (hoursOld < 6) priority += 20;
  else if (hoursOld < 24) priority += 10;
  
  return Math.min(Math.round(priority), 100);
}

// ========================================
// USER LOCATION
// ========================================

function requestUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      },
      () => {
        // Silently fail - location is optional for feed
      },
      { enableHighAccuracy: false, timeout: 5000 }
    );
  }
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('keydown', (e) => {
  // Escape to close modals
  if (e.key === 'Escape') {
    closeReportModal();
    closePostModal();
  }
  
  // N for new report
  if (e.key === 'n' || e.key === 'N') {
    if (!e.target.matches('input, textarea, select')) {
      e.preventDefault();
      const modal = document.getElementById('reportModal');
      if (!modal.classList.contains('active')) {
        resetReportForm();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        goToStep(1);
      }
    }
  }
  
  // F for filters
  if (e.key === 'f' || e.key === 'F') {
    if (!e.target.matches('input, textarea, select')) {
      e.preventDefault();
      document.getElementById('statusFilter')?.focus();
    }
  }
});

// ========================================
// INFINITE SCROLL (Optional Enhancement)
// ========================================

let scrollLoading = false;

window.addEventListener('scroll', Utils.throttle(() => {
  if (scrollLoading) return;
  
  const scrollTop = window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = scrollTop / docHeight;
  
  if (scrollPercent > 0.85 && displayedCount < filteredPosts.length) {
    scrollLoading = true;
    displayedCount += 6;
    renderPosts();
    setTimeout(() => scrollLoading = false, 500);
  }
}, 200));

// ========================================
// SERVICE WORKER REGISTRATION (PWA)
// ========================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration failed - not critical
    });
  });
}