var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
server.listen(3000);
var PLAYER_WIDTH = 30;
var CANVAS_WIDTH = 1000;
var gravity = 0.5;
//console.log('test');
function player(id, x, y){
  this.id = id;
  this.x = x;
  this.y = y;
  this.color = "#000";
  this.velX = 0;
  this.velY = 0;
}
var clientPlayers = [];
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
  p.velY = 2;
  players.push(p);
  //console.log(p);
  //console.log('login');
  //console.log(socket.id);
  setInterval(movePlayers, 20);
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
  socket.on('playerMove', function(data){
    var i;
    if(data.moveDir == "r"){
      i = getPlayerIndex(data.player.id);
      players[i].velX = 3;
      console.log(players[i]);
  } else if(data.moveDir == "l"){
    i = getPlayerIndex(data.player.id);
    players[i].velX = -3;
    console.log(players[i]);
  }
  });
  socket.on('stopMove', function(data){
    var i;
    console.log('stopMove');
    if(data.moveDir == "r"){
      i = getPlayerIndex(data.player.id);
      if(i != false){
        players[i].velX = 0;
        console.log(players[i]);
      }
    } else if(data.moveDir == "l"){
      i = getPlayerIndex(data.player.id);
      if(i != false){
        players[i].velX = 0;
      }
    }
  });
});
  function movePlayers(){
    clientPlayers = [];
    var length = players.length;
    for(var i = 0; i < length; i++){
        players[i].velY += gravity;
        players[i].x += players[i].velX;
        players[i].y += players[i].velY;

        if(players[i].y > 175.0)
        {
          players[i].y = 175.0;
          players[i].velY = 0;
        }
        clientPlayers.push(new player(players[i].id, players[i].x, players[i].y));
    }
    emitPlayers();
  }
  function getPlayerIndex(id){
    var length = players.length;
    for(var i = 0; i < length; i++){
      if(players[i].id == id){
        return i;
      }
    }
    return false;
  }
  function replacePlayer(player){
    var length = players.length;
    for(var i = 0; i < length; i++){
      if(players[i].id == player.id){
        players[i] = player;
        return true;
      }

    }
    return false;
  }
  function emitPlayers(){
    io.sockets.emit('players', { data : clientPlayers});
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
