"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeContextState {
  theme: "dark";
  setTheme: (theme: "dark") => void;
}

const ThemeContext = createContext<ThemeContextState>({
  theme: "dark",
  setTheme: () => null,
});

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
  }, []);

  const setTheme = () => {
    // Always dark - no-op
  };

  return (
    <ThemeContext.Provider value={{ theme: "dark", setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
