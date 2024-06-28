const Chat = require('../models/Chat');
const Message = require('../models/Message');
const WebSocket = require('ws');

let wss;

function initializeWebSocketServer(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', ws => {
    console.log('New client connected');

    ws.on('message', async message => {
      try {
        const parsedMessage = JSON.parse(message);
        console.log('Received message:', parsedMessage);

        const { userId, user, text, chatId } = parsedMessage.data || {};

        if (!userId || !user || !text || !chatId) {
          console.error('Invalid message format: missing fields', parsedMessage);
          return;
        }

        if (parsedMessage.type === 'message') {
          const chatMessage = new Message({
            userId,
            user,
            text,
            chatId,
          });

          const savedMessage = await chatMessage.save();

          // Send message to all clients with the same chatId
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'message', data: savedMessage }));
            }
          });
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
}

function initializeWebSocketMiddleware(server) {
  initializeWebSocketServer(server);
}

module.exports = {
  initializeWebSocketMiddleware,
  getAllChats: async (req, res) => {
    try {
      const chats = await Chat.find();
      res.json(chats);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении чатов' });
    }
  },
  createChat: async (req, res) => {
    const { title, description, createdBy } = req.body;

    if (!title || !description || !createdBy) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    try {
      const newChat = new Chat({ title, description, createdBy });
      const savedChat = await newChat.save();
      res.json(savedChat);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при создании чата' });
    }
  },
  getMessages: async (req, res) => {
    const { chatId } = req.params;

    try {
      const messages = await Message.find({ chatId });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении сообщений' });
    }
  },
  createMessage: async (req, res) => {
    const { userId, user, text, chatId } = req.body;

    if (!userId || !user || !text || !chatId) {
      console.error('Missing fields:', req.body); // Debug log
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    try {
      const newMessage = new Message({ userId, user, text, chatId });
      const savedMessage = await newMessage.save();
      console.log('Message saved:', savedMessage); // Debug log

      // Send message to all connected WebSocket clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'message', data: savedMessage }));
        }
      });

      res.status(200).json(savedMessage); // Ensure status 200
    } catch (error) {
      console.error('Error saving message:', error); // Debug log
      res.status(500).json({ error: 'Ошибка при создании сообщения' });
    }
  },
};
