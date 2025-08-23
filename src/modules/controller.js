import { ProjectFactory } from "./project";
import { TodoFactory } from "./todo";
import { saveAllProjects, loadAllProjects, clearStorage } from "./storage";
import { renderProjects } from "./dom.js";

class ProjectController {
  constructor() {
    this.projects = loadAllProjects();
    this.currentProject = this.projects[0] || null;
    this.init();
  }

  init() {
    this.projects = loadAllProjects();
    this.#setupEventListeners();
    renderProjects(this.projects, this.currentProject);
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
  }

  addProject(project) {
    this.projects.push(project);
    this.currentProject = project;
    saveAllProjects(this.projects);
    renderProjects(this.projects, this.currentProject);
  }

  selectProject(project) {
    this.currentProject = project;
    renderProjects(this.projects, this.currentProject);
  }

  removeProject(projectId) {
    this.projects = this.projects.filter((p) => p.id !== projectId);

    if (this.currentProject?.id === projectId) {
      this.currentProject = this.projects[0] || null;
    }

    saveAllProjects(this.projects);
    renderProjects(this.projects, this.currentProject);
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
