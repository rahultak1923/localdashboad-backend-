const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    month: {
      type: String, // Jaise "October 2026"
      required: true,
    },
    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      default: "",
    },
    givenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Ek employee ko ek month me ek hi baar rating mile
ratingSchema.index({ employeeId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);