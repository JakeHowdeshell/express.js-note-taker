// dependencies
const notes = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const util = require("util");
// GET method for existing notes
notes.get("/", (req, res) => {
  util
    .promisify(fs.readFile)("./db/db.json")
    .then((data) => res.json(JSON.parse(data)))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Error reading notes." });
    });
});
// POST method for newly created notes
notes.post("/", (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(newNote);
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedData, null, 4),
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: "Error writing data file." });
            } else {
              console.info(`\nData written to db/db.json`);
              res.status(201).json(newNote);
            }
          }
        );
      }
    });
  }
});
// DELETE method to remove notes
notes.delete("/:id", (req, res) => {
    const noteId = req.params.id;
    util.promisify(fs.readFile)("./db/db.json")
    .then((data) => {
        const parsedData = JSON.parse(data);
        const newData = parsedData.filter((note) => note.id !== noteId);
        return util.promisify(fs.writeFile)("./db/db.json", JSON.stringify(newData, null, 4));
    })
    .then(() => {
        console.info(`Note with ID ${noteId} deleted`);
        res.status(204).send();
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Error deleting note." });
      });
})
module.exports = notes;
