var User = require('./models/user');

module.exports = function(req,res,callback){
  var user = new User({
    session_id    : req.sessionID,
    name     : req.body.name,
    email     : req.body.email,
    ip_address : req.headers['x-forwarded-for'],
    subscribe  :typeof req.body.subscribe!=='undefined'?true:false
  });
  user.save(function (err, user) {
    if (err){
      console.error(err);
      return res.send("Something is broken, please contact me!")
    }
    callback(user);

  });

}
