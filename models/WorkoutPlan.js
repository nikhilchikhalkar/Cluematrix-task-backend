const mongoose = require('mongoose');
const WorkoutPlanSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  fileUrl: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('WorkoutPlan', WorkoutPlanSchema);
