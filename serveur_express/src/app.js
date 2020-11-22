const createError = require('http-errors');
const express = require('express');
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index.route');
const notesRouter = require('./routes/notes.route');
const coursesRouter = require('./routes/kourses.route');
const chatRouter = require('./routes/chat.route');
const loginRouter = require('./routes/login.route')

const database = require('./services/database');
const db = new database(); // Initialize the connexion to the database 


const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/notes', notesRouter);
app.use('/courses', coursesRouter);
app.use('/chat', chatRouter);
app.use('/login', loginRouter);

app.use(function (req, res, next) {
    res.status(404).send("Impossible de trouver la page, erreur 404")
})

module.exports = app;
