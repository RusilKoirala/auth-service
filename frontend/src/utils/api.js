const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to get project API key from localStorage or URL params
const getProjectApiKey = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('api_key') || localStorage.getItem('projectApiKey');
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Only add auth token if requireAuth is true (default: true except for public endpoints)
  if (options.requireAuth !== false) {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // console.log('[apiRequest] No auth token found in localStorage');
    }
  }

  // Add project API key if available and required
  if (options.requireApiKey) {
    const apiKey = getProjectApiKey();
    if (apiKey) {
      config.headers['x-api-key'] = apiKey;
    }
  }

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Main Website Auth API
export const mainAuthAPI = {
  // Register a new main site user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      requireAuth: false,
    });
  },

  // Login a main site user
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      requireAuth: false,
    });
  },

  // Get current main site user info
  getMe: async () => {
    return apiRequest('/auth/profile');
  },
};

// Project User API (requires API key)
export const projectUserAPI = {
  // Register a new user under a project
  register: async (userData) => {
    return apiRequest('/project-users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      requireApiKey: true,
    });
  },

  // Login a user
  login: async (credentials) => {
    return apiRequest('/project-users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      requireApiKey: true,
    });
  },

  // Get current project user info
  getMe: async () => {
    return apiRequest('/project-users/me', { requireApiKey: true });
  },
};

// Auth utilities
export const authUtils = {
  // Store auth token
  setToken: (token) => {
    localStorage.setItem('authToken', token);
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Remove auth token
  removeToken: () => {
    localStorage.removeItem('authToken');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Store project API key
  setProjectApiKey: (apiKey) => {
    localStorage.setItem('projectApiKey', apiKey);
  },

  // Get project API key
  getProjectApiKey: () => {
    return getProjectApiKey();
  },
}; 

// Project management API (for owner dashboard)
export const projectAPI = {
  // List all projects for the current user (owner)
  listUserProjects: async () => {
    return apiRequest('/projects', {
      method: 'GET',
    });
  },
  createProject: async ({ name }) => {
    return apiRequest('/projects/create', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  },
  // Fetch a single project by ID
  getProjectById: async (id) => {
    return apiRequest(`/projects/${id}`, {
      method: 'GET',
    });
  },
}; 

export const adminAPI = {
  // List users for a project (owner/admin)
  listProjectUsers: async (projectId, apiKey) => {
    const token = authUtils.getToken();
    return apiRequest(`/admin/users?projectId=${projectId}`, {
      headers: {
        'x-api-key': apiKey,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  },
}; 