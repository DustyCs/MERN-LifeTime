const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Activity = require("../models/Activity");
const mongoose = require("mongoose");
const router = express.Router();

// Create a new activity
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("Starting Activity Creation...");
    
    const userId = req.user.userId; // Ensure correct extraction
    const { activityType, duration, distance, date } = req.body;

    console.log("Received Body:", req.body);
    console.log("Extracted userId:", userId);

    // const parsedDate = new Date(date); 
    // if (isNaN(parsedDate.getTime())) {
    //     return res.status(400).json({ msg: "Invalid date format" });
    // }

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

// in case it doesnt work
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const userId = req.user.userId; // Ensure correct extraction
//     const { activityType, duration, distance, date } = req.body;

//     const newActivity = new Activity({
//       userId,
//       activityType,
//       duration,
//       distance,
//       date: new Date(date) // Ensure the date is stored as a Date object
//     });

//     await newActivity.save();
//     res.json(newActivity);
//   } catch (error) {
//     console.error("Create Activity Error:", error.message);
//     res.status(500).json({ msg: "Server Error - attempting to create activity" });
//   }
// });

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
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday start
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday end
    endOfWeek.setHours(23, 59, 59, 999);

    console.log("Fetching activities for user:", req.user, "from:", startOfWeek, "to:", endOfWeek);

    const activities = await Activity.find({
      userId: req.user,  // Ensure activities belong to the authenticated user
      date: {
        $gte: startOfWeek,
        $lte: endOfWeek,
      },
    });

    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// Get activities for a specific month (YYYY-MM format)
router.get("/:month", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId; // Ensure correct extraction
    const { month } = req.params;

    const [year, monthNum] = month.split("-").map(Number);
    if (!year || !monthNum || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ msg: "Invalid month format. Use YYYY-MM." });
    }

    const startOfMonth = new Date(year, monthNum - 1, 1);
    const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59, 999);

    const activities = await Activity.find({
      userId: new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId using 'new'
      date: { $gte: startOfMonth, $lte: endOfMonth }
    }).sort({ date: -1 }); // Sort by date descending

    res.json(activities || []);
  } catch (error) {
    console.error("Get Monthly Activities Error:", error.message);
    res.status(500).json({ msg: "Server Error - attempting to get monthly activities" });
  }
});

// Mark an activity as completed
router.patch("/:id/complete", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid activity ID" });
    }
    
    const activity = await Activity.findByIdAndUpdate(id, { completed: true }, { new: true });
    
    if (!activity) {
      return res.status(404).json({ msg: "Activity not found" });
    }

    res.json(activity);
  } catch (error) {
    console.error("Mark Activity Completed Error:", error.message);
    res.status(500).json({ msg: "Server Error - attempting to mark activity as completed" });
  }
});

// Mark an activity as non-completed
router.patch("/:id/uncomplete", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findByIdAndUpdate(id, { completed: false }, { new: true });
    res.json(activity);
  } catch (error) {
    console.error("Mark Activity Non-Completed Error:", error.message);
    res.status(500).json({ msg: "Server Error - attempting to mark activity as non-completed" });
  }
});

// Update an activity
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { activityType, duration, distance, date } = req.body;
    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      { activityType, duration, distance, date: new Date(date) },
      { new: true }
    );
    res.json(updatedActivity);
  } catch (error) {
    console.error("Update Activity Error:", error.message);
    res.status(500).json({ msg: "Server Error - attempting to update activity" });
  }
});

module.exports = router;


module.exports = router;