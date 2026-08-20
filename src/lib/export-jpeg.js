// Redraws the sheet onto a 2x canvas with the same geometry model as the DOM
// preview, then downloads it as a JPEG.
import { SHEET_W } from "./geometry";

const ICON_PATHS = {
  lab: "M9 3h6M10 3v6l-4.6 8.6a2 2 0 0 0 1.8 2.9h9.6a2 2 0 0 0 1.8-2.9L14 9V3M6.5 15h11",
  lec: "M3 4h18M4 4v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4M12 16v4M9 20h6"
};

export async function exportSheetAsJpeg({ geo, theme, accent, font, truncate }) {
  const titleFam = font === "Code" ? '"JetBrains Mono"' : font === "University" ? '"Helvetica Neue"' : "Lexend";
  const bodyFam = font === "Code" ? '"JetBrains Mono"' : font === "University" ? '"Helvetica Neue"' : "Poppins";
  const boldW = font === "Code" ? 700 : 500;

  try { await document.fonts.ready; } catch { /* draw with fallback fonts */ }

  const S = 2, W = SHEET_W, H = geo.sheetH;
  const cv = document.createElement("canvas");
  cv.width = W * S; cv.height = H * S;
  const x = cv.getContext("2d");
  x.scale(S, S);

  const drawIcon = (kind, px, py, color) => {
    x.save(); x.translate(px, py); x.scale(13 / 24, 13 / 24);
    x.strokeStyle = color; x.lineWidth = 2; x.lineCap = "round"; x.lineJoin = "round"; x.setLineDash([]);
    x.stroke(new Path2D(ICON_PATHS[kind])); x.restore();
  };
  const fit = (t, mw) => { t = String(t); if (x.measureText(t).width <= mw) return t; while (t.length > 1 && x.measureText(t + "…").width > mw) t = t.slice(0, -1); return t + "…"; };
  // Untruncated text wraps onto as many rows as it needs, matching how the DOM
  // preview reflows it. A single word wider than the block still overflows.
  const wrap = (t, mw) => {
    const words = String(t).split(/\s+/).filter(Boolean);
    if (!words.length) return [""];
    const rows = [words[0]];
    for (let i = 1; i < words.length; i++) {
      const merged = rows[rows.length - 1] + " " + words[i];
      if (x.measureText(merged).width <= mw) rows[rows.length - 1] = merged;
      else rows.push(words[i]);
    }
    return rows;
  };

  x.fillStyle = theme.sheetBg; x.fillRect(0, 0, W, H);
  x.strokeStyle = theme.edge; x.lineWidth = 1; x.strokeRect(0.5, 0.5, W - 1, H - 1);
  x.fillStyle = theme.sheetInk; x.font = "500 20px Lexend"; x.textAlign = "center"; x.textBaseline = "alphabetic";
  x.fillText(geo.sheetTitle, W / 2, 49);

  const ox = 26, oy = 70;
  for (const h of geo.hourLines) {
    x.strokeStyle = theme.hairFaint; x.lineWidth = 1;
    x.beginPath(); x.moveTo(ox + 46, oy + h.y + 0.5); x.lineTo(ox + 742, oy + h.y + 0.5); x.stroke();
    x.fillStyle = theme.sheetMuted; x.font = "400 10px Poppins"; x.textAlign = "right";
    x.fillText(h.label, ox + 40, oy + h.y + 3);
  }
  x.strokeStyle = theme.hairFaint;
  for (const sp of geo.seps) { x.beginPath(); x.moveTo(ox + sp.x + 0.5, oy + sp.y0); x.lineTo(ox + sp.x + 0.5, oy + sp.y0 + sp.h); x.stroke(); }
  x.fillStyle = theme.sheetInk; x.font = "500 13px Lexend"; x.textAlign = "center";
  for (const d of geo.dayCols) x.fillText(d.name, ox + d.x + d.w / 2, oy + 20);

  for (const b of geo.blocks) {
    x.fillStyle = b.bg; x.fillRect(ox + b.x, oy + b.y, b.w, b.h);
    x.save();
    if (truncate) { x.beginPath(); x.rect(ox + b.x, oy + b.y, b.w, b.h); x.clip(); }
    const lines = [];
    if (b.title) lines.push({ t: b.title, f: boldW + " 11.5px " + titleFam, h: 15, icon: b.showLab ? "lab" : (b.showLec ? "lec" : null) });
    if (b.line2) lines.push({ t: b.line2, f: "400 10.5px " + bodyFam, h: 14 });
    if (b.line3) lines.push({ t: b.line3, f: "400 10.5px " + bodyFam, h: 14 });
    // Each line becomes one clipped row when truncating, or as many rows as
    // the full text wraps onto when not. The icon rides the first row only.
    const rows = [];
    for (const l of lines) {
      x.font = l.f;
      const maxW = b.w - 14 - (l.icon ? 18 : 0);
      if (truncate) rows.push({ ...l, t: fit(l.t, maxW) });
      else for (const [i, t] of wrap(l.t, maxW).entries()) rows.push({ ...l, t, icon: i === 0 ? l.icon : null });
    }
    const total = rows.reduce((a, r) => a + r.h, 0);
    let ty = oy + b.y + (b.h - total) / 2 + 11;
    x.textAlign = "center";
    for (const r of rows) {
      x.font = r.f; x.fillStyle = b.ink;
      const cx = ox + b.x + b.w / 2;
      if (r.icon) {
        const tw = x.measureText(r.t).width;
        drawIcon(r.icon, cx - (tw + 18) / 2, ty - 10, b.ink);
        x.fillText(r.t, cx + 9, ty);
      } else {
        x.fillText(r.t, cx, ty);
      }
      ty += r.h;
    }
    x.restore();
  }

  for (const k of geo.breaks) {
    x.strokeStyle = accent; x.lineWidth = 2; x.setLineDash([7, 7]);
    x.strokeRect(ox + k.x + 1, oy + k.y + 1, k.w - 2, k.h - 2);
    x.setLineDash([]);
    x.fillStyle = theme.sheetMuted; x.font = "400 10.5px Poppins"; x.textAlign = "center";
    const maxW = k.w - 34;
    const rows = truncate ? [fit(k.label, maxW)] : wrap(k.label, maxW);
    const cx = ox + k.x + k.w / 2 + 5, cy = oy + k.y + k.h / 2;
    let ry = cy + 3.5 - ((rows.length - 1) * 13) / 2;
    for (const t of rows) { x.fillText(t, cx, ry); ry += 13; }
    x.save(); x.translate(cx - x.measureText(rows[0]).width / 2 - 10, cy); x.rotate(Math.PI / 4); x.fillStyle = accent; x.fillRect(-2.5, -2.5, 5, 5); x.restore();
  }

  const a = document.createElement("a");
  a.download = (geo.sheetTitle || "schedule").replace(/\s+/g, "-").toLowerCase() + ".jpg";
  a.href = cv.toDataURL("image/jpeg", 0.95);
  a.click();
}
