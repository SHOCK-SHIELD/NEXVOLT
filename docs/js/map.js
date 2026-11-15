/**
 * ShockShield - Map Page JavaScript
 * OpenStreetMap integration with hazard markers, clustering, and interactions
 */

// ========================================
// MOCK HAZARD DATA (Same as feed)
// ========================================

const HAZARD_DATA = [
  {
    id: '1',
    lat: 28.5921,
    lng: 77.0460,
    type: 'live-wire',
    severity: 'critical',
    status: 'unsolved',
    title: 'Live Wire on Main Road',
    description: 'Live wire sparking dangerously on Main Road near Metro Pillar 345. Multiple pedestrians at risk. Wire fell from transformer during last night\'s storm. Urgent attention needed!',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=450&fit=crop',
    author: { name: 'Priya Sharma', initials: 'PS', verified: true },
    timestamp: Date.now() - 1000 * 60 * 15,
    likes: 47,
    comments: 2,
    verified: false,
    address: 'Sector 12, Dwarka, New Delhi'
  },
  {
    id: '2',
    lat: 12.9758,
    lng: 77.6013,
    type: 'transformer',
    severity: 'high',
    status: 'inprogress',
    title: 'Transformer Explosion',
    description: 'Transformer exploded near Brigade Road junction. Loud bang heard, smoke visible. Power out in surrounding buildings. BESCOM team on site.',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=450&fit=crop',
    author: { name: 'Amit Kumar', initials: 'AK', verified: false },
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    likes: 89,
    comments: 1,
    verified: true,
    address: 'MG Road, Bangalore'
  },
  {
    id: '3',
    lat: 17.4126,
    lng: 78.4070,
    type: 'illegal',
    severity: 'medium',
    status: 'solved',
    title: 'Illegal Power Connection',
    description: 'Illegal power connection found in construction site behind GVK Mall. Multiple unauthorized wires tapping main line. Reported to TSSPDCL.',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=450&fit=crop',
    author: { name: 'Sneha Reddy', initials: 'SR', verified: true },
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    likes: 156,
    comments: 1,
    verified: true,
    address: 'Banjara Hills, Hyderabad'
  },
  {
    id: '4',
    lat: 19.1197,
    lng: 72.8465,
    type: 'sparking',
    severity: 'high',
    status: 'unsolved',
    title: 'Sparking Street Light',
    description: 'Street light pole sparking violently near WEH Metro Station. Rain making it worse. Cars and pedestrians passing dangerously close.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=450&fit=crop',
    author: { name: 'Vikram Singh', initials: 'VS', verified: false },
    timestamp: Date.now() - 1000 * 60 * 60 * 3,
    likes: 67,
    comments: 1,
    verified: false,
    address: 'Andheri East, Mumbai'
  },
  {
    id: '5',
    lat: 22.5855,
    lng: 88.4243,
    type: 'exposed',
    severity: 'medium',
    status: 'inprogress',
    title: 'Exposed Junction Box',
    description: 'Open junction box on footpath near City Centre Mall. Exposed live wires at knee height. Children playing nearby. CESC notified.',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=450&fit=crop',
    author: { name: 'Anjali Mehta', initials: 'AM', verified: true },
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    likes: 43,
    comments: 0,
    verified: true,
    address: 'Salt Lake, Kolkata'
  },
  {
    id: '6',
    lat: 12.9352,
    lng: 77.6245,
    type: 'theft',
    severity: 'low',
    status: 'verified',
    title: 'Suspected Meter Tampering',
    description: 'Suspected meter tampering in residential complex. Multiple units showing unusually low readings. BESCOM inspection scheduled.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop',
    author: { name: 'Rohit Gupta', initials: 'RG', verified: false },
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    likes: 28,
    comments: 1,
    verified: true,
    address: 'Koramangala, Bangalore'
  },
  // Additional mock data for clustering demo
  {
    id: '7',
    lat: 28.6139,
    lng: 77.2090,
    type: 'live-wire',
    severity: 'critical',
    status: 'unsolved',
    title: 'Downed Power Line',
    description: 'Power line down across road near Connaught Place. Traffic disrupted.',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=450&fit=crop',
    author: { name: 'Delhi Traffic', initials: 'DT', verified: true },
    timestamp: Date.now() - 1000 * 60 * 30,
    likes: 112,
    comments: 5,
    verified: true,
    address: 'Connaught Place, New Delhi'
  },
  {
    id: '8',
    lat: 28.6200,
    lng: 77.2100,
    type: 'transformer',
    severity: 'high',
    status: 'inprogress',
    title: 'Transformer Fire',
    description: 'Distribution transformer caught fire. Fire brigade on scene.',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=450&fit=crop',
    author: { name: 'Fire Dept', initials: 'FD', verified: true },
    timestamp: Date.now() - 1000 * 60 * 45,
    likes: 78,
    comments: 3,
    verified: true,
    address: 'Barakhamba Road, New Delhi'
  },
  {
    id: '9',
    lat: 28.6150,
    lng: 77.2080,
    type: 'illegal',
    severity: 'medium',
    status: 'unsolved',
    title: 'Illegal Hooking',
    description: 'Multiple illegal connections found in JJ Colony.',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=450&fit=crop',
    author: { name: 'BSES Rajdhani', initials: 'BR', verified: true },
    timestamp: Date.now() - 1000 * 60 * 60,
    likes: 34,
    comments: 2,
    verified: false,
    address: 'JJ Colony, New Delhi'
  },
  {
    id: '10',
    lat: 28.6180,
    lng: 77.2120,
    type: 'exposed',
    severity: 'high',
    status: 'inprogress',
    title: 'Open Feeder Pillar',
    description: 'Feeder pillar door broken, live parts exposed near school.',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=450&fit=crop',
    author: { name: 'School Admin', initials: 'SA', verified: false },
    timestamp: Date.now() - 1000 * 60 * 90,
    likes: 56,
    comments: 4,
    verified: false,
    address: 'Mandi House, New Delhi'
  }
];

const HAZARD_TYPES = {
  'live-wire': { label: 'Live Wire', icon: '🔴', color: '#FF0033', svg: '<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="4" y1="12" x2="20" y2="12"/>' },
  'transformer': { label: 'Transformer Burst', icon: '⚡', color: '#FF4400', svg: '<polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/><line x1="12" y1="22" x2="12" y2="15"/><line x1="12" y1="9" x2="12" y2="2"/>' },
  'illegal': { label: 'Illegal Connection', icon: '🔌', color: '#FFB800', svg: '<path d="M18.7 13.17A9 9 0 1 0 5.3 20.83"/><path d="M12 6v12"/><path d="M8 12h8"/>' },
  'sparking': { label: 'Sparking Equipment', icon: '💥', color: '#FF0033', svg: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>' },
  'exposed': { label: 'Exposed Cable', icon: '⚠️', color: '#00B4D8', svg: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
  'theft': { label: 'Electricity Theft', icon: '🔓', color: '#8B5CF6', svg: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>' },
  'other': { label: 'Other', icon: '📋', color: '#64748B', svg: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>' }
};

const SEVERITY_COLORS = {
  low: '#00E676',
  medium: '#00B4D8',
  high: '#FFB800',
  critical: '#FF0033'
};

const STATUS_COLORS = {
  unsolved: '#FF4400',
  inprogress: '#FFB800',
  solved: '#00E676',
  verified: '#00B4D8',
  critical: '#FF0033'
};

// ========================================
// MAP STATE
// ========================================

let map = null;
let markersLayer = null;
let clustersLayer = null;
let userMarker = null;
let userAccuracyCircle = null;
let heatmapLayer = null;
let currentBasemap = 'osm';
let currentFilters = {
  status: 'all',
  type: 'all',
  radius: 5
};
let userLocation = null;
let selectedHazard = null;
let mapInitialized = false;

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initMap();
  initMapControls();
  initSheets();
  requestUserLocation();
  initHeroScroll();
  initReportModal();
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

// Hero section scroll behavior - hide on scroll down, show on scroll up
function initHeroScroll() {
  const hero = document.getElementById('mapHero');
  if (!hero) return;
  
  let lastScrollY = window.pageYOffset;
  let ticking = false;
  const heroHeight = hero.offsetHeight;
  const hideThreshold = 50; // Start hiding after 50px scroll
  
  function updateHero() {
    const currentScrollY = window.pageYOffset;
    const scrollDelta = currentScrollY - lastScrollY;
    
    // Don't hide if near top
    if (currentScrollY < hideThreshold) {
      hero.classList.remove('hidden');
    } else if (scrollDelta > 0 && currentScrollY > lastScrollY + 10) {
      // Scrolling down - hide hero
      hero.classList.add('hidden');
    } else if (scrollDelta < 0 && currentScrollY < lastScrollY - 10) {
      // Scrolling up - show hero
      hero.classList.remove('hidden');
    }
    
    lastScrollY = currentScrollY;
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHero);
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
// MAP INITIALIZATION
// ========================================

function initMap() {
  // Create map centered on India
  map = L.map('map', {
    center: [20.5937, 78.9629],
    zoom: 5,
    zoomControl: false,
    attributionControl: false,
    preferCanvas: true,
    renderer: L.canvas({ padding: 0.5 })
  });

  // Add base layers
  const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  });

  const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: '© Esri, Maxar, Earthstar Geographics'
  });

  const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors © CARTO'
  });

  const baseLayers = {
    'OpenStreetMap': osmLayer,
    'Satellite': satelliteLayer,
    'Dark Mode': darkLayer
  };

  // Add default layer
  osmLayer.addTo(map);

  // Create marker cluster group
  clustersLayer = L.markerClusterGroup({
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    singleMarkerMode: false,
    iconCreateFunction: createClusterIcon
  });

  // Create individual markers layer
  markersLayer = L.layerGroup();

  // Add clusters to map
  map.addLayer(clustersLayer);

  // Add zoom control
  L.control.zoom({ position: 'topright' }).addTo(map);

  // Add attribution
  L.control.attribution({ position: 'bottomright', prefix: false }).addTo(map);

  // Store base layers for switching
  map.baseLayers = baseLayers;

  // Load hazards
  loadHazards();

  // Map events
  map.on('zoomend', updateLegendCounts);
  map.on('moveend', updateLegendCounts);

  mapInitialized = true;
  
  // Ensure map container has proper dimensions
  setTimeout(() => {
    map.invalidateSize();
  }, 100);
}

function createClusterIcon(cluster) {
  const count = cluster.getChildCount();
  let className = 'marker-cluster';
  let size = 48;

  if (count < 10) {
    className += ' marker-cluster-small';
  } else if (count < 50) {
    className += ' marker-cluster-medium';
  } else {
    className += ' marker-cluster-large';
  }

  return L.divIcon({
    html: `<div><span>${count}</span></div>`,
    className: className,
    iconSize: L.point(size, size),
    iconAnchor: L.point(size / 2, size / 2)
  });
}

// ========================================
// HAZARD MARKERS
// ========================================

function loadHazards() {
  clustersLayer.clearLayers();
  
  const filteredHazards = filterHazards(HAZARD_DATA);
  
  filteredHazards.forEach(hazard => {
    const marker = createHazardMarker(hazard);
    clustersLayer.addLayer(marker);
  });

  updateLegendCounts();
  
  // Fit bounds if no user location
  if (!userLocation && filteredHazards.length > 0) {
    const group = new L.featureGroup(filteredHazards.map(h => L.marker([h.lat, h.lng])));
    map.fitBounds(group.getBounds().pad(0.1), { maxZoom: 12 });
  }
}

function filterHazards(hazards) {
  return hazards.filter(hazard => {
    // Status filter
    if (currentFilters.status !== 'all' && hazard.status !== currentFilters.status) {
      return false;
    }
    
    // Type filter
    if (currentFilters.type !== 'all' && hazard.type !== currentFilters.type) {
      return false;
    }
    
    // Radius filter (if user location available)
    if (userLocation && currentFilters.radius) {
      const distance = calculateDistance(
        userLocation.lat, userLocation.lng,
        hazard.lat, hazard.lng
      );
      if (distance > currentFilters.radius) {
        return false;
      }
    }
    
    return true;
  });
}

function createHazardMarker(hazard) {
  const typeInfo = HAZARD_TYPES[hazard.type];
  const statusColor = STATUS_COLORS[hazard.status] || STATUS_COLORS.unsolved;
  const severityColor = SEVERITY_COLORS[hazard.severity];
  const displayColor = hazard.severity === 'critical' ? severityColor : statusColor;
  
  const markerHtml = `
    <div class="hazard-marker ${hazard.status} ${hazard.severity === 'critical' ? 'pulse' : ''}" 
         style="background: ${displayColor};" 
         data-hazard-id="${hazard.id}"
         role="button"
         tabindex="0"
         aria-label="${typeInfo.label}, ${hazard.status}, ${hazard.severity} severity">
      <div class="hazard-marker-inner" style="background: ${displayColor};">
        <svg class="hazard-marker-icon" viewBox="0 0 24 24" fill="none">
          ${typeInfo.svg}
        </svg>
      </div>
    </div>
  `;

  const icon = L.divIcon({
    html: markerHtml,
    className: 'custom-hazard-marker',
    iconSize: L.point(36, 36),
    iconAnchor: L.point(18, 36),
    popupAnchor: L.point(0, -36)
  });

  const marker = L.marker([hazard.lat, hazard.lng], { icon });
  
  // Custom popup
  marker.bindPopup(createPopupContent(hazard), {
    className: 'custom-popup-container',
    closeButton: true,
    autoClose: true,
    closeOnEscapeKey: true
  });

  // Click event for bottom sheet
  marker.on('click', () => {
    showHazardDetail(hazard);
  });

  // Keyboard support
  marker.on('keydown', (e) => {
    if (e.originalEvent.key === 'Enter' || e.originalEvent.key === ' ') {
      e.originalEvent.preventDefault();
      showHazardDetail(hazard);
    }
  });

  return marker;
}

function createPopupContent(hazard) {
  const typeInfo = HAZARD_TYPES[hazard.type];
  const statusLabels = {
    unsolved: 'Unsolved',
    inprogress: 'In Progress',
    solved: 'Resolved',
    verified: 'Verified'
  };
  const timeAgo = Utils.formatRelativeTime(hazard.timestamp);

  return `
    <div class="custom-popup">
      <div class="custom-popup-header">
        <div class="custom-popup-type">
          <span style="display: inline-flex; width: 24px; height: 24px; border-radius: 50%; background: ${STATUS_COLORS[hazard.status]}; align-items: center; justify-content: center;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">${typeInfo.svg}</svg>
          </span>
          <span>${typeInfo.label}</span>
        </div>
        <span class="custom-popup-status" style="background: ${STATUS_COLORS[hazard.status]}20; color: ${STATUS_COLORS[hazard.status]}; border: 1px solid ${STATUS_COLORS[hazard.status]}40;">${statusLabels[hazard.status]}</span>
      </div>
      <p class="custom-popup-description">${hazard.description.substring(0, 150)}${hazard.description.length > 150 ? '...' : ''}</p>
      <div class="custom-popup-meta">
        <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${timeAgo}</span>
        <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> ${hazard.address}</span>
      </div>
      <div class="custom-popup-actions">
        <button class="custom-popup-btn primary" onclick="window.showHazardDetailFromPopup('${hazard.id}')">Details</button>
        <button class="custom-popup-btn secondary" onclick="window.navigateToHazard('${hazard.id}')">Navigate</button>
      </div>
    </div>
  `;
}

// Global functions for popup buttons
window.showHazardDetailFromPopup = (id) => {
  const hazard = HAZARD_DATA.find(h => h.id === id);
  if (hazard) showHazardDetail(hazard);
};

window.navigateToHazard = (id) => {
  const hazard = HAZARD_DATA.find(h => h.id === id);
  if (hazard) {
    const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation?.lat || hazard.lat}%2C${userLocation?.lng || hazard.lng}%3B${hazard.lat}%2C${hazard.lng}`;
    window.open(url, '_blank');
  }
};

// ========================================
// USER LOCATION
// ========================================

function requestUserLocation() {
  const locationStatus = document.getElementById('locationStatus');
  const locationText = document.querySelector('.location-text');
  const centerMapBtn = document.getElementById('centerMapBtn');

  if (!navigator.geolocation) {
    updateLocationStatus('Geolocation not supported', true);
    return;
  }

  updateLocationStatus('Detecting location...');

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      addUserLocationMarker();
      updateLocationStatus('Location found', false, true);
      
      // Center map on user
      map.setView([userLocation.lat, userLocation.lng], 14, { animate: true });
      
      // Reload hazards with radius filter
      loadHazards();
      
      // Enable center button
      centerMapBtn.disabled = false;
    },
    (error) => {
      let message = 'Unable to get location';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = 'Location permission denied';
          break;
        case error.POSITION_UNAVAILABLE:
          message = 'Location unavailable';
          break;
        case error.TIMEOUT:
          message = 'Location request timed out';
          break;
      }
      updateLocationStatus(message, true);
      
      // Use default location (Delhi)
      userLocation = { lat: 28.6139, lng: 77.2090 };
      map.setView([userLocation.lat, userLocation.lng], 12, { animate: true });
      loadHazards();
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
  );

  // Watch position for updates
  navigator.geolocation.watchPosition(
    (position) => {
      userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      };
      updateUserLocationMarker();
    },
    (error) => console.warn('Watch position error:', error),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  );
}

function updateLocationStatus(message, isError = false, isSuccess = false) {
  const locationStatus = document.getElementById('locationStatus');
  const locationText = document.querySelector('.location-text');
  const locationDot = document.querySelector('.location-dot');
  
  if (!locationStatus) return;
  
  locationStatus.classList.remove('error', 'located');
  if (isError) locationStatus.classList.add('error');
  if (isSuccess) locationStatus.classList.add('located');
  
  locationText.textContent = message;
  if (locationDot) {
    locationDot.style.background = isError ? 'var(--color-hazard-critical)' : 'var(--color-hazard-solved)';
  }
}

function addUserLocationMarker() {
  if (!userLocation) return;

  // User marker
  const userMarkerHtml = `
    <div class="user-marker">
      <div class="user-marker-core"></div>
      <div class="user-marker-accuracy"></div>
    </div>
  `;

  const userIcon = L.divIcon({
    html: userMarkerHtml,
    className: 'custom-user-marker',
    iconSize: L.point(24, 24),
    iconAnchor: L.point(12, 12)
  });

  userMarker = L.marker([userLocation.lat, userLocation.lng], { 
    icon: userIcon,
    zIndexOffset: 1000
  }).addTo(map);

  // Accuracy circle
  if (userLocation.accuracy) {
    userAccuracyCircle = L.circle([userLocation.lat, userLocation.lng], {
      radius: userLocation.accuracy,
      color: 'var(--color-hazard-verified)',
      fillColor: 'var(--color-hazard-verified)',
      fillOpacity: 0.1,
      weight: 1,
      dashArray: '5, 5',
      interactive: false
    }).addTo(map);
  }
}

function updateUserLocationMarker() {
  if (!userLocation || !userMarker) return;

  userMarker.setLatLng([userLocation.lat, userLocation.lng]);
  
  if (userAccuracyCircle) {
    userAccuracyCircle.setLatLng([userLocation.lat, userLocation.lng]);
    userAccuracyCircle.setRadius(userLocation.accuracy);
  }
}

// ========================================
// MAP CONTROLS
// ========================================

function initMapControls() {
  // Center map button
  const centerMapBtn = document.getElementById('centerMapBtn');
  centerMapBtn.addEventListener('click', () => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 15, { animate: true });
    } else {
      Toast.warning('Location not available yet', 'GPS');
    }
  });

  // Status filter chips
  document.querySelectorAll('.filter-chip[data-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;
      currentFilters.status = filter;
      
      document.querySelectorAll('.filter-chip[data-filter]').forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-pressed', 'true');
      
      loadHazards();
    });
  });

  // Type filter
  const typeFilter = document.getElementById('typeFilter');
  typeFilter.addEventListener('change', () => {
    currentFilters.type = typeFilter.value;
    loadHazards();
  });

  // Radius filter
  const radiusFilter = document.getElementById('radiusFilter');
  radiusFilter.addEventListener('change', () => {
    currentFilters.radius = parseInt(radiusFilter.value);
    loadHazards();
  });

  // Reset filters
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  resetFiltersBtn.addEventListener('click', () => {
    currentFilters = { status: 'all', type: 'all', radius: 5 };
    
    document.querySelectorAll('.filter-chip[data-filter]').forEach(c => {
      c.classList.toggle('active', c.dataset.filter === 'all');
      c.setAttribute('aria-pressed', c.dataset.filter === 'all');
    });
    
    typeFilter.value = 'all';
    radiusFilter.value = '5';
    
    loadHazards();
    Toast.success('Filters reset', 'Map');
  });

  // Report FAB
  const reportFab = document.getElementById('reportFab');
  reportFab.addEventListener('click', () => {
    window.location.href = 'feed.html';
  });

  // Layers FAB
  const layersFab = document.getElementById('layersFab');
  layersFab.addEventListener('click', () => {
    openSideSheet('layersSheet');
  });

  // Measure FAB (placeholder)
  const measureFab = document.getElementById('measureFab');
  measureFab.addEventListener('click', () => {
    Toast.info('Measure tool coming soon!', 'Feature Preview');
  });

  // Basemap radio buttons
  document.querySelectorAll('input[name="basemap"]').forEach(radio => {
    radio.addEventListener('change', () => {
      switchBasemap(radio.value);
    });
  });

  // Overlay checkboxes
  document.querySelectorAll('input[name="overlay"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      toggleOverlay(checkbox.value, checkbox.checked);
    });
  });
}

function switchBasemap(basemap) {
  if (basemap === currentBasemap) return;
  
  // Remove current layer
  map.baseLayers[currentBasemap].remove();
  
  // Add new layer
  map.baseLayers[basemap].addTo(map);
  currentBasemap = basemap;
}

function toggleOverlay(overlay, enabled) {
  switch (overlay) {
    case 'heatmap':
      if (enabled) {
        addHeatmapLayer();
      } else {
        removeHeatmapLayer();
      }
      break;
    case 'clusters':
      if (enabled) {
        map.addLayer(clustersLayer);
        if (markersLayer) map.removeLayer(markersLayer);
      } else {
        map.removeLayer(clustersLayer);
        map.addLayer(markersLayer);
        // Re-add individual markers
        loadHazards();
      }
      break;
    case 'userReports':
      // Filter to show only current user's reports
      Toast.info(enabled ? 'Showing your reports only' : 'Showing all reports', 'Filter');
      break;
  }
}

function addHeatmapLayer() {
  if (heatmapLayer) return;
  
  // Simple heatmap using Leaflet.heat (would need the plugin)
  // For now, show a toast
  Toast.info('Heatmap layer requires Leaflet.heat plugin', 'Feature Preview');
  document.getElementById('heatmapOverlay').checked = false;
}

function removeHeatmapLayer() {
  if (heatmapLayer) {
    map.removeLayer(heatmapLayer);
    heatmapLayer = null;
  }
}

// ========================================
// BOTTOM SHEET
// ========================================

function initSheets() {
  // Bottom sheet drag handle
  const bottomSheet = document.getElementById('bottomSheet');
  const sheetHandle = bottomSheet.querySelector('.sheet-handle');
  const sheetClose = document.getElementById('sheetClose');
  
  let startY = 0;
  let sheetHeight = 0;
  let isDragging = false;

  sheetHandle.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startY = e.clientY;
    sheetHeight = bottomSheet.offsetHeight;
    bottomSheet.style.transition = 'none';
    e.preventDefault();
  });

  document.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    
    const deltaY = startY - e.clientY;
    const newHeight = Math.min(Math.max(sheetHeight + deltaY, 120), window.innerHeight * 0.9);
    bottomSheet.style.transform = `translateY(${window.innerHeight - newHeight}px)`;
  });

  document.addEventListener('pointerup', () => {
    if (!isDragging) return;
    isDragging = false;
    bottomSheet.style.transition = '';
    
    const currentY = window.innerHeight - bottomSheet.getBoundingClientRect().top;
    if (currentY > window.innerHeight * 0.5) {
      bottomSheet.classList.add('full');
      bottomSheet.classList.add('open');
    } else if (currentY > 120) {
      bottomSheet.classList.remove('full');
      bottomSheet.classList.add('open');
    } else {
      closeBottomSheet();
    }
  });

  sheetClose.addEventListener('click', closeBottomSheet);
  
  // Click outside to close (on mobile)
  bottomSheet.addEventListener('click', (e) => {
    if (e.target === bottomSheet) {
      closeBottomSheet();
    }
  });

  // Side sheet close buttons
  document.getElementById('layersClose').addEventListener('click', () => closeSideSheet('layersSheet'));
  document.getElementById('layersSheet').addEventListener('click', (e) => {
    if (e.target.id === 'layersSheet') closeSideSheet('layersSheet');
  });
}

function initReportModal() {
  const modal = document.getElementById('reportModal');
  const openBtn = document.getElementById('reportFab');
  const closeBtn = document.getElementById('closeReportModal');
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
  
  if (!modal || !openBtn || !form) return;
  
  let currentStep = 1;
  let reportData = {
    photo: null,
    location: null,
    coordinates: null,
    type: null,
    description: null,
    severity: 'low'
  };
  
  // Open modal
  openBtn.addEventListener('click', () => {
    resetReportForm();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    goToStep(1);
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
    
    // Add to HAZARD_DATA
    HAZARD_DATA.unshift(newPost);
    
    btnLoading.style.display = 'none';
    btnText.textContent = 'Report Submitted!';
    submitBtn.classList.add('success');
    
    Toast.success('Hazard reported successfully! Your report is now live.', 'Report Submitted');
    
    setTimeout(() => {
      closeReportModal();
      loadHazards();
      updateTrending();
      updateUserStats();
    }, 1500);
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
    
    form.reset();
    photoPreview.innerHTML = '';
    document.getElementById('descCount').textContent = '0';
    document.getElementById('locationStatus').textContent = 'Click "Use GPS" to auto-detect your location';
    locationStatus.style.color = '';
    
    goToStep(1);
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
}

function showHazardDetail(hazard) {
  selectedHazard = hazard;
  const bottomSheet = document.getElementById('bottomSheet');
  const sheetTitle = document.getElementById('sheetTitle');
  const sheetBody = document.getElementById('sheetBody');
  
  sheetTitle.textContent = hazard.title;
  sheetBody.innerHTML = renderHazardDetail(hazard);
  
  bottomSheet.hidden = false;
  // Force reflow
  bottomSheet.offsetHeight;
  bottomSheet.classList.add('open');
  
  // Attach events
  attachHazardDetailEvents(hazard);
}

function renderHazardDetail(hazard) {
  const typeInfo = HAZARD_TYPES[hazard.type];
  const statusLabels = {
    unsolved: 'Unsolved',
    inprogress: 'In Progress',
    solved: 'Resolved',
    verified: 'Verified'
  };
  const severityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical'
  };
  const timeAgo = Utils.formatRelativeTime(hazard.timestamp);
  const fullDate = Utils.formatDate(hazard.timestamp, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return `
    <div class="hazard-detail">
      <div class="hazard-image">
        <img src="${hazard.image}" alt="${hazard.title}" loading="lazy">
      </div>
      
      <div class="hazard-meta">
        <span class="hazard-type-badge ${hazard.type}">${typeInfo.icon} ${typeInfo.label}</span>
        <span class="hazard-status ${hazard.status}">${statusLabels[hazard.status]}</span>
        <span class="hazard-status" style="background: ${SEVERITY_COLORS[hazard.severity]}20; color: ${SEVERITY_COLORS[hazard.severity]}; border-color: ${SEVERITY_COLORS[hazard.severity]}40;">Severity: ${severityLabels[hazard.severity]}</span>
        ${hazard.verified ? '<span class="hazard-status verified">✓ Verified</span>' : ''}
      </div>
      
      <p class="hazard-description">${hazard.description}</p>
      
      <div class="hazard-info-grid">
        <div class="hazard-info-item">
          <div class="hazard-info-label">Reported By</div>
          <div class="hazard-info-value">${hazard.author.name} ${hazard.author.verified ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-hazard-verified); vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}</div>
        </div>
        <div class="hazard-info-item">
          <div class="hazard-info-label">Time</div>
          <div class="hazard-info-value">${timeAgo}</div>
        </div>
        <div class="hazard-info-item">
          <div class="hazard-info-label">Location</div>
          <div class="hazard-info-value">${hazard.address}</div>
        </div>
        <div class="hazard-info-item">
          <div class="hazard-info-label">Coordinates</div>
          <div class="hazard-info-value">${hazard.lat.toFixed(6)}, ${hazard.lng.toFixed(6)}</div>
        </div>
        <div class="hazard-info-item">
          <div class="hazard-info-label">Community Priority</div>
          <div class="hazard-info-value">${hazard.likes} likes · ${hazard.comments} comments</div>
        </div>
        <div class="hazard-info-item">
          <div class="hazard-info-label">Full Date</div>
          <div class="hazard-info-value">${fullDate}</div>
        </div>
      </div>
      
      <div class="hazard-actions">
        <button class="hazard-action-btn primary" id="navigateBtn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
          </svg>
          Navigate
        </button>
        <button class="hazard-action-btn secondary" id="shareBtn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          Share
        </button>
        <button class="hazard-action-btn secondary" id="reportSimilarBtn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          Report Similar
        </button>
      </div>
    </div>
  `;
}

function attachHazardDetailEvents(hazard) {
  document.getElementById('navigateBtn').addEventListener('click', () => {
    const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${userLocation?.lat || hazard.lat}%2C${userLocation?.lng || hazard.lng}%3B${hazard.lat}%2C${hazard.lng}`;
    window.open(url, '_blank');
  });
  
  document.getElementById('shareBtn').addEventListener('click', () => {
    const shareUrl = `${window.location.origin}/map.html?hazard=${hazard.id}`;
    if (navigator.share) {
      navigator.share({
        title: `Electrical Hazard: ${hazard.title}`,
        text: hazard.description.substring(0, 200),
        url: shareUrl
      });
    } else {
      Utils.copyToClipboard(shareUrl);
      Toast.success('Link copied!', 'Shared');
    }
  });
  
  document.getElementById('reportSimilarBtn').addEventListener('click', () => {
    closeBottomSheet();
    setTimeout(() => {
      window.location.href = 'feed.html';
    }, 300);
  });
}

function closeBottomSheet() {
  const bottomSheet = document.getElementById('bottomSheet');
  bottomSheet.classList.remove('open', 'full');
  setTimeout(() => {
    bottomSheet.hidden = true;
    bottomSheet.style.transform = '';
  }, 300);
  selectedHazard = null;
}

function openSideSheet(sheetId) {
  const sheet = document.getElementById(sheetId);
  sheet.hidden = false;
  sheet.offsetHeight;
  sheet.classList.add('open');
}

function closeSideSheet(sheetId) {
  const sheet = document.getElementById(sheetId);
  sheet.classList.remove('open');
  setTimeout(() => {
    sheet.hidden = true;
  }, 300);
}

// ========================================
// LEGEND COUNTS
// ========================================

function updateLegendCounts() {
  const filtered = filterHazards(HAZARD_DATA);
  
  const counts = {
    unsolved: 0,
    inprogress: 0,
    solved: 0,
    verified: 0
  };
  
  filtered.forEach(h => {
    if (counts.hasOwnProperty(h.status)) {
      counts[h.status]++;
    }
    if (h.verified) counts.verified++;
  });
  
  document.getElementById('countUnsolved').textContent = counts.unsolved;
  document.getElementById('countInProgress').textContent = counts.inprogress;
  document.getElementById('countSolved').textContent = counts.solved;
  document.getElementById('countVerified').textContent = counts.verified;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('keydown', (e) => {
  // Escape to close sheets
  if (e.key === 'Escape') {
    closeBottomSheet();
    closeSideSheet('layersSheet');
  }
  
  // M for map center
  if (e.key === 'm' || e.key === 'M') {
    if (!e.target.matches('input, textarea, select')) {
      e.preventDefault();
      if (userLocation) {
        map.setView([userLocation.lat, userLocation.lng], 15, { animate: true });
      }
    }
  }
  
  // F for filters
  if (e.key === 'f' || e.key === 'F') {
    if (!e.target.matches('input, textarea, select')) {
      e.preventDefault();
      document.getElementById('typeFilter')?.focus();
    }
  }
});

// ========================================
// MAP RESIZE HANDLER
// ========================================

window.addEventListener('resize', Utils.debounce(() => {
  if (map) {
    map.invalidateSize();
  }
}, 250));

// ========================================
// SERVICE WORKER (PWA)
// ========================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}