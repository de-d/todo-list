import { highForm, highTaskContainer, lowTaskContainer, tasks } from "./constants.js";
import data from "/task.json" assert { type: "json" };
export async function createForm(event) {
  event.preventDefault();

  const input = event.target.querySelector("input");
  const inputValue = input.value;
  try {
    if (parseInt(inputValue)) {
      throw new Error("Задача не может состоять только из чисел");
    } else if (inputValue.length < 3 || inputValue.length > 30) {
      throw new Error("Введите от 3 до 30 символов");
    }
  } catch (error) {
    alert(error.message);
    return;
  }
  const task = {
    text: inputValue,
    priority: event.target === highForm ? "high" : "low",
    status: "todo",
  };
  tasks.push(task);

  input.value = "";

  createTaskForm(task);

  arrayLog();
}

const createTaskForm = (task) => {
  const form = document.createElement("form");
  form.classList.add("form", "task-form");

  const radioInput = document.createElement("input");
  radioInput.type = "radio";
  radioInput.className = "input-radio";
  radioInput.addEventListener("change", () => {
    if (radioInput.checked) {
      form.classList.add("completed");
      radioInput.disabled = true;
      task.status = "done";
    } else {
      form.classList.remove("completed");
    }
  });

  const newInput = document.createElement("p");
  newInput.textContent = task.text;
  newInput.className = "text-task";

  const newButton = document.createElement("button");
  newButton.type = "button";
  newButton.className = "form-btn";
  newButton.classList.add("form-btn");
  newButton.innerHTML = '<img src="./assets/close-icon.svg" alt="" class="close-btn-icon">';

  form.appendChild(radioInput);
  form.appendChild(newInput);
  form.appendChild(newButton);

  if (task.priority === "high") {
    highTaskContainer.appendChild(form);
  } else if (task.priority === "low") {
    lowTaskContainer.appendChild(form);
  }

  newButton.addEventListener("click", () => {
    form.remove();
    removeTaskFromArray(task);
  });

  return form;
};

const removeTaskFromArray = (task) => {
  const index = tasks.findIndex((item) => item.text === task.text && item.priority === task.priority);
  if (index !== -1) {
    tasks.splice(index, 1);
  }
};

let isDataLoaded = false;
async function loadFormData() {
  try {
    if (!isDataLoaded) {
      data.forEach((item) => {
        const task = {
          text: item.text,
          priority: item.priority,
          status: item.status,
        };
        tasks.push(task);
        createTaskForm(task);
      });
      isDataLoaded = true;
    }
  } catch (error) {
    console.error("Ошибка при загрузке данных из JSON:", error);
  }
}

loadFormData();

const arrayLog = () => {
  console.clear();
  console.table(tasks);
};
