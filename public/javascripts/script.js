window.addEventListener('keydown',this.check,false);

function p_response(data){
  if(data!=="OK") {
    $("#error").html(data);
    $("#error").show();
    setTimeout(function(){
    $("#error").hide();
  },6000);
  }
  else $("#error").hide();
}
function do_c(code){
  switch (code) {
    case 37: $.get("left",p_response); break; //Left key
    case 38: $.get("top",p_response); break; //Up key
    case 39: $.get("right",p_response); break; //Right key
    case 40: $.get("bottom",p_response); break; //Down key
    case 80: $.get("space",p_response); break; //Down key
  }
}
function check(e) {
  var code = e.keyCode;
    if(e.target.id=='m') return;
    do_c(code);
}
$(document).ready(function() {
  $("button#top").click(function(){do_c(38)});
  $("button#top").click(function(){do_c(38)});
  $("button#left").click(function(){do_c(37)});
  $("button#right").click(function(){do_c(39)});
  $("button#bottom").click(function(){do_c(40)});
  $("button#space").click(function(){do_c(80)});
  $("button#enter_game").click(function(){
      $.get("enter_game",function(data){
        $("#message").html(data);
        $("#message").show();
        setTimeout(function(){
        $("#message").hide();
      },6000);
      });

  });


    videojs("live").ready(function(){
    var myPlayer = this;
    myPlayer.triggerReady()
      myPlayer.play();
      myPlayer.triggerReady()
      //console.log(myPlayer.currentTime,myPlayer);
    //myPlayer.currentTime+=5;
    });
});


var socket = io();
$('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(data){
    document.getElementById("ping").play();
    $last = $('<li>').text(data.name+': '+data.msg);
    $('#messages').append($last);
    $("#messages").stop().animate({
  scrollTop: $last.offset().top
}, '500', 'swing', function() {});
  });

  socket.on('chat status', function(data){
    $last = $('<li id="status">').text(data.name+': '+data.msg);
    $('#messages').append($last);
    $("#messages").stop().animate({
  scrollTop: $last.offset().top
}, '500', 'swing', function() {});
  });

  socket.on('game play_now', function(data){

      $last = $('<li>').text(data.user_name+" has started a new game!");
      $('#messages').append($last);
      $("#messages").stop().animate({
      scrollTop: $last.offset().top
    }, '500', 'swing', function() {});
  });

    socket.on('game game_over', function(data){

        $last = $('<li>').text(data.user_name+" has lost his game with score "+data.score+"!");
        $('#messages').append($last);
        $("#messages").stop().animate({
        scrollTop: $last.offset().top
      }, '500', 'swing', function() {});
    });

    socket.on('game has_removed', function(data){

        $last = $('<li>').text(data.user_name+" has been removed by Admin!");
        $('#messages').append($last);
        $("#messages").stop().animate({
        scrollTop: $last.offset().top
      }, '500', 'swing', function() {});
    });


    socket.on('game you_removed', function(data){
      console.log("Removed!");
      $("#error").html("You have been removed by Admin, i'm sorry  "+data.name+" for this!");
      $("#error").show();
      setTimeout(function(){
      $("#error").hide();
    },6000);
    });

  socket.on('game start_game', function(data){
      $("#message").html("Hey "+data.name+" start game now!");
      $("#message").show();
        document.getElementById("start").play();
      setTimeout(function(){
      $("#message").hide();
    },6000);
  });
