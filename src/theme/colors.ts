export const Colors = {
  yellow: "#FFCC00",
  cream: "#FDF4CF",
  creamLight: "#FFFBE8",
  white: "#FFFFFF",
  black: "#000000",
  dark: "#212121",
  muted: "#424242",
  softMuted: "#70706F",
  red: "#FF3B30",
  panel: "#FAFAFA",
} as const;

export type ColorKey = (typeof Colors)[keyof typeof Colors];
