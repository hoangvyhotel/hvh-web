import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';

const IS_AUTH_KEY = 'is_logged_in';
const USER_ROLE_KEY = 'user_role'; // 'admin' hoặc 'staff'
const HOTEL_ID_KEY = 'hotel_id';
const HOTEL_NAME_KEY = 'hotel_name';

// username storage with optional expiry
const USERNAME_KEY = 'username';
const USERNAME_EXPIRY_KEY = 'username_expiry';

// admin-specific expiry (3 hours)
const ADMIN_AUTH_EXPIRY_KEY = 'admin_auth_expiry';
const ADMIN_AUTH_FLAG = 'is_admin_logged_in';
const ADMIN_AUTH_EXPIRY_MS = 3 * 60 * 60 * 1000; // 3 hours

export function useAuthState() {
  const getInitial = () => {
    try {
      const v = localStorage.getItem(IS_AUTH_KEY);
      return v === 'true';
    } catch (e) {
      return false;
    }
  };

  const getRole = () => {
    try {
      return localStorage.getItem(USER_ROLE_KEY) || '';
    } catch (e) {
      return '';
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(getInitial);
  const [role, setRole] = useState(getRole);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === IS_AUTH_KEY) setIsAuthenticated(e.newValue === 'true');
      if (e.key === USER_ROLE_KEY) setRole(e.newValue || '');
      if (e.key === ADMIN_AUTH_EXPIRY_KEY || e.key === ADMIN_AUTH_FLAG) {
        // force re-evaluate admin expiry effect by updating a dummy state via setRole (no-op if same)
        setRole((r) => r);
      }
      if (e.key === USERNAME_KEY || e.key === USERNAME_EXPIRY_KEY) {
        // nothing immediate to do here, other consumers should call getUsername()
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // manage automatic admin logout when admin expiry is reached
  useEffect(() => {
    let adminTimer = null;
    const schedule = () => {
      try {
        const adminExpiry = parseInt(localStorage.getItem(ADMIN_AUTH_EXPIRY_KEY) || '0', 10) || 0;
        // clear any existing
        if (adminTimer) {
          clearTimeout(adminTimer);
          adminTimer = null;
        }
        const msLeft = adminExpiry - Date.now();
        if (msLeft > 0) {
          adminTimer = setTimeout(() => {
            try {
              localStorage.removeItem(ADMIN_AUTH_FLAG);
              localStorage.removeItem(ADMIN_AUTH_EXPIRY_KEY);
              // redirect to admin login with expired flag
              try {
                window.location.replace('/admin-login?expired=1');
              } catch (err) {}
            } catch (e) {}
          }, msLeft);
        } else if (adminExpiry) {
          // already expired
          try {
            localStorage.removeItem(ADMIN_AUTH_FLAG);
            localStorage.removeItem(ADMIN_AUTH_EXPIRY_KEY);
            try {
              window.location.replace('/admin-login');
            } catch (err) {}
          } catch (e) {}
        }
      } catch (e) {
        // ignore
      }
    };

    // schedule on mount
    schedule();

    // also listen for changes to admin expiry in other tabs
    const onStorage = (e) => {
      if (e.key === ADMIN_AUTH_EXPIRY_KEY || e.key === ADMIN_AUTH_FLAG) schedule();
    };
    window.addEventListener('storage', onStorage);

    return () => {
      if (adminTimer) clearTimeout(adminTimer);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const setAuth = useCallback((isLoggedIn) => {
    try {
      if (isLoggedIn) {
        localStorage.setItem(IS_AUTH_KEY, 'true');
      } else {
        localStorage.setItem(IS_AUTH_KEY, 'false');
      }
    } catch (e) {}
    setIsAuthenticated(!!isLoggedIn);
  }, []);

  // helper to set username with optional TTL (ms). If ttlMs not provided, no expiry stored.
  const setUsername = useCallback((username, ttlMs) => {
    try {
      if (username === null || typeof username === 'undefined') {
        localStorage.removeItem(USERNAME_KEY);
        localStorage.removeItem(USERNAME_EXPIRY_KEY);
      } else {
        localStorage.setItem(USERNAME_KEY, String(username));
        if (typeof ttlMs === 'number' && ttlMs > 0) {
          localStorage.setItem(USERNAME_EXPIRY_KEY, String(Date.now() + ttlMs));
        } else {
          localStorage.removeItem(USERNAME_EXPIRY_KEY);
        }
      }
    } catch (e) {}
  }, []);

  const getUsername = useCallback(() => {
    try {
      const expiry = parseInt(localStorage.getItem(USERNAME_EXPIRY_KEY) || '0', 10) || 0;
      if (expiry && expiry <= Date.now()) {
        // expired
        try {
          localStorage.removeItem(USERNAME_KEY);
          localStorage.removeItem(USERNAME_EXPIRY_KEY);
        } catch (err) {}
        return null;
      }
      return localStorage.getItem(USERNAME_KEY) || null;
    } catch (e) {
      return null;
    }
  }, []);

  // helper to set admin logged state and expiry
  const setAdminLoggedIn = useCallback((flag) => {
    try {
      if (flag) {
        localStorage.setItem(ADMIN_AUTH_FLAG, 'true');
        localStorage.setItem(ADMIN_AUTH_EXPIRY_KEY, String(Date.now() + ADMIN_AUTH_EXPIRY_MS));
      } else {
        localStorage.removeItem(ADMIN_AUTH_FLAG);
        localStorage.removeItem(ADMIN_AUTH_EXPIRY_KEY);
      }
      // trigger storage listeners
      setRole((r) => r);
    } catch (e) {}
  }, []);

  const setUserRole = useCallback((userRole) => {
    try {
      localStorage.setItem(USER_ROLE_KEY, userRole);
    } catch (e) {}
    setRole(userRole);
  }, []);

  const logout = useCallback(() => {
    try {
      // clear auth and related keys
      localStorage.setItem(IS_AUTH_KEY, 'false');
      localStorage.removeItem(HOTEL_ID_KEY);
      localStorage.removeItem(USERNAME_KEY);
      localStorage.removeItem(USERNAME_EXPIRY_KEY);
      localStorage.removeItem(ADMIN_AUTH_FLAG);
      localStorage.removeItem(ADMIN_AUTH_EXPIRY_KEY);
      localStorage.removeItem(USER_ROLE_KEY);
    } catch (e) {}
    setIsAuthenticated(false);
    setRole('');
  }, []);

  return { isAuthenticated, setAuth, logout, role, setUserRole };
}

export function useHotelState() {
  const getInitialId = () => {
    try {
      return localStorage.getItem(HOTEL_ID_KEY) || '';
    } catch (e) {
      return '';
    }
  };

  const getInitialName = () => {
    try {
      return localStorage.getItem(HOTEL_NAME_KEY) || '';
    } catch (e) {
      return '';
    }
  };

  const [hotelId, setHotelIdState] = useState(getInitialId);
  const [hotelName, setHotelNameState] = useState(getInitialName);

  useEffect(() => {
    try {
      if (hotelId) localStorage.setItem(HOTEL_ID_KEY, hotelId);
      else localStorage.removeItem(HOTEL_ID_KEY);
    } catch (e) {}
  }, [hotelId]);

  useEffect(() => {
    try {
      if (hotelName) localStorage.setItem(HOTEL_NAME_KEY, hotelName);
      else localStorage.removeItem(HOTEL_NAME_KEY);
    } catch (e) {}
  }, [hotelName]);

  const setHotelId = useCallback((id) => {
    try {
      if (id === null || typeof id === 'undefined') {
        localStorage.removeItem(HOTEL_ID_KEY);
        setHotelIdState('');
        return;
      }
    } catch (e) {}
    setHotelIdState(id);
  }, []);

  const setHotelName = useCallback((name) => {
    try {
      if (name === null || typeof name === 'undefined') {
        localStorage.removeItem(HOTEL_NAME_KEY);
        setHotelNameState('');
        return;
      }
    } catch (e) {}
    setHotelNameState(name);
  }, []);

  return { hotelId, setHotelId, hotelName, setHotelName };
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthState();
  if (!isAuthenticated) return React.createElement(Navigate, { to: '/login', replace: true });
  return children;
}

export function AdminProtectedRoute({ children }) {
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('is_admin_logged_in') === 'true';
  const role = typeof window !== 'undefined' ? localStorage.getItem(USER_ROLE_KEY) : '';
  if (!isAdmin || role !== 'admin') return React.createElement(Navigate, { to: '/admin-login', replace: true });
  return children;
}

export function StaffProtectedRoute({ children }) {
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem(IS_AUTH_KEY) === 'true';
  const role = typeof window !== 'undefined' ? localStorage.getItem(USER_ROLE_KEY) : '';
  if (!isAuthenticated || role !== 'staff') return React.createElement(Navigate, { to: '/login', replace: true });
  return children;
}
