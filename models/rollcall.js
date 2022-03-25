const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rollcallSchema = new Schema({
  workplace: {
    type: String,
  },
  startTime: {
    type: Date,
    
  },
  endTime : {
    type: Date,

  },
  timework: {
    type: Number
  },
  overTime: {
    type: Number
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Rollcall', rollcallSchema);