// Dependencies to require
const express = require('express');
const fs = require('fs');
const [ notes ]= require('./db/db.json');
const path = require('path');

// Port declaration
const PORT = process.env.PORT || 3001; // Why can't push to heroku?

const app = express();

// Middleware
// parse incoming string or array data
app.use(express.urlencoded({ extended: true}));
// parse incoming JSON data
app.use(express.json());

const { v4: uuidv4 } = require('uuid'); // How to use this package
uuidv4();

function filterByQuery(query, notesArray) {
    let filteredResults = notesArray;
    if (query.title) {
        filteredResults = filteredResults.filter(note => note.title === query.title);
    }
    if (query.text) {
        filteredResults = filteredResults.filter(note => note.text === query.text);
    }
    return filteredResults;
}
app.get('/api/notes', (req,res) => {
    let results = notes;
    console.log(req.query);
    if (req.query) {
        results = filterByQuery(req.query, results);
      }
    res.json(results);
});

app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
}
function createNewNote(body, notesArray) {
    console.log(body);
// TODO: function's main code will go here

// return finished code to post route for response
  return body;
}
app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
      res.json(result);
  });

// TODO: POST /api/notes receives new note to save, adds to db.json, and returns note to client
// Ref: UUID
app.post('/api/notes', (req,res) => {
// req.body is where our incoming content will be
  console.log(req.body);
  res.json(req.body);
});


app.listen(3001, () => {
    console.log(`API server now on port ${PORT}!`);
});