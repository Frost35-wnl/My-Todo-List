import { TodoFactory, PriorityManager } from "./modules/todo.js";
import { ProjectFactory } from "./modules/project.js";

const priorityManager = new PriorityManager([
  "low",
  "medium",
  "high",
  "urgent",
]);

const noteTodo = TodoFactory.createTodo(
  null,
  "note",
  "My first note",
  "This is a description",
  new Date(),
  "medium",
  false,
  { content: "Write something important here", priorityManager },
);

const checkListTodo = TodoFactory.createTodo(
  null,
  "checklist",
  "My first checklist",
  "This is a description",
  new Date(),
  "high",
  false,
  { priorityManager },
);

checkListTodo.addItem("Buy milk");
checkListTodo.addItem("Call mom");
checkListTodo.toggleItem(0);

const project = ProjectFactory.createProject(
  "My project",
  "Test project",
  "#ffcc00",
);

project.addTodo(noteTodo);
project.addTodo(checkListTodo);

console.log("Project todos : ", project.getTodos());
console.log("Completed todos : ", project.getCompletedTodos());
console.log("Pending todes : ", project.getPendingTodos());
console.log(
  "Filter by priority 'high' : ",
  project.filterTodosByPriority("high"),
);
console.log("Checklist progress : ", project.getChecklistProgress());

noteTodo.editDetails("Updated note title", "Updated description", new Date());
noteTodo.changeCompletion();
checkListTodo.toggleItem(1);

console.log("After edit & completion toggle : ", project.getTodos());
