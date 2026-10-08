import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('fireguard_token') || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('fireguard_user');
      if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
        const parsed = JSON.parse(savedUser);
        if (parsed && (parsed.role === 'Admin' || parsed.role === 'Organization' || parsed.role === 'Technician')) {
          return parsed;
        }
      }
      localStorage.removeItem('fireguard_user');
      localStorage.removeItem('fireguard_token');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password, role) => {
    const res = await api.post('/auth/login', { email, password, role });
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('fireguard_token', receivedToken);
    localStorage.setItem('fireguard_user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const registerOrganization = async (formData) => {
    const res = await api.post('/auth/register/organization', formData);
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('fireguard_token', receivedToken);
    localStorage.setItem('fireguard_user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const registerTechnician = async (formData) => {
    const res = await api.post('/auth/register/technician', formData);
    const { token: receivedToken, user: receivedUser } = res.data;
    localStorage.setItem('fireguard_token', receivedToken);
    localStorage.setItem('fireguard_user', JSON.stringify(receivedUser));
    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const updateProfile = async (formData) => {
    const res = await api.put('/auth/profile', formData);
    const { token: receivedToken, user: receivedUser } = res.data;
    if (receivedToken) {
      localStorage.setItem('fireguard_token', receivedToken);
      setToken(receivedToken);
    }
    if (receivedUser) {
      localStorage.setItem('fireguard_user', JSON.stringify(receivedUser));
      setUser(receivedUser);
    }
    return receivedUser;
  };

  const deleteAccount = async () => {
    await api.delete('/auth/profile');
    logout();
  };

  const logout = () => {
    localStorage.removeItem('fireguard_token');
    localStorage.removeItem('fireguard_user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        registerOrganization,
        registerTechnician,
        updateProfile,
        deleteAccount,
        logout,
        isAuthenticated: !!token && !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
