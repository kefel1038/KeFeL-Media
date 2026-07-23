export const colors = {
  brand: {
    primary: "#D32F2F",
    dark: "#B71C1C",
    light: "#E53935",
    50: "#FEF2F2",
    100: "#FEE2E2",
    200: "#FECACA",
    300: "#FCA5A5",
    400: "#F87171",
    500: "#EF4444",
    600: "#DC2626",
    700: "#B91C1C",
    800: "#991B1B",
    900: "#7F1D1D",
    950: "#450A0A",
  },
  accent: {
    politics: "#DC2626",
    business: "#7C3AED",
    tech: "#0891B2",
    engineering: "#D97706",
    science: "#059669",
    education: "#2563EB",
    sports: "#EA580C",
    entertainment: "#EC4899",
    africa: "#16A34A",
    uganda: "#CA8A04",
    world: "#4F46E5",
    opinion: "#6B7280",
    videos: "#E11D48",
    podcasts: "#8B5CF6",
    innovation: "#F59E0B",
    ai: "#6366F1",
  },
  neutral: {
    50: "#FAFAFA",
    100: "#F4F4F5",
    200: "#E4E4E7",
    300: "#D4D4D8",
    400: "#A1A1AA",
    500: "#71717A",
    600: "#52525B",
    700: "#3F3F46",
    800: "#27272A",
    900: "#18181B",
    950: "#09090B",
  },
  background: {
    light: "#FAFAFA",
    dark: "#0A0A0A",
    cardLight: "#FFFFFF",
    cardDark: "#18181B",
    elevated: "#1C1C1F",
  },
  text: {
    light: "#09090B",
    dark: "#FAFAFA",
    mutedLight: "#71717A",
    mutedDark: "#A1A1AA",
    secondary: "#71717A",
  },
} as const;

export const typography = {
  fontFamily: {
    sans: "var(--font-inter), system-ui, -apple-system, sans-serif",
    serif: "var(--font-playfair), Georgia, serif",
    headline: "var(--font-playfair), Georgia, serif",
    arabic: "var(--font-noto-naskh), 'Noto Naskh Arabic', Arial, sans-serif",
    mono: "'SF Mono', 'Fira Code', 'Fira Mono', Menlo, monospace",
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }],
    sm: ["0.875rem", { lineHeight: "1.25rem" }],
    base: ["1rem", { lineHeight: "1.5rem" }],
    lg: ["1.125rem", { lineHeight: "1.75rem" }],
    xl: ["1.25rem", { lineHeight: "1.75rem" }],
    "2xl": ["1.5rem", { lineHeight: "2rem" }],
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
    "5xl": ["3rem", { lineHeight: "1" }],
    "6xl": ["3.75rem", { lineHeight: "1" }],
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },
} as const;

export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  glow: "0 0 20px rgba(211, 47, 47, 0.3)",
} as const;

export const transitions = {
  fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  normal: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
  smooth: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "500ms cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export const borderRadius = {
  sm: "0.25rem",
  DEFAULT: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  "2xl": "2rem",
  full: "9999px",
} as const;

export const zIndex = {
  dropdown: "50",
  sticky: "100",
  overlay: "200",
  modal: "300",
  popover: "400",
  toast: "500",
  tooltip: "600",
} as const;
