// API Client with automatic Spring Boot integration + seamless local fallback
const BASE_URL = '/api';

export const BACKEND_STATE = {
  isLive: false,
  checked: false,
  lastPing: null,
  latency: null,
};

// Initial realistic seed data for the civic portal
const INITIAL_LOCATIONS = [
  { id: 1, name: 'Connaught Place', district: 'New Delhi', pinCode: '110001' },
  { id: 2, name: 'Bandra West', district: 'Mumbai Suburban', pinCode: '400050' },
  { id: 3, name: 'Indiranagar', district: 'Bengaluru Urban', pinCode: '560038' },
  { id: 4, name: 'Sector 62', district: 'Gautam Buddha Nagar', pinCode: '201309' },
  { id: 5, name: 'Salt Lake Sector V', district: 'Kolkata', pinCode: '700091' },
  { id: 6, name: 'T Nagar', district: 'Chennai', pinCode: '600017' },
  { id: 7, name: 'Kavuri Hills, Madhapur', district: 'Hyderabad', pinCode: '500081' },
  { id: 8, name: 'Civil Lines', district: 'Jaipur', pinCode: '302006' },
  { id: 9, name: 'Shivaji Nagar', district: 'Pune', pinCode: '411005' },
  { id: 10, name: 'Kankarbagh', district: 'Patna', pinCode: '800020' },
];

const INITIAL_ISSUES = [
  {
    id: 1,
    title: 'Severe Potholes causing traffic hazard near Metro Gate 2',
    description: 'Multiple deep potholes after monsoon rains are causing accidents and slow traffic during peak office hours. Immediate road resurfacing required.',
    category: 'ROAD',
    status: 'IN_PROGRESS',
    resolutionSource: 'GOVERNMENT_RESOLVED',
    locationName: 'Sector 62, Gautam Buddha Nagar (201309)',
    reporterName: 'Aarav Sharma',
    reportedAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
  },
  {
    id: 2,
    title: 'Major drinking water pipeline burst flooding Main Street',
    description: 'Clean municipal water is overflowing onto the streets for the past 12 hours. Residential blocks 4B through 6C have zero water supply pressure.',
    category: 'WATER',
    status: 'PENDING',
    resolutionSource: 'PENDING',
    locationName: 'Indiranagar, Bengaluru Urban (560038)',
    reporterName: 'Priya Narayanan',
    reportedAt: new Date(Date.now() - 3600 * 1000 * 14).toISOString(),
  },
  {
    id: 3,
    title: 'Illegal garbage accumulation near Govt Primary School',
    description: 'Large heaps of mixed municipal and commercial waste uncollected for over 5 days creating severe foul smell and health hazard for school children.',
    category: 'GARBAGE',
    status: 'RESOLVED',
    resolutionSource: 'COMMUNITY_RESOLVED',
    locationName: 'Connaught Place, New Delhi (110001)',
    reporterName: 'Vikramaditya Roy',
    reportedAt: new Date(Date.now() - 3600 * 1000 * 96).toISOString(),
  },
  {
    id: 4,
    title: 'Defective LED streetlights along Sector Ring Road (8 poles)',
    description: 'Stretches of road are completely pitch black after 7 PM, creating safety concerns especially for women and pedestrians walking from bus terminus.',
    category: 'STREETLIGHT',
    status: 'VERIFIED',
    resolutionSource: 'PENDING',
    locationName: 'Bandra West, Mumbai Suburban (400050)',
    reporterName: 'Neha Deshmukh',
    reportedAt: new Date(Date.now() - 3600 * 1000 * 22).toISOString(),
  },
  {
    id: 5,
    title: 'Damaged drainage cover collapsed on pedestrian footpath',
    description: 'Heavy concrete slab collapsed into stormwater drain. Pedestrians could fall into the 6-foot drain if not cordoned off urgently.',
    category: 'OTHER',
    status: 'PENDING',
    resolutionSource: 'PENDING',
    locationName: 'T Nagar, Chennai (600017)',
    reporterName: 'Karthik Subramanian',
    reportedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
  },
];

// Helper to get local data
const getStoredIssues = () => {
  const data = localStorage.getItem('pvi_issues');
  if (!data) {
    localStorage.setItem('pvi_issues', JSON.stringify(INITIAL_ISSUES));
    return INITIAL_ISSUES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_ISSUES;
  }
};

const saveStoredIssues = (issues) => {
  localStorage.setItem('pvi_issues', JSON.stringify(issues));
};

export async function pingBackend() {
  const startTime = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    // Ping an auth endpoint or any endpoint
    const res = await fetch(`${BASE_URL}/auth/ping`, {
      method: 'GET',
      signal: controller.signal,
    }).catch(() => null);
    clearTimeout(timeoutId);

    // If server responded (even 404 or 403), the Spring Boot HTTP server is alive!
    if (res && res.status !== 0) {
      BACKEND_STATE.isLive = true;
      BACKEND_STATE.latency = Math.round(performance.now() - startTime);
      BACKEND_STATE.checked = true;
      BACKEND_STATE.lastPing = new Date().toLocaleTimeString();
      return true;
    }
  } catch (err) {
    // offline
  }
  BACKEND_STATE.isLive = false;
  BACKEND_STATE.latency = null;
  BACKEND_STATE.checked = true;
  BACKEND_STATE.lastPing = new Date().toLocaleTimeString();
  return false;
}

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('pvi_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.ok) {
      BACKEND_STATE.isLive = true;
      return await res.json();
    }

    // If backend returns an error message JSON (like GlobalExceptionHandler)
    const errorBody = await res.json().catch(() => null);
    const errorMsg = errorBody?.error || `Request failed with status ${res.status}`;
    
    // Throw error so TanStack Query handles error states properly
    const err = new Error(errorMsg);
    err.status = res.status;
    err.body = errorBody;
    throw err;
  } catch (networkOrApiError) {
    // If it is an intentional API error response from the backend, rethrow it
    if (networkOrApiError.status) {
      throw networkOrApiError;
    }

    // Backend is offline or unreachable - use client-side fallback logic
    BACKEND_STATE.isLive = false;
    return handleOfflineFallback(endpoint, options);
  }
}

// Fallback simulator matching exact backend contracts
function handleOfflineFallback(endpoint, options) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : null;

  // 1. Auth Login
  if (endpoint === '/auth/login' && method === 'POST') {
    const userEmail = body?.email || 'citizen@newindia.gov.in';
    const fakeToken = btoa(JSON.stringify({ sub: userEmail, role: 'CITIZEN', exp: Date.now() + 86400000 }));
    return { token: `eyJhbGciOiJIUzI1NiJ9.${fakeToken}.mockSignature` };
  }

  // 2. Auth Register
  if (endpoint === '/auth/register' && method === 'POST') {
    const userEmail = body?.email || 'newcitizen@newindia.gov.in';
    const fakeToken = btoa(JSON.stringify({ sub: userEmail, role: 'CITIZEN', exp: Date.now() + 86400000 }));
    return { token: `eyJhbGciOiJIUzI1NiJ9.${fakeToken}.mockSignature` };
  }

  // 3. User Me Profile
  if (endpoint === '/users/me' && method === 'GET') {
    const userRole = localStorage.getItem('pvi_active_role') || 'CITIZEN';
    const userEmail = localStorage.getItem('pvi_user_email') || 'citizen@newindia.gov.in';
    const userName = localStorage.getItem('pvi_user_name') || 'Dr. Ashis Kumar';
    return {
      id: 101,
      fullName: userName,
      email: userEmail,
      role: userRole,
      createdAt: '2026-01-15T10:00:00',
    };
  }

  // 4. Analytics Summary
  if (endpoint === '/analytics/summary' && method === 'GET') {
    const issues = getStoredIssues();
    const totalReported = issues.length;
    const pending = issues.filter(i => i.status === 'PENDING').length;
    const resolvedByGovt = issues.filter(i => i.resolutionSource === 'GOVERNMENT_RESOLVED').length;
    const resolvedByCommunity = issues.filter(i => i.resolutionSource === 'COMMUNITY_RESOLVED').length;
    return {
      totalReported,
      pending,
      resolvedByGovt,
      resolvedByCommunity,
    };
  }

  // 5. Locations Search
  if (endpoint.startsWith('/locations/search') && method === 'GET') {
    const url = new URL(`http://localhost${endpoint}`);
    const q = (url.searchParams.get('q') || '').toLowerCase();
    if (!q) return INITIAL_LOCATIONS.slice(0, 6);
    return INITIAL_LOCATIONS.filter(
      loc => loc.name.toLowerCase().includes(q) || loc.pinCode.includes(q) || loc.district.toLowerCase().includes(q)
    );
  }

  // 6. Issues - GET all
  if (endpoint === '/issues' && method === 'GET') {
    return getStoredIssues();
  }

  // 7. Issues - POST create
  if (endpoint === '/issues' && method === 'POST') {
    const issues = getStoredIssues();
    const locId = body?.locationId || 1;
    const loc = INITIAL_LOCATIONS.find(l => l.id === Number(locId)) || INITIAL_LOCATIONS[0];
    const userRole = localStorage.getItem('pvi_active_role') || 'CITIZEN';
    const userName = localStorage.getItem('pvi_user_name') || 'Dr. Ashis Kumar';

    const newIssue = {
      id: Date.now(),
      title: body?.title || 'Reported Issue',
      description: body?.description || '',
      category: body?.category || 'OTHER',
      status: 'PENDING',
      resolutionSource: 'PENDING',
      locationName: `${loc.name}, ${loc.district} (${loc.pinCode})`,
      reporterName: userName,
      reportedAt: new Date().toISOString(),
    };

    issues.unshift(newIssue);
    saveStoredIssues(issues);
    return newIssue;
  }

  // 8. Issues - PUT update status: /issues/{id}/status
  const statusMatch = endpoint.match(/\/issues\/(\d+)\/status/);
  if (statusMatch && method === 'PUT') {
    const issueId = Number(statusMatch[1]);
    const issues = getStoredIssues();
    const index = issues.findIndex(i => i.id === issueId);
    if (index !== -1) {
      issues[index].status = body?.status || 'IN_PROGRESS';
      if (body?.status === 'RESOLVED') {
        issues[index].resolutionSource = issues[index].resolutionSource === 'PENDING'
          ? 'GOVERNMENT_RESOLVED'
          : issues[index].resolutionSource;
      }
      saveStoredIssues(issues);
      return issues[index];
    }
    throw new Error('Issue not found');
  }

  return {};
}
