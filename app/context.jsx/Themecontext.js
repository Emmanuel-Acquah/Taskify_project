import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(null);

  const value = {
    currentTheme,
    setCurrentTheme,
    getTextColor: () => {
      if (!currentTheme) return "#111827";
      if (currentTheme.type === "color") {
        const isDark = [
          "#6366F1",
          "#8B5CF6",
          "#EC4899",
          "#EF4444",
          "#6B7280",
        ].includes(currentTheme.color);
        return isDark ? "#FFFFFF" : "#111827";
      }
      return "#FFFFFF";
    },
    getSecondaryTextColor: () => {
      if (!currentTheme) return "#6B7280";
      if (currentTheme.type === "color") {
        const isDark = [
          "#6366F1",
          "#8B5CF6",
          "#EC4899",
          "#EF4444",
          "#6B7280",
        ].includes(currentTheme.color);
        return isDark ? "#E5E7EB" : "#6B7280";
      }
      return "#E5E7EB";
    },
    getBackgroundStyle: () => {
      if (!currentTheme) return { backgroundColor: "white" };
      if (currentTheme.type === "color")
        return { backgroundColor: currentTheme.color };
      return {};
    },
    getOverlayStyle: () => {
      if (currentTheme?.type === "photo") {
        return { backgroundColor: "rgba(0, 0, 0, 0.3)", flex: 1 };
      }
      return { flex: 1 };
    },
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
