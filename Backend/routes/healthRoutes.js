const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Health = require("../models/Health");

const router = express.Router();

// Update or add health data
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { weight, height, bmi, riskOfSickness } = req.body;
    let healthData = await Health.findOne({ userId: req.user });

    if (!healthData) {
      healthData = new Health({ userId: req.user, weight, height, bmi, riskOfSickness });
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
    const healthData = await Health.findOne({ userId: req.user });
    res.json(healthData || { msg: "No health data found" });
  } catch (err) {
    console.error("Get Health Data Error:", err);
    res.status(500).json({ msg: "Server Error - attempting to get health data" });
  }
});

module.exports = router;
