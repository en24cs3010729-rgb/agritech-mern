import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeSetting, setThemeSetting] = useState(() => {
    return localStorage.getItem('agritech_theme') || 'auto';
  });

  const [activeTheme, setActiveTheme] = useState('light');

  useEffect(() => {
    localStorage.setItem('agritech_theme', themeSetting);

    const updateResolvedTheme = () => {
      let resolved = themeSetting;
      if (themeSetting === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        resolved = prefersDark ? 'dark' : 'light';
      }
      setActiveTheme(resolved);
      document.documentElement.setAttribute('data-bs-theme', resolved);
      document.documentElement.setAttribute('data-theme', resolved);
    };

    updateResolvedTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (themeSetting === 'auto') {
        updateResolvedTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [themeSetting]);

  return (
    <ThemeContext.Provider value={{ themeSetting, setThemeSetting, activeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
