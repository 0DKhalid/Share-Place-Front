import { useState, useEffect, useCallback } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpDate, setTokenExpDate] = useState();
  const [userId, setUserId] = useState('');

  const login = useCallback((userId, token, exp) => {
    setUserId(userId);
    setToken(token);
    const tokenExDate = exp || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpDate(tokenExDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({ userId, token, expiration: tokenExDate.toISOString() })
    );
  }, []);
  const logout = useCallback(userId => {
    setUserId(userId);
    setTokenExpDate(null);
    setToken(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpDate) {
      const remaningTime = tokenExpDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remaningTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, tokenExpDate, logout]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));

    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return { token, login, logout, userId };
};
