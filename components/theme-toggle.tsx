"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR / première hydration : bouton vide identique côté serveur et client
  if (!mounted) {
    return (
      <button
        className="inline-flex items-center justify-center h-9 w-9
                   rounded-md border border-input bg-background
                   hover:bg-accent hover:text-accent-foreground"
        aria-label="Toggle theme"
        disabled
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground transition hover:bg-accent"
      aria-label="Basculer le theme"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {isDark ? "Mode jour" : "Mode nuit"}
    </button>
  );
}
