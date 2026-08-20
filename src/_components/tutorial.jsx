import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import classes from '../app/styles.module.css'
import Button from './elements/button'

const STEPS = [
  { target: "class", text: "Click a class to change its color." },
  { target: "height", text: "Drag this to make the whole schedule taller or shorter." },
  { target: "truncate", text: "If a class name is too long, tick this to truncate the text." }
]

const CARD_W = 260, GAP = 14, EDGE = 12, RING = 6

// Guided tour of the preview controls. Each step spotlights the element
// carrying its data-tour name and parks a card beside it, flipping above the
// target when there is no room below. Escape closes it, same as Done.
const Tutorial = ({ onClose }) => {
  const [i, setI] = useState(0)
  const [box, setBox] = useState(null)
  const [cardH, setCardH] = useState(150)
  const card = useRef(null)

  // Re-measured on scroll so the spotlight tracks the smooth scrollIntoView,
  // and in the capture phase so the sheet's own scroller counts too.
  useEffect(() => {
    const el = document.querySelector(`[data-tour="${STEPS[i].target}"]`)
    if (!el) { setBox(null); return }
    el.scrollIntoView({ block: "center", behavior: "smooth" })
    const measure = () => {
      const r = el.getBoundingClientRect()
      setBox({ x: r.left, y: r.top, w: r.width, h: r.height })
    }
    measure()
    window.addEventListener("scroll", measure, true)
    window.addEventListener("resize", measure)
    return () => {
      window.removeEventListener("scroll", measure, true)
      window.removeEventListener("resize", measure)
    }
  }, [i])

  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  // Steps differ in height, so the card is measured whenever it mounts or the
  // copy changes, and only then: box changes on every scroll frame.
  const hasBox = box !== null
  useLayoutEffect(() => {
    const h = card.current?.offsetHeight
    if (h) setCardH(c => (c === h ? c : h))
  }, [i, hasBox])

  if (!box) return null

  const below = box.y + box.h + RING + GAP
  const top = below + cardH + EDGE < window.innerHeight ? below : Math.max(EDGE, box.y - RING - GAP - cardH)
  const left = Math.min(Math.max(EDGE, box.x + box.w / 2 - CARD_W / 2), window.innerWidth - CARD_W - EDGE)
  const last = i === STEPS.length - 1

  return (
    <>
      <div className={classes.tourBlock} />
      <div className={classes.tourSpot} style={{ left: box.x - RING, top: box.y - RING, width: box.w + RING * 2, height: box.h + RING * 2 }} />
      <div ref={card} className={classes.tourCard} style={{ left, top }}>
        <span className={classes.tourCount}>{`0${i + 1} / 0${STEPS.length}`}</span>
        <p className={classes.tourText}>{STEPS[i].text}</p>
        <div className={classes.tourButtons}>
          <Button variant="outline" size="sm" disabled={i === 0} onClick={() => setI(n => n - 1)}>Back</Button>
          <Button variant="accent" size="sm" onClick={() => last ? onClose() : setI(n => n + 1)}>{last ? "Done" : "Next"}</Button>
        </div>
      </div>
    </>
  )
}

export default Tutorial
