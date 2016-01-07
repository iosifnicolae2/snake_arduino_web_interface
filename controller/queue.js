var Queue = require('../models/order.js');
var User = require('../models/user.js');
var game = require('./game');
module.exports = function(req,res,serialPort){
  Queue.find({"session_id":req.sessionID},function(err,user){
    if(err){
      console.log(err);
      return res.send("ERROR BACKEND");
    }
    if(user.length==0){
      var order = new Queue({
        session_id:req.sessionID
      });
      order.save(function(err,result){
        if(err){
          console.log("Error Save Score",err);
        }
      Queue.findOne({}).sort({data:1}).exec(function(err,data){
        if(data && data.session_id == req.sessionID){
          res.send("You can control Mr. Snake now;), press arrow key on keyboard!");
          User.findOne({session_id:req.sessionID},function(err,user){
            if(err){
              console.log(err);
              return res.send("ERROR BACKEND");
            }
            if(serialPort)
            serialPort.write("s_n "+user.name+"\n");
          });
        }
        else
        res.send("You will be notified when it's your turn, turn volume up:) !");
      });

      });
    }else
    res.send("Wait for your turn :)!");
    game.start(req);
  });
};
