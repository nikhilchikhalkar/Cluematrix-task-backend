

const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const mongoose = require('mongoose');
const WorkoutPlan = require('../models/WorkoutPlan');

// Multer setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Upload or update workout plan PDF (admin only)
router.post('/upload', auth('admin'), upload.single('file'), async (req, res) => {
  const { member, class: classId } = req.body;

  if (!member || !mongoose.Types.ObjectId.isValid(member)) {
    return res.status(400).json({ message: 'Invalid or missing member ID' });
  }
  if (classId && !mongoose.Types.ObjectId.isValid(classId)) {
    return res.status(400).json({ message: 'Invalid class ID' });
  }
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Upsert: findOneAndUpdate or create new
    const plan = await WorkoutPlan.findOneAndUpdate(
      { member, class: classId || null },
      { fileUrl: req.file.filename },
      { new: true, upsert: true }
    );
    return res.status(200).json(plan);
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ message: err.message });
  }
});

// Get all workout plans for a member
router.get('/member/:memberId', auth(['admin', 'member']), async (req, res) => {
  const { memberId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(memberId)) {
    return res.status(400).json({ message: 'Invalid member ID' });
  }
  try {
    const plans = await WorkoutPlan.find({ member: memberId }).populate('class');
    res.json(plans);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
