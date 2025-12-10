export const EMBED_CONFIG = {
  WIDGET_URL: import.meta.env.VITE_WIDGET_URL || "http://localhost:3000",
  DEFAULT_POSITION: "bottom-right" as const,
  // Primary color from globals.css: oklch(0.7357 0.1641 34.7091) ≈ #e07744
  PRIMARY_COLOR: "#e07744",
  PRIMARY_COLOR_SHADOW: "rgba(224, 119, 68, 0.35)",
};
