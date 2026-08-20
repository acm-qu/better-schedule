# Better Schedule

Paste your myQU or myBanner schedule, customize it, and export a clean timetable as PDF or JPEG.

This app was part of the landing page so if u wanna see the commit history from the beginning check [the landing page repo](https://github.com/acm-qu/ACM-Landing-Page/commit/dffe790bfdc8520c27d63a8bac6cd1eccedd8ddf).

## Running it

```bash
bun install
bun run dev      # dev server
bun run build    # production build into dist/
bun run preview  # serve the production build
bun run lint
```

## Structure

Single page, no router — the whole product is the 3-step wizard in `src/app/App.jsx`.
It owns every piece of state; the steps are presentational and get theirs as props.

```
src/
├── app/                    the page itself
│   ├── main.jsx            entry point, mounts App
│   ├── App.jsx             the wizard: all state lives here
│   ├── content.ts          themes, college presets, building codes, fonts — edit content here
│   ├── types.ts            shared types for content.ts and the parser output
│   ├── index.css           reset, CSS variables, fonts
│   └── styles.module.css   all styling, plus the @media print rules the PDF export needs
├── _components/
│   ├── steps/              one screen per wizard step: paste → customize → preview
│   ├── elements/           shared UI: button, stepper, slider, font-menu, icons, and the sheet
│   └── tutorial.jsx        spotlight tour over the preview, once per page load
├── lib/
│   ├── parser.js           turns pasted myQU / myBanner text into course data
│   ├── geometry.js         lays courses and breaks out into the sheet grid
│   └── export-jpeg.js      canvas renderer for the JPEG export
└── hooks/
    └── use-page-title.ts
```

`elements/sheet.jsx` renders the timetable from the geometry, and is what both
exports capture: JPEG redraws it on a canvas, PDF is `window.print()` scoped by
the print rules in `styles.module.css`.

## Contributors

- Abdelhakim Akhadkhou: Design, Implementation
