var mongoose = require('mongoose');

module.exports = mongoose.model('Visit',{
    session_id   : {type: String, unique: true, dropDups: true},
    ip_address      :  String
});
