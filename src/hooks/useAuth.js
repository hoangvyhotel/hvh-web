import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';

const IS_AUTH_KEY = 'is_logged_in';
const USER_ROLE_KEY = 'user_role'; // 'admin' hoặc 'staff'
const HOTEL_ID_KEY = 'hotel_id';
// admin-specific expiry (3 hours)
const ADMIN_AUTH_EXPIRY_KEY = 'admin_auth_expiry';
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
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // schedule automatic admin logout when admin expiry is reached
  useEffect(() => {
    let adminTimer = null;
    try {
      const adminExpiry = parseInt(localStorage.getItem(ADMIN_AUTH_EXPIRY_KEY) || '0', 10) || 0;
      const msLeft = adminExpiry - Date.now();
      if (msLeft > 0) {
        adminTimer = setTimeout(() => {
          try {
            localStorage.removeItem('is_admin_logged_in');
            localStorage.removeItem(ADMIN_AUTH_EXPIRY_KEY);
            // redirect to admin login with expired flag
            try {
              window.location.replace('/hoangvy/admin-login?expired=1');
            } catch (err) {}
          } catch (e) {}
        }, msLeft);
      } else if (adminExpiry) {
        // already expired
        try {
          localStorage.removeItem('is_admin_logged_in');
          localStorage.removeItem(ADMIN_AUTH_EXPIRY_KEY);
          try {
            window.location.replace('/hoangvy/admin-login');
          } catch (err) {}
        } catch (e) {}
      }
    } catch (e) {
      // ignore
    }
    return () => {
      if (adminTimer) clearTimeout(adminTimer);
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
      localStorage.removeItem('username');
      localStorage.removeItem('is_admin_logged_in');
      localStorage.removeItem(ADMIN_AUTH_EXPIRY_KEY);
      localStorage.removeItem(USER_ROLE_KEY);
    } catch (e) {}
    setIsAuthenticated(false);
    setRole('');
  }, []);

  return { isAuthenticated, setAuth, logout, role, setUserRole };
}

export function useHotelState() {
  const getInitial = () => {
    try {
      return localStorage.getItem(HOTEL_ID_KEY) || '';
    } catch (e) {
      return '';
    }
  };

  const [hotelId, setHotelIdState] = useState(getInitial);

  useEffect(() => {
    try {
      if (hotelId) localStorage.setItem(HOTEL_ID_KEY, hotelId);
      else localStorage.removeItem(HOTEL_ID_KEY);
    } catch (e) {}
  }, [hotelId]);

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

  return { hotelId, setHotelId };
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
