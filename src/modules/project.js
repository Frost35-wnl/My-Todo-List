import { Todo, NoteTodo, CheckListTodo } from "./todo.js";

class Project {
  #id;
  #name;
  #description;
  #color;
  #todos;

  constructor(id, name, description, color) {
    this.#id = id;
    this.#name = name;
    this.#description = description;
    this.#color = color;
    this.#todos = [];
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }
  set name(value) {
    this.#name = value;
  }

  get description() {
    return this.#description;
  }
  set description(value) {
    this.#description = value;
  }

  get color() {
    return this.#color;
  }
  set color(value) {
    this.#color = value;
  }

  addTodo(todo) {
    if (todo instanceof Todo) {
      this.#todos.push(todo);
    } else console.warn("Only instances of Todo can be added to a project");
  }

  removeTodo(todoId) {
    const index = this.#todos.findIndex((todo) => todo.id === todoId);
    this.#todos = this.#todos.splice(index, 1);
  }

  getTodos() {
    return [...this.#todos];
  }

  getCompletedTodos() {
    return this.#todos.filter((todo) => todo.completed);
  }

  getPendingTodos() {
    return this.#todos.filter((todo) => !todo.completed);
  }

  filterTodosByPriority(priority) {
    return this.#todos.filter((todo) => todo.priority === priority);
  }

  getTodoCount() {
    return this.#todos.length;
  }

  getCompletedCount() {
    return this.getCompletedTodos().length;
  }

  getChecklistProgress() {
    const checklistTodos = this.#todos.filter(
      (todo) => todo instanceof CheckListTodo,
    );
    const progress = checklistTodos.map((todo) => {
      const total = todo.items.length;
      const completed = todo.items.filter((item) => item.completed).length;
      const percentage =
        total > 0 ? Math.round((completed / total) * 100) : 100;
      return { todo, completed, total, percentage };
    });
    return progress;
  }
}

class ProjectFactory {
  static createProject(id, name, description = "", color) {
    return new Project(id ?? crypto.randomUUID(), name, description, color);
  }
}

export { Project, ProjectFactory };
