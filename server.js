// Dependencies to require
const express = require("express");
const Joi = require("joi");
const fs = require("fs");
const notes = require("./db/db.json"); // []
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // How to use this package
uuidv4(); // hfshhfsuu-jfjsfs-jjfsjfs-jfjsfs

console.log("PID: ", process.pid);

// Port declaration
const PORT = process.env.PORT || 3001;

const app = express();

// Middleware
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

app.use(express.static('public'));

function filterByQuery(query, notesArray) {
  let filteredResults = notesArray;
  if (query.title) {
    filteredResults = filteredResults.filter(
      (note) => note.title === query.title
    );
  }

  if (query.id) {
    filteredResults = filteredResults.filter((note) => note.id === query.id);
  }
  if (query.text) {
    filteredResults = filteredResults.filter(
      (note) => note.text === query.text
    );
  }
  return filteredResults;
}

const noteSchema = Joi.object({
  text: Joi.string().allow(null),
  title: Joi.string().allow(null),
});

app.get("/api/notes", async (req, res) => {
  try {
    const payload = await noteSchema.validateAsync(req.query);
    let results = notes;
    console.log(payload);
    if (payload) {
      results = filterByQuery(payload, results);
    }
    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: "Error occurs",
    });
  }
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

function findById(id, notesArray) {
  const result = notesArray.filter((note) => note.id === id)[0];
  return result;
}
function createNewNote(body, notesArray) {
  console.log(body);
  // TODO: function's main code will go here

  // return finished code to post route for response
  return body;
}
app.get("/api/notes/:id", (req, res) => {
  const result = findById(req.params.id, notes);
  res.json(result);
});

// TODO: POST /api/notes receives new note to save, adds to db.json, and returns note to client
// Ref: UUID
app.post("/api/notes", (req, res) => {
  try {
    // req.body is where our incoming content will be
    const newNote = req.body;
    newNote.id = uuidv4();

    notes.push(newNote);

    fs.writeFile(
      "./db/db.json",
      JSON.stringify(notes, null, 3), // [] or object
      function (error, data) {
        if (error) {
          throw new Error("Not able to write note to .json");
        }
        return res.json(newNote);
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
});

app.listen(3001, () => {
  console.log(`API server now on port ${PORT}!`);
});
