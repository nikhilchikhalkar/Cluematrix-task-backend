const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const Class = require('../models/ClassModels');
const User = require('../models/UserModels');
const mongoose = require('mongoose');




// Admin CRUD
router.get('/', auth(['admin','member']), async (req, res) => {
  const classes = await Class.find().populate('members', 'name email');
  res.json(classes);
});
router.post('/', auth('admin'), async (req, res) => {
  const cls = await Class.create(req.body);
  res.status(201).json(cls);
});
router.put('/:id', auth('admin'), async (req, res) => {
  const cls = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(cls);
});
router.delete('/:id', auth('admin'), async (req, res) => {
  await Class.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// Enrollment
router.post('/:id/enroll', auth('member'), async (req, res) => {
  const cls = await Class.findById(req.params.id);
  if (!cls.members.includes(req.user.id)) cls.members.push(req.user.id);
  await cls.save();
  res.json(cls);
});
router.post('/:id/unenroll', auth('member'), async (req, res) => {
  const cls = await Class.findById(req.params.id);
  cls.members = cls.members.filter(m => m.toString() !== req.user.id);
  await cls.save();
  res.json(cls);
});





// In classRoutes.js
router.post('/:id/assign/:memberId', auth('admin'), async (req, res) => {
  const cls = await Class.findById(req.params.id);
  if (!cls.members.includes(req.params.memberId)) {
    cls.members.push(req.params.memberId);
    await cls.save();
  }
  res.json(cls);
});

router.post('/:id/unassign/:memberId', auth('admin'), async (req, res) => {
  const cls = await Class.findById(req.params.id);
  cls.members = cls.members.filter(m => m.toString() !== req.params.memberId);
  await cls.save();
  res.json(cls);
});


router.get('/:id', auth(['admin', 'member']), async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid class ID' });
  }

  try {
    const cls = await Class.findById(id).populate('members', 'name email');
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(cls);
  } catch (err) {
    console.error('Error fetching class by ID:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
