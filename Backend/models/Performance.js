const mongoose = require("mongoose");

const PerformanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  completedActivities: { type: Number, default: 0 },
  incompleteActivities: { type: Number, default: 0 },
  weightChange: { type: Number, default: 0 },
  heightChange: { type: Number, default: 0 },
  hobbiesDone: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Performance", PerformanceSchema);
