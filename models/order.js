var mongoose = require('mongoose');

module.exports = mongoose.model('Order',{
    session_id   : {type: String, unique: true, dropDups: true},
    created      :  { type: Date, default: Date.now },
    is_playing   :  { type: Boolean, default: false }
});
