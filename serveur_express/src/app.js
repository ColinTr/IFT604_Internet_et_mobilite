const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index.route");
const notesRouter = require("./routes/notes.route");
const coursesRouter = require("./routes/kourses.route");
const chatRouter = require("./routes/chat.route");
const loginRouter = require("./routes/login.route");
const usersRouter = require("./routes/user.route");
const kognotteRouter = require("./routes/kognotte.route");
const spotifyRouter = require("./routes/spotify.route");
const login = require("./controllers/login.controller");
const database = require("./services/database");

const db = new database(); // Initialize the connexion to the database

const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/konotes", login.checkToken, notesRouter);
app.use("/kourses", login.checkToken, coursesRouter);
app.use("/kochat", login.checkToken, chatRouter);
app.use("/kognotte", login.checkToken, kognotteRouter);
app.use("/users", login.checkToken, usersRouter);
app.use("/login", loginRouter);
app.use("/spotify", spotifyRouter);

/*
const addKourse = async () => {
  const kourseService = require('./services/kourse.service');

  const elem1 = {
    content: "6 bananes",
    bought: false
  }

  const elem2 = {
    content: "12 oeufs",
    bought: false
  }

  const elem3 = {
    content: "1l lait",
    bought: false
  }

  kourseService.addKourse("5fbbd16a57e2c761e0ef574e", "L'autre meilleur liste", [elem1, elem2, elem3]);

}
addKourse();
*/

app.use(function (req, res, next) {
  res.status(404).send("Impossible de trouver la page, erreur 404");
});

module.exports = app;
