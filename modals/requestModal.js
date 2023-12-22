const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  status:{
    type: String,
    required: true,
    enum:['pending','fulfilled'],

  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
