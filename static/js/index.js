"use strict";
const trajectories = [{"model": "OLMo 3 7B", "checkpoints": 7, "streams": [{"key": "attention_delta", "label": "Token mixing", "color": "#16828A", "first": 0.19736951634091845, "last": 0.12253748878758088}, {"key": "mlp_delta", "label": "Feed-forward", "color": "#76529A", "first": 0.2913265997614004, "last": 0.1450654625091521}, {"key": "residual_state", "label": "Residual state", "color": "#62666A", "first": 0.2753317344652832, "last": 0.15565625852982917}], "accuracy": {"knowledge": [0.2833333333333333, 0.5854166666666667], "reasoning": [0.2791666666666667, 0.4604166666666667]}}, {"model": "Apertus 1.0 8B", "checkpoints": 11, "streams": [{"key": "attention_delta", "label": "Token mixing", "color": "#16828A", "first": 0.174436, "last": 0.235188}, {"key": "mlp_delta", "label": "Feed-forward", "color": "#76529A", "first": 0.273364, "last": 0.336932}, {"key": "residual_state", "label": "Residual state", "color": "#62666A", "first": 0.25213, "last": 0.323192}], "accuracy": {"knowledge": [0.260417, 0.620833], "reasoning": [0.254167, 0.433333]}}];

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[character]));
function drawTrajectories(stream = "all") {
  const mount = document.getElementById("trajectory-chart");
  mount.innerHTML = trajectories.map(model => {
    const selected = model.streams.filter(row => stream === "all" || stream === row.key);
    const marks = selected.map(row => {
      const first = row.first / .4 * 100, last = row.last / .4 * 100;
      return `<div class="trajectory-row"><div class="trajectory-row-label"><span>${escapeHtml(row.label)}</span><strong>${row.first.toFixed(3)} → ${row.last.toFixed(3)}</strong></div><div class="trajectory-rail" aria-hidden="true"><span class="trajectory-track"></span>${[0,25,50,75,100].map(value => `<i class="trajectory-gridline" style="left:${value}%"></i>`).join("")}<span class="trajectory-join" style="left:${Math.min(first,last)}%;width:${Math.abs(last-first)}%;background:${row.color}"></span><span class="trajectory-marker trajectory-first" style="left:${first}%;border-color:${row.color}"></span><span class="trajectory-marker trajectory-final" style="left:${last}%;background:${row.color};border-color:${row.color}"></span><span class="trajectory-arrow ${last>first ? "right" : "left"}" style="left:${last}%;color:${row.color}"></span></div></div>`;
    }).join("");
    const ticks = `<div class="trajectory-axis"><span></span><div>${[0,.1,.2,.3,.4].map(value => `<span style="left:${value/.4*100}%">${value.toFixed(1)}</span>`).join("")}</div></div>`;
    const accuracy = Object.entries(model.accuracy).map(([group, values]) => `<span><b>${group === "knowledge" ? "Knowledge" : "Reasoning"}</b> ${(values[0] * 100).toFixed(1)} → ${(values[1] * 100).toFixed(1)}%</span>`).join("");
    return `<figure class="trajectory-card"><div class="trajectory-card-heading"><h3>${escapeHtml(model.model)}</h3><span>Base run · ${model.checkpoints} checkpoints</span></div><p class="micro-note">Depth-mean mean-shift ratio</p><div class="trajectory-plot">${marks}${ticks}</div><figcaption><span class="endpoint-key"><i class="hollow-marker"></i> First <i class="filled-marker"></i> Final</span><span class="accuracy-caption">Task accuracy also increases:</span><span class="accuracy-pairs">${accuracy}</span></figcaption></figure>`;
  }).join("");
}
drawTrajectories();
document.querySelectorAll("[data-trajectory-stream]").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll("[data-trajectory-stream]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  drawTrajectories(button.dataset.trajectoryStream);
}));
document.querySelector(".copy-citation").addEventListener("click", async () => {
  const citation = document.getElementById("citation");
  const status = document.getElementById("copy-status");
  try {
    await navigator.clipboard.writeText(citation.textContent.trim());
    status.textContent = "BibTeX copied.";
  } catch {
    const selection = window.getSelection(), range = document.createRange();
    range.selectNodeContents(citation);
    selection.removeAllRanges(); selection.addRange(range);
    status.textContent = "Citation selected. Press Ctrl+C or ⌘C to copy.";
  }
});
