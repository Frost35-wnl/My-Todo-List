import { format } from "date-fns";
import DeleteIcon from "../assets/delete.svg";
import { PriorityManager } from "./todo";
const priorityManager = new PriorityManager();

//Projects DOM manipulation

function renderProjects(projects, currentProject = null, todoType) {
  const projectList = document.querySelector(".project-list");
  if (!projectList) return;

  projectList.innerText = "";

  const root = document.documentElement;
  const clearBtn = document.querySelector("#clearProjectBtn");

  if (!currentProject) {
    clearBtn.className = "project-action-item project-action-item__disable";
    root.style.removeProperty("--project-color");
    renderTodos([], todoType);
  } else {
    root.style.setProperty("--project-color", currentProject.color);
    clearBtn.className = "project-action-item project-action-item__remove";
    renderTodos(currentProject.getTodos(), todoType);
  }

  projects.forEach((project) => {
    const isActive = currentProject && currentProject.id === project.id;
    const projectElement = createProjectElement(project, isActive);
    if (projectElement) {
      projectList.appendChild(projectElement);
    }
  });

  return projectList;
}

function createProjectElement(project, isActive = false) {
  if (!project) return null;
  const li = document.createElement("li");
  li.className = isActive
    ? "project-item project-item__active"
    : "project-item";

  const projectContent = document.createElement("div");
  projectContent.className = "project-item-content";

  const projectName = document.createElement("div");
  projectName.className = "project-item-name";
  projectName.textContent = project.name;
  li.style.setProperty("--project-color", project.color);

  const projectDescription = document.createElement("div");
  projectDescription.className = "project-item-description";
  projectDescription.textContent = project.description;
  li.style.setProperty("--project-description-color", "#999999");

  const todoCount = document.createElement("div");
  todoCount.className = "project-item-todoCount";
  todoCount.textContent = `${project.getTodoCount()} todos`;

  projectContent.appendChild(projectName);
  if (projectDescription) {
    projectContent.appendChild(projectDescription);
  }

  projectContent.appendChild(todoCount);

  li.appendChild(projectContent);

  li.addEventListener("click", () => {
    const event = new CustomEvent("projectSelected", {
      detail: { project },
    });
    document.dispatchEvent(event);
  });

  return li;
}

//Todos DOM manipulation
function renderTodos(todos, type) {
  const todosList = document.querySelector("#todos-content");
  if (!todosList) return;

  if (todos.length == 0) {
    todosList.textContent = "One day, you will be more productive";
    todosList.className = "todos-empty";
  } else {
    todosList.textContent = "";
    todosList.className = "";
    const filteredTodosType = todos.filter((todo) => todo.type === type);
    const sortedTodosPrio = filteredTodosType.sort(compareTodos);

    const filteredTodos = [...sortedTodosPrio];
    if (filteredTodos.length == 0) {
      todosList.textContent = "No todos found";
      todosList.className = "todos-empty";
    } else {
      filteredTodos.forEach((filteredTodo) => {
        const todoElement = createTodoElement(filteredTodo);
        if (todoElement) {
          todosList.appendChild(todoElement);
        }
      });
    }
  }
}

function createTodoElement(todo) {
  if (!todo) return null;

  const li = document.createElement("li");
  li.className = "todo-item";

  const todoInfo = document.createElement("div");
  todoInfo.className = "todo-info";

  const todoTitle = document.createElement("div");
  todoTitle.className = "todo-title";
  todoTitle.textContent = todo.title;
  todoInfo.appendChild(todoTitle);

  if (todo.description) {
    const todoDescription = document.createElement("div");
    todoDescription.className = "todo-description";
    todoDescription.textContent = todo.description;
    todoInfo.appendChild(todoDescription);
  }

  if (todo.type == "checklist") {
    const todoCheckDiv = document.createElement("div");
    todoCheckDiv.className = "todo-check-div";

    const todoCompleted = document.createElement("input");
    todoCompleted.type = "checkbox";
    todoCompleted.checked = todo.completed;
    todoCompleted.checked
      ? (li.className = "todo-item todo-item-done")
      : (li.className = "todo-item");

    todoCompleted.addEventListener("change", () => {
      todo.updateCompletion();
      todoCompleted.checked = todo.completed;
      todoCompleted.checked
        ? (li.className = "todo-item todo-item-done")
        : (li.className = "todo-item");

      const event = new CustomEvent("todoCompletedChanged", {
        detail: { todo },
      });
      document.dispatchEvent(event);
    });
    todoCheckDiv.appendChild(todoCompleted);
    todoCheckDiv.appendChild(todoInfo);

    li.appendChild(todoCheckDiv);
  } else {
    li.appendChild(todoInfo);
  }

  const todoAction = document.createElement("div");
  todoAction.className = "todo-action";

  if (todo.type === "note") {
    const showNoteBtn = document.createElement("button");
    showNoteBtn.className = "show-note-btn";
    showNoteBtn.textContent = "Show Note";

    showNoteBtn.addEventListener("click", () => {
      const event = new CustomEvent("todoSelected", {
        detail: { todo },
      });
      document.dispatchEvent(event);
    });
    todoAction.appendChild(showNoteBtn);
  }

  const todoDueDate = document.createElement("div");
  todoDueDate.textContent = format(todo.dueDate, "MM/dd/yyyy");
  todoDueDate.className = "todo-action-date";
  todoAction.appendChild(todoDueDate);

  const todoPriority = document.createElement("div");
  todoPriority.className = "todo-action-prio";
  todoPriority.textContent = todo.priority.toUpperCase();
  changePriorityColor(todoPriority, todo);
  todoAction.appendChild(todoPriority);

  const todoDelete = document.createElement("img");
  todoDelete.className = "delete-todo-btn";
  todoDelete.src = DeleteIcon;

  todoDelete.addEventListener("click", (e) => {
    const event = new CustomEvent("todoDeleted", {
      detail: { todo },
    });
    document.dispatchEvent(event);
  });

  todoAction.appendChild(todoDelete);

  li.appendChild(todoAction);

  return li;
}

export { renderProjects, renderTodos };

function renderPriority(priorityManager) {
  const priorityDiv = document.querySelector("#todo-input-prio-div");
  if (!priorityDiv) return;
  priorityDiv.innerHTML = "";

  const priorityLabel = document.createElement("label");
  priorityLabel.textContent = "Priotiry : ";
  priorityLabel.setAttribute("for", "todo-input-prio");

  const prioritySelector = document.createElement("select");
  prioritySelector.id = "todo-input-prio";
  prioritySelector.name = "todo-input-prio";

  const priorityItems = priorityManager.all;
  priorityItems.forEach((item) => {
    const option = document.createElement("option");
    option.textContent = item;
    option.value = item;
    prioritySelector.appendChild(option);
  });

  priorityDiv.appendChild(priorityLabel);
  priorityDiv.appendChild(prioritySelector);
}

export { renderPriority };

function changePriorityColor(prioElement, todo) {
  const priorityTable = priorityManager.all;

  switch (todo.priority) {
    case priorityTable[0]:
      prioElement.style.color = "green";
      break;
    case priorityTable[1]:
      prioElement.style.color = "orange";
      break;
    case priorityTable[2]:
      prioElement.style.color = "red";
      break;
    default:
      prioElement.style.color = "var(--text-color)";
      break;
  }
}

function compareTodos(a, b) {
  if (a.type == "checklist" && b.type == "checklist") {
    const completionDiff =
      b.completed === a.completed ? 0 : a.completed ? 1 : -1;
    if (completionDiff !== 0) return completionDiff;
  }

  const priorities = priorityManager.all;
  const prioDiff =
    priorities.indexOf(b.priority) - priorities.indexOf(a.priority);
  if (prioDiff !== 0) return prioDiff;

  return new Date(b.dueDate) - new Date(b.dueDate);
}
