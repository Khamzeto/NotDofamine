const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), videoController.uploadVideo);
router.get('/', videoController.getVideos);
router.get('/user/:userId', videoController.getUserVideos); // Новый маршрут для получения всех видео пользователя по userId
router.get('/files/:filename', videoController.getFile);

module.exports = router;
