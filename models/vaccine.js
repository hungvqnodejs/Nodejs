const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const vaccineSchema = new Schema({
  injection: String,
  vaccineType: String,
  vaccineDay: Date,

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Vaccine", vaccineSchema);
