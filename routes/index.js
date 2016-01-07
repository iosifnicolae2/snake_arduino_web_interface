var express = require('express');
var router = express.Router();
var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("/dev/ttyUSB0", {
  baudrate: 9600
});
var port = 1;
var controll_access = require('../auth');
var getUser = require('../get_user');
var createUser = require('../create_user');
var put_in_queue = require('../controller/queue');
var game = require('../controller/game.js');
var Visit = require('../models/visit.js');


function error_callback(err){
  if((err.toString()).indexOf("Cannot open /dev/ttyUSB")>-1 && port<5){
          serialPort = new SerialPort("/dev/ttyUSB"+port, {
            baudrate: 9600
          });
      serialPort.on('error', error_callback);
      port++;
  }
}

serialPort.on('error', error_callback);

serialPort.on("open", function () {
  console.log('Port open');
});
function stringStartsWith (string, prefix) {
    return string.slice(0, prefix.length) == prefix;
}

serialPort.on("data", function (d) {
  if(stringStartsWith(d, "g_o")){
    game.game_over(d.slice(3));
  }
    console.log('data'+d);
});

function write_callback  (err, results) {
  //console.log("Results:",results);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  getUser.getUserR(req,res,function(user,err){
    if(!user && user!=null) {
      console.log(err);
      return res.send("Something is broken, contact me!");
    }

    if (user == null){
      var visit = Visit({
        session_id : req.sessionID,
        ip_address : req.headers['x-forwarded-for']
      });
      visit.save(function(err){
        if(err)console.log(err);
      });

      //We will create one
      return res.render('register', { title: 'Register'});
    }
    res.render('index', { title: 'Snake on Arduino',score:user.score,highScore:user.highScore,name:user.name });
  });
});

router.post('/', function(req, res, next) {
  createUser(req,res,function(user){
    res.redirect('/');
  });
});


router.get('/left',controll_access, function(req, res, next) {
  serialPort.write("1\n", write_callback);
  res.send("OK");
});
router.get('/right',controll_access, function(req, res, next) {
  serialPort.write("2\n", write_callback);
  res.send("OK");
});

router.get('/top',controll_access, function(req, res, next) {
  serialPort.write("3\n", write_callback);
  res.send("OK");
});

router.get('/bottom',controll_access, function(req, res, next) {
  serialPort.write("4\n", write_callback);
  res.send("OK");
});

router.get('/space',controll_access, function(req, res, next) {
  serialPort.write("5\n", write_callback);
  res.send("OK");
});

router.get('/enter_game', function(req, res, next) {
  put_in_queue(req,res,serialPort);
});

router.get('/remove_player', function(req, res, next) {
  game.remove(req.query.session_id,res);
});


/*
Only Admin can do this
router.get('/reset',controll_access, function(req, res, next) {
  serialPort.write("6\n", write_callback);
  res.send("OK");
});
*/

module.exports = router;
