import { useEffect } from "react";
import type { ReactNode } from "react";
import { ThemeContext } from "./ThemeContext.ts";
import type { Theme } from "../types.ts";
import { useLocalStorage } from "../hooks/useLocalStorage.ts";


function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>('trombi.theme', "clair");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "clair" ? "sombre" : "clair"));

  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>;
}

export default ThemeProvider;
