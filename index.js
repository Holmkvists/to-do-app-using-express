const express = require("express");
const exphbs = require("express-handlebars");

const app = express();

app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.send("it works");
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
