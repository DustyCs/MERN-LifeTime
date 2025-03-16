const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  activityType: { type: String, required: true },
  duration: { type: Number, required: true },
  distance: { type: Number },
  date: { type: Date, required: true },
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Activity", ActivitySchema);
