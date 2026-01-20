function highlightText() {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    alert("Please select text to highlight.");
    return;
  }

  const range = selection.getRangeAt(0);
  const passage = document.querySelector(".passage");

  if (!passage.contains(range.commonAncestorContainer)) {
    alert("Please select text inside the reading passage.");
    return;
  }

  const mark = document.createElement("mark");
  mark.classList.add("note");
  range.surroundContents(mark);

  selection.removeAllRanges();
}

function addNote() {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    alert("Click on a highlighted text to add a note.");
    return;
  }

  const node = selection.anchorNode.parentElement;

  if (!node || node.tagName !== "MARK") {
    alert("Please click on highlighted text first.");
    return;
  }

  const noteText = prompt("Write your note:");

  if (!noteText) return;

  node.dataset.note = noteText;
}

// Show note on hover
document.addEventListener("mouseover", function (e) {
  if (e.target.tagName === "MARK" && e.target.dataset.note) {
    const tooltip = document.createElement("div");
    tooltip.className = "note-tooltip";
    tooltip.innerText = e.target.dataset.note;

    e.target.appendChild(tooltip);
  }
});

// Hide note
document.addEventListener("mouseout", function (e) {
  if (e.target.tagName === "MARK") {
    const tooltip = e.target.querySelector(".note-tooltip");
    if (tooltip) tooltip.remove();
  }
});

// Remove highlight (click)
document.addEventListener("click", function (e) {
  if (e.target.tagName === "MARK") {
    if (confirm("Remove highlight and note?")) {
      const text = document.createTextNode(e.target.textContent);
      e.target.parentNode.replaceChild(text, e.target);
    }
  }
});
