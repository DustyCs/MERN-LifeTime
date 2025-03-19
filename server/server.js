console.log("Server is attempting to start...");
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require("./routes/authRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const activityRoutes = require("./routes/activityRoutes");
const healthRoutes = require("./routes/healthRoutes");
const performanceRoutes = require("./routes/performanceRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const lifeOverviewRoutes = require("./routes/lifeOverviewRoutes");
const geminiRoutes = require("./routes/geminiRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://lifetime-schedules.web.app", // Firebase frontend
  "https://mern-lifetime.onrender.com" // onreender backend
];

app.get("/", (req, res) => {
  console.log("Root route accessed");
  res.send("Server is running!");
});

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

console.log("Environment Variables:");
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Exists" : "Not Found");
console.log("JWTKEY:", process.env.JWTKEY ? "Exists" : "Not Found");
console.log("MONGO_URI:", process.env.MONGODB_URI ? "Exists" : "Not Found");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/life-overview", lifeOverviewRoutes);
app.use("/api/gemini", geminiRoutes);

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});



// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;