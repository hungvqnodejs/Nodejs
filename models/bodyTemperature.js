const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bodyTemperatureSchema = new Schema({
  
  measureDay : {
    type: Date,
    
  },  
  temperature: {
    type: Number,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('BodyTemperature', bodyTemperatureSchema);