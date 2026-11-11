import { createContext, useContext } from "react";
import type { Theme } from "../types.ts";

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useTheme doit être utilisé dans un ThemeProvider");
  return context;
}
