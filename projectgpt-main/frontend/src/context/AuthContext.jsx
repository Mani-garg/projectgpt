import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [company, setCompany] = useState(() => {
    const saved = localStorage.getItem('company');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = (companyData, authToken) => {
    setCompany(companyData);
    setToken(authToken);
    localStorage.setItem('company', JSON.stringify(companyData));
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setCompany(null);
    setToken(null);
    localStorage.removeItem('company');
    localStorage.removeItem('token');
  };

  const value = useMemo(() => ({ company, token, login, logout }), [company, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
