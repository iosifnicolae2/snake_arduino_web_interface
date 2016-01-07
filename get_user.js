var User = require('./models/user');


exports.getById = function getById(sessionId,callback){
  User.find({'session_id':sessionId}, function (err, user) {
    if (err) {
      return callback(false,err);
    }
    if(user.length==0)
    return callback(null);
    callback(user[0]);
  });
};

exports.getUserR = function(req,res,callback){
  User.find({'session_id':req.sessionID}, function (err, user) {
    if (err) {
      return callback(false,err);
    }
    if(user.length==0)
    return callback(null);
    callback(user[0]);
  });
};
