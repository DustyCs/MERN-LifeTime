const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  analysis: {
    health: { type: String },
    exercise: { type: String },
    hobby: { type: String },
    entertainment: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", ReviewSchema);