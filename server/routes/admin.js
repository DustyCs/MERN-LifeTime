// routes/admin.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const adminMiddleware = require("../middleware/adminMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const User = require("../models/User");
const Activity = require("../models/Activity");
const Schedule = require("../models/Schedule");
const Review = require("../models/Review");
const Health = require("../models/Health");


// 📊 OVERVIEW
router.get("/overview", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalActivities = await Activity.countDocuments();
    const totalEvents = await Schedule.aggregate([{ $unwind: "$events" }, { $count: "total" }]);

    const recentSignups = await User.find().sort({ _id: -1 }).limit(5).select("name email createdAt");

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUsers = await Activity.distinct("userId", { date: { $gte: oneWeekAgo } });

    res.json({
      totalUsers,
      totalActivities,
      totalScheduledEvents: totalEvents[0]?.total || 0,
      recentSignups,
      activeUsers: activeUsers.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 👥 USER MANAGEMENT
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  const { query = "", page = 1, limit = 10 } = req.query;
  const q = query.toLowerCase(); // case-insensitive search

  const filter = {
    $or: [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ]
  }

  const users = await User.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .select("-password");

  const total = await User.countDocuments(filter);

  res.status(200).json({
    users,
    totalPages: Math.ceil(total / limit),
    total
  });
});

router.get("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

router.delete("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

router.patch("/users/:id/toggle-active", authMiddleware, adminMiddleware, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.isActive = !user.isActive; // there's no active field
  await user.save();
  res.json({ message: `User is now ${user.isActive ? "active" : "inactive"}` });
});

router.patch("/users/:id/toggle-admin", authMiddleware, adminMiddleware, async (req, res) => {
  console.log("Toggle admin route called", req.params.id);
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.isAdmin = !user.isAdmin;
  await user.save();
  res.json({ message: `User is now ${user.isAdmin ? "admin" : "user"}` });
});

router.get("/users/:id/details", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const objectIdUserId = new mongoose.Types.ObjectId(userId); 

    const [user, activities, schedules, healthData, reviews] = await Promise.all([
      User.findById(userId).select("-password"),
      Activity.find({ userId: objectIdUserId }),
      Schedule.find({ userId: objectIdUserId }),
      Health.find({ userId: objectIdUserId }),
      Review.find({ userId: objectIdUserId })
    ]);

    const totalActivities = activities.length;
    const completedActivities = activities.filter((a) => a.completed).length;
    const incompleteActivities = totalActivities - completedActivities;
    const lastHealthData = healthData.sort((a, b) => b.createdAt - a.createdAt)[0]; // most recent
    const totalSchedules = schedules.reduce((count, sch) => count + (sch.events?.length || 0), 0);

    res.json({
      user,
      activities,
      schedules,
      healthData,
      reviews,
      summary: {
        totalActivities,
        completedActivities,
        incompleteActivities,
        totalSchedules,
        lastHealthData,
      }
    });
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    res.status(500).json({ message: "Server error fetching user details" });
  }
});


// 📅 SCHEDULE MANAGEMENT
router.get("/schedules", authMiddleware, adminMiddleware, async (req, res) => {
  const schedules = await Schedule.find();
  res.json(schedules);
});

router.delete("/schedules/:scheduleId/event/:eventId", authMiddleware, adminMiddleware, async (req, res) => {
  const { scheduleId, eventId } = req.params;
  const result = await Schedule.updateOne(
    { _id: scheduleId },
    { $pull: { events: { _id: eventId } } }
  );
  res.json({ message: "Event deleted", result });
});

// 🏃 ACTIVITY MANAGEMENT
router.get("/activities", authMiddleware, adminMiddleware, async (req, res) => {
  const { userId, type, date } = req.query;
  const filter = {};

  if (userId) filter.userId = userId;
  if (type) filter.activityType = type;
  if (date) filter.date = { $gte: new Date(date) };

  const activities = await Activity.find(filter);
  res.json(activities);
});

router.patch("/activities/:id/toggle-complete", authMiddleware, adminMiddleware, async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) return res.status(404).json({ message: "Not found" });
  activity.completed = !activity.completed;
  await activity.save();
  res.json({ message: "Toggled activity status", completed: activity.completed });
});

router.delete("/activities/:id", authMiddleware, adminMiddleware, async (req, res) => {
  await Activity.findByIdAndDelete(req.params.id);
  res.json({ message: "Activity deleted" });
});

// Update an activity
router.patch("/activities/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!activity) return res.status(404).json({ message: "Activity not found" });
    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: "Error updating activity" });
  }
});


// New

router.get("/completed-activities", authMiddleware, adminMiddleware, async (req, res) => {
  const activities = await Activity.find({ completed: true });
  res.json(activities);
});


router.get("/incompleted-activities", authMiddleware, adminMiddleware, async (req, res) => {
  const activities = await Activity.find({ completed: false });
  res.json(activities);
});

// 📊 ANALYTICS
router.get("/queries", authMiddleware, adminMiddleware, async (req, res) => {
  const mostMissed = await Activity.aggregate([
    { $match: { completed: false } },
    { $group: { _id: "$userId", missed: { $sum: 1 } } },
    { $sort: { missed: -1 } },
    { $limit: 5 }
  ]);

  const mostPopular = await Activity.aggregate([
    { $group: { _id: "$activityType", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  const mostUsedCategory = await Schedule.aggregate([
    { $unwind: "$events" },
    { $group: { _id: "$events.category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  const timeDistribution = await Activity.aggregate([
    {
      $group: {
        _id: { $hour: "$date" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id": 1 } },
  ]);

  res.json({ mostMissed, mostPopular, mostUsedCategory, timeDistribution });
});

module.exports = router;