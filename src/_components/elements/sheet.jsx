import { useState } from 'react'
import { UNIVERSAL_SWATCHES } from '../../app/content'
import { HEADER_H, INNER_W, SHEET_W } from '../../lib/geometry'
import classes from '../../app/styles.module.css'
import Diamond from './diamond'
import { LabIcon, LectureIcon } from './icons'

// Truncated text keeps every field on one line and ellipsizes what overflows,
// matching how the JPEG canvas draws it. minWidth lets flex rows shrink first.
const CLIP = { maxWidth: "100%", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }

// The exported sheet: A4-width surface with the weekly grid, class blocks,
// dashed break blocks and the click-to-recolor popover.
const Sheet = ({ geo, theme, accent, palette, custom, onRecolor, fontSel, truncate }) => {
  const [picker, setPicker] = useState(null)
  const [hexDraft, setHexDraft] = useState("")

  const openPicker = b => {
    if (picker && picker.key === b.key && picker.day === b.day && picker.blockY === b.y) { setPicker(null); return }
    let px = Math.min(b.x, INNER_W - 212)
    let py = b.y + b.h + 6
    if (py + 160 > geo.gridH) py = Math.max(HEADER_H + 4, b.y - 166)
    setPicker({ key: b.key, day: b.day, blockY: b.y, x: px, y: py })
    setHexDraft("")
  }

  const applyHex = () => {
    let v = hexDraft.trim()
    if (v && v[0] !== "#") v = "#" + v
    if (/^#[0-9a-fA-F]{6}$/.test(v)) onRecolor(picker.key, v.toLowerCase())
  }

  const swatches = picker
    ? palette.concat(UNIVERSAL_SWATCHES.filter(c => palette.indexOf(c) === -1))
    : []
  const currentColor = picker ? (custom[picker.key] || palette[geo.orderIdx[picker.key] % palette.length]) : null

  return (
    <div id="print-sheet" style={{
      position: "relative", width: SHEET_W, boxSizing: "border-box",
      background: theme.sheetBg, border: `1px solid ${theme.edge}`, boxShadow: `8px 8px 0 0 ${accent}`,
      padding: "30px 26px 24px", printColorAdjust: "exact", WebkitPrintColorAdjust: "exact"
    }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", height: 26, marginBottom: 14 }}>
        <span style={{ fontFamily: "var(--title)", fontWeight: 500, fontSize: 20, color: theme.sheetInk }}>{geo.sheetTitle}</span>
      </div>
      <div style={{ position: "relative", height: geo.gridH }}>
        {geo.hourLines.map(h => (
          <span key={h.y} style={{ display: "contents" }}>
            <div style={{ position: "absolute", left: 46, right: 0, top: h.y, borderTop: `1px solid ${theme.hairFaint}` }} />
            <div style={{ position: "absolute", left: 0, width: 40, top: h.labelY, textAlign: "right", fontSize: 10, whiteSpace: "nowrap", color: theme.sheetMuted, fontFamily: "var(--paragraph)" }}>{h.label}</div>
          </span>
        ))}
        {geo.seps.map(v => (
          <div key={v.x} style={{ position: "absolute", width: 1, left: v.x, top: v.y0, height: v.h, background: theme.hairFaint }} />
        ))}
        {geo.dayCols.map(d => (
          <div key={d.name} style={{ position: "absolute", top: 2, left: d.x, width: d.w, textAlign: "center", fontFamily: "var(--title)", fontWeight: 500, fontSize: 13, letterSpacing: "0.05em", color: theme.sheetInk }}>{d.name}</div>
        ))}
        {geo.breaks.map((k, i) => (
          <div key={i} style={{
            position: "absolute", left: k.x, top: k.y, width: k.w, height: k.h,
            border: `2px dashed ${accent}`, boxSizing: "border-box",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
            color: theme.sheetMuted, fontSize: 10.5, fontFamily: "var(--paragraph)",
            overflow: truncate ? "hidden" : "visible"
          }}>
            <Diamond size={5} color={accent} />
            <span style={truncate ? CLIP : undefined}>{k.label}</span>
          </div>
        ))}
        {geo.blocks.map((b, i) => (
          <div key={i} onClick={() => openPicker(b)} data-tour={i === 0 ? "class" : undefined} style={{
            position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h,
            background: b.bg, color: b.ink,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            textAlign: "center", cursor: "pointer", padding: "3px 7px", boxSizing: "border-box",
            overflow: truncate ? "hidden" : "visible", fontFamily: fontSel.bodyFontCss
          }}>
            {/* Fonts set on the text elements themselves: the `*` reset in
                index.css matches them directly, which beats inheritance */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontWeight: fontSel.boldW, fontSize: 11.5, lineHeight: 1.3, fontFamily: fontSel.titleFontCss, maxWidth: "100%" }}>
              {b.showLab && <LabIcon />}
              {b.showLec && <LectureIcon />}
              <span style={{ fontFamily: "inherit", ...(truncate ? CLIP : null) }}>{b.title}</span>
            </div>
            {b.line2 && <div style={{ fontSize: 10.5, opacity: 0.92, marginTop: 2, fontFamily: fontSel.bodyFontCss, ...(truncate ? CLIP : null) }}>{b.line2}</div>}
            {b.line3 && <div style={{ fontSize: 10.5, opacity: 0.92, fontFamily: fontSel.bodyFontCss, ...(truncate ? CLIP : null) }}>{b.line3}</div>}
          </div>
        ))}
        {picker && (
          <div style={{
            position: "absolute", left: picker.x, top: picker.y, width: 208,
            background: "var(--popbg)", border: `1px solid ${theme.edge}`, padding: 12, zIndex: 20,
            display: "flex", flexDirection: "column", gap: 10, boxShadow: `4px 4px 0 0 ${accent}`
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--muted)" }}>Class colour</span>
              <button type="button" className={classes.link} style={{ fontSize: 12 }} onClick={() => setPicker(null)}>Done</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {swatches.map(col => (
                <button
                  key={col}
                  type="button"
                  onClick={() => onRecolor(picker.key, col)}
                  style={{
                    width: 24, height: 24, background: col, cursor: "pointer", padding: 0,
                    border: currentColor === col ? "2px solid #42a7ae" : "1px solid rgba(127,127,127,0.35)",
                    boxSizing: "border-box", display: "block"
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                value={hexDraft}
                onChange={e => setHexDraft(e.target.value)}
                placeholder="#0f766e"
                style={{
                  flex: 1, minWidth: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                  padding: "5px 8px", border: "1px solid var(--hair)", background: "var(--inputbg)",
                  color: "var(--ink)", outline: "none"
                }}
              />
              <button type="button" className={classes.link} style={{ fontSize: 12, whiteSpace: "nowrap" }} onClick={applyHex}>Apply</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sheet
