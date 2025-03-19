const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Activity = require("../models/Activity");
const Health = require("../models/Health");

const router = express.Router();

// Get performance data
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user

    const [completedActivities, incompleteActivities] = await Promise.all([
      Activity.countDocuments({ userId: req.user, completed: true }),
      Activity.countDocuments({ userId: req.user, completed: false })
    ]);

    res.json({ completedActivities, incompleteActivities });
  } catch (err) {
    console.error("Get Performance Data Error:", err);
    res.status(500).json({ msg: "Server Error - attempting to get performance data" });
  }
});

// Get performance data for the current month
router.get("/current-month", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [completedActivities, incompleteActivities, healthData, activities] = await Promise.all([
      Activity.countDocuments({ userId, completed: true, date: { $gte: startOfMonth, $lte: endOfMonth } }),
      Activity.countDocuments({ userId, completed: false, date: { $gte: startOfMonth, $lte: endOfMonth } }),
      Health.find({ userId }).sort({ createdAt: -1 }), // Fetch all health data
      Activity.find({ userId, date: { $gte: startOfMonth, $lte: endOfMonth } }).sort({ date: -1 })
    ]);

    res.json({ completedActivities, incompleteActivities, healthData, activities });
  } catch (err) {
    console.error("Get Performance Data Error:", err);
    res.status(500).json({ msg: "Server Error - attempting to get performance data" });
  }
});

module.exports = router;
