const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Activity = require("../models/Activity");

const router = express.Router();

// Get performance data
router.get("/", authMiddleware, async (req, res) => {
  try {
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

module.exports = router;
