let selectedMark = null;

/* Highlight selected text */
function highlightText() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const passage = document.querySelector(".passage");

  if (!passage.contains(range.commonAncestorContainer)) return;

  const mark = document.createElement("mark");
  range.surroundContents(mark);

  selection.removeAllRanges();
  selectMark(mark);
}

/* Add note to selected highlight */
function addNote() {
  if (!selectedMark) return;

  const noteText = prompt("Write your note:");
  if (!noteText) return;

  selectedMark.dataset.note = noteText;
  selectedMark.classList.add("has-note");
}

/* Select a highlight */
function selectMark(mark) {
  clearSelection();
  selectedMark = mark;
  mark.classList.add("selected");
  showTooltip(mark);
}

/* Show tooltip actions */
function showTooltip(mark) {
  removeTooltip();

  const tooltip = document.createElement("div");
  tooltip.className = "action-tooltip";

  const removeHighlightBtn = document.createElement("button");
  removeHighlightBtn.textContent = "Remove highlight";
  removeHighlightBtn.onclick = () => removeHighlight(mark);

  tooltip.appendChild(removeHighlightBtn);

  if (mark.dataset.note) {
    const removeNoteBtn = document.createElement("button");
    removeNoteBtn.textContent = "Remove note";
    removeNoteBtn.onclick = () => removeNote(mark);
    tooltip.appendChild(removeNoteBtn);
  }

  mark.appendChild(tooltip);
}

/* Remove highlight entirely */
function removeHighlight(mark) {
  const textNode = document.createTextNode(mark.firstChild.textContent);
  mark.parentNode.replaceChild(textNode, mark);
  clearSelection();
}

/* Remove only the note */
function removeNote(mark) {
  delete mark.dataset.note;
  mark.classList.remove("has-note");
  removeTooltip();
}

/* Clear current selection */
function clearSelection() {
  document.querySelectorAll("mark").forEach(m => m.classList.remove("selected"));
  removeTooltip();
  selectedMark = null;
}

/* Remove tooltip if exists */
function removeTooltip() {
  const tooltip = document.querySelector(".action-tooltip");
  if (tooltip) tooltip.remove();
}

/* Click handling */
document.addEventListener("click", function (e) {
  if (e.target.tagName === "MARK") {
    selectMark(e.target);
    e.stopPropagation();
  } else {
    clearSelection();
  }
});
