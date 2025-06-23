const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  year: Number,
  month: Number,
  events: [
    {
      day: Number,
      title: { type: String, required: true },
      description: String,
      category: { type: String, enum: ["Work", "Fitness", "Chill", "Hobby", "Health", "Other"], required: true },
      date: { type: Date, required: true } // <-- Ensure date exists in events
    }
  ]
});

// isn't this inefficient?


module.exports = mongoose.model("Schedule", ScheduleSchema);

// old
// const mongoose = require("mongoose");

// const ScheduleSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   title: { type: String, required: true },
//   description: { type: String },
//   date: { type: Date, required: true },
//   category: { type: String, enum: ["Work", "Fitness", "Chill", "Hobby", "Health","Other"], required: true },
// });

// module.exports = mongoose.model("Schedule", ScheduleSchema);
