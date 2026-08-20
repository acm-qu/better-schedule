import { useEffect, useRef, useState } from 'react'
import { FONT_STYLES } from '../../app/content'
import classes from '../../app/styles.module.css'
import Diamond from './diamond'

const FontNames = ({ fonts }) => (
  <span style={{ display: "flex", gap: 6, alignItems: "baseline", flex: 1, minWidth: 0, overflow: "hidden" }}>
    {fonts.map(f => (
      <span key={f.label} style={{ display: "contents" }}>
        {f.plus && <span style={{ color: "var(--muted)", fontSize: 12 }}>+</span>}
        <span style={{ fontFamily: f.fam, fontSize: 13, color: "var(--body)", whiteSpace: "nowrap" }}>{f.label}</span>
      </span>
    ))}
  </span>
)

// Custom dropdown for the sheet's text style. The exit animation plays before
// the menu unmounts (~200ms timer).
const FontMenu = ({ font, accent, ink, onPick }) => {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const timer = useRef()

  useEffect(() => () => clearTimeout(timer.current), [])

  const close = () => {
    setClosing(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => { setOpen(false); setClosing(false) }, 200)
  }

  const toggle = () => {
    if (open && !closing) close()
    else { clearTimeout(timer.current); setOpen(true); setClosing(false) }
  }

  const current = FONT_STYLES.find(f => f.key === font) || FONT_STYLES[0]

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={toggle}
        style={{
          cursor: "pointer", display: "flex", alignItems: "center", gap: 10, width: "100%",
          padding: "9px 12px", border: "1px solid var(--hair)", background: "var(--inputbg)"
        }}
      >
        <span style={{ fontWeight: 500, color: accent, fontSize: 14, fontFamily: "var(--title)" }}>{current.key}</span>
        <span style={{ width: 1, height: 16, background: "var(--hair)", flexShrink: 0 }} />
        <FontNames fonts={current.fonts} />
        <Diamond size={6} color={accent} />
      </button>
      {open && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: "calc(100% + 6px)",
          background: "var(--popbg)", border: "1px solid var(--hair)", zIndex: 30,
          boxShadow: `4px 4px 0 0 ${accent}`,
          animation: closing ? "bs-menu-out 0.22s cubic-bezier(0,.8,.2,1) forwards" : "bs-menu-in 0.3s cubic-bezier(0,.8,.2,1)"
        }}>
          {FONT_STYLES.map((f, i) => (
            <button
              key={f.key}
              type="button"
              className={classes.fontRow}
              onClick={() => { onPick(f.key); close() }}
              style={{
                cursor: "pointer", display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "10px 12px", background: "none",
                border: "none", borderBottom: i < FONT_STYLES.length - 1 ? "1px solid var(--hair)" : "none"
              }}
            >
              <span style={{ fontWeight: 500, color: f.key === font ? accent : ink, fontSize: 14, fontFamily: "var(--title)", width: 78, flexShrink: 0, textAlign: "left" }}>{f.key}</span>
              <span style={{ width: 1, height: 16, background: "var(--hair)", flexShrink: 0 }} />
              <FontNames fonts={f.fonts} />
              {f.key === font && <Diamond size={6} color={accent} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default FontMenu
