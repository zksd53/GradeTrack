import { createContext } from "react";

export const themes = {
  light: {
    background: "#F5F6FB",
    card: "#FFFFFF",
    cardAlt: "#F1F5F9",
    text: "#0F172A",
    muted: "#64748B",
    accent: "#5B3FE4",
    border: "#E2E8F0",
    danger: "#EF4444",
    dangerBg: "#FEE2E2",
    navBg: "#FFFFFF",
    navBorder: "#E2E8F0",
    navText: "#64748B",
    navActive: "#5B3FE4",
  },
  dark: {
    background: "#0B1020",
    card: "#141B2D",
    cardAlt: "#1E2538",
    text: "#E5E7EB",
    muted: "#94A3B8",
    accent: "#8B7CFF",
    border: "#1F2937",
    danger: "#F87171",
    dangerBg: "#2A1416",
    navBg: "#0B1020",
    navBorder: "#1F2937",
    navText: "#94A3B8",
    navActive: "#8B7CFF",
  },
};

export const ThemeContext = createContext({
  darkMode: false,
  setDarkMode: () => {},
  theme: themes.light,
});
