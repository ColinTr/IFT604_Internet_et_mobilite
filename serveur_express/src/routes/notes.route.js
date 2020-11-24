const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');

/* GET toutes les notes */
router.get('/', noteController.getNotes);

/* POST ajout d'une nouvelle note */
router.post('/', noteController.createNote);

/* GET récuperation d'une note par id */
router.get('/:id_note', noteController.getNote);

/* PUT modification d'une note */
router.put('/:id_note', noteController.updateNote);

/* DELETE suppression d'une note */
router.delete('/:id_note', noteController.deleteNote);

module.exports = router;