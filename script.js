function highlightText() {
    const selection = window.getSelection();
  
    if (!selection || selection.rangeCount === 0) {
      alert("Please select text to highlight.");
      return;
    }
  
    const range = selection.getRangeAt(0);
  
    // Prevent highlighting outside passage
    const passage = document.querySelector(".passage");
    if (!passage.contains(range.commonAncestorContainer)) {
      alert("Please select text inside the reading passage.");
      return;
    }
  
    const mark = document.createElement("mark");
    range.surroundContents(mark);
  
    // Clear selection
    selection.removeAllRanges();
  }
  