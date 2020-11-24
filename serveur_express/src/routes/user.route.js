const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

/* GET toutes les users*/
router.get("/", userController.getUsers);

/* GET les infos publiques d'un user */
/*  {
        id,
        name,
        mail
    }
*/
router.get("/:id", userController.getUser);

module.exports = router;
