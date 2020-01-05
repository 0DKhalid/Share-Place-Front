import { createContext } from 'react';

export const AuthContext = createContext({
  userId: null,
  isLogin: false,
  token: null,
  login: () => {},
  logout: () => {}
});
