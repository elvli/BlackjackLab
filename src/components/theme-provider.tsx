"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = Exclude<Theme, "system">;

type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: "class" | `data-${string}`;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  enableColorScheme?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
};

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
  systemTheme: ResolvedTheme;
};

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
);

const MEDIA_QUERY = "(prefers-color-scheme: dark)";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
}

function getStoredTheme(storageKey: string, fallbackTheme: Theme): Theme {
  if (typeof window === "undefined") {
    return fallbackTheme;
  }

  try {
    const storedTheme = window.localStorage.getItem(storageKey);
    if (
      storedTheme === "light" ||
      storedTheme === "dark" ||
      storedTheme === "system"
    ) {
      return storedTheme;
    }
  } catch {
    return fallbackTheme;
  }

  return fallbackTheme;
}

function applyTheme(options: {
  attribute: ThemeProviderProps["attribute"];
  enableColorScheme: boolean;
  resolvedTheme: ResolvedTheme;
  disableTransitionOnChange: boolean;
}) {
  const {
    attribute = "class",
    enableColorScheme,
    resolvedTheme,
    disableTransitionOnChange,
  } = options;
  const root = document.documentElement;
  let cleanup = () => undefined;

  if (disableTransitionOnChange) {
    const style = document.createElement("style");
    style.textContent =
      "*,*::before,*::after{transition:none!important}";
    document.head.appendChild(style);
    cleanup = () => {
      window.getComputedStyle(document.body);
      window.setTimeout(() => {
        document.head.removeChild(style);
      }, 1);
    };
  }

  if (attribute === "class") {
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  } else {
    root.setAttribute(attribute, resolvedTheme);
  }

  if (enableColorScheme) {
    root.style.colorScheme = resolvedTheme;
  }

  cleanup();
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  enableColorScheme = true,
  disableTransitionOnChange = false,
  storageKey = "theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() =>
    getStoredTheme(storageKey, defaultTheme)
  );
  const [systemTheme, setSystemTheme] = React.useState<ResolvedTheme>(
    getSystemTheme
  );

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(MEDIA_QUERY);
    const updateSystemTheme = () => setSystemTheme(getSystemTheme());

    updateSystemTheme();
    mediaQuery.addEventListener("change", updateSystemTheme);

    return () => mediaQuery.removeEventListener("change", updateSystemTheme);
  }, []);

  React.useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) {
        return;
      }

      setThemeState(getStoredTheme(storageKey, defaultTheme));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [defaultTheme, storageKey]);

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      setThemeState(nextTheme);

      try {
        window.localStorage.setItem(storageKey, nextTheme);
      } catch {}
    },
    [storageKey]
  );

  const resolvedTheme =
    theme === "system" && enableSystem ? systemTheme : (theme as ResolvedTheme);

  React.useEffect(() => {
    applyTheme({
      attribute,
      enableColorScheme,
      resolvedTheme,
      disableTransitionOnChange,
    });
  }, [attribute, disableTransitionOnChange, enableColorScheme, resolvedTheme]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      systemTheme,
    }),
    [resolvedTheme, setTheme, systemTheme, theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
