const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Schedule = require("../models/Schedule");

const router = express.Router();

// // Create schedule
// router.post('/', authMiddleware, async (req, res) => {
//     try {
//         console.log("Received Request Body:", req.body); // Debugging log

//         const { title, description, date, category } = req.body;

//         if (!title || !date || !category) {
//             return res.status(400).json({ msg: "Missing required fields: title, date, or category" });
//         }

//         // Ensure `req.user` exists
//         if (!req.user || !req.user.userId) {
//             return res.status(401).json({ msg: "Unauthorized - No user ID found" });
//         }

//         const userId = req.user.userId; // ✅ Correct extraction
//         console.log("User ID from token:", userId);

//         // Parse the date
//         const parsedDate = new Date(date);
//         const year = parsedDate.getFullYear();
//         const month = parsedDate.getMonth() + 1; // JS months are 0-based
//         const day = parsedDate.getDate();

//         console.log("Parsed Date:", { year, month, day });

//         // 🔍 Check if the schedule exists
//         let schedule = await Schedule.findOne({ userId, year, month });

//         if (!schedule) {
//             console.log("No existing schedule found, creating a new one...");
//             schedule = new Schedule({
//                 userId,
//                 month,
//                 year,
//                 events: [] // ✅ Ensure events array exists
//             });
//         }

//         // Ensure `events` array exists before pushing
//         if (!Array.isArray(schedule.events)) {
//             schedule.events = [];
//         }

//         // Add the new event
//         schedule.events.push({ day, title, description, category });

//         // Save the updated schedule
//         await schedule.save();

//         console.log("Schedule saved successfully:", schedule);
//         res.json(schedule);
//     } 
//     catch (error) {
//         console.error("Error creating schedule:", error);
//         res.status(500).json({ msg: `Server Error - attempting to create schedule - ${error.message}` });
//     }
// });

// Create/Update Schedule
router.post("/", authMiddleware, async (req, res) => {
    try {
        console.log("🔍 Raw Request Body:", req.body);

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ msg: "Request body is empty - Check if Content-Type is JSON" });
        }

        const { title, description, date, category } = req.body;

        if (!title || !date || !category) {
            return res.status(400).json({ msg: "Missing required fields: title, date, or category" });
        }

        if (!req.user || !req.user.userId) {
            return res.status(401).json({ msg: "Unauthorized - No user ID found" });
        }

        const userId = req.user.userId;
        console.log("User ID from token:", userId);

        // Convert `date` into a valid Date object
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ msg: "Invalid date format" });
        }

        const year = parsedDate.getFullYear();
        const month = parsedDate.getMonth() + 1; // JS months are 0-based
        const day = parsedDate.getDate();

        console.log("📅 Parsed Date:", { year, month, day });

        // Find existing schedule document for this user, year, and month
        let schedule = await Schedule.findOne({ userId, year, month });

        if (!schedule) {
            console.log("No existing schedule found, creating a new one...");
            schedule = new Schedule({
                userId,
                year,
                month,
                events: [] // Initialize the array
            });
        }

        // Ensure `events` array exists before pushing
        if (!Array.isArray(schedule.events)) {
            schedule.events = [];
        }

        // Add new event
        schedule.events.push({ day, title, description, category, date: parsedDate });

        // Save the updated schedule
        await schedule.save();

        console.log("✅ Schedule saved successfully:", schedule);
        res.json(schedule);
    } catch (error) {
        console.error("❌ Error creating schedule:", error);
        res.status(500).json({ msg: `Server Error - ${error.message}` });
    }
});

// Debug
// router.post("/", async (req, res) => {
//     console.log("Received Request Body:", req.body); // Debugging line

//     try {
//         const { title, description, date, category } = req.body;

//         if (!title || !date || !category) {
//             return res.status(400).json({ msg: "Missing required fields: title, date, or category" });
//         }

//         console.log("Extracted Fields:", { title, description, date, category });

//         // Dummy response to confirm the request is working
//         res.json({ msg: "Test route received data successfully!", data: { title, description, date, category } });

//         // In the actual implementation, you'd continue with database logic...
//     } catch (error) {
//         console.error("Error creating schedule:", error);
//         res.status(500).json({ msg: "Server Error - attempting to create schedule - " + error });
//     }
// });

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
