import { ProjectFactory } from "./project";
import { TodoFactory, PriorityManager } from "./todo";
import { saveAllProjects, loadAllProjects, clearStorage } from "./storage";
import { renderProjects, renderPriority, renderTodos } from "./dom.js";

class ProjectController {
  constructor() {
    this.projects = loadAllProjects();
    this.currentProject = this.projects.length > 0 ? this.projects[0] : null;
    this.currentTodoType = "note";
    this.currentEditingTodo = null;
    this.init();
    this.priorityManager = new PriorityManager();
  }

  init() {
    this.currentTodoType = "note";
    this.priorityManager = new PriorityManager();
    this.projects = loadAllProjects();

    if (this.projects.length > 0) {
      this.currentProject = this.projects[0];
    } else {
      this.currentProject = null;
    }

    this.#setupEventListeners();
    renderPriority(this.priorityManager);
    renderProjects(this.projects, this.currentProject, this.currentTodoType);
  }

  #setupEventListeners() {
    const newBtn = document.querySelector("#newProjectBtn");
    if (newBtn) {
      newBtn.addEventListener("click", () => {
        const name = prompt("Enter project name : ");
        if (!name) return;
        const description = prompt("Enter project description : ") || "";
        const color = prompt(
          "Enter project color (#ffffff or press Enter to generate): ",
        );
        const project = ProjectFactory.createProject(
          null,
          name,
          description,
          colorValidator(color) ? color : randomColor(),
        );
        this.addProject(project);
      });
    }

    const clearBtn = document.querySelector("#clearProjectBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (!this.currentProject) return;
        if (
          confirm(
            `Are you sure you want to delete "${this.currentProject.name}" ?`,
          )
        ) {
          this.removeProject(this.currentProject.id);
        }
      });
    }

    document.addEventListener("projectSelected", (e) => {
      this.selectProject(e.detail.project);
    });

    const openDialog = document.querySelector("#open-dialog");
    const dialogTodo = document.querySelector("#newTodoDiag");
    if (openDialog) {
      openDialog.addEventListener("click", () => {
        if (!this.currentProject) {
          alert("Please select a project first");
          return;
        }
        if (dialogTodo) {
          dialogTodo.showModal();
        }
      });
    }

    const closeDialogTodo = document.querySelector("#close-dialog-todo");
    if (closeDialogTodo) {
      closeDialogTodo.addEventListener("click", () => {
        if (dialogTodo) {
          dialogTodo.close();
        }
      });
    }

    const addTodoBtn = document.querySelector("#addTodoBtn");
    const todoForm = document.querySelector("#todoForm");
    if (addTodoBtn) {
      addTodoBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const newTodo = createTodoFromForm(todoForm, this.currentTodoType);
        this.currentProject.addTodo(newTodo);

        saveAllProjects(this.projects);
        renderProjects(
          this.projects,
          this.currentProject,
          this.currentTodoType,
        );
        alert("Todo added");
        dialogTodo.close();
      });
    }

    const todosTab = document.querySelectorAll(".todos-tab-item");
    todosTab[0].classList.add("todos-tab-item__active");
    if (todosTab) {
      todosTab.forEach((tab) => {
        tab.addEventListener("click", () => {
          todosTab.forEach((tab) =>
            tab.classList.remove("todos-tab-item__active"),
          );
          tab.classList.add("todos-tab-item__active");

          this.currentTodoType = tab.getAttribute("value");

          const todos = this.currentProject
            ? this.currentProject.getTodos()
            : [];
          renderTodos(todos, this.currentTodoType || "");
        });
      });
    }

    document.addEventListener("todoSelected", (e) => {
      this.showNoteDialog(e.detail.todo);
    });

    const saveNoteBtn = document.getElementById("saveNote");
    if (saveNoteBtn) {
      saveNoteBtn.addEventListener("click", (e) => {
        if (!this.currentProject) return;
        e.preventDefault();
        this.saveNoteContent();
      });
    }

    const closeNoteBtn = document.getElementById("close-dialog-note");
    if (closeNoteBtn) {
      closeNoteBtn.addEventListener("click", () => {
        this.closeNoteDialog();
      });
    }

    document.addEventListener("todoDeleted", (e) => {
      const todo = e.detail.todo;

      if (confirm(`Are you sure you want to delete "${todo.title}"?`)) {
        this.deleteTodo(todo);
      }
    });

    document.addEventListener("todoCompletedChanged", (e) => {
      saveAllProjects(this.projects);
      renderProjects(this.projects, this.currentProject, this.currentTodoType);
    });
  }

  addProject(project) {
    this.projects.push(project);
    this.currentProject = project;
    saveAllProjects(this.projects);
    renderProjects(this.projects, this.currentProject, this.currentTodoType);
  }

  selectProject(project) {
    this.currentProject = project;
    renderProjects(this.projects, this.currentProject, this.currentTodoType);
  }

  removeProject(projectId) {
    this.projects = this.projects.filter((p) => p.id !== projectId);

    if (this.currentProject?.id === projectId) {
      this.currentProject = this.projects[0] || null;
    }

    saveAllProjects(this.projects);
    renderProjects(this.projects, this.currentProject, this.currentTodoType);
  }

  showNoteDialog(todo) {
    this.currentEditingTodo = todo;
    const dialog = document.querySelector("#noteDiag");
    const textarea = document.querySelector("#note-text");

    if (dialog && textarea) {
      textarea.value = todo.content || "";
      dialog.showModal();
    }
  }

  closeNoteDialog() {
    const noteDialog = document.querySelector("#noteDiag");
    if (noteDialog) {
      noteDialog.close();
      this.currentEditingTodo = null;
    }
  }

  saveNoteContent() {
    if (!this.currentEditingTodo) return;

    const textarea = document.querySelector("#note-text");
    const noteDialog = document.querySelector("#noteDiag");
    if (textarea && noteDialog) {
      this.currentEditingTodo.setContent(textarea.value);
      saveAllProjects(this.projects);
      renderProjects(this.projects, this.currentProject, this.currentTodoType);
      noteDialog.close();
      this.currentEditingTodo = null;
      alert("Note saved successfully!");
    }
  }

  deleteTodo(todo) {
    if (!this.currentProject) return;

    this.currentProject.removeTodo(todo.id);
    saveAllProjects(this.projects);
    renderProjects(this.projects, this.currentProject, this.currentTodoType);
    alert("Todo deleted successfully!");
  }
}

const projectController = new ProjectController();
export { projectController };

function colorValidator(color) {
  if (color.length !== 7) return false;
  if (!color.startsWith("#")) return false;
  const hex = color.slice(1);
  if (!hex.match(/^[0-9A-Fa-f]{6}$/)) return false;
  return true;
}

function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function createTodoFromForm(formElement, todoType) {
  const formData = new FormData(formElement);
  const title = formData.get("todo-input-title");
  const dateStr = formData.get("todo-input-date");
  const dueDate = dateStr ? new Date(dateStr) : new Date();
  const desc = formData.get("todo-input-desc");
  const prio = formData.get("todo-input-prio");

  return TodoFactory.createTodo(
    crypto.randomUUID(),
    todoType,
    title,
    desc,
    dueDate,
    prio,
  );
}
