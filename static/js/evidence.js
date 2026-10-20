/* Empirical charts for LMBehave. No network requests, dependencies, or build step.
 *
 * Values are copied at full CSV precision from the public, sample-free summaries:
 *  - results/representation_dynamics_main_track_instrument_validation_v1/
 *      matched_excess_summary.csv
 *  - results/representation_dynamics_main_track_review_response_v1/
 *      inference_unit_contrast.csv
 *  - results/representation_dynamics_main_track_v1/main_track_model_summary.csv
 *  - results/representation_dynamics_main_track_fisher_v1/
 *      calibrated_model_summary.csv
 *  - results/representation_dynamics_text_expansion_corrected_v1/
 *      fdr_profile_replication.csv
 *
 * Cross-checked against the complete paper, including its appendices.
 * These matched-64 scores are distinct from the raw PCA-95 probe scores.
 * Exact p-values test task-label assignments, with site reselection. They are
 * not confidence intervals or effect sizes. The example-split control instead
 * deliberately uses the invalid sample-level inference described in the paper.
 */
(() => {
  "use strict";

  const SOURCE = "https://github.com/parsa-ra/lmbehave/blob/main/results/";
  const PROMPT_F1 = 0.7554763117677026;
  const MATCHED = [
    { model: "OLMo 3 7B", f1: 0.8030843092185846, delta: 0.04760799745088207, p: 0.2896658896658897 },
    { model: "Apertus 1.5 8B", f1: 0.824982498249825, delta: 0.06950618648212237, p: 0.177000777000777 },
    { model: "Qwen 3.5 9B", f1: 0.8022401311723686, delta: 0.04676381940466601, p: 0.2909090909090909 },
    { model: "Qwen 3.5 27B", f1: 0.7726773697738398, delta: 0.01720105800613725, p: 0.43962703962703964 },
    { model: "Gemma 4 31B", f1: 0.8065751158730078, delta: 0.05109880410530521, p: 0.29681429681429683 }
  ];
  const HOLDOUT = [
    {
      label: "Examples split at random",
      detail: "Train and test share every subject",
      f1: 0.8022401311723686,
      p: 0.0001,
      inference: "9,999 sample-label permutations",
      kind: "example"
    },
    {
      label: "Whole subjects held out",
      detail: "Test subjects excluded from probe fitting",
      f1: 0.5737440057750812,
      p: 0.22766122766122765,
      inference: "12,870 balanced task-label assignments",
      kind: "subject"
    }
  ];
  const PANELS = [
    { label: "MMLU-Pro", detail: "5 + 5 subjects" },
    { label: "MMLU", detail: "8 + 8 subjects" },
    { label: "Mixed benchmarks", detail: "5 + 5 tasks" }
  ];
  const SITES = [
    { model: "OLMo 3 7B", layers: 32, sites: [{ layer: 3, stream: "ffn" }, { layer: 3, stream: "ffn" }, { layer: 5, stream: "mix" }] },
    { model: "Apertus 1.5 8B", layers: 32, sites: [{ layer: 0, stream: "ffn" }, { layer: 0, stream: "ffn" }, { layer: 8, stream: "mix" }] },
    { model: "Qwen 3.5 9B", layers: 32, sites: [{ layer: 1, stream: "mix" }, { layer: 2, stream: "ffn" }, { layer: 11, stream: "mix" }] },
    { model: "Qwen 3.5 27B", layers: 64, sites: [{ layer: 11, stream: "ffn" }, { layer: 1, stream: "mix" }, { layer: 5, stream: "ffn" }] },
    { model: "Gemma 4 31B", layers: 60, sites: [{ layer: 12, stream: "mix" }, { layer: 23, stream: "ffn" }, { layer: 14, stream: "ffn" }] }
  ];

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function text(tag, className, content, parent) {
    const node = el(tag, className, content);
    parent.append(node);
    return node;
  }

  function figure(host, title, description) {
    const root = el("figure", "evidence-root");
    const caption = el("figcaption", "evidence-caption");
    const heading = text("strong", "evidence-title", title, caption);
    const desc = text("p", "evidence-description", description, caption);
    heading.id = `${host.id}-title`;
    desc.id = `${host.id}-description`;
    root.setAttribute("aria-labelledby", heading.id);
    root.setAttribute("aria-describedby", desc.id);
    root.append(caption);
    return root;
  }

  function legend(items) {
    const root = el("ul", "evidence-legend");
    root.setAttribute("aria-label", "Chart key");
    items.forEach(({ kind, label }) => {
      const item = el("li", "evidence-legend-item");
      const mark = el("span", `evidence-key evidence-key-${kind}`);
      mark.setAttribute("aria-hidden", "true");
      item.append(mark, el("span", "", label));
      root.append(item);
    });
    return root;
  }

  function scale(label, percent = false) {
    const root = el("div", "evidence-scale");
    root.setAttribute("aria-hidden", "true");
    const ticks = el("div", "evidence-ticks");
    [0, 0.25, 0.5, 0.75, 1].forEach(value => {
      const tick = el("span", "evidence-tick", percent ? `${value * 100}%` : value.toFixed(2));
      tick.style.left = `${value * 100}%`;
      ticks.append(tick);
    });
    root.append(ticks, el("div", "evidence-axis-label", label));
    return root;
  }

  function rail() {
    const root = el("div", "evidence-rail");
    root.setAttribute("aria-hidden", "true");
    root.append(el("span", "evidence-track"));
    [0, 0.25, 0.5, 0.75, 1].forEach(value => {
      const grid = el("span", "evidence-gridline");
      grid.style.left = `${value * 100}%`;
      root.append(grid);
    });
    return root;
  }

  function marker(root, kind, fraction) {
    const mark = el("span", `evidence-marker evidence-marker-${kind}`);
    mark.style.left = `${fraction * 100}%`;
    root.append(mark);
  }

  function source(root, path, label) {
    const note = el("p", "evidence-source");
    note.append(document.createTextNode("Source: "));
    const link = el("a", "", label);
    link.href = SOURCE + path;
    note.append(link);
    root.append(note);
  }

  function renderMatched(host) {
    const root = figure(
      host,
      "Activations and prompt text under the same probe",
      "Held-out-subject macro-F1. Both inputs use 64 fold-local features, identical folds, scaling, and a logistic classifier."
    );
    root.append(legend([
      { kind: "activation", label: "Activations" },
      { kind: "prompt", label: "Prompt text" }
    ]));
    const rows = el("div", "evidence-matched-rows");
    rows.setAttribute("role", "list");
    MATCHED.forEach(row => {
      const item = el("div", "evidence-matched-row");
      item.setAttribute("role", "listitem");
      const label = el("div", "evidence-row-label");
      text("strong", "evidence-model", row.model, label);
      text("span", "evidence-score-pair", `Prompt ${PROMPT_F1.toFixed(3)} · Activations ${row.f1.toFixed(3)}`, label);
      const plot = rail();
      const join = el("span", "evidence-pair-join");
      join.style.left = `${PROMPT_F1 * 100}%`;
      join.style.width = `${row.delta * 100}%`;
      plot.append(join);
      marker(plot, "prompt", PROMPT_F1);
      marker(plot, "activation", row.f1);
      const stats = el("div", "evidence-row-stats");
      text("strong", "evidence-gain", `+${row.delta.toFixed(4)} F1`, stats);
      text("span", "evidence-pvalue", `Exact p = ${row.p.toFixed(4)}`, stats);
      item.append(label, plot, stats);
      rows.append(item);
    });
    root.append(rows);
    const footer = el("div", "evidence-matched-axis");
    footer.append(el("span"), scale("Macro-F1 · full 0–1 scale"), el("span"));
    root.append(footer);
    text("p", "evidence-note",
      "p tests the activation-minus-prompt gain, with the site reselected for all 12,870 balanced task-label assignments. No gain meets α = 0.01; this does not establish equivalence.", root);
    text("p", "evidence-method-note",
      "Probe fitting holds out subjects; site choice uses all subjects. These matched-64 scores differ from the raw PCA-95 probe scores. Minimum attainable exact p: 2/12,870.", root);
    source(root, "representation_dynamics_main_track_instrument_validation_v1/matched_excess_summary.csv", "Matched probe results (CSV)");
    host.append(root);
  }

  function renderHoldout(host) {
    const root = figure(
      host,
      "The same arbitrary label, two validation rules",
      "OLMo 3 7B · alphabetical 8 + 8 subject partition · layer 0 feed-forward site. This is a negative control, not the knowledge/reasoning partition."
    );
    const rows = el("div", "evidence-holdout-rows");
    rows.setAttribute("role", "list");
    HOLDOUT.forEach(row => {
      const item = el("div", `evidence-holdout-row evidence-holdout-${row.kind}`);
      item.setAttribute("role", "listitem");
      const heading = el("div", "evidence-holdout-heading");
      const label = el("div", "evidence-row-label");
      text("strong", "evidence-model", row.label, label);
      text("span", "evidence-row-detail", row.detail, label);
      const score = el("strong", "evidence-holdout-score", row.f1.toFixed(3));
      score.setAttribute("aria-label", `Macro-F1 ${row.f1.toFixed(3)}`);
      heading.append(label, score);
      const plot = rail();
      const bar = el("span", "evidence-bar");
      bar.style.width = `${row.f1 * 100}%`;
      plot.append(bar);
      const inference = el("p", "evidence-inference");
      text("strong", "", `p = ${row.p.toFixed(4)}`, inference);
      inference.append(document.createTextNode(` · ${row.inference}`));
      item.append(heading, plot, inference);
      rows.append(item);
    });
    root.append(rows, scale("Macro-F1 · full 0–1 scale"));
    text("p", "evidence-note",
      "Sharing subjects between training and test inflates the score. The sample-label test is deliberately invalid for a claim about benchmark categories; whole tasks are the inference unit.", root);
    source(root, "representation_dynamics_main_track_review_response_v1/inference_unit_contrast.csv", "Inference-unit contrast (CSV)");
    host.append(root);
  }

  function renderSites(host) {
    const root = figure(
      host,
      "Selected sites across three task panels",
      "Each marker is the layer and stream with the largest PCA-space mean-shift ratio within that model and panel."
    );
    root.append(legend([
      { kind: "mix", label: "Token mixing" },
      { kind: "ffn", label: "Feed-forward (FFN)" }
    ]));
    const grid = el("div", "evidence-sites");
    const head = el("div", "evidence-sites-header");
    head.setAttribute("aria-hidden", "true");
    text("strong", "evidence-sites-model-heading", "Model", head);
    PANELS.forEach(panel => {
      const label = el("div", "evidence-panel-heading");
      text("strong", "", panel.label, label);
      text("span", "", panel.detail, label);
      head.append(label);
    });
    grid.append(head);
    const rows = el("div", "evidence-site-rows");
    rows.setAttribute("role", "list");
    SITES.forEach(row => {
      const item = el("div", "evidence-site-row");
      item.setAttribute("role", "listitem");
      const name = el("div", "evidence-site-model");
      text("strong", "evidence-model", row.model, name);
      text("span", "evidence-row-detail", `${row.layers} layers`, name);
      item.append(name);
      row.sites.forEach((site, i) => {
        const cell = el("div", "evidence-site-cell");
        const panel = text("span", "evidence-mobile-panel", PANELS[i].label, cell);
        panel.append(el("span", "evidence-sr-only", `, ${PANELS[i].detail}: `));
        const plot = rail();
        const position = site.layer / (row.layers - 1);
        marker(plot, site.stream, position);
        const stream = site.stream === "ffn" ? "FFN" : "token mixing";
        const label = el("p", "evidence-site-value", `L${site.layer} · ${stream}`);
        label.append(el("span", "evidence-sr-only", `; ${(position * 100).toFixed(1)}% normalized depth, with layer 0 at 0% and layer ${row.layers - 1} at 100%.`));
        cell.append(plot, label);
        item.append(cell);
      });
      const mobileAxis = el("div", "evidence-site-mobile-axis");
      mobileAxis.setAttribute("aria-hidden", "true");
      mobileAxis.append(el("span"), scale("", true), el("span"));
      item.append(mobileAxis);
      rows.append(item);
    });
    grid.append(rows);
    const axes = el("div", "evidence-sites-axes");
    axes.setAttribute("aria-hidden", "true");
    axes.append(el("span"));
    PANELS.forEach(() => axes.append(scale("", true)));
    grid.append(axes);
    root.append(grid);
    text("p", "evidence-depth-label",
      "Normalized decoder depth: 0% = first layer; 100% = final layer. Position = zero-based layer / (number of layers − 1).", root);
    text("p", "evidence-note",
      "Two models retain their site across MMLU-Pro and MMLU; none retains it across all three panels. Mixed-benchmark sites are descriptive. Site location alone does not establish causal importance.", root);
    const sources = el("p", "evidence-source");
    sources.append(document.createTextNode("Sources: "));
    [
      ["representation_dynamics_main_track_fisher_v1/calibrated_model_summary.csv", "MMLU-Pro"],
      ["representation_dynamics_main_track_v1/main_track_model_summary.csv", "MMLU"],
      ["representation_dynamics_text_expansion_corrected_v1/fdr_profile_replication.csv", "Cross-panel comparison"]
    ].forEach(([path, label], i) => {
      if (i) sources.append(document.createTextNode(" · "));
      const link = el("a", "", label);
      link.href = SOURCE + path;
      sources.append(link);
    });
    root.append(sources);
    host.append(root);
  }

  function init() {
    [
      ["matched-probe-chart", renderMatched],
      ["holdout-chart", renderHoldout],
      ["localization-chart", renderSites]
    ].forEach(([id, render]) => {
      const host = document.getElementById(id);
      if (host && !host.querySelector(".evidence-root")) render(host);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
