const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: String, required: true },
});

module.exports = mongoose.model('Chat', ChatSchema);
