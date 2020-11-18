const createError = require('http-errors');
const express = require('express');
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes');
const notesRouter = require('./routes/notes');
const coursesRouter = require('./routes/courses');
const chatRouter = require('./routes/chat');
const loginRouter = require('./routes/login')

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
