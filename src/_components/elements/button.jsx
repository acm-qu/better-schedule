import { useState } from 'react'

// Pill button ported from the ACM QU design system (components/core/Button.jsx).
const BASE = {
  display: "inline-block",
  boxSizing: "border-box",
  cursor: "pointer",
  textAlign: "center",
  textDecoration: "none",
  border: "none",
  borderRadius: "9999px",
  fontFamily: "var(--paragraph)",
  transition: "background-color 0.2s ease, color 0.2s ease"
}

const VARIANTS = {
  solid: { background: "var(--gray)", color: "#ffffff", fontWeight: 600 },
  accent: { background: "var(--primary)", color: "var(--gray)", fontWeight: 600 },
  outline: { background: "transparent", color: "var(--primary-dark)", fontWeight: 400, border: "2px solid var(--primary-dark)" }
}

const SIZES = {
  md: { padding: "8px 32px", fontSize: "16px" },
  sm: { padding: "5px 24px", fontSize: "16px" }
}

const Button = ({ variant = "accent", size = "md", disabled = false, onClick, style, children }) => {
  const [hover, setHover] = useState(false)

  const v = VARIANTS[variant] || VARIANTS.accent
  const composed = {
    ...BASE,
    ...v,
    ...(SIZES[size] || SIZES.md),
    ...(hover && variant === "accent" && !disabled ? { background: "var(--primary-dark)" } : null),
    ...(disabled ? { opacity: 0.5, cursor: "not-allowed", pointerEvents: "none" } : null),
    ...style
  }

  return (
    <button
      type="button"
      disabled={disabled}
      style={composed}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </button>
  )
}

export default Button
