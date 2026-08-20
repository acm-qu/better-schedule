import type { IFontStyle, IPreset, ITheme } from "./types";

// Light/dark palettes for the page chrome and the exported sheet.
export const THEMES: Record<"light" | "dark", ITheme> = {
  light: { pageBg: "#fbfafb", ink: "#010000", body: "#373637", muted: "#706d70", hair: "#e4e2e4", inputBg: "#ffffff", popBg: "#ffffff", navBg: "#fbfafb", sheetBg: "#fbfafb", sheetInk: "#010000", sheetMuted: "#706d70", hairFaint: "#dcdadc", edge: "#010000" },
  dark: { pageBg: "#010000", ink: "#fbfafb", body: "#c9c6c9", muted: "#8f8c8f", hair: "#2c2b2c", inputBg: "#0c0c0c", popBg: "#0c0c0c", navBg: "#010000", sheetBg: "#0a0a0a", sheetInk: "#fbfafb", sheetMuted: "#8f8c8f", hairFaint: "#2c2b2c", edge: "#373637" }
};

// College presets: 5 class-block colors + the accent used for shadows,
// dashed breaks and dropdown highlights.
export const PRESETS: Record<string, IPreset> = {
  "ACM QU": { colors: ["#227f74", "#2fbbab", "#42a7ae", "#373637", "#155e56"], accent: "#2fbbab" },
  "Engineering": { colors: ["#8e4f18", "#b8661f", "#6e3c10", "#8e7e18", "#343a40"], accent: "#b8661f" },
  "Business & Economics": { colors: ["#6d071a", "#8e1837", "#4a0512", "#8e1853", "#343a40"], accent: "#8e1837" },
  "Arts & Sciences": { colors: ["#184f8e", "#1f66b8", "#12395f", "#1a6f8e", "#343a40"], accent: "#1f66b8" },
  "Law": { colors: ["#212529", "#495057", "#6c757d", "#8e1837", "#343a40"], accent: "#6c757d" },
  "Education": { colors: ["#0e7490", "#0891b2", "#155e75", "#0aa2c0", "#343a40"], accent: "#0891b2" },
  "Health & Medicine": { colors: ["#4d7c0f", "#65a30d", "#3f6212", "#83a615", "#343a40"], accent: "#65a30d" },
  "Sharia": { colors: ["#146c43", "#0a3622", "#8e7e18", "#495057", "#343a40"], accent: "#146c43" },
  // Sharia's greens with the hue nudged toward cyan; the rest of the ramp matches.
  "Sports": { colors: ["#146c5d", "#0a362f", "#8e7e18", "#495057", "#343a40"], accent: "#146c5d" }
};

// Which buildings belong to which college, so a class picks up its college's
// colour from the text alone. Codes are what the schedule prints before the
// building name ("H07- College of Engineering B201").
export const COLLEGE_BUILDINGS: Record<string, readonly string[]> = {
  "Engineering": ["H07"],
  "Arts & Sciences": ["BCR", "C01"],
  "Business & Economics": ["H08"],
  "Law": ["I09"],
  "Education": ["I10"],
  // Health & Pharmacy (I06) and Medicine & Dental Medicine (H12) share a preset.
  "Health & Medicine": ["I06", "H12"],
  "Sharia": ["B05", "C11"],
  "Sports": ["A07"]
};

// Extra recolor swatches offered on every preset (deduped against it).
export const UNIVERSAL_SWATCHES: readonly string[] = ["#343a40", "#8e1837", "#b81f47", "#8e1853", "#b81fae", "#5b188e", "#184f8e", "#1f66b8", "#188e8a", "#188e28", "#8e7e18", "#8e4f18"];

export const FONT_STYLES: readonly IFontStyle[] = [
  { key: "ACM", fonts: [{ label: "Lexend", fam: "'Lexend', sans-serif" }, { label: "Poppins", fam: "'Poppins', sans-serif", plus: true }] },
  { key: "University", fonts: [{ label: "Helvetica Neue", fam: "'Helvetica Neue', sans-serif" }] },
  { key: "Code", fonts: [{ label: "JetBrains Mono", fam: "'JetBrains Mono', monospace" }] }
];

// Gaps of at least this many minutes between classes render as break blocks.
export const BREAK_MIN_GAP = 15;
