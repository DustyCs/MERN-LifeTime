const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Health = require("../models/Health");
const mongoose = require("mongoose");

const router = express.Router();

// Update or add health data
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { weight, height, bmi, riskOfSickness } = req.body;
    const userId = req.user.userId; // ✅ Extract only the userId

    let healthData = await Health.findOne({ userId });

    if (!healthData) {
      healthData = new Health({ userId, weight, height, bmi, riskOfSickness });
    } else {
      Object.assign(healthData, { weight, height, bmi, riskOfSickness });
    }

    await healthData.save();
    res.json(healthData);
  } catch (err) {
    console.error("Health Data Update Error:", err);
    res.status(500).json({ msg: "Server Error - attempting to update health data" });
  }
});

// Get health data
router.get("/", authMiddleware, async (req, res) => {
  try {
    const healthData = await Health.findOne({ userId: req.user.userId });
    res.json(healthData || { msg: "No health data found" });
  } catch (err) {
    console.error("Get Health Data Error:", err);
    res.status(500).json({ msg: "Server Error - attempting to get health data" });
  }
});

// Get recent health data
router.get("/recent", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }

    // Fetch the two most recent entries
    const healthData = await Health.find({ userId })
      .sort({ createdAt: -1 })
      .limit(2);

    if (!healthData.length) {
      return res.status(404).json({ msg: "No health data found" });
    }

    res.json(healthData);
  } catch (error) {
    console.error("Get Health Data Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
