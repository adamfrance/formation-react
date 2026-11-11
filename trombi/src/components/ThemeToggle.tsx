import { useTheme } from "../contexts/ThemeContext.ts";
import type { Theme } from "../types.ts";

// Le bouton jour / nuit : l'état « theme » décide de l'icône affichée
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const next: Theme = theme === "clair" ? "sombre" : "clair"; // le thème proposé par le bouton

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme} 
      aria-label={`Passer au thème ${next}`}
    >
      {theme === "clair" ? "🌙" : "☀️"}
    </button>
  );
}

export default ThemeToggle;
