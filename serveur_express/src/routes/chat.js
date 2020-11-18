const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController')

/* GET tous les messages du chat */
router.get('/', chatController.getMessages);

module.exports = router;