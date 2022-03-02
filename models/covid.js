const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const covidSchema = new Schema({
  arrive: String,
  symptom: [String],
  contact: [String],
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Covid", covidSchema);
