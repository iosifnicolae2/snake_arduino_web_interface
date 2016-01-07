var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
  session_id    : String,
  name     : String,
  created      :  { type: Date, default: Date.now },
  score : { type: Number, default: 0 },
  highScore : { type: Number, default: 0 },
  isBest : { type: Boolean, default: false },
  socket_id : String,
  ip_address : String,
  email : String,
  subscribe : { type: Boolean, default: false }
});
