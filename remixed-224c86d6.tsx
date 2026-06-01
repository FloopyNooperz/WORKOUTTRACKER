<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Workout Tracker — Apex Media WI</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0a;
    --surface: #111;
    --surface2: #181818;
    --border: #1e1e1e;
    --red: #c0152a;
    --red-bright: #e01a32;
    --text: #e0e0e0;
    --muted: #666;
    --dim: #444;
  }
  body { background: var(--bg); color: var(--text); font-family: 'DM Mono', monospace; min-height: 100vh; max-width: 520px; margin: 0 auto; -webkit-tap-highlight-color: transparent; }
  ::-webkit-scrollbar { display: none; }

  /* Header */
  .header { padding: 24px 16px 16px; }
  .title { font-family: 'Bebas Neue', sans-serif; font-size: 44px; letter-spacing: 4px; color: #fff; line-height: 1; }
  .title span { color: var(--red); }
  .subtitle { font-size: 10px; color: var(--dim); letter-spacing: 2px; text-transform: uppercase; margin-top: 6px; }

  /* Day strip */
  .day-strip { display: flex; overflow-x: auto; gap: 6px; padding: 8px 16px 0; }
  .day-btn { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); cursor: pointer; min-width: 56px; transition: all 0.15s ease; }
  .day-btn.active { background: #1a0508; border-color: var(--red); }
  .day-btn.rest { opacity: 0.4; }
  .day-lbl { font-family: 'Bebas Neue', sans-serif; font-size: 15px; letter-spacing: 1.5px; color: #fff; }
  .day-type { font-size: 8px; letter-spacing: 1px; text-transform: uppercase; margin-top: 3px; color: var(--muted); }
  .day-btn.active .day-type { color: var(--red); }

  /* Hero */
  .hero { padding: 18px 16px 10px; }
  .hero-day { font-family: 'Bebas Neue', sans-serif; font-size: 40px; letter-spacing: 3px; color: #fff; line-height: 1; }
  .hero-day span { color: var(--red); }
  .accent { height: 1px; background: linear-gradient(90deg, var(--red), transparent); margin: 4px 16px; }

  .section-head { font-size: 9px; letter-spacing: 2.5px; text-transform: uppercase; color: var(--dim); padding: 14px 16px 6px; }

  /* Exercise card */
  .ex-card { margin: 0 16px 8px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 13px 14px; cursor: pointer; transition: all 0.15s ease; }
  .ex-card:active { background: var(--surface2); }
  .ex-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
  .ex-name { font-size: 13px; color: var(--text); line-height: 1.4; }
  .ex-prog { font-size: 10px; color: var(--dim); margin-top: 3px; }
  .ex-detail { font-size: 11px; color: var(--muted); text-align: right; white-space: nowrap; flex-shrink: 0; }
  .ex-chevron { font-size: 9px; color: var(--dim); margin-top: 6px; letter-spacing: 1px; text-transform: uppercase; }

  /* Rest screen */
  .rest-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 16px; gap: 10px; }
  .rest-icon { font-size: 48px; opacity: 0.12; color: #fff; }
  .rest-label { font-family: 'Bebas Neue', sans-serif; font-size: 36px; letter-spacing: 4px; color: #333; }
  .rest-sub { font-size: 10px; color: #2a2a2a; letter-spacing: 2px; text-transform: uppercase; }

  /* Modal */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 100; display: none; align-items: flex-end; justify-content: center; }
  .modal-overlay.open { display: flex; }
  .modal { background: var(--surface); border-top: 2px solid var(--red); border-radius: 16px 16px 0 0; width: 100%; max-width: 520px; max-height: 88vh; overflow-y: auto; padding: 20px 16px 32px; animation: slideUp 0.25s ease; }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .modal-handle { width: 40px; height: 4px; background: var(--dim); border-radius: 2px; margin: 0 auto 16px; }
  .modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 2px; color: #fff; line-height: 1.1; }
  .modal-close { float: right; font-size: 22px; color: var(--muted); cursor: pointer; line-height: 1; padding: 0 4px; }
  .modal-meta { font-size: 11px; color: var(--muted); margin: 6px 0 18px; }

  .chart-label { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--dim); margin: 18px 0 8px; }
  .chart-box { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 14px 10px 8px; }
  .no-data { text-align: center; color: var(--dim); font-size: 12px; padding: 30px 0; font-style: italic; }

  /* Log table */
  .log-table { width: 100%; margin-top: 18px; border-collapse: collapse; }
  .log-table th { font-size: 9px; letter-spacing: 1px; text-transform: uppercase; color: var(--dim); text-align: left; padding: 6px 8px; border-bottom: 1px solid var(--border); }
  .log-table td { font-size: 12px; color: var(--text); padding: 8px; border-bottom: 1px solid var(--border); }
  .log-table tr:last-child td { border-bottom: none; }

  /* States */
  .loading, .error { text-align: center; padding: 50px 24px; color: var(--muted); }
  .error-title { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: var(--red); margin-bottom: 10px; letter-spacing: 1px; }
  .error p { font-size: 12px; line-height: 1.7; color: var(--muted); }

  .footer { text-align: center; padding: 28px 16px 40px; font-size: 9px; color: #222; letter-spacing: 2px; text-transform: uppercase; }
  .refresh-note { text-align: center; font-size: 9px; color: var(--dim); letter-spacing: 1px; padding: 0 16px; margin-top: 12px; }
</style>
</head>
<body>

<div class="header">
  <div class="title">WORKOUT <span>LOG</span></div>
  <div class="subtitle">Apex Media WI · Progressive Overload</div>
</div>

<div id="dayStrip" class="day-strip"></div>
<div id="content"><div class="loading">Loading…</div></div>
<div class="refresh-note">Edit your Google Sheet and refresh to update</div>
<div class="footer">Apex Media WI · Progressive Overload Protocol</div>

<div class="modal-overlay" id="modalOverlay" onclick="if(event.target===this)closeModal()">
  <div class="modal" id="modal"></div>
</div>

<script>
  // ===== CONFIG — replace these two with YOUR sheet's CSV links =====
  const EXERCISES_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSur7nxch2ZoQgLRekszTXWx3IqvxsH6lZnz-kexKeceLwWu2AeODnb2BQ-rju2C8to69UL3dL5t7cp/pub?gid=609618803&single=true&output=csv";
  const LOG_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSur7nxch2ZoQgLRekszTXWx3IqvxsH6lZnz-kexKeceLwWu2AeODnb2BQ-rju2C8to69UL3dL5t7cp/pub?gid=671553414&single=true&output=csv";
  // =================================================================

  const DAY_ORDER = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const DAY_SHORT = { Monday:"MON", Tuesday:"TUE", Wednesday:"WED", Thursday:"THU", Friday:"FRI", Saturday:"SAT", Sunday:"SUN" };

  let exercises = [];   // from Exercises tab
  let logRows = [];     // from Log tab
  let activeDay = null;

  async function fetchCSV(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    return Papa.parse(text, { header: true, skipEmptyLines: true, transformHeader: h => h.trim() }).data;
  }

  async function init() {
    if (EXERCISES_CSV.startsWith("PASTE")) {
      showError("Not configured yet", "Add your two Google Sheet CSV links at the top of the code (EXERCISES_CSV and LOG_CSV), then refresh.");
      return;
    }
    try {
      const [exData, logData] = await Promise.all([ fetchCSV(EXERCISES_CSV), fetchCSV(LOG_CSV) ]);
      exercises = exData.filter(r => r["Exercise"] && r["Exercise"].trim());
      logRows = logData.filter(r => r["Exercise"] && r["Exercise"].trim());
      // default active day = today if it's a training day, else first training day
      const today = DAY_ORDER[(new Date().getDay() + 6) % 7];
      const trainingDays = DAY_ORDER.filter(d => exercises.some(e => (e["Day"]||"").trim() === d));
      activeDay = trainingDays.includes(today) ? today : (trainingDays[0] || "Monday");
      render();
    } catch (err) {
      showError("Couldn't load your sheet", "Check that both tabs are published to the web as CSV. Error: " + err.message);
    }
  }

  function showError(title, msg) {
    document.getElementById("dayStrip").innerHTML = "";
    document.getElementById("content").innerHTML =
      `<div class="error"><div class="error-title">${title}</div><p>${msg}</p></div>`;
  }

  function dayHasExercises(day) {
    return exercises.some(e => (e["Day"]||"").trim() === day);
  }

  function render() {
    // Day strip
    const strip = DAY_ORDER.map(day => {
      const isRest = !dayHasExercises(day);
      const cls = "day-btn" + (isRest ? " rest" : "") + (day === activeDay ? " active" : "");
      const type = isRest ? "Rest" : (exercises.find(e => (e["Day"]||"").trim() === day)["Type"] || "Train");
      return `<button class="${cls}" onclick="selectDay('${day}')">
        <span class="day-lbl">${DAY_SHORT[day]}</span>
        <span class="day-type">${type}</span>
      </button>`;
    }).join("");
    document.getElementById("dayStrip").innerHTML = strip;

    // Content
    const dayEx = exercises.filter(e => (e["Day"]||"").trim() === activeDay);
    const heroName = activeDay.slice(0,-3) + "<span>" + activeDay.slice(-3) + "</span>";
    let html = `<div class="hero"><div class="hero-day">${heroName}</div></div><div class="accent"></div>`;

    if (dayEx.length === 0) {
      html += `<div class="rest-screen"><div class="rest-icon">◯</div><div class="rest-label">Rest Day</div><div class="rest-sub">Recover · Hydrate · Sleep</div></div>`;
    } else {
      const sections = [...new Set(dayEx.map(e => (e["Section"]||"").trim()).filter(Boolean))];
      const showSections = sections.length > 1;
      const groups = showSections ? sections : [null];
      groups.forEach(sec => {
        const list = sec === null ? dayEx : dayEx.filter(e => (e["Section"]||"").trim() === sec);
        if (showSections) html += `<div class="section-head">${sec}</div>`;
        list.forEach(e => {
          var sets = (e["Sets"]||"").trim();
          var reps = (e["Reps"]||"").trim();
          var wt = (e["Target Weight"]||"").trim();
          var detail = "";
          if (sets && reps) detail = sets + "×" + reps;
          if (wt) {
            var wtLabel = isNaN(wt) ? wt : (wt + " lbs");
            detail += (detail ? " @ " : "") + wtLabel;
          }
          var notes = (e["Notes"]||"").trim();
          var notesHtml = notes ? ('<div class="ex-prog">' + notes + '</div>') : "";
          html += '<div class="ex-card" onclick="openExercise(\'' + escAttr(e["Exercise"]) + '\')">'
            + '<div class="ex-top">'
            + '<div><div class="ex-name">' + e["Exercise"] + '</div>' + notesHtml + '</div>'
            + '<div class="ex-detail">' + detail + '</div>'
            + '</div>'
            + '<div class="ex-chevron">Tap for progress ›</div>'
            + '</div>';
        });
      });
    }
    document.getElementById("content").innerHTML = html;
  }

  function selectDay(day) { activeDay = day; render(); }
  function escAttr(s) { return (s||"").replace(/'/g, "\\'"); }

  function openExercise(name) {
    const entries = logRows
      .filter(r => (r["Exercise"]||"").trim().toLowerCase() === name.trim().toLowerCase())
      .map(r => ({
        date: r["Date"],
        d: new Date(r["Date"]),
        weight: parseFloat(r["Weight"]) || 0,
        reps: parseFloat(r["Reps"]) || 0,
        sets: parseFloat(r["Sets"]) || 0,
      }))
      .filter(r => !isNaN(r.d))
      .sort((a,b) => a.d - b.d);

    const def = exercises.find(e => (e["Exercise"]||"").trim().toLowerCase() === name.trim().toLowerCase()) || {};
    const meta = [def["Sets"] && def["Reps"] ? `${def["Sets"]}×${def["Reps"]}` : "", def["Target Weight"] ? `Target ${def["Target Weight"]} lbs` : ""].filter(Boolean).join(" · ");

    let body = `<span class="modal-close" onclick="closeModal()">✕</span>
      <div class="modal-handle"></div>
      <div class="modal-title">${name}</div>
      <div class="modal-meta">${meta || "&nbsp;"}</div>`;

    if (entries.length === 0) {
      body += `<div class="no-data">No logged sessions yet.<br>Add rows in your Log tab to see progress.</div>`;
    } else {
      body += `<div class="chart-label">Weight Progression (lbs)</div><div class="chart-box">${lineChart(entries, e => e.weight)}</div>`;
      body += `<div class="chart-label">Volume — Sets × Reps × Weight</div><div class="chart-box">${lineChart(entries, e => e.sets * e.reps * e.weight)}</div>`;
      body += `<table class="log-table"><thead><tr><th>Date</th><th>Weight</th><th>Reps</th><th>Sets</th></tr></thead><tbody>`;
      [...entries].reverse().forEach(e => {
        body += `<tr><td>${fmtDate(e.d)}</td><td>${e.weight || "—"}</td><td>${e.reps || "—"}</td><td>${e.sets || "—"}</td></tr>`;
      });
      body += `</tbody></table>`;
    }

    document.getElementById("modal").innerHTML = body;
    document.getElementById("modalOverlay").classList.add("open");
  }

  function closeModal() { document.getElementById("modalOverlay").classList.remove("open"); }

  function fmtDate(d) { return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }); }

  // Lightweight inline SVG line chart
  function lineChart(entries, valueFn) {
    var W = 480, H = 150, PAD = 28;
    var vals = entries.map(valueFn);
    var max = Math.max.apply(null, vals), min = Math.min.apply(null, vals);
    var range = (max - min) || 1;
    var n = entries.length;
    function x(i) { return n === 1 ? W / 2 : PAD + (i / (n - 1)) * (W - PAD * 2); }
    function y(v) { return H - PAD - ((v - min) / range) * (H - PAD * 2); }

    var ptArr = entries.map(function (e, i) { return x(i) + "," + y(valueFn(e)); });
    var pts = ptArr.join(" ");
    var dots = entries.map(function (e, i) {
      return '<circle cx="' + x(i) + '" cy="' + y(valueFn(e)) + '" r="3.5" fill="#e01a32"/>';
    }).join("");

    var areaCmd = "M " + x(0) + "," + (H - PAD) + " L " + ptArr.join(" L ") + " L " + x(n - 1) + "," + (H - PAD) + " Z";
    var yTop = max.toFixed(0), yBot = min.toFixed(0);

    var areaPath = (n > 1) ? '<path d="' + areaCmd + '" fill="url(#g)"/>' : "";
    var linePath = (n > 1) ? '<polyline points="' + pts + '" fill="none" stroke="#e01a32" stroke-width="2"/>' : "";

    return '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto;display:block">'
      + '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0%" stop-color="#c0152a" stop-opacity="0.3"/>'
      + '<stop offset="100%" stop-color="#c0152a" stop-opacity="0"/>'
      + '</linearGradient></defs>'
      + '<line x1="' + PAD + '" y1="' + PAD + '" x2="' + PAD + '" y2="' + (H - PAD) + '" stroke="#222" stroke-width="1"/>'
      + '<line x1="' + PAD + '" y1="' + (H - PAD) + '" x2="' + (W - PAD) + '" y2="' + (H - PAD) + '" stroke="#222" stroke-width="1"/>'
      + '<text x="4" y="' + (PAD + 4) + '" fill="#444" font-size="9" font-family="monospace">' + yTop + '</text>'
      + '<text x="4" y="' + (H - PAD) + '" fill="#444" font-size="9" font-family="monospace">' + yBot + '</text>'
      + areaPath + linePath + dots
      + '</svg>';
  }

  init();
</script>
</body>
</html>
