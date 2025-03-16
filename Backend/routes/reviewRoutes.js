const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Review = require("../models/Review");
const { generateReview } = require("../utils/geminiService");

const router = express.Router();

// Get monthly review
router.get("/:month", authMiddleware, async (req, res) => {
  try {
    const review = await Review.findOne({ 
      userId: req.user, 
      month: req.params.month.trim(),
      year: new Date().getFullYear() // Ensure fetching only the current year's review
    });

    if (!review) {
      return res.status(404).json({ msg: "No review found for this month" });
    }

    res.json(review);
  } catch (err) {
    console.error("Get Monthly Review Error:", err);
    res.status(500).json({ msg: "Server Error - attempting to get monthly review" });
  }
});

// Create/Update Monthly

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { month, year, activities, healthData } = req.body;

    // Check if review exists
    let review = await Review.findOne({ userId: req.user, month, year });

    // Call AI to generate review analysis
    const aiAnalysis = await generateReview(month, year, activities, healthData);

    if (!aiAnalysis) {
      return res.status(500).json({ msg: "Failed to generate AI review" });
    }

    if (!review) {
      review = new Review({ userId: req.user, month, year, analysis: aiAnalysis });
    } else {
      review.analysis = aiAnalysis;
    }

    await review.save();
    res.json(review);
  } catch (err) {
    console.error("Review AI Error:", err);
    res.status(500).json({ msg: "Server Error - attempting to update review" });
  }
});

module.exports = router;
