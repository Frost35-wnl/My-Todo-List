//Projects DOM manipulation

function renderProjects(projects, currentProject = null) {
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
function renderTodos(todos) {}

function createTodoElement(todo) {
  if (!todo) return null;

  const li = document.createElement("li");
  li.className = "todo-item";

  const todoName = document.createElement("div");
  todoName.className = "todo-title";
  todoName.textContent = todo.name;
  li.appendChild(todoName);

  if (todo.description) {
    const description = document.createElement("div");
    description.className = "todo-description";
    description.textContent = todo.description;
    li.appendChild(description);
  }

  if (todo.type === "note") {
  }
}

export { renderProjects };
