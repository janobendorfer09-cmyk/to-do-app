let editMode = false;

document.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  setReadonly(true);

  // ✅ Validierung auch für geladene Einträge aktivieren
  activateDateValidation();
  activateTimeValidation();
  activateCheckboxes();
});

/* ✅ Checkbox: Abhaken = Eintrag verschwindet */
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

  // ✅ WICHTIG: Validierung & Checkbox für neue Zeile aktivieren
  activateDateValidation();
  activateTimeValidation();
  activateCheckboxes();
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

/* =========================
   ✅ DATUMSVALIDIERUNG
   ========================= */
function activateDateValidation() {
  document.querySelectorAll(".date").forEach(input => {

    input.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9.]/g, "");
    });

    input.addEventListener("blur", function () {
      if (this.value === "") return;

      if (!isValidDate(this.value)) {
        alert("Bitte ein gültiges Datum im Format TT.MM.JJJJ eingeben.");
        this.value = "";
        this.focus();
      }
    });
  });
}

function isValidDate(value) {
  const match = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return false;

  const day = +match[1];
  const month = +match[2] - 1;
  const year = +match[3];

  const date = new Date(year, month, day);

  return (
    year >= 1900 &&
    year <= 2100 &&
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  );
}

/* =========================
   ✅ UHRZEITVALIDIERUNG
   ========================= */
function activateTimeValidation() {
  document.querySelectorAll(".time").forEach(input => {

    input.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9:]/g, "");
    });

    input.addEventListener("blur", function () {
      if (this.value === "") return;

      if (!isValidTime(this.value)) {
        alert("Bitte eine gültige Uhrzeit im Format HH:MM eingeben.");
        this.value = "";
        this.focus();
      }
    });
  });
}

function isValidTime(value) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}
