import { Project, ProjectFactory } from "./project.js";
import {
  Todo,
  TodoFactory,
  PriorityManager,
  NoteTodo,
  CheckListTodo,
} from "./todo.js";

const STORAGE_KEY = "my_todo_projects";

function saveAllProjects(projects) {
  const data = projects.map((project) => ({
    name: project.name,
    color: project.color,
    description: project.description,
    id: project.id,
    todos: project.getTodos().map((todo) => {
      let base = {
        type: todo.type,
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate,
        priority: todo.priority,
        completed: todo.completed,
        id: todo.id,
      };
      if (todo instanceof NoteTodo) base.content = todo.content;
      if (todo instanceof CheckListTodo) base.items = todo.items;
      return base;
    }),
  }));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadAllProjects() {
  const dataStr = localStorage.getItem(STORAGE_KEY);
  if (!dataStr) return [];

  try {
    const data = JSON.parse(dataStr);
    const projects = data.map((projectData) => {
      const project = ProjectFactory.createProject(
        projectData.id,
        projectData.name,
        projectData.description,
        projectData.color,
      );
      projectData.todos.forEach((todoData) => {
        let todo = TodoFactory.createTodo(
          todoData.id,
          todoData.type,
          todoData.title,
          todoData.description,
          todoData.dueDate,
          todoData.priority,
          todoData.completed,
        );
        if (todo instanceof NoteTodo) todo.content = todoData.content;
        if (todo instanceof CheckListTodo) todo.items = todoData.items;
        project.addTodo(todo);
      });
      return project;
    });
    return projects;
  } catch (error) {
    console.error("Error loading projects:", error);
    return [];
  }
}

function clearStorage() {
  loadAllProjects.removeItem(STORAGE_KEY);
}

export { saveAllProjects, loadAllProjects, clearStorage };
