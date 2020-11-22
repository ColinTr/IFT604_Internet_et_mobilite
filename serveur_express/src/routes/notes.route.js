const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');

/* GET toute les notes */
router.get('/', noteController.getNotes);

/*POST ajout d'une nouvelle note */
router.post('/', noteController.createNote);

module.exports = router;