/**
 * Theme Configuration
 * Defines available color themes for the application
 */

export type ColorTheme =
  | "default"
  | "purple"
  | "blue"
  | "green"
  | "orange"
  | "rose"
  | "cyan";

export interface ThemeConfig {
  name: string;
  label: string;
  description: string;
  colors: {
    primary: string;
    primaryForeground: string;
    accent: string;
    accentForeground: string;
  };
  preview: string; // Color for preview circle
}

export const THEME_CONFIGS: Record<ColorTheme, ThemeConfig> = {
  default: {
    name: "default",
    label: "Default",
    description: "Classic neutral theme",
    colors: {
      primary: "oklch(0.205 0 0)",
      primaryForeground: "oklch(0.985 0 0)",
      accent: "oklch(0.97 0 0)",
      accentForeground: "oklch(0.205 0 0)",
    },
    preview: "#333333",
  },
  purple: {
    name: "purple",
    label: "Purple",
    description: "Vibrant purple vibes",
    colors: {
      primary: "oklch(0.55 0.25 290)",
      primaryForeground: "oklch(0.985 0 0)",
      accent: "oklch(0.95 0.05 290)",
      accentForeground: "oklch(0.3 0.15 290)",
    },
    preview: "#a855f7",
  },
  blue: {
    name: "blue",
    label: "Ocean Blue",
    description: "Cool ocean breeze",
    colors: {
      primary: "oklch(0.55 0.22 240)",
      primaryForeground: "oklch(0.985 0 0)",
      accent: "oklch(0.95 0.05 240)",
      accentForeground: "oklch(0.3 0.15 240)",
    },
    preview: "#3b82f6",
  },
  green: {
    name: "green",
    label: "Forest Green",
    description: "Natural and fresh",
    colors: {
      primary: "oklch(0.55 0.20 150)",
      primaryForeground: "oklch(0.985 0 0)",
      accent: "oklch(0.95 0.05 150)",
      accentForeground: "oklch(0.3 0.15 150)",
    },
    preview: "#10b981",
  },
  orange: {
    name: "orange",
    label: "Sunset Orange",
    description: "Warm and energetic",
    colors: {
      primary: "oklch(0.60 0.22 40)",
      primaryForeground: "oklch(0.985 0 0)",
      accent: "oklch(0.95 0.05 40)",
      accentForeground: "oklch(0.3 0.15 40)",
    },
    preview: "#f97316",
  },
  rose: {
    name: "rose",
    label: "Rose Pink",
    description: "Soft and romantic",
    colors: {
      primary: "oklch(0.58 0.24 10)",
      primaryForeground: "oklch(0.985 0 0)",
      accent: "oklch(0.95 0.05 10)",
      accentForeground: "oklch(0.3 0.15 10)",
    },
    preview: "#f43f5e",
  },
  cyan: {
    name: "cyan",
    label: "Electric Cyan",
    description: "Modern and techy",
    colors: {
      primary: "oklch(0.60 0.20 200)",
      primaryForeground: "oklch(0.985 0 0)",
      accent: "oklch(0.95 0.05 200)",
      accentForeground: "oklch(0.3 0.15 200)",
    },
    preview: "#06b6d4",
  },
};

export const THEME_STORAGE_KEY = "music-app-color-theme";

export function getThemeColors(theme: ColorTheme): ThemeConfig["colors"] {
  return THEME_CONFIGS[theme]?.colors || THEME_CONFIGS.default.colors;
}
