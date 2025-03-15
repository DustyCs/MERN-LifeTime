const mongoose = require("mongoose");

const HealthSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  bmi: { type: Number, required: true },
  riskOfSickness: { type: String, enum: ["Low", "Medium", "High"], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Health", HealthSchema);
