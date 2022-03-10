const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bodyTemperatureSchema = new Schema({
  measureDay: Date,
  temperature: Number,

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("BodyTemperature", bodyTemperatureSchema);
