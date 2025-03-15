const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true },
  category: { type: String, enum: ["Work", "Fitness", "Chill", "Hobby", "Other"], required: true },
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
