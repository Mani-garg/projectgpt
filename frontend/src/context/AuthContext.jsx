import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [company, setCompany] = useState(() => {
    const saved = localStorage.getItem('company');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (companyData) => {
    setCompany(companyData);
    localStorage.setItem('company', JSON.stringify(companyData));
  };

  const logout = () => {
    setCompany(null);
    localStorage.removeItem('company');
  };

  const value = useMemo(() => ({ company, login, logout }), [company]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
