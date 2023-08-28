const notes = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const util = require("util");

notes.get("/", (req, res) => {
  util
    .promisify(fs.readFile)("./db/db.json")
    .then((data) => res.json(JSON.parse(data)))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Error reading notes." });
    });
});

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

module.exports = notes;
