var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
server.listen(3000);
var PLAYER_WIDTH = 30;
var CANVAS_WIDTH = 1000;
//console.log('test');
function player(id, x, y){
  this.id = id;
  this.x = x;
  this.y = y;
  this.color = "#000";
  //this.velocityX = velX;
  //this.velocityY = velY;
}
var players = [];
var numPlayers = 0;
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });
  //console.log('sent3');
app.get('/', function (req, res) {

  //console.log('sent2');
  res.sendfile(__dirname + '/index.html');
});
//setInterval(sendPlayers, 20000);
function sendPlayers(){
  if(numPlayers > 0){
  io.sockets.emit('players', { data : players });
  //console.log('sendPlayers    ');
  //console.log(players);
  //console.log();
  }
}
io.sockets.on('connection', function(socket){
  numPlayers++;
  //console.log('sent');
  var p = new player(socket.id, 0, 0);
  socket.emit('init', { player : p});
  players.push(p);
  //console.log(p);
  //console.log('login');
  //console.log(socket.id);
  socket.on('event', function(data){
    console.log(data);
  });

  socket.on('disconnect', function(){
    var length = players.length;
      for(var i = 0; i < length; i++){
      if(socket.id && players[i]){
      if(socket.id == players[i].id){
         players.splice(i, 1);
         emitPlayers();
      }
    }
    }
  });
  socket.on('updatePlayer', function(data){
    var length = players.length;
    for(var i = 0; i < length; i++){
      //console.log(data.player.id);
      //console.log(players[i].id);
      if(data.player.id == players[i].id){
        players[i] = data.player;
        //console.log('updatePlayer');
        emitPlayers();
      }
    }
  });
  socket.on('playerStartMove', function(data){
    
  });
  });
  function emitPlayers(){
    io.sockets.emit('players', { data : players});
  }
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
