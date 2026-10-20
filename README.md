# LMBehave project page

Website for *Do Knowledge- and Reasoning-Oriented Benchmarks Induce Stable Representation Signatures in LLMs?*, accepted at the NeurIPS 2026 Interpretability as a Science Workshop.

- **Project page:** https://parsa-ra.github.io/lmbehave/
- **Paper:** https://arxiv.org/abs/2610.24029
- **Research code:** https://github.com/parsa-ra/lmbehave
- **Artifacts:** https://drive.google.com/drive/folders/1eS3xhP3qB_QBep2mUcOfbvddVSj4qHy2?usp=drive_link

## Preview and edit

Open `index.html` directly in a browser. This is a static website; no server, build tool, package installation, or external font service is needed.

Edit `index.html`, `static/css/index.css`, and `static/js/index.js`. The bundled PDF and figures are in `static/`. Numerical results come from the hash-bound summary tables in the research repository. Preserve their estimator definitions and claim limits when updating the page.

## Publishing

This repository owns the website source. To preserve the published address `/lmbehave/`, GitHub Pages runs in **parsa-ra/lmbehave**, whose Pages workflow checks out this repository. After pushing a website change, publish it immediately with:

```sh
gh workflow run pages.yml --repo parsa-ra/lmbehave
```

The deployment workflow also refreshes the page daily. No cross-repository secret is required because the source is public. Pages is not enabled on this repository.

## Attribution

Adapted from the [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template) and [Nerfies](https://nerfies.github.io). The research code and page are MIT licensed; the article and third-party assets retain their respective terms.
