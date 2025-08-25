import { useState, useEffect, useContext, createContext } from 'react';
import api from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/profile')
        .then((response) => setUser(response.data))
        .catch(() => setUser(null))
        .finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    const userData = await api.get('/auth/profile');
    setUser(userData.data);
    setReady(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setReady(true);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
