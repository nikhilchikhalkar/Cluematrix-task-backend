const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ debug: true }); // Load .env

const connectDB = require("./config/db");
const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const classRoutes = require('./routes/classRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const cors = require("cors");

const app = express();

app.use(cors({
    origin: ['http://localhost:3000'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/workouts', workoutRoutes);

const PORT = process.env.PORT || 5000;

//  Connect DB first, THEN start the server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" Database connection failed", err);
  });
