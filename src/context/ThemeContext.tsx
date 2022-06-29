import React from 'react';
import { createContext, useState } from 'react';

export const ThemeContext = createContext<any>({ theme: 'light', undefined });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState('light');
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
