import classes from '../../app/styles.module.css'

const MIN = 44, MAX = 110, RANGE = MAX - MIN, TICKS = 4

// Custom px-per-hour slider: teal fill, four evenly spaced tick marks and a
// rotated square thumb. Pointer down or drag anywhere on the track sets the
// value. Everything inside is positioned as a percentage of the track, so the
// narrower mobile track in styles.module.css needs no extra maths here.
const HeightSlider = ({ value, onChange }) => {
  const pct = ((value - MIN) / RANGE) * 100

  const handleDown = e => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    const setFrom = cx => {
      const f = Math.min(1, Math.max(0, (cx - rect.left) / rect.width))
      onChange(Math.round((MIN + f * RANGE) / 2) * 2)
    }
    setFrom(e.clientX)
    const mv = ev => setFrom(ev.clientX)
    const up = () => { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up) }
    window.addEventListener("pointermove", mv)
    window.addEventListener("pointerup", up)
  }

  return (
    <div onPointerDown={handleDown} className={classes.slider}>
      <div className={classes.sliderTrack} />
      <div className={classes.sliderFill} style={{ width: `${pct}%` }} />
      {[0, 1, 2, 3, 4].map(i => {
        const at = (i / TICKS) * 100
        return (
          <div
            key={i}
            className={`${classes.sliderTick} ${at <= pct ? classes.sliderTickOn : ''}`}
            style={{ left: i === TICKS ? "calc(100% - 1px)" : `${at}%` }}
          />
        )
      })}
      <div className={classes.sliderThumb} style={{ left: `clamp(0px, calc(${pct}% - 7px), calc(100% - 14px))` }} />
    </div>
  )
}

export default HeightSlider
