const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

/* GET toutes les users*/
router.get("/", userController.getUsers);

module.exports = router;
