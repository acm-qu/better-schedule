import classes from '../../app/styles.module.css'

const STEPS = [["Paste", 1], ["Customize", 2], ["Export", 3]]

const cx = (...names) => names.filter(Boolean).join(" ")

// Mantine-style horizontal stepper. Steps 2–3 are clickable only once text exists.
// Collapses on mobile: only the active step keeps its label, and only the
// connector running to the next step stays a line (see styles.module.css).
const Stepper = ({ step, allowed, onGo, animate = false }) => (
  <div className={cx(classes.stepper, animate && classes.stepperAnimate)}>
    {STEPS.map(([label, n], i) => {
      const done = step > n, act = step === n
      return (
        <span key={n} className={classes.stepperItem}>
          {i > 0 && (
            <span className={cx(
              classes.stepLine,
              step >= n && classes.stepLineReached,
              step === n - 1 && classes.stepLineNext
            )} />
          )}
          <button
            type="button"
            aria-label={label}
            aria-current={act ? "step" : undefined}
            onClick={(n === 1 || allowed) ? () => onGo(n) : undefined}
            className={classes.stepButton}
          >
            <span className={cx(classes.stepMark, act && classes.stepMarkActive, done && classes.stepMarkDone)}>
              {done ? "◆" : "0" + n}
            </span>
            <span className={cx(classes.stepLabel, (act || done) && classes.stepLabelReached, act && classes.stepLabelActive)}>
              {label}
            </span>
          </button>
        </span>
      )
    })}
  </div>
)

export default Stepper
