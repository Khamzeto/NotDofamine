const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Define the routes and map them to the controller functions
router.get('/', chatController.getAllChats);
router.post('/', chatController.createChat);
router.get('/:chatId/messages', chatController.getMessages);
router.post('/:chatId/messages', chatController.createMessage);

module.exports = router;
