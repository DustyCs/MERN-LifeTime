const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Review = require("../models/Review");

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

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { month, year, analysis } = req.body;

    let review = await Review.findOne({ userId: req.user, month, year });

    if (!review) {
      review = new Review({
        userId: req.user,
        month,
        year,
        analysis,
      });
    } else {
      review.analysis = analysis; 
    }

    await review.save();
    res.json(review);
  } catch (err) {
    console.error("Review Update Error:", err);
    res.status(500).json({ msg: "Server Error - attempting to update review" });
  }
});


module.exports = router;
