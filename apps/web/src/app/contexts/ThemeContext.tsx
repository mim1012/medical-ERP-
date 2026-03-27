import { createContext, useContext, useState, ReactNode } from 'react';
import { DesignTheme, themes } from '../components/ThemeSelector';

interface ThemeContextType {
  currentTheme: DesignTheme;
  setTheme: (theme: DesignTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<DesignTheme>(themes[0]); // Default: Medical Navy

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme: setCurrentTheme }}>
      <div
        style={{
          '--color-primary': currentTheme.primary,
          '--color-secondary': currentTheme.secondary,
          '--color-accent': currentTheme.accent,
          '--color-background': currentTheme.background,
          '--color-surface': currentTheme.surface,
          '--color-text': currentTheme.text,
          '--color-border': currentTheme.border,
          '--color-sidebar': currentTheme.sidebar,
          '--color-sidebar-text': currentTheme.sidebarText,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
