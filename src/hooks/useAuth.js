import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';

const IS_AUTH_KEY = 'is_logged_in';
const HOTEL_ID_KEY = 'hotel_id';
const AUTH_EXPIRY_KEY = 'auth_expiry';
const AUTH_EXPIRY_MS = 5 * 60 * 60 * 1000; // 5 hours

export function useAuthState() {
  const getInitial = () => {
    try {
      // if expiry set and passed, clear auth/hotel and return false
      const expiry = parseInt(localStorage.getItem(AUTH_EXPIRY_KEY) || '0', 10) || 0;
      if (expiry && Date.now() > expiry) {
        try {
          localStorage.setItem(IS_AUTH_KEY, 'false');
          localStorage.removeItem(HOTEL_ID_KEY);
          localStorage.removeItem('username');
          localStorage.removeItem('is_admin_logged_in');
          localStorage.removeItem(AUTH_EXPIRY_KEY);
        } catch (e) {}
        return false;
      }
      const v = localStorage.getItem(IS_AUTH_KEY);
      return v === 'true';
    } catch (e) {
      return false;
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(getInitial);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === IS_AUTH_KEY) setIsAuthenticated(e.newValue === 'true');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // schedule automatic logout when auth expiry is reached
  useEffect(() => {
    let timer = null;
    if (isAuthenticated) {
      try {
        const expiry = parseInt(localStorage.getItem(AUTH_EXPIRY_KEY) || '0', 10) || 0;
        const msLeft = expiry - Date.now();
        if (msLeft > 0) {
          timer = setTimeout(() => {
            try {
              localStorage.setItem(IS_AUTH_KEY, 'false');
              localStorage.removeItem(HOTEL_ID_KEY);
              localStorage.removeItem('username');
              localStorage.removeItem('is_admin_logged_in');
              localStorage.removeItem(AUTH_EXPIRY_KEY);
            } catch (e) {}
            setIsAuthenticated(false);
          }, msLeft);
        } else {
          // already expired
          try {
            localStorage.setItem(IS_AUTH_KEY, 'false');
            localStorage.removeItem(HOTEL_ID_KEY);
            localStorage.removeItem('username');
            localStorage.removeItem('is_admin_logged_in');
            localStorage.removeItem(AUTH_EXPIRY_KEY);
          } catch (e) {}
          setIsAuthenticated(false);
        }
      } catch (e) {
        // ignore
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAuthenticated]);

  const setAuth = useCallback((isLoggedIn) => {
    try {
      if (isLoggedIn) {
        localStorage.setItem(IS_AUTH_KEY, 'true');
        // set expiry
        localStorage.setItem(AUTH_EXPIRY_KEY, String(Date.now() + AUTH_EXPIRY_MS));
      } else {
        localStorage.setItem(IS_AUTH_KEY, 'false');
        localStorage.removeItem(AUTH_EXPIRY_KEY);
      }
    } catch (e) {}
    setIsAuthenticated(!!isLoggedIn);
  }, []);

  const logout = useCallback(() => {
    try {
  // clear auth and related keys
  localStorage.setItem(IS_AUTH_KEY, 'false');
  localStorage.removeItem(HOTEL_ID_KEY);
  localStorage.removeItem('username');
  localStorage.removeItem('is_admin_logged_in');
  localStorage.removeItem(AUTH_EXPIRY_KEY);
    } catch (e) {}
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, setAuth, logout };
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
  if (!isAdmin) return React.createElement(Navigate, { to: '/admin-login', replace: true });
  return children;
}
