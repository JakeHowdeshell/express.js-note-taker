// dependencies
const express = require("express");
const path = require("path");
const api = require("./routes/import");

const PORT = process.env.PORT || 3001;

const app = express();
// middlewear for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", api);

app.use(express.static("public"));
// GET route for notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);
// GET route for homepage
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

app.listen(PORT, () =>
  console.log(`App is listening at http://localhost:${PORT}`)
);
