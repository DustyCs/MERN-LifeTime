const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Schedule = require("../models/Schedule");

const router = express.Router();
// Create schedule
router.post("/", authMiddleware, async (req, res) => {
    try {
      const userId = req.user; // FIXED: req.user is already the userId string
      const { title, description, date, category } = req.body;
  
      console.log("User ID from token:", userId);
      console.log("Request Body:", req.body);
  
      const schedule = new Schedule({
        userId, // FIXED: correctly setting userId
        title,
        description,
        date,
        category,
      });
  
      await schedule.save();
      res.json(schedule);
    } catch (error) {
      console.error("Create Schedule Error:", error.message);
      res.status(500).json({ msg: "Server Error - attempting to create schedule" });
    }
  });

// Get Current Week Schedule
router.get("/current-week", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() - today.getDay() + 7);
    endOfWeek.setHours(23, 59, 59, 999);

    const schedules = await Schedule.find({
      userId,
      date: { $gte: startOfWeek, $lte: endOfWeek }
    });

    res.json(schedules || []);
  } catch (error) {
    console.error("Get Current Week Schedules Error:", error.message);
    res.status(500).json({ msg: "Server Error - attempting to get current week" });
  }
});

// Get Full Schedule
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const schedules = await Schedule.find({ userId });
    res.json(schedules || []);
  } catch (error) {
    console.error("Get Full Schedule Error:", error.message);
    res.status(500).json({ msg: "Server Error - attempting to get full schedule" });
  }
});

// Update Schedule
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const scheduleId = req.params.id.trim(); // Trim whitespace/newline

    const updatedSchedule = await Schedule.findOneAndUpdate(
      { _id: scheduleId, userId }, // Ensure the schedule belongs to the user
      req.body,
      { new: true }
    );

    if (!updatedSchedule) {
      return res.status(404).json({ msg: "Schedule not found or unauthorized" });
    }

    console.log("Updated Schedule:", updatedSchedule);
    res.json(updatedSchedule);
  } catch (error) {
    console.error("Update Schedule Error:", error.message);
    res.status(500).json({ msg: "Server Error - attempting to update schedule" });
  }
});

// Delete Schedule
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const scheduleId = req.params.id.trim();

    const deletedSchedule = await Schedule.findOneAndDelete({ _id: scheduleId, userId });

    if (!deletedSchedule) {
      return res.status(404).json({ msg: "Schedule not found or unauthorized" });
    }

    res.json({ msg: "Schedule deleted", deletedSchedule });
  } catch (error) {
    console.error("Delete Schedule Error:", error.message);
    res.status(500).json({ msg: "Server Error - attempting to delete schedule" });
  }
});

module.exports = router;
