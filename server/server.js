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
  "https://lifetime-schedules.web.app", // Firebase hosting
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
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

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "../frontend/LifeTimeMern/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/LifeTimeMern/dist/index.html"));
  });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));