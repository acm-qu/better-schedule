// Tabler-style stroke icons, inlined per the design (stroke 2, round caps).

const Svg = ({ size, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {children}
  </svg>
)

export const MoonIcon = ({ size = 15 }) => (
  <Svg size={size}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></Svg>
)

export const SunIcon = ({ size = 15 }) => (
  <Svg size={size}>
    <circle cx="12" cy="12" r="4" />
    <path d="M3 12h1M12 3v1M20 12h1M12 20v1M5.6 5.6l0.7 0.7M17.7 5.6l-0.7 0.7M17.7 18.4l0.7 0.7M5.6 18.4l0.7 0.7" />
  </Svg>
)

export const LabIcon = ({ size = 13 }) => (
  <Svg size={size}><path d="M9 3h6M10 3v6l-4.6 8.6a2 2 0 0 0 1.8 2.9h9.6a2 2 0 0 0 1.8-2.9L14 9V3M6.5 15h11" /></Svg>
)

export const LectureIcon = ({ size = 13 }) => (
  <Svg size={size}><path d="M3 4h18M4 4v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4M12 16v4M9 20h6" /></Svg>
)
