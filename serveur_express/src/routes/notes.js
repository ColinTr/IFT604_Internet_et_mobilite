const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController')


/* GET toute les notes */
router.get('/', noteController.getNotes)

module.exports = router;