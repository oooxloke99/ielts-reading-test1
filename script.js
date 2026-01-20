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
    range.surroundContents(mark);
  
    selection.removeAllRanges();
  }
  
  // Remove highlight when clicking on it
  document.addEventListener("click", function (e) {
    if (e.target.tagName === "MARK") {
      const text = document.createTextNode(e.target.textContent);
      e.target.parentNode.replaceChild(text, e.target);
    }
  });
  