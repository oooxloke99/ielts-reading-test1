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

  // Show note content if exists
  if (mark.dataset.note) {
    const noteContent = document.createElement("div");
    noteContent.className = "note-content";
    noteContent.textContent = mark.dataset.note;
    tooltip.appendChild(noteContent);
  }

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

// // answer key
// const answerKey = {
//   1: "D",
//   2: "G",
//   3: "B",
//   4: "C",
//   5: "B",
//   6: "D",
//   7: "E",
//   8: "B",
//   9: "C",
//   10: "A",
//   11: "jackals",
//   12: "diseases",
//   13: "food",
//   14: "foxes"
// };

// // Auto-scoring using data-q
// document.getElementById("submitBtn").addEventListener("click", () => {
//   const blanks = document.querySelectorAll(".blank");
//   let correct = 0;

//   blanks.forEach(blank => {
//     const qNum = blank.dataset.q;   // ← HERE is data-q
//     const userAnswer = blank.value.trim().toLowerCase();
//     const correctAnswer = answerKey[qNum];

//     let isCorrect = false;

//     if (Array.isArray(correctAnswer)) {
//       isCorrect = correctAnswer.some(
//         ans => ans.toLowerCase() === userAnswer
//       );
//     } else {
//       isCorrect = correctAnswer.toLowerCase() === userAnswer;
//     }

//     if (isCorrect) {
//       correct++;
//       blank.style.borderBottomColor = "green";
//     } else {
//       blank.style.borderBottomColor = "red";
//     }

//     blank.disabled = true;
//   });

//   document.getElementById("score").textContent =
//     `Score: ${correct} / ${blanks.length}`;
// });

// // Show correct answer after submit (optional)
// if (userAnswer !== correctAnswer) {
//   blank.title = `Correct answer: ${correctAnswer}`;
// }


// // Prevent scoring if answer missing
// if (!userAnswer) {
//   blank.style.borderBottomColor = "orange";
//   return;
// }

// // Show correct answer on hover (optional)
// if (!isCorrect) {
//   blank.title = "Correct: " + correctAnswer;
// }




/* =========================
   Countdown Timer
========================= */

let timerInterval;
let timeLeft = 25 * 60; // seconds (25 min)

function startTimer() {
  timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      submitTest(); // auto-submit
      return;
    }

    timeLeft--;
    updateClock();
  }, 1000);
}

// let totalTime = 25 * 60; // 60 minutes in seconds
// let timerElement = document.getElementById("timer");

// function startTimer() {
//   updateTimerDisplay();

//   const interval = setInterval(() => {
//     totalTime--;

//     updateTimerDisplay();

//     // Turn red in last 5 minutes
//     if (totalTime <= 300) {
//       timerElement.classList.add("warning");
//     }

//     if (totalTime <= 0) {
//       clearInterval(interval);
//       timerElement.textContent = "00:00";
//       // Future: auto-submit here
//     }
//   }, 1000);
// }

// function updateTimerDisplay() {
//   const minutes = Math.floor(totalTime / 60);
//   const seconds = totalTime % 60;

//   timerElement.textContent =
//     String(minutes).padStart(2, "0") +
//     ":" +
//     String(seconds).padStart(2, "0");
// }

// // Start automatically
// startTimer();

// Collect answers
function submitTest() {
  console.log("submit clicked");

  clearInterval(timerInterval); // ⛔ stop timer safely

  const blanks = document.querySelectorAll(".blank");
  let correct = 0;
  const answers = {};

  blanks.forEach(blank => {
    const q = blank.dataset.q;
    const userAnswer = blank.value.trim().toLowerCase();
    answers[q] = userAnswer;

    if (answerKey[q]?.toLowerCase() === userAnswer) {
      correct++;
      blank.style.borderBottomColor = "green";
    } else {
      blank.style.borderBottomColor = "red";
    }

    blank.disabled = true;
  });

  document.getElementById("score").textContent =
    `Score: ${correct} / ${blanks.length}`;

  sendToGoogle(answers, correct);
}

document.getElementById("submitBtn").addEventListener("click", submitTest);


function sendToGoogle(answers, score) {
  fetch(https://script.google.com/macros/s/AKfycbyF1naYE5EsfeYPUX41z0l2V-7SqXZhlxZyaMRUj_o-X8CNaw2o0-S8ypG5757bqbx7/exec, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      answers,
      score,
      timestamp: new Date().toISOString()
    })
  });
}


// function collectAnswers() {
//   const answers = {};
//   document.querySelectorAll(".blank").forEach(b => {
//     answers[b.dataset.q] = b.value.trim();
//   });
//   return answers;
// }

// // Submit + send to Google Script
// document.getElementById("submitBtn").addEventListener("click", () => {
//   const answers = collectAnswers();

//   const payload = {
//     answers: answers,
//     score: document.getElementById("score").textContent,
//     userAgent: navigator.userAgent
//   };

//   fetch(https://script.google.com/macros/s/AKfycbyF1naYE5EsfeYPUX41z0l2V-7SqXZhlxZyaMRUj_o-X8CNaw2o0-S8ypG5757bqbx7/exec, {
//     method: "POST",
//     mode: "no-cors",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(payload)
//   });

//   alert("Your answers have been submitted!");
// });
