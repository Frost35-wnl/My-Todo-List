//Projects DOM manipulation

function renderProjects(projects, currentProject = null, todoType) {
  const projectList = document.querySelector(".project-list");
  if (!projectList) return;

  projectList.innerText = "";

  const root = document.documentElement;
  const clearBtn = document.querySelector("#clearProjectBtn");

  if (!currentProject) {
    clearBtn.className = "project-action-item project-action-item__disable";
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
    const filteredTodos = todos.filter((todo) => todo.type === type);

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

  const todoCheckBox = document.createElement("input");
  todoCheckBox.type = "checkbox";
  todoCheckBox.id = `todo-checkbox-${todo.id}`;
  todoCheckBox.name = `todo-checkbox-${todo.id}`;
  todoCheckBox.value = todo.id;
  todoCheckBox.checked = todo.completed;
  // todoCheckBox.addEventListener("change", () => {
  //   todo.completed = todoCheckBox.checked;
  //   updateTodo(todo);
  // });
  li.appendChild(todoCheckBox);

  const todoTitle = document.createElement("div");
  todoTitle.className = "todo-title";
  todoTitle.textContent = todo.title;
  li.appendChild(todoTitle);

  if (todo.description) {
    const description = document.createElement("div");
    description.className = "todo-description";
    description.textContent = todo.description;
    li.appendChild(description);
  }

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
