// Rotated-square motif from the ACM QU design system (components/core/Diamond.jsx).
const Diamond = ({ size = 10, color = "var(--black)", style }) => (
  <span style={{ width: size, height: size, background: color, transform: "rotate(45deg)", flexShrink: 0, display: "inline-block", ...style }} />
)

export default Diamond
