const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModels");

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const existuser = await User.findOne({ email });
  if (existuser) {
    return res.status(200).json({
      msg: "user allready register",
    });
  }
  const hashed = await bcrypt.hash(password, 10);
  // console.log("api req...............", name, email, password, role);
  try {
    const user = await User.create({ name, email, password: hashed, role });
    // console.log("api req...............");
    if (user) {
      return res.status(200).json({
        msg: "register sucessfully",
      });
    }
    return res.status(400).json({
      msg: "user not created try again ",
    });
  } catch (error) {
    console.log(`error while register user ${error}`);
    res.status(400).json({
      msg: "server not running ",
      error: error,
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if (!u || !(await bcrypt.compare(password, u.password)))
    return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign(
    { id: u._id, role: u.role, name: u.name, email: u.email },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
  res.json({ token, role: u.role, name: u.name ,_id: u._id });
});

module.exports = router;
