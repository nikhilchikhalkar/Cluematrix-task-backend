const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/UserModels');

// Admin-only CRUD for members
router.get('/', auth('admin'), async (req, res) => {
  const users = await User.find({ role: 'member' }).select('-password');
  res.json(users);
});
router.post('/', auth('admin'), async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await require('bcryptjs').hash(password, 10);
  const member = await User.create({ name, email, password: hashed, role: 'member' });
  res.status(201).json(member);
});
router.put('/:id', auth('admin'), async (req, res) => {
  const { name, email } = req.body;
  const member = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true }).select('-password');
  res.json(member);
});
router.delete('/:id', auth('admin'), async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
