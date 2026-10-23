
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const count = document.querySelector("#task-count");

let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  list.replaceChildren();

  const visibleTasks = tasks.filter(task => {
    if (currentFilter === "pending") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  visibleTasks.forEach(task => {
    const item = document.createElement("li");
    item.className = "task" +
      (task.completed ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task completed");

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.textContent = task.title;

    const remove = document.createElement("button");
    remove.textContent = "Delete";
    remove.className = "delete-button";

    remove.addEventListener("click", () => {
      tasks = tasks.filter(entry => entry.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, text, remove);
    list.append(item);
  });

  count.textContent = `${tasks.length} task(s)`;
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const title = input.value.trim();
  if (!title) return;

  tasks.push({
    id: crypto.randomUUID(),
    title,
    completed: false
  });

  saveTasks();
  input.value = "";
  renderTasks();
});

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

renderTasks();
