const mongoose = require("mongoose");

const LifeOverviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  year: { type: String, required: true },
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
  schedules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule" }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  healthData: [{ type: mongoose.Schema.Types.ObjectId, ref: "Health" }]
});

module.exports = mongoose.model("LifeOverview", LifeOverviewSchema);