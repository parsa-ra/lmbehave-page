# LMBehave project page

Website for *Do Knowledge- and Reasoning-Oriented Benchmarks Induce Stable Representation Signatures in LLMs?*, accepted at the NeurIPS 2026 Interpretability as a Science Workshop.

- **Project page:** https://parsa-ra.github.io/lmbehave/
- **Paper:** https://arxiv.org/abs/2610.24029
- **Research code:** https://github.com/parsa-ra/lmbehave
- **Artifacts:** https://drive.google.com/drive/folders/1eS3xhP3qB_QBep2mUcOfbvddVSj4qHy2?usp=drive_link

## Preview and edit

Open `index.html` directly in a browser. This is a static website; no server, build tool, package installation, or external font service is needed.

Edit `index.html` and `static/css/index.css` for the page and its paper-matched blue/orange palette. `static/js/evidence.js` and `static/css/evidence.css` render the matched-probe, holdout-control, and localization charts; `static/js/index.js` handles the interactive training endpoint chart and citation copying. All charts work when opening the HTML directly, without fetching data.

The paper’s main overview figure is displayed prominently near the top, with a full-size vector link. Boxes use complete borders rather than contrasting accent strips. The full abstract, exact numerical tables, detailed trajectory figure, and methodological caveats are available in native expandable sections. `static/data/evidence-provenance.json` records the full-precision plotted data, source CSV SHA-256 values, and research-source revision. Preserve the distinction between raw PCA-95 and matched-64 probes, task versus example inference, descriptive training endpoints, and non-rejection versus equivalence.

The page, chart labels, buttons, tables, and citation share the self-hosted TeX Gyre Termes family used in the main figure. Font licenses are in `static/fonts/`; logo/icon sources and notices are in `static/images/ASSET_SOURCES.md`. Official EPFL and Idiap logos identify the numbered affiliations. Resource links use GitHub, arXiv, PDF, and storage marks.

The bundled PDF and original figures are unchanged. The venue is displayed as “NeurIPS 2026 · Interpretability as a Science,” with Sydney, Australia verified against the [event page](https://interpscience.github.io/).

## Publishing

This repository owns the website source. To preserve the published address `/lmbehave/`, GitHub Pages runs in **parsa-ra/lmbehave**, whose Pages workflow checks out this repository. After pushing a website change, publish it immediately with:

```sh
gh workflow run pages.yml --repo parsa-ra/lmbehave
```

The deployment workflow also refreshes the page daily. No cross-repository secret is required because the source is public. Pages is not enabled on this repository.

## Attribution

Adapted from the [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template) and [Nerfies](https://nerfies.github.io). The research code and page are MIT licensed; the article and third-party assets retain their respective terms.
