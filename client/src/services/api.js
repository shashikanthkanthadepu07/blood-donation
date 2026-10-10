// API client service with auto JWT token attachment

const API_BASE = '/api';

export const getAuthToken = () => {
  return localStorage.getItem('lifeflow_token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('lifeflow_token', token);
  } else {
    localStorage.removeItem('lifeflow_token');
  }
};

export const getCurrentStoredUser = () => {
  try {
    const raw = localStorage.getItem('lifeflow_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem('lifeflow_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('lifeflow_user');
  }
};

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({ success: false, message: 'Server communication error' }));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  demoLogin: (role) => request('/auth/demo', { method: 'POST', body: JSON.stringify({ role }) }),
  getMe: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Donors
  getDonors: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/donors${query ? `?${query}` : ''}`);
  },
  getDonorById: (id) => request(`/donors/${id}`),
  toggleAvailability: (id, isAvailable) =>
    request(`/donors/${id}/availability`, { method: 'PATCH', body: JSON.stringify({ isAvailable }) }),

  // Blood Requests
  getRequests: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/requests${query ? `?${query}` : ''}`);
  },
  getRequestById: (id) => request(`/requests/${id}`),
  createRequest: (data) => request('/requests', { method: 'POST', body: JSON.stringify(data) }),
  pledgeDonation: (id, data) => request(`/requests/${id}/pledge`, { method: 'POST', body: JSON.stringify(data) }),
  updateRequestStatus: (id, status) =>
    request(`/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Inventory
  getInventory: () => request('/inventory'),
  updateInventory: (bloodGroup, unitsAvailable) =>
    request(`/inventory/${encodeURIComponent(bloodGroup)}`, {
      method: 'PUT',
      body: JSON.stringify({ unitsAvailable })
    }),

  // Donation Camps
  getCamps: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/camps${query ? `?${query}` : ''}`);
  },
  createCamp: (data) => request('/camps', { method: 'POST', body: JSON.stringify(data) }),
  registerCamp: (id, data) => request(`/camps/${id}/register`, { method: 'POST', body: JSON.stringify(data) }),

  // Stats
  getStats: () => request('/stats'),
  healthCheck: () => request('/health')
};
