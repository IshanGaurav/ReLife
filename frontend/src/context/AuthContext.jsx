import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('relife_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('relife_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('relife_user');
    }
  }, [user]);

  const login = (email, password, role = 'user') => {
    // Mock login logic
    if (email && password) {
      setUser({
        name: email.split('@')[0].split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' '),
        email: email,
        role: role,
        memberSince: 'June 2026',
        badge: 'Silver Circular Citizen',
        credits: 1250,
        recycled: 14,
        co2: '52kg',
        avatar: `https://ui-avatars.com/api/?name=${email}&background=16a34a&color=fff`,
        city: 'Patna',
        state: 'Bihar'
      });
      return true;
    }
    return false;
  };

  const signup = (name, email, password) => {
    if (name && email && password) {
      setUser({
        name: name,
        email: email,
        memberSince: 'Today',
        badge: 'Green Starter',
        credits: 100, // Sign up bonus
        recycled: 0,
        co2: '0kg',
        avatar: `https://ui-avatars.com/api/?name=${name}&background=16a34a&color=fff`,
        city: 'Patna',
        state: 'Bihar'
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
