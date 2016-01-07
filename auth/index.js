/*
  Here we wil grant permision to do actions
*/
var Queue = require('../models/order.js');

module.exports = function(req,res,next){


  Queue.find({}).sort({data:1}).exec(function(err,users){
    if(!users)
    return res.send("You must enter a name, please press ENTER GAME button!");
    if(typeof users[0] !== 'undefined'){
      if(req.sessionID === users[0].session_id)return next();
      else{
        find = false;
        users.forEach( function (user) {
          if(req.sessionID === user.session_id) return find = true;
        });
        if(find)
        res.send("Wait your turn, chat with me if you're bored :)!");
        else
        res.send("Press ENTER GAME!")
      }
    } else
    return res.send("Press ENTER GAME!");
  });
};
