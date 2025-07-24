const mongoose = require('mongoose');
const ClassSchema = new mongoose.Schema({
  title: String,
  description: String,
  schedule: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});
module.exports = mongoose.model('Class', ClassSchema);
