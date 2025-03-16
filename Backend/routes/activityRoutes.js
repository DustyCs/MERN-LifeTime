const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Activity = require("../models/Activity");

const router = express.Router();

// Create a new activity
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { activityType, duration, distance, date } = req.body;
    const newActivity = new Activity({
      userId: req.user,
      activityType,
      duration,
      distance,
      date
    });
    await newActivity.save();
    res.json(newActivity);
  } catch (err) {
    console.error("Create Activity Error:", err);
    res.status(500).json({ msg: "Server Error - attempting to create activity" });
  }
});

// Get all activities
router.get("/", authMiddleware, async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user });
    res.json(activities);
  } catch (err) {
    console.error("Get Activities Error:", err);
    res.status(500).json({ msg: "Server Error - attempting to get activities" });
  }
});

// Get activities for the current week

router.get('/current-week', authMiddleware, async (req, res) => {
  try {
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday
      const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7)); // Sunday

      const activities = await Activity.find({
          userId: req.user,
          date: { $gte: startOfWeek, $lte: endOfWeek },
      });

      // Ensure always returning an array, even if no activities exist
      res.json(activities.length ? activities : []);
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server Error - attempting to get current week activities" });
  }
});

// Get activities for a specific month
router.get("/:month", authMiddleware, async (req, res) => {
  try {
    const { month } = req.params;
    const activities = await Activity.find({
      userId: req.user,
      date: { $gte: `${month}-01`, $lte: `${month}-31` }
    });

    res.json(activities);
  } catch (err) {
    console.error("Get Monthly Activities Error:", err);
    res.status(500).json({ msg: "Server Error - attempting to get monthly activities" });
  }
});

module.exports = router;
