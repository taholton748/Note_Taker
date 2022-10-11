const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001; // Why can't push to heroku?
const app = express();
const [ database ]= require('./db/db.json');

const { v4: uuidv4 } = require('uuid'); // How to use this package
uuidv4();

app.get('/api/notes', (req,res) => {
    res.json(database);
});
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
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