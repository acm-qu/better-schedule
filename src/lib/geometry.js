// Layout engine for the exported sheet. The same geometry feeds the DOM
// preview and the 2x JPEG canvas so the two never drift apart.
import { breakLabel, computeBreaks, detectSemester, formatTime, hourLabel } from "./parser";

export const SHEET_W = 794; // A4 portrait at 96dpi
export const GUTTER = 46;
export const INNER_W = 742;
export const HEADER_H = 30;
export const COL_W = (INNER_W - GUTTER) / 5;

export function countCourses(sched) {
  let count = 0;
  for (const d of Object.keys(sched)) count += sched[d].filter(c => c.margin >= 0 && c.height > 0).length;
  return count;
}

// Automatic text contrast: perceived luminance above 150 gets near-black ink.
export function inkFor(hex) {
  const h = String(hex).replace("#", "");
  if (h.length !== 6) return "#fbfafb";
  const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? "#010000" : "#fbfafb";
}

export function buildSheetGeometry({ sched, text, pph, fmt24, fields, palette, custom, showBreaks, breakMinGap }) {
  const dayNames = Object.keys(sched);
  let mn = Infinity, mx = -Infinity;
  for (const d of dayNames) for (const c of sched[d]) if (c.margin >= 0 && c.height > 0) { mn = Math.min(mn, c.margin); mx = Math.max(mx, c.margin + c.height); }
  const g0 = Math.floor(mn), g1 = Math.ceil(mx);
  const gridH = HEADER_H + (g1 - g0) * pph + 1;

  const hourLines = [], seps = [], dayCols = [], blocks = [], breaks = [];
  for (let h = g0; h <= g1; h++) {
    const y = HEADER_H + (h - g0) * pph;
    hourLines.push({ y, labelY: y - 6, label: hourLabel(h, fmt24) });
  }
  for (let i = 0; i <= 5; i++) seps.push({ x: GUTTER + i * COL_W, y0: HEADER_H, h: gridH - HEADER_H });

  // First-seen order of name+type across Sun→Thu decides the palette cycle.
  const orderIdx = {};
  let seen = 0;
  for (const d of dayNames) for (const c of sched[d]) { const k = c.name + c.type; if (!(k in orderIdx)) orderIdx[k] = seen++; }

  dayNames.forEach((d, di) => {
    dayCols.push({ x: GUTTER + di * COL_W, w: COL_W, name: d });
    for (const c of sched[d]) {
      if (!(c.margin >= 0 && c.height > 0)) continue;
      const k = c.name + c.type;
      const bg = custom[k] || palette[orderIdx[k] % palette.length];
      const parts3 = [];
      if (fields.bcode && c.building) parts3.push(c.building);
      if (fields.bname && c.buildingName) parts3.push(c.buildingName);
      if (fields.room && c.room) parts3.push("Room " + c.room);
      let title;
      if (fields.code && fields.name) title = (c.code ? c.code + " · " : "") + c.name;
      else if (fields.name) title = c.name;
      else if (fields.code) title = c.code || c.name;
      else title = c.type || "";
      blocks.push({
        key: k,
        day: d,
        x: GUTTER + di * COL_W + 3,
        y: HEADER_H + (c.margin - g0) * pph + 1,
        w: COL_W - 6,
        h: c.height * pph - 2,
        bg,
        ink: inkFor(bg),
        title,
        line2: fields.timing ? (formatTime(c.timing[0], fmt24) + " – " + formatTime(c.timing[1], fmt24)) : false,
        line3: parts3.length ? parts3.join(" · ") : false,
        showLab: fields.icon && c.kind === "Lab",
        showLec: fields.icon && c.kind !== "Lab"
      });
    }
  });

  if (showBreaks) {
    const allBreaks = computeBreaks(sched, breakMinGap);
    dayNames.forEach((d, di) => {
      for (const b of allBreaks[d]) breaks.push({
        x: GUTTER + di * COL_W + 9,
        y: HEADER_H + (b.margin - g0) * pph + 5,
        w: COL_W - 18,
        h: b.height * pph - 10,
        label: breakLabel(b.mins)
      });
    });
  }

  return {
    gridH,
    sheetH: 30 + 26 + 14 + gridH + 24,
    sheetTitle: detectSemester(text) || "Schedule",
    hourLines,
    seps,
    dayCols,
    blocks,
    breaks,
    orderIdx
  };
}
