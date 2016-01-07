var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');



var app = express();
var http = require('http').Server(app);
var io = exports.io = require('socket.io')(http);

var routes = require('./routes/index');

var session = require('express-session');
var redisStore = require('connect-redis')(session);
var redis   = require("redis");
var client  = redis.createClient();

var game = require('./controller/game.js');

var get_user = require('./get_user');

mongoose.connect('mongodb://127.0.0.1:27017/snake-online');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());




app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(''));
var sessionMiddleware = session({secret: 'iojASFISJFOISJFSIJFOPIASFH_PASH0h&FA',
   key: 'h9(*AHfOhp9h239*gHIUswhf98ahlSH9f8A*go)',
   store: new redisStore({
    host: 'localhost',
    port: 6379,
    pass: 'a9hjahkfh9sf9auhAHF', client: client,ttl :  260
  }),
  duration: 30 * 60 * 1000 * 60 *24 * 2,
  activeDuration: 5 * 60 * 1000 *60 *24 *1,
});

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


/* Socket.IO */


io.on('connection', function(socket){
  get_user.getById(socket.request.sessionID,function(user,err){
    if(user){
    io.emit('chat status', {msg:user.name+" is online! Chat with him!",name:"Robot FlyingCode"});
      user.socket_id = socket.id;
      user.save(function (err) {
        if (err) return handleError(err);
      });
    }
  });

  socket.on('disconnect', function(){
    //game.remove(socket.request.sessionID,null);
    get_user.getById(socket.request.sessionID,function(user,err){
      if(user){
      io.emit('chat status', {msg:user.name+" is offline!",name:"Robot FlyingCode"});
        user.socket_id = undefined;
        user.save(function (err) {
          if (err) return handleError(err);
        });
      }
    });
 });
 socket.on('chat message', function(msg){
   //socket.request.sessionID
   get_user.getById(socket.request.sessionID,function(user,err){
     if(user)
     io.emit('chat message', {msg:msg,name:user.name});
   });
 });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
