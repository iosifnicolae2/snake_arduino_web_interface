var Queue = require('../models/order.js');
var User = require('../models/user.js');
var io = require('../app').io;

exports.start = function start(req){
  /*Queue.find({}).sort({date: 1}).exec(function(err,users){
    if(err){
      console.log("error",err);
    }
    if(typeof users[0] !== 'undefined'){
      User.findOne({"session_id":users[0].session_id},function(err,user){
        if(user)
        io.emit('game play_now', {user_name:user.name});
      });
  }
});*/
};
exports.remove = function(session_id,res){

  User.findOne({"session_id":session_id},function(err,user){
    if(user){

    console.log("Removed "+user.name+" ");
      io.emit('game has_removed', {user_name:user.name});
      io.to(user.socket_id).emit('game you_removed', {name:user.name});
      Queue.find({},function(err,users){
        if(typeof users[0] === 'undefined' && res!=null)
        return res.send("User isn't in queue!");

        if(typeof users[0] !=='undefined')
        users[0].remove(function (err) {
        if(err)console.log("Cannot remove user",err);
        });
        if(typeof users[1] !== 'undefined'){
          User.findOne({"session_id":users[1].session_id},function(err,user){
            if(user){
              io.emit('game play_now', {user_name:user.name});
              console.log(user.name,"must start a game",user.socket_id);
              io.to(user.socket_id).emit('game start_game', {name:user.name});
            }
          });
        }
        if(res!=null)
        res.send("Removed!");
      });

    }
  });
};
exports.game_over=function(score){
  Queue.find({}).sort({date: 1}).exec(function(err,users){
    if(err){
      console.log("error",err);
    }
    if(typeof users[0] !== 'undefined'){
      User.findOne({"session_id":users[0].session_id},function(err,user){
        if(user){

        user.score = parseInt(score);
        console.log("Game over "+user.name+" "+user.score);
          io.emit('game game_over', {user_name:user.name,score:user.score});
        if(user.highScore<user.score) user.highScore = user.score;

        user.save(function(err){
          if(err){
            console.log("Error Save Score",err);
          }
          });
        }
      });
      console.log(users);
      users[0].remove(function (err) {
      if(err)console.log("Cannot remove user",err);
    });
      if(typeof users[1] !== 'undefined'){
        User.findOne({"session_id":users[1].session_id},function(err,user){
          if(user){
            io.emit('game play_now', {user_name:user.name});
            console.log(user.name,"must start a game",user.socket_id);
            io.to(user.socket_id).emit('game start_game', {name:user.name});
          }
        });
      }
    }

    // Emit all users data again to update it TODO
});
}

//    io.to(user.socket_id).emit('game start_now', 'for your eyes only');
