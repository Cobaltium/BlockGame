var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
server.listen(3000);
var PLAYER_WIDTH = 30;
var CANVAS_WIDTH = 1000;
console.log('test');
function player(id, x, y){
  this.id = id;
  this.x = x;
  this.y = y;
}
var players = [];
var numPlayers = 0;
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });
  console.log('sent3');
app.get('/', function (req, res) {

  console.log('sent2');
  res.sendfile(__dirname + '/index.html');
});
setInterval(sendPlayers, 200);
function sendPlayers(){
  if(numPlayers > 0){
  io.sockets.emit('players', { data : players });
  console.log('sendPlayers');
  }
}
io.sockets.on('connection', function(socket){
  numPlayers++;
  socket.emit('sessid', socket.id);
  console.log('sent');
  var p = new player(socket.id, 0, 0);
  players.push(p);
  console.log(p);
  console.log('login');
  console.log(socket.id);
  socket.on('event', function(data){
    console.log(data);
  });
  socket.on('move', function(data){
  console.log(socket.id);
    console.log('move');
    var length = players.length
    for(var i = 0; i < length; i++){
      if(socket.id && players[i]){
      if(socket.id == players[i].id){
        player = players[i];
        if(data.move == "left"){
          player.moveDir = "left";
          player.moveAmt = 10;
          players[i].x -= 10;
        } else if (data.move == "right"){

          player.moveDir = "right";
          player.moveAmt = 10;
          players[i].x += 10;
        } else if (data.move == "up"){

          player.moveDir = "up";
          player.moveAmt = 10;
          players[i].y -= 10;
        } else if (data.move == "down"){

          player.moveDir = "down";
          player.moveAmt = 10;
          players[i].y += 10;
        }
          io.sockets.emit('updatePlayers', { data : players, player : player});
          player.moveAmt = 0;
          player.moveDir = "";
//        console.log(players[i]);
//        if(data.move == "left"){
//          if(velX < 2){
//            velX++;
//          }
//          players[i].x += -10;
//        if(checkCollision(players[i])){
//          players[i].x += 10;
//
//          }
//        } else if (data.move == "right"){
//          players[i].x += 10;
//        if(checkCollision(players[i])){
//          players[i].x += -10;
//
//          }
//        } else if (data.move == "down"){
//          players[i].y += 10;
//        if(checkCollision(players[i])){
//          players[i].y += -10;
//
//          }
//        } else if (data.move == "up"){
//          players[i].y += -10;
//          if(checkCollision(players[i])){
//          players[i].y += 10;
//          }
//          }
        }
      }
    }

  });
  socket.on('disconnect', function(){
    var length = players.length;
      for(var i = 0; i < length; i++){
      if(socket.id && players[i]){
      if(socket.id == players[i].id){
         players.splice(i, 1);
      }
    }
    }
    });
  function checkCollision(player){
    var length = players.length;
    for(var i = 0; i < length; i++){
      console.log(player.x + 30);
      console.log(players[i].x + 30);
      if((player.x + 30 <= players[i].x || player.x >= players[i].x + 30 || player.y + 30 <= players[i].y || player.y >= players[i].y + 30) || player.id == players[i].id){
        console.log('good');
      } else {
        return true;
      }

    }
  }
});
