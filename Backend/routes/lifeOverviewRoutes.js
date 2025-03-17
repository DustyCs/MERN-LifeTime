const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Activity = require("../models/Activity");
const Schedule = require("../models/Schedule");
const Review = require("../models/Review");
const Health = require("../models/Health");

const router = express.Router();

// Get all user data for a specific year
router.get("/:year", authMiddleware, async (req, res) => {
  try {
    const year = parseInt(req.params.year.trim());
    const userId = req.user.userId;

    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const [activities, schedules, reviews, healthData] = await Promise.all([
      Activity.find({ userId, date: { $gte: startDate, $lte: endDate } }),
      Schedule.find({ userId, date: { $gte: startDate, $lte: endDate } }),
      Review.find({ userId, year }),
      Health.find({ userId, createdAt: { $gte: startDate, $lte: endDate } })
    ]);

    res.json({ activities, schedules, reviews, healthData });
  } catch (err) {
    console.error("Get Life Overview Error:", err);
    res.status(500).json({ msg: "Server Error - attempting to get life overview" });
  }
});

module.exports = router;