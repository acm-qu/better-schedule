import { BREAK_MIN_GAP, PRESETS } from '../../app/content'
import classes from '../../app/styles.module.css'
import Button from '../elements/button'
import FontMenu from '../elements/font-menu'
import Stepper from '../elements/stepper'

const Eyebrow = ({ children }) => (
  <p style={{ color: "var(--light-gray)", textTransform: "uppercase", letterSpacing: 8, fontFamily: "var(--paragraph)", fontSize: 16, margin: 0 }}>{children}</p>
)

const CheckRow = ({ label, checked, onToggle, first = false }) => (
  <label className={classes.checkRow} style={first ? { marginTop: 8 } : undefined}>
    {label}
    <input type="checkbox" className={classes.check} checked={checked} onChange={onToggle} />
  </label>
)

const FIELD_ROWS = [
  ["Course code", "code"],
  ["Course name", "name"],
  ["Timing", "timing"],
  ["Building code", "bcode"],
  ["Building name", "bname"],
  ["Room number", "room"],
  ["Lab / Lecture icon", "icon"]
]

// Step 2 — timings, breaks, class content and theme.
const StepCustomize = ({ theme, step, allowed, accent, ramadan, fmt24, showBreaks, fields, college, font, onGo, onRamadan, onFmt24, onBreaks, onField, onCollege, onFont }) => (
  <section style={{
    minHeight: "100vh", boxSizing: "border-box", display: "flex", flexDirection: "column",
    alignItems: "center", padding: "150px 24px 72px",
    animation: "bs-slide-in 0.5s cubic-bezier(0,.8,.2,1) both"
  }}>
    <Stepper step={step} allowed={allowed} onGo={onGo} />
    <h1 className={classes.title} style={{ color: theme.ink }}>Make it yours</h1>
    <p style={{ color: "var(--body)", fontSize: 16, lineHeight: 1.6, margin: 0, textAlign: "center", maxWidth: 560, textWrap: "pretty" }}>
      Everything here updates the preview in the next step. You can also click any class there to recolor it.
    </p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 300px))", gap: "44px 64px", justifyContent: "center", alignItems: "start", marginTop: 46, width: "100%", maxWidth: 1120 }}>
      <div>
        <Eyebrow>Timing</Eyebrow>
        <CheckRow label="Ramadan timings" checked={ramadan} onToggle={onRamadan} first />
        <CheckRow label="24-hour clock" checked={fmt24} onToggle={onFmt24} />
        <div style={{ marginTop: 40 }}>
          <Eyebrow>Breaks</Eyebrow>
          <CheckRow label="Show breaks in the grid" checked={showBreaks} onToggle={onBreaks} first />
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, margin: "12px 2px 0", textWrap: "pretty" }}>
            Gaps of {BREAK_MIN_GAP} minutes or more between classes show as dashed blocks, like &quot;1h and 40 mins break&quot;.
          </p>
        </div>
      </div>
      <div>
        <Eyebrow>Class content</Eyebrow>
        {FIELD_ROWS.map(([label, key], i) => (
          <CheckRow key={key} label={label} checked={fields[key]} onToggle={() => onField(key)} first={i === 0} />
        ))}
      </div>
      <div>
        <Eyebrow>Theme</Eyebrow>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "14px 0 16px", borderBottom: "1px solid var(--hair)" }}>
          {Object.keys(PRESETS).map(name => (
            <button
              key={name}
              type="button"
              onClick={() => onCollege(name)}
              style={{
                cursor: "pointer", padding: "4px 13px", borderRadius: 9999, fontSize: 13,
                border: `2px solid ${name === college ? PRESETS[name].colors[0] : "var(--hair)"}`,
                background: name === college ? PRESETS[name].colors[0] : "transparent",
                color: name === college ? "#fbfafb" : "var(--body)",
                whiteSpace: "nowrap", transition: "background-color 0.2s"
              }}
            >
              {name}
            </button>
          ))}
        </div>
        <div style={{ padding: "13px 2px 14px", borderBottom: "1px solid var(--hair)" }}>
          <div style={{ color: "var(--body)", fontSize: 15, marginBottom: 10 }}>Text style</div>
          <FontMenu font={font} accent={accent} ink={theme.ink} onPick={onFont} />
        </div>
        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, margin: "12px 2px 0", textWrap: "pretty" }}>
          Each college preset recolors the whole grid. Individual classes can still be recolored when clicked.
        </p>
      </div>
    </div>
    <div style={{ display: "flex", gap: 16, marginTop: 54 }}>
      <Button variant="outline" size="sm" onClick={() => onGo(1)}>Back</Button>
      <Button variant="accent" disabled={!allowed} onClick={() => onGo(3)}>Preview Schedule</Button>
    </div>
  </section>
)

export default StepCustomize
