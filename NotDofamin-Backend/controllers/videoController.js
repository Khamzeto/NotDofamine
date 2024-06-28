const Video = require('../models/video');
const path = require('path');
const fs = require('fs');

exports.uploadVideo = async (req, res) => {
  const { type, title, description, userId } = req.body; // Получаем userId из данных формы

  if (!req.file) {
    return res.status(400).json({ message: 'No file received' });
  }

  if (!type || !title || !description || !userId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const video = new Video({
    filename: req.file.filename,
    type,
    title,
    description,
    userId, // Сохраняем userId в документе видео
  });

  await video.save();
  res.json({ file: { filename: req.file.filename, type, title, description } });
};

exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Error fetching videos' });
  }
};

exports.getUserVideos = async (req, res) => {
  const { userId } = req.params; // Получаем userId из параметров запроса
  try {
    const videos = await Video.find({ userId });
    res.json(videos);
  } catch (error) {
    console.error('Error fetching user videos:', error);
    res.status(500).json({ message: 'Error fetching user videos' });
  }
};

exports.getFile = (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.params.filename);
  fs.access(filePath, fs.constants.F_OK, err => {
    if (err) {
      return res.status(404).json({ err: 'No file exists' });
    }
    res.sendFile(filePath);
  });
};
