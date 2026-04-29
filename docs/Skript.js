let editMode = false;

document.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  setReadonly(true);
  activateCheckboxes(); // ✅ NEU, sonst nichts
});

/* ✅ NEU: Abhaken → Eintrag verschwindet */
function activateCheckboxes() {
  document.querySelectorAll(".check").forEach(box => {
    box.addEventListener("change", function () {
      if (this.checked) {
        this.parentElement.remove();
        saveTodos();
      }
    });
  });
}

/* ADD */
document.getElementById("addBtn").addEventListener("click", () => {
  const container = document.getElementById("listContainer");

  const row = document.createElement("div");
  row.className = "row";

  row.innerHTML = `
    <input type="checkbox" class="check">
    <input type="text" class="todo" placeholder="To Do">
    <input type="text" class="date" placeholder="TT.MM.JJJJ">
    <input type="text" class="time" placeholder="HH:MM">
  `;

  container.appendChild(row);

  if (!editMode) {
    row.querySelectorAll(".todo, .date, .time")
      .forEach(i => i.setAttribute("readonly", "readonly"));
  } else {
    row.querySelector(".todo").focus();
  }

  activateCheckboxes(); // ✅ nur für neue Zeilen
});

/* BEARBEITEN */
document.getElementById("editBtn").addEventListener("click", () => {
  editMode = !editMode;

  document.querySelectorAll(".todo, .date, .time").forEach(input => {
    editMode
      ? input.removeAttribute("readonly")
      : input.setAttribute("readonly", "readonly");
  });

  document.getElementById("editBtn").innerText =
    editMode ? "FERTIG" : "BEARBEITEN";

  if (!editMode) saveTodos();
});

/* SPEICHERN */
document.getElementById("saveBtn").addEventListener("click", saveTodos);

function saveTodos() {
  const data = [];

  document.querySelectorAll(".row").forEach(row => {
    data.push({
      checked: row.querySelector(".check").checked,
      todo: row.querySelector(".todo").value,
      date: row.querySelector(".date").value,
      time: row.querySelector(".time").value
    });
  });

  localStorage.setItem("todos", JSON.stringify(data));
}

/* LADEN */
function loadTodos() {
  const stored = localStorage.getItem("todos");
  if (!stored) return;

  const container = document.getElementById("listContainer");
  container.innerHTML = "";

  JSON.parse(stored).forEach(item => {
    const row = document.createElement("div");
    row.className = "row";

    row.innerHTML = `
      <input type="checkbox" class="check">
      <input type="text" class="todo" value="${item.todo}" readonly>
      <input type="text" class="date" value="${item.date}" readonly>
      <input type="text" class="time" value="${item.time}" readonly>
    `;

    container.appendChild(row);
  });
}

/* READONLY initial */
function setReadonly(state) {
  document.querySelectorAll(".todo, .date, .time").forEach(input => {
    state
      ? input.setAttribute("readonly", "readonly")
      : input.removeAttribute("readonly");
  });
}
