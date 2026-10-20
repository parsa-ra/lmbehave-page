"use strict";
document.querySelector(".copy-citation").addEventListener("click", async () => {
  const citation = document.getElementById("citation");
  const status = document.getElementById("copy-status");
  try {
    await navigator.clipboard.writeText(citation.textContent.trim());
    status.textContent = "BibTeX copied.";
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(citation);
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = "Citation selected. Press Ctrl+C or ⌘C to copy.";
  }
});
