import React, { createContext, useContext, useState, useEffect } from 'react';

const ModeContext = createContext();

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('amazon_relife_mode');
    return savedMode === 'relife' ? 'relife' : 'shopping';
  });

  useEffect(() => {
    localStorage.setItem('amazon_relife_mode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'shopping' ? 'relife' : 'shopping'));
  };

  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
