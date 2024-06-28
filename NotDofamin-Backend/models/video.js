const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  filename: String,
  type: String,
  title: String,
  description: String,
  uploadDate: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Добавлено поле userId
});

module.exports = mongoose.model('Video', videoSchema);
