require('dotenv').config();

const connect = require('./connect');
const express = require('express');
const cors = require('cors');
const authRoutes = require("./routes/authRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const activityRoutes = require("./routes/activityRoutes");
const healthRoutes = require("./routes/healthRoutes");
const performanceRoutes = require("./routes/performanceRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const lifeOverviewRoutes = require("./routes/lifeOverviewRoutes");

const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// connect DB

// connect.connectDB();

// API
// app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/auth", authRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/life-overview", lifeOverviewRoutes);


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));