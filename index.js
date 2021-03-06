// MODULES

const express = require("express");
const exphbs = require("express-handlebars");
const todosArray = require("./data/todos");

// SETUP

const app = express();

app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// FUNCTIONS

function createNewId(array) {
  let newId = 0;

  for (const item of array) {
    if (item.id > newId) {
      newId = item.id;
    }
  }

  return newId + 1;
}

function getDateTime() {
  let today = new Date();
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let time = today.getHours() + ":" + today.getMinutes();
  let currentDateTime = date + " " + time;

  return currentDateTime;
}

// HOME PAGE

// Sorts oldest first by default

app.get("/", (req, res) => {
  const todosToDisplay = [...todosArray];
  res.render("home", { todosToDisplay });
});

app.post("/", (req, res) => {
  const id = createNewId(todosArray);

  const newTodo = {
    id: id,
    description: req.body.description,
    created: getDateTime(),
    completed: false,
    statusText: "In progress",
  };

  todosArray.push(newTodo);
  res.redirect("/");
});

// SORT BY NEW PAGE

app.get("/sort/new", (req, res) => {
  const todosSorted = [...todosArray];

  todosSorted.sort((a, b) => {
    if (b.created < a.created) {
      return -1;
    }
  });

  const todosToDisplay = [...todosSorted];

  res.render("home", { todosToDisplay });
});

// FILTER IN PROGRESS PAGE

app.get("/in-progress", (req, res) => {
  const todosFiltered = todosArray.filter((todos) => todos.completed === false);

  const todosToDisplay = [...todosFiltered];

  res.render("home", { todosToDisplay });
});

// FILTER COMPLETED PAGE

app.get("/completed", (req, res) => {
  const todosFiltered = todosArray.filter((todos) => todos.completed === true);

  const todosToDisplay = [...todosFiltered];

  res.render("home", { todosToDisplay });
});

// DETAILED PAGE

app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todosArray.find((t) => t.id === id);

  res.render("todo-detailed", todo);
});

app.post("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todosArray.findIndex((i) => i.id === id);

  let completed = req.body.completed === "true";
  todosArray[index].completed = completed;
  todosArray[index].statusText = completed ? "Completed" : "In progress";

  res.redirect("/");
});

// EDIT PAGE

app.get("/todos/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todosArray.find((t) => t.id === id);

  res.render("todo-edit", todo);
});

app.post("/todos/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todosArray.findIndex((t) => t.id === id);

  todosArray[index].description = req.body.description;

  let completed = req.body.completed === "true";
  todosArray[index].completed = completed;
  todosArray[index].statusText = completed ? "Completed" : "In progress";

  res.redirect("/todos/" + id);
});

// DELETE PAGE

app.get("/todos/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todosArray.find((t) => t.id === id);

  res.render("todo-delete", todo);
});

app.post("/todos/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todosArray.findIndex((t) => t.id === id);

  todosArray.splice(index, 1);

  res.redirect("/");
});

// SERVER

app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
