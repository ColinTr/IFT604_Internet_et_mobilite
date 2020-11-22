const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chat.controller');

/* GET tous les messages du chat */
router.get('/', chatController.getMessages);

/*POST ajout d'un nouveau message */
router.post('/', chatController.createMessage);

/*DELETE suppresion d'un message*/
router.delete('/:id_message', chatController.deleteMessage)

module.exports = router;