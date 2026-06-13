import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUserApi, registerUserApi, getMeApi } from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('relife_jwt');
    if (token) {
      getMeApi()
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('relife_jwt');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, role) => {
    try {
      const data = await loginUserApi(email, password, role);
      localStorage.setItem('relife_jwt', data.token);
      setUser(data);
      return { success: true, role: data.role };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message || 'Login failed' };
    }
  };

  const signup = async (name, email, password, role) => {
    try {
      const data = await registerUserApi(name, email, password, role);
      localStorage.setItem('relife_jwt', data.token);
      setUser(data);
      return { success: true, role: data.role };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('relife_jwt');
    setUser(null);
  };

  const updateUser = (newUserData) => {
    setUser(prev => ({ ...prev, ...newUserData }));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
