import { createContext, useContext, useState, useEffect } from 'react';
import { mainAuthAPI, projectUserAPI, authUtils } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper to determine if we are in project-embedded mode
const isProjectMode = () => {
  // If api_key is present in URL or localStorage, treat as project-embedded
  const urlParams = new URLSearchParams(window.location.search);
  return !!(urlParams.get('api_key') || localStorage.getItem('projectApiKey'));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authUtils.isAuthenticated()) {
          let userData;
          if (isProjectMode()) {
            userData = await projectUserAPI.getMe();
          } else {
            userData = await mainAuthAPI.getMe();
          }
          setUser(userData.user || userData); // support both {user} and user
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // If token is invalid, remove it
        authUtils.removeToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      let response;
      if (isProjectMode()) {
        response = await projectUserAPI.login({ email, password });
      } else {
        response = await mainAuthAPI.login({ email, password });
      }
      // Store the token
      authUtils.setToken(response.token);
      // Get user data
      let userData;
      if (isProjectMode()) {
        userData = await projectUserAPI.getMe();
      } else {
        userData = await mainAuthAPI.getMe();
      }
      setUser(userData.user || userData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      let response;
      if (isProjectMode()) {
        response = await projectUserAPI.register(userData);
      } else {
        response = await mainAuthAPI.register(userData);
      }
      // Store the token
      authUtils.setToken(response.token);
      // Get user data
      let userInfo;
      if (isProjectMode()) {
        userInfo = await projectUserAPI.getMe();
      } else {
        userInfo = await mainAuthAPI.getMe();
      }
      setUser(userInfo.user || userInfo);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    authUtils.removeToken();
    setUser(null);
    setError(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
    isProjectMode: isProjectMode(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 