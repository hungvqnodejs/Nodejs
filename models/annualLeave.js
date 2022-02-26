const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const annualLeaveSchema = new Schema({
  startLeave: {
    type: Date,
    required: true,
  },
  endLeave: {
    type: Date,
    required: true,
  },
  totalTime: {
    type: Number,
  },
  reason: {
    type: String
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("AnnualLeave", annualLeaveSchema);
