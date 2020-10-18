const { random } = require('colors/safe');
var net = require('net');
const prompt = require('prompt-sync')();
const players = [];
const Config = require("./FileSys/Config.json");
var turnCount = 0;
var GameHasStarted = false;
// creates the server
var server = net.createServer();
function StartGame(){
  this.timer = setInterval(() => {
      turnCount = turnCount +1;

  }, Config.delay)
  GameHasStarted = true;
}
//emitted when server closes ...not emitted until all connections closes.
server.on('close',function(){
  console.log('Server closed !');
});

// emitted when new client connects
const publicIp = require('public-ip');
const { player } = require('./FileSys/Player');
const { indexOf } = require('./FileSys/BaseMap');
server.on('connection',function(socket){
  if(!GameHasStarted) StartGame();
server.getConnections(function(error,count){
  if(Config.Verbose)console.log('Number of concurrent connections to the server : ' + count);
});




socket.on('data',(data)=>{
  var data1 = data.toString();
if(data1.startsWith("newPlayer: ")){
  var NewPlayer = JSON.parse(data1.slice(11));
  var randNum = Math.floor(Math.random() * 100000);
  const Config = require("./FileSys/Config.json");
  const chalk = require("chalk");
  let rabdbnumtest = Math.floor(Math.random()*16777215).toString(16)
  var RandIcon = chalk.hex("#"+rabdbnumtest)(Config.PlayerIcon)
  var ShouldExit = false; 
  while (ShouldExit == false) {
    if(players.length > 0){
  players.forEach(player => {
    if(randNum == player.PlayerID){
    randNum = Math.floor(Math.random() * 100000); 
    }else if(RandIcon == player.PlayerColor){
      let newcolor = Math.floor(Math.random()*16777215)
      while (Math.abs(rabdbnumtest - newcolor) > 10000) {
        newcolor = Math.floor(Math.random()*16777215).toString(16)
      }
      RandIcon = chalk.hex("#"+rabdbnumtest)(Config.PlayerIcon)
    }else{
    ShouldExit = true;
    }
  });
}else{
  ShouldExit = true; 
}
}
  NewPlayer.PlayerColor = RandIcon;
  NewPlayer.PlayerID = randNum;
  socket.write("SendPlayerWithIdBack: "+ JSON.stringify(NewPlayer) +"\n")
  players.push(NewPlayer);
} else if(data1.startsWith("updatePlayer: ")){
  var UpdatedPlayer = data1.slice(14);
  let i = 0;
  players.forEach(player => {
      if(UpdatedPlayer.PlayerID == player.PlayerID){
        players[i] = player
      }
      i++;
  });
} else if(data1.startsWith("sendPlayersToMePls: ")){
  var data5 = data1.slice(20)
  var UpdatedPlayer = JSON.parse(data5);
  let i = 0;
  let exists = false;
  players.forEach(player => {
      if(UpdatedPlayer.PlayerID == player.PlayerID){
        players[i] = UpdatedPlayer;
        exists = true;
      }
      i++;
  });
  infoObj = {
    players,
    turnCount
  }
  if(exists == false) 
socket.write("hereAreYourPlayers: " + JSON.stringify(infoObj) + "\n");
// } else if(data1.startsWith("sendTick: ")){
//   socket.write("hereAreYourTicks: " + turnCount + "\n");
  }else if(data1.startsWith("playerDeath: ")){
    const Player = require("./FileSys/Player").player;
    const player2 = new Player()
    player.PlayerColor = Config.DeadIcon;
    var playerToKillId = data1.slice(13)
    players.forEach(player => {
      if(playerToKillId == player.PlayerID){
        players.splice(players.indexOf(playerToKillId),1, player2);
        socket.end();
      }
  });
  }

});

socket.on('error',function(error){
  console.log('Error : ' + error);
});


socket.on('end',function(data){
//kill player
});

socket.on('close',function(error){
//kill player
  if(error){

  }
}); 
});

// emits when any error occurs -> calls closed event immediately after this.
server.on('error',function(error){
  console.log('Error: ' + error);
});

//emits when server is bound with server.listen
server.on('listening',function(){
  console.log('Server is listening!');
});

server.maxConnections = 10;

const port = prompt('What port do you want to host a server on, type \"-99\" for automatically assigned port: ')
if(port == "-99"){
  server.listen(async function(){
   const publicIp = require('public-ip');

      var address = server.address();
      var port = address.port;
      var family = address.family;
      //var ipaddr = address.address;
      console.log('Server is listening at port: ' + port);
      console.log('Server ip: ' + await publicIp.v4());
      console.log('Server is IP4/IP6: ' + family);
    });
}else{
  server.listen(port,async function(){
    var address = server.address();
    var port = address.port;
    var family = address.family;
    var ipaddr = address.address;
    console.log('Server is listening at port: ' + port);
    console.log('Server ip: ' + await publicIp.v4());
    console.log('Server is IP4/IP6: ' + family);
  });
}




var islistening = server.listening;

if(islistening){
  console.log('Server is listening');
}else{
  console.log('Server is not listening');
}


