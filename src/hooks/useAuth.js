import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';

const ACCESS_TOKEN_KEY = 'access_token';
const HOTEL_ID_KEY = 'hotel_id';

export function useAuthState() {
  const getInitial = () => {
    try {
      return !!localStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (e) {
      return false;
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(getInitial);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === ACCESS_TOKEN_KEY) setIsAuthenticated(!!e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setAuth = useCallback((token) => {
    if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token);
    else localStorage.removeItem(ACCESS_TOKEN_KEY);
    setIsAuthenticated(!!token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem('refresh_token');
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

  const setHotelId = useCallback((id) => setHotelIdState(id), []);

  return { hotelId, setHotelId };
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthState();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
