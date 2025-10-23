"use client";

import { useEffect, useState } from "react";
import { ColorTheme, THEME_STORAGE_KEY, getThemeColors } from "@/lib/themes";

/**
 * Custom hook to manage color theme
 * Applies CSS variables to the root element for theming
 */
export function useColorTheme() {
  const [colorTheme, setColorTheme] = useState<ColorTheme>("purple");
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ColorTheme;
    if (saved) {
      setColorTheme(saved);
      applyTheme(saved);
    } else {
      // Default to purple for music app
      applyTheme("purple");
    }
  }, []);

  const applyTheme = (theme: ColorTheme) => {
    const colors = getThemeColors(theme);
    const root = document.documentElement;

    // Apply CSS variables
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--primary-foreground", colors.primaryForeground);
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--accent-foreground", colors.accentForeground);

    // Add data attribute for CSS targeting
    root.setAttribute("data-color-theme", theme);
  };

  const changeTheme = (theme: ColorTheme) => {
    setColorTheme(theme);
    applyTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  };

  return {
    colorTheme,
    setColorTheme: changeTheme,
    mounted,
  };
}
