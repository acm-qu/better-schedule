import { DEMO_BANNER, DEMO_QU, TUTORIAL_LINK } from '../../lib/parser'
import classes from '../../app/styles.module.css'
import Button from '../elements/button'
import Stepper from '../elements/stepper'

const rise = delay => ({ animation: `bs-rise 0.7s cubic-bezier(0,.8,.2,1) ${delay}s both` })

// Step 1 — paste the raw schedule text from myQU or myBanner.
const StepPaste = ({ theme, step, allowed, tab, text, showNote, onGo, onPickTab, onText, onNext }) => (
  <section style={{
    minHeight: "100vh", boxSizing: "border-box", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", padding: "150px 24px 72px",
    animation: "bs-slide-in 0.5s cubic-bezier(0,.8,.2,1) both"
  }}>
    <Stepper step={step} allowed={allowed} onGo={onGo} animate />
    <h1 className={classes.title} style={{ color: theme.ink }}>Paste your schedule</h1>
    <p style={{ color: "var(--body)", fontSize: 16, lineHeight: 1.6, margin: "0 0 26px", textAlign: "center", maxWidth: 600, textWrap: "pretty", ...rise(0.55) }}>
      {tab === "banner"
        ? "On myBanner, open Registration, Register Classes, Select a semester, and copy the Schedule details."
        : "Open myQU, then select all of the schedule text, and copy it."}
      {" "}Watch <a href={TUTORIAL_LINK} target="_blank" rel="noreferrer">the tutorial</a> if it is your first time.
    </p>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, ...rise(0.8) }}>
      <span style={{ fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--paragraph)" }}>Source</span>
      <div style={{ display: "flex", gap: 12 }}>
        <Button variant={tab === "myqu" ? "accent" : "outline"} size="sm" onClick={() => onPickTab("myqu")}>myQU</Button>
        <Button variant={tab === "banner" ? "accent" : "outline"} size="sm" onClick={() => onPickTab("banner")}>myBanner</Button>
      </div>
    </div>
    <div style={{ position: "relative", marginTop: 28, ...rise(1.05) }}>
      <svg style={{ position: "absolute", left: -11, top: -11, width: "calc(100% + 22px)", height: "calc(100% + 22px)", pointerEvents: "none", overflow: "visible" }}>
        <rect x="2" y="2" fill="none" stroke="#3ae4d1" strokeWidth="3" strokeDasharray="12 12" style={{ width: "calc(100% - 4px)", height: "calc(100% - 4px)", animation: "bs-ants 4s linear infinite" }} />
      </svg>
      <textarea
        className={classes.textarea}
        value={text}
        onChange={e => onText(e.target.value)}
        placeholder={tab === "banner" ? "Paste the myBanner registration text here..." : "Paste the myQU schedule text here..."}
        rows={12}
      />
    </div>
    <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 32, ...rise(1.35) }}>
      <Button variant="outline" size="sm" onClick={() => onText(tab === "banner" ? DEMO_BANNER : DEMO_QU)}>Load Demo Text</Button>
      <Button variant="accent" disabled={!allowed} onClick={onNext}>Next: Customize</Button>
    </div>
    {showNote && <p style={{ color: "var(--muted)", fontSize: 14, margin: "18px 0 0" }}>No classes recognized yet — make sure you copied the whole schedule text.</p>}
  </section>
)

export default StepPaste
