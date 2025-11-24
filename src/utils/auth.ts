/**
 * Authentication utility functions
 * Handles token retrieval from Redux store
 * Note: Tokens are stored in Redux store and persisted via redux-persist
 */

/**
 * Get authentication token from Redux store (via getState callback)
 */
export const getAuthToken = (getState?: () => { auth?: { accessToken: string | null } }): string | null => {
  if (typeof window === 'undefined') return null;
  
  if (getState) {
    try {
      const state = getState();
      return state?.auth?.accessToken || null;
    } catch {
      return null;
    }
  }
  
  return null;
};

/**
 * Get refresh token from Redux store (via getState callback)
 */
export const getRefreshToken = (getState?: () => { auth?: { refreshToken: string | null } }): string | null => {
  if (typeof window === 'undefined') return null;
  
  if (getState) {
    try {
      const state = getState();
      return state?.auth?.refreshToken || null;
    } catch {
      return null;
    }
  }
  
  return null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (getState?: () => { auth?: { isAuthenticated: boolean } }): boolean => {
  if (typeof window === 'undefined') return false;
  
  if (getState) {
    try {
      const state = getState();
      return state?.auth?.isAuthenticated || false;
    } catch {
      return false;
    }
  }
  
  return false;
};

