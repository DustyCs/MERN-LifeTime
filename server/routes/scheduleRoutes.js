const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Schedule = require("../models/Schedule");
const mongoose = require("mongoose");
const router = express.Router();

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

// Get Current Week Schedule
router.get("/current-week", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId; 
        const objectIdUserId = new mongoose.Types.ObjectId(userId);

        const today = new Date();
        const startOfWeek = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - today.getUTCDay() + 1));
        startOfWeek.setUTCHours(0, 0, 0, 0);
        const endOfWeek = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - today.getUTCDay() + 7));
        endOfWeek.setUTCHours(23, 59, 59, 999);

        console.log("Start of Week (UTC):", startOfWeek);
        console.log("End of Week (UTC):", endOfWeek);

        // Fetch schedules in NEW format (individual documents)
        const newFormatSchedules = await Schedule.find({
            userId: objectIdUserId,
            date: { $gte: startOfWeek, $lte: endOfWeek }
        });

        // Fetch schedules in OLD format (events array)
        const oldFormatSchedules = await Schedule.find({
            userId: objectIdUserId,
            "events.date": { $gte: startOfWeek, $lte: endOfWeek }
        });

        console.log("New Format Schedules:", JSON.stringify(newFormatSchedules, null, 2));
        console.log("Old Format Schedules:", JSON.stringify(oldFormatSchedules, null, 2));

        // Extract all events from old format
        const oldFormatEvents = oldFormatSchedules.flatMap(schedule =>
            schedule.events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= startOfWeek && eventDate <= endOfWeek;
            })
        );

        // Merge both formats into a single response
        const allEvents = [
            ...newFormatSchedules.map(sch => ({
                _id: sch._id,
                title: sch.title,
                description: sch.description,
                date: sch.date,
                category: sch.category
            })),
            ...oldFormatEvents
        ];

        console.log("Final Filtered Events:", JSON.stringify(allEvents, null, 2));

        res.json(allEvents);
    } catch (error) {
        console.error("Get Current Week Schedules Error:", error.message);
        res.status(500).json({ msg: "Server Error - attempting to get current week" });
    }
});

// Get Full Schedule
router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const objectIdUserId = new mongoose.Types.ObjectId(userId);

        // Fetch all schedules (new format)
        const newFormatSchedules = await Schedule.find({ userId: objectIdUserId });

        // Fetch all schedules (old format)
        const oldFormatSchedules = await Schedule.find({ userId: objectIdUserId, events: { $exists: true, $not: { $size: 0 } } });

        console.log("New Format Schedules:", JSON.stringify(newFormatSchedules, null, 2));
        console.log("Old Format Schedules:", JSON.stringify(oldFormatSchedules, null, 2));

        // Extract all events from old format
        // const oldFormatEvents = oldFormatSchedules.flatMap(schedule =>
        //     schedule.events.map(event => ({
        //         ...event.toObject(),
        //         year: schedule.year,
        //         month: schedule.month
        //     }))
        // );

        const oldFormatEvents = oldFormatSchedules.flatMap(schedule =>
            schedule.events.map(event => ({
                _id: event._id,
                title: event.title,
                description: event.description,
                date: event.date,
                category: event.category,
                day: event.day,
                year: schedule.year,
                month: schedule.month,
            }))
        );

        // Merge both formats
        const allEvents = [
            ...newFormatSchedules.map(sch => ({
                _id: sch._id,
                title: sch.title,
                description: sch.description,
                date: sch.date,
                category: sch.category,
                year: sch.year,
                month: sch.month,
            })),
            ...oldFormatEvents
        ];

        res.json(allEvents);
    } catch (error) {
        console.error("Get Full Schedule Error:", error.message);
        res.status(500).json({ msg: "Server Error - attempting to get full schedule" });
    }
});

// Get Month Schedule
router.get("/current-month", authMiddleware, async (req, res) => {
  try {
      const userId = req.user.userId;
      const objectIdUserId = new mongoose.Types.ObjectId(userId);

      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      console.log("Start of Month:", startOfMonth);
      console.log("End of Month:", endOfMonth);

      // Fetch schedules in NEW format (individual documents)
      const newFormatSchedules = await Schedule.find({
          userId: objectIdUserId,
          date: { $gte: startOfMonth, $lte: endOfMonth }
      });

      // Fetch schedules in OLD format (events array)
      const oldFormatSchedules = await Schedule.find({
          userId: objectIdUserId,
          "events.date": { $gte: startOfMonth, $lte: endOfMonth }
      });

      console.log("New Format Schedules:", JSON.stringify(newFormatSchedules, null, 2));
      console.log("Old Format Schedules:", JSON.stringify(oldFormatSchedules, null, 2));

      // Extract all events from old format
      const oldFormatEvents = oldFormatSchedules.flatMap(schedule =>
          schedule.events.filter(event => {
              const eventDate = new Date(event.date);
              return eventDate >= startOfMonth && eventDate <= endOfMonth;
          })
      );

      // Merge both formats into a single response
      const allEvents = [
          ...newFormatSchedules.map(sch => ({
              _id: sch._id,
              title: sch.title,
              description: sch.description,
              date: sch.date,
              category: sch.category
          })),
          ...oldFormatEvents
      ];

      console.log("Final Filtered Events:", JSON.stringify(allEvents, null, 2));

      res.json(allEvents);
  } catch (error) {
      console.error("Get Current Month Schedules Error:", error.message);
      res.status(500).json({ msg: "Server Error - attempting to get current month schedules" });
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

// Update Specific Event Inside a Schedule
router.put("/:id/:eventId", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const scheduleId = req.params.id.trim();
      const eventId = req.params.eventId.trim();
      const { title, description, category, date } = req.body;
  
      const updatedSchedule = await Schedule.findOneAndUpdate(
        { _id: scheduleId, userId, "events._id": eventId },
        {
          $set: {
            "events.$.title": title,
            "events.$.description": description,
            "events.$.category": category,
            "events.$.date": date
          }
        },
        { new: true }
      );
  
      if (!updatedSchedule) {
        return res.status(404).json({ msg: "Event not found or unauthorized" });
      }
  
      res.json(updatedSchedule);
    } catch (error) {
      console.error("Update Event Error:", error.message);
      res.status(500).json({ msg: "Server Error - attempting to update event" });
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

// Delete Specific Event Inside a Schedule
router.delete("/:id/:eventId", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
      const scheduleId = req.params.id.trim();
      const eventId = req.params.eventId.trim();
  
      const updatedSchedule = await Schedule.findOneAndUpdate(
        { _id: scheduleId, userId },
        { $pull: { events: { _id: eventId } } }, // Remove only the matching event
        { new: true }
      );
  
      if (!updatedSchedule) {
        return res.status(404).json({ msg: "Event not found or unauthorized" });
      }
  
      res.json({ msg: "Event deleted", updatedSchedule });
    } catch (error) {
      console.error("Delete Event Error:", error.message);
      res.status(500).json({ msg: "Server Error - attempting to delete event" });
    }
  });

module.exports = router;
