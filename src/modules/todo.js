class PriorityManager {
  #validPriorities;

  constructor(initialPriorities = ["low", "medium", "high"]) {
    this.#validPriorities = [...initialPriorities];
  }

  isValid(priority) {
    return this.#validPriorities.includes(priority);
  }

  addPriority(newPriority) {
    if (newPriority && !this.#validPriorities.includes(newPriority)) {
      this.#validPriorities.push(newPriority);
    }
  }

  get default() {
    return this.#validPriorities[0];
  }

  get all() {
    return [...this.#validPriorities];
  }
}

class Todo {
  #id;
  #title;
  #description;
  #dueDate;
  #priority;

  constructor(id, title, description, dueDate, priority, priorityManager) {
    this.#id = id;
    this.#title = title;
    this.#description = description;
    this.#dueDate = dueDate;

    this.priorityManager = priorityManager;
    this.#priority = priorityManager.isValid(priority)
      ? priority
      : priorityManager.default;
  }

  editDetails(newTitle, newDescription, newDueDate) {
    if (newTitle && newTitle.trim() !== "") this.#title = newTitle;
    if (newDescription) this.#description = newDescription;
    if (newDueDate instanceof Date) this.#dueDate = newDueDate;
    else if (newDueDate !== undefined)
      console.warn(`Invalid due date: ${newDueDate}`);
  }

  addValidPriority(newValidPriority) {
    if (newValidPriority) this.priorityManager.addPriority(newValidPriority);
  }

  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }
  set title(newTitle) {
    this.#title = newTitle;
  }

  get description() {
    return this.#description;
  }
  set description(newDescription) {
    if (newDescription) this.#description = newDescription;
  }

  get dueDate() {
    return this.#dueDate;
  }
  set dueDate(newDueDate) {
    if (newDueDate instanceof Date) this.#dueDate = newDueDate;
    else console.warn(`Invalid due date: ${newDueDate}`);
  }

  get priority() {
    return this.#priority;
  }
  set priority(newPriority) {
    if (this.priorityManager.isValid(newPriority)) this.#priority = newPriority;
    else console.warn(`Invalid priority: ${newPriority}`);
  }
}

class NoteTodo extends Todo {
  constructor(
    id,
    title,
    description,
    dueDate,
    priority = "low",
    content = "",
    priorityManager = new PriorityManager(),
  ) {
    super(id, title, description, dueDate, priority, priorityManager);
    this.content = content; //string
    this.type = "note";
  }

  setContent(newContent) {
    this.content = newContent;
  }
}

class CheckListTodo extends Todo {
  constructor(
    id,
    title,
    description,
    dueDate,
    priority = "low",
    completed = false,
    priorityManager = new PriorityManager(),
  ) {
    super(id, title, description, dueDate, priority, priorityManager);
    this.completed = completed;
    this.type = "checklist";
  }

  updateCompletion() {
    this.completed = !this.completed;
  }
}

class TodoFactory {
  static createTodo(
    id,
    type,
    title,
    description,
    dueDate,
    priority = "low",
    completed = false,
    options = {},
  ) {
    const priorityManager = options.priorityManager || new PriorityManager();
    switch (type.toLowerCase()) {
      case "note":
        return new NoteTodo(
          id ?? crypto.randomUUID(),
          title,
          description,
          dueDate,
          priority,
          options.content || "",
          priorityManager,
        );
      case "checklist":
        return new CheckListTodo(
          id ?? crypto.randomUUID(),
          title,
          description,
          dueDate,
          priority,
          completed,
          priorityManager,
        );
      default:
        throw new Error(`Invalid todo type: ${type}`);
    }
  }
}

export { PriorityManager, TodoFactory, Todo, NoteTodo, CheckListTodo };
