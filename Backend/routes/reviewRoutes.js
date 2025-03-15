const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Review = require("../models/Review");

const router = express.Router();

// Get monthly review
router.get("/:month", authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user, month: req.params.month.trim() });
    res.json(reviews);
  } catch (err) {
    console.error("Get Monthly Review Error:", err);
    res.status(500).json({ msg: "Server Error - attempting to get monthly review" });
  }
});

module.exports = router;
