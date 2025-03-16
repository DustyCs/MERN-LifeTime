const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Schedule = require('../models/Schedule');

const router = express.Router();

// Create schedule
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, date, category } = req.body;

        console.log("User ID from token:", req.user);
        console.log("Request Body:", req.body); 

        const schedule = new Schedule({
            userId: req.user,
            title,
            description,
            date,
            category,
        });
        await schedule.save();
        res.json(schedule);
    }
    catch (error){
        res.status(500).json({ msg: `Server Error - attempting to create schedule - ${error}` });
    }
})


// Get Current Week Schedule
router.get('/current-week', authMiddleware, async (req, res) => {
    try {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday
        const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7)); // Sunday

        const schedules = await Schedule.find({
            userId: req.user,
            date: { $gte: startOfWeek, $lte: endOfWeek },
        });

        // Ensure always returning an array, even if no schedules exist
        res.json(schedules.length ? schedules : []);
    }
    catch(error){
        res.status(500).json({ msg: "Server Error - attempting to get current week" });
    }
});

// Get Full Schedule

router.get("/", authMiddleware, async (req, res) => {
    try {
        const schedules = await Schedule.find({ userId: req.user });
        res.json(schedules);
    }
    catch(error){
        res.status(500).json({ msg: "Server Error - attempting to get full schedule" });
    }
})

// Update Schedule

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const scheduleId = req.params.id.trim(); // Trim whitespace/newline
        const updatedSchedule = await Schedule.findOneAndUpdate(
            { _id: scheduleId, userId: req.user },  // Ensure the schedule belongs to the user
            req.body,
            { new: true }
        );

        if (!updatedSchedule) {
            return res.status(404).json({ msg: "Schedule not found or unauthorized" });
        }

        console.log("Updated Schedule:", updatedSchedule);
        res.json(updatedSchedule);
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ msg: "Server Error - attempting to update schedule" });
    }
});
        
// Delete Schedule

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const scheduleId = req.params.id.trim(); // Trim whitespace/newline

        const deletedSchedule = await Schedule.findOneAndDelete({ _id: scheduleId, userId: req.user });

        if (!deletedSchedule) {
            return res.status(404).json({ msg: "Schedule not found or unauthorized" });
        }

        res.json({ msg: "Schedule deleted", deletedSchedule });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ msg: "Server Error - attempting to delete schedule" });
    }
});

module.exports = router;