const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Activity = require("../models/Activity");

const router = express.Router();

// Create a new activity
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("Starting Activity Creation...");
    
    const userId = req.user; // Ensure correct extraction
    const { activityType, duration, distance, date } = req.body;

    console.log("Received Body:", req.body);
    console.log("Extracted userId:", userId);

    const newActivity = new Activity({
      userId,
      activityType,
      duration,
      distance,
      date: new Date(date) // Ensure the date is stored as a Date object
    });

    await newActivity.save();
    res.json(newActivity);
  } catch (error) {
    console.error("Create Activity Error:", error.message);
    console.error("Stack Trace:", error.stack);
    res.status(500).json({ msg: "Server Error - attempting to create activity" });
  }
});

// Get all activities
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user; // Ensure consistent extraction
    console.log("Fetching activities for user:", userId);

    const activities = await Activity.find({ userId });
    res.json(activities || []); // Ensure empty array if no activities
  } catch (error) {
    console.error("Get Activities Error:", error.message);
    res.status(500).json({ msg: "Server Error - attempting to get activities" });
  }
});

// Get activities for the current week
router.get("/current-week", authMiddleware, async (req, res) => {
  try {
    const userId = req.user;
    const today = new Date();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() - today.getDay() + 7);
    endOfWeek.setHours(23, 59, 59, 999);

    console.log("Fetching weekly activities for:", userId);
    console.log("Start of week:", startOfWeek.toISOString(), "End of week:", endOfWeek.toISOString());

    const activities = await Activity.find({
      userId,
      date: { $gte: startOfWeek.toISOString(), $lte: endOfWeek.toISOString() }
    });

    res.json(activities || []);
  } catch (error) {
    console.error("Get Current Week Activities Error:", error.message);
    res.status(500).json({ msg: "Server Error - attempting to get current week activities" });
  }
});

// Get activities for a specific month (YYYY-MM format)
router.get("/:month", authMiddleware, async (req, res) => {
  try {
    const userId = req.user;
    const { month } = req.params;

    console.log("Fetching activities for month:", month, "User:", userId);

    const [year, monthNum] = month.split("-").map(Number);
    if (!year || !monthNum || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ msg: "Invalid month format. Use YYYY-MM." });
    }

    const startOfMonth = new Date(year, monthNum - 1, 1);
    const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59, 999);

    console.log("Start of month:", startOfMonth, "End of month:", endOfMonth);

    const activities = await Activity.find({
      userId,
      date: { $gte: startOfMonth.toISOString(), $lte: endOfMonth.toISOString() }
    });

    res.json(activities || []);
  } catch (error) {
    console.error("Get Monthly Activities Error:", error.message);
    res.status(500).json({ msg: "Server Error - attempting to get monthly activities" });
  }
});

module.exports = router;