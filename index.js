const express = require("express");
const exphbs = require("express-handlebars");
const todosArray = require("./data/todos");

const app = express();

app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

function getDateTime() {
  let today = new Date();
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let time = today.getHours() + ":" + today.getMinutes();
  let dateTime = date + " " + time;

  return dateTime;
}

console.log(todosArray);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home", { todosArray });
});

app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
