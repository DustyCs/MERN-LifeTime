const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Activity = require("../models/Activity");
const Schedule = require("../models/Schedule");
const Review = require("../models/Review");

const router = express.Router();

// Get all user data for a specific year
router.get("/:year", authMiddleware, async (req, res) => {
  try {
    const year = req.params.year.trim();

    const [activities, schedules, reviews] = await Promise.all([
      Activity.find({ userId: req.user, date: { $regex: `^${year}` } }),
      Schedule.find({ userId: req.user, date: { $regex: `^${year}` } }),
      Review.find({ userId: req.user, year: year })
    ]);

    res.json({ activities, schedules, reviews });
  } catch (err) {
    console.error("Get Life Overview Error:", err);
    res.status(500).json({ msg: "Server Error - attempting to get life overview" });
  }
});

module.exports = router;
