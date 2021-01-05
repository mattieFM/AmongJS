/*
 #Programmer: Matt /AuthoredEntropy
 ahhhheeee, its the server file....
*/
const { random } = require('colors/safe');
let criticalTimer;
let msgs = [" "];
let emeMsg = [""]
let gameStarted = false;
var net = require('net');
const chalk = require("chalk")
let isEmergency = false;
let allEmergencies = [];
const prompt = require('prompt-sync')();
var date = new Date();
let LastTime = 0;
let CurrentTime = 0;
let TotalTime = 0;
let numtimes = 0;
let winner;
const waiters = [];
const deathWaiters = [];
let emergency = false;
let reportStartTime;
let reportTimeRemaining;
const players = [];
/**@description this is an array containing net sockets: when they receive data they will trigger the report function in FsController */
const reportWaiters = []
let votes = [];
TraitorWin = false;
InnocentWin = false;
const Config = require("./FileSys/Config.json");
let visionBase = Config.VisionTiles;
var turnCount = 0;
var GameHasStarted = gameStarted;
const readline = require("readline")
this.rl = readline.createInterface(process.stdin, process.stdout)
this.rl.on('line', (cmd => {
  if (cmd == "start") {
    gameStarted = true
    traitorsArr = [];
    imposersAssigned = 0;
    while (imposersAssigned != Config.Traitors) {
      var randNum = Math.floor(Math.random() * players.length);
      var match = false
      traitorsArr.forEach(num => {
        if (num == randNum) {
          match = true
        }
      });
      while (match == true) {
        randNum = Math.floor(Math.random() * players.length);
        match2 = false;
        traitorsArr.forEach(num => {
          if (num == randNum) {
            match2 = true
          }
        });
      }

      traitorsArr.push(randNum)

      traitorsArr.forEach(element => {
        waiters[element].write("youAreTraitor")
      });


      imposersAssigned++;
    }
    console.log(chalk.green(`Your game has started with ${players.length} players and ${Config.Traitors} imposters`))
  }

})).on('close', () => {
  // only gets triggered by ^C or ^D
  const MSGs = require("./FileSys/Msg.json");
  console.log(chalk.green(MSGs.QuitMSG));
  process.exit(0);
});

// creates the server
var server = net.createServer();
function StartGame() {
  this.timer = setInterval(() => {
    turnCount = turnCount + 1;
    if (emergency = "active") {
      reportTimeRemaining--;
      if (reportTimeRemaining == 0) {
        emergency = "ended"
        if (Config.Verbose) console.log(votes)
        if (votes.length < 1) {
          votes = [1, 2] //tie if 0 votes thus nothing
        }
        var map = votes.reduce(function (prev, cur) {
          prev[cur] = (prev[cur] || 0) + 1;
          return prev;
        }, {});

        let winner2 = Object.keys(map).reduce(function (a, b) { if (map[a] == map[b]) return "tie"; return map[a] > map[b] ? a : b });
        votes = [];
        if (winner2 > players.length) {
          winner2 = "tie"
        }
        winner = winner2;
        if (Config.Verbose) console.log(votes)

        if (winner2 != "tie") {
          if (Config.Verbose) console.log(winner2)
          var playerToKillId = players[parseInt(winner2) - 1].PlayerID;
          killPlayer(playerToKillId, false);
        }
      }
    }
  }, Config.delay)
  GameHasStarted = true;
}
//emitted when server closes ...not emitted until all connections closes.
server.on('close', function () {
  console.log('Server closed !');
});
async function killPlayer(playerToKillId, spawnCorpse = true) {
  var tratiorNum = 0;
  var InnocentNum = 0;
  const Player = require("./FileSys/Player").player;
  const ghost = new Player()
  players.forEach(player => {
    if (playerToKillId == player.PlayerID) {
      let corpse = new Player();
      corpse.y = player.y;
      corpse.x = player.x;
      corpse.IsDead = true
      corpse.PreviousColor = player.PlayerColor;
      corpse.instanceOfPlayer = player.PlayerID
      corpse.isCorpse = true
      ghost.y = player.y;
      ghost.x = player.x;
      ghost.IsDead = true;
      ghost.PreviousColor = player.PlayerColor;
      ghost.PlayerColor = player.PlayerColor;
      ghost.isRendered = false;
      ghost.isGhost = true;
      ghost.PlayerID = player.PlayerID;
      if (spawnCorpse) {
        players.push(corpse);
        players.splice(players.indexOf(player), 1, ghost);
      } else {
        players.splice(players.indexOf(player), 1, ghost);
      }
      deathWaiters.forEach(waiter => {
        if (waiter.playerId == playerToKillId) {
          waiter.socket.write("die:" + JSON.stringify(ghost))
        }
      });

    }
  });
  players.forEach(player => {
    if (!player.IsDead) { if (player.IsTraitor) { tratiorNum++ } else { InnocentNum++ } }
  });
  if (tratiorNum == InnocentNum) { TraitorWin = true } else
    if (tratiorNum == 0) { InnocentWin = true }
}

// emitted when new client connects
const publicIp = require('public-ip');
const { player } = require('./FileSys/Player');
const { indexOf } = require('./FileSys/BaseMap');
const stripAnsi = require('strip-ansi');
const { spawn } = require('child_process');
const { kill } = require('process');
server.on('connection', function (socket) {
  if (!GameHasStarted) StartGame();
  server.getConnections(function (error, count) {
    if (Config.Verbose) console.log('Number of concurrent connections to the server : ' + count);
  });




  socket.on('data', (data) => {
    let currentPlayer;
 
    var data1 = data.toString();
    if (Config.Verbose) console.log(data1)
    if (data1.startsWith("sendMsgsToServer: ")) {
      var msg = data1.slice("sendMsgsToServer: ".length);
      players.forEach(player => {
        if (msg.includes(player.PlayerColor)) {
          currentPlayer = player;
        }
      });
      const saveMsg = msg;
      
      var num = stripAnsi(msg.split(" ").join("").replace("ඞ", "").replace(":", "").replace("vote", "").split(" ").join(""))
      let validVote = true;
      let stripMsg = stripAnsi(saveMsg)
      let userNameMsg = stripMsg.replace("ඞ", currentPlayer.userName +" "+ currentPlayer.PlayerColor + "")
      msg = userNameMsg
      if (!isNaN(num) || msg.includes("No Vote For U")) {
        
        
        let Voted = false;

        if (saveMsg.includes("No Vote For U")) {
          Voted = true; //voting
        }
        if (!Voted) {
          if (player.IsDead) validVote = false; //dead men tell not tales..... so i geuss they can't vote either... probably?

          if (num > players.length) {
            msg = `SERVER: ${currentPlayer.PlayerColor}  voted to skip`
          } else if (players[parseInt(num) - 1].IsDead) {
            msg = `SERVER: ${currentPlayer.PlayerColor}  tried to vote for a dead man, this is not anime, hes not coming back bruv :(`
            validVote = false; //voter fraud TRUMP2020!!!!!!! w/e do what you do man idc "now is the time for the proletariate to rise" -- technoblade also techno blade "welp, the buswasie do lots of damage so i geuss its not the time for comunismm"
          }
          else {
            try {
              msg = `SERVER: ${currentPlayer.PlayerColor}  voted for ${players[parseInt(num) - 1].PlayerColor}`
            } catch (error) {
              console.log("error player voted for undefined position --voted num:" + num)
              msg = `SERVER: ${currentPlayer.PlayerColor} attempted to vote for #${num} there may have been an error. report at r/AmongJS`
            }

          }
        } else {
          validVote = false;
          msg = `SERVER: ${currentPlayer.PlayerColor} , you have already voted, you cannot vote again`
        }
        if (validVote)
          votes.push(parseInt(num));
      }
     
      msgs.push(msg);
    } else
      if (data1 == "sendMsgsPls") {
        socket.write(JSON.stringify([msgs, reportTimeRemaining]))
      }


    if (data1.startsWith("waiting")) {
      waiters.push(socket);
      return
    }
    if (data1.startsWith("DeathWaiting")) {//awaiting your death
      var playerId = JSON.parse(data1.slice(12));
      let dataObj = {
        socket,
        playerId
      }
      deathWaiters.push(dataObj)
      return
    }
    if (data1.startsWith("ReportWaiting")) {//reported to PETA
      var playerId = JSON.parse(data1.slice(13));
      reportWaiters.push(socket)
      return
    } else if (data1.startsWith("Report")) {
      players.forEach(player => {
        player.HasVoted = false;
      });
      votes = [];
      reportStartTime = turnCount;
      reportTimeRemaining = Config.emergencyMeetingTime;
      emergency = "active";

      let obj = JSON.parse(data1.slice(6));
      var reporter = obj["reporter"];
      var dead = obj["dead"];
      if (dead != null) {
        players.forEach(player => {
          if (player.instanceOfPlayer == dead.instanceOfPlayer) {
            player.isRendered = false;
          }
        });
      }
      reportWaiters.forEach(waiter12 => {
        waiter12.write(JSON.stringify(reporter));
      });
    } else if (data1.startsWith("giveMeResults")) {
      socket.write(JSON.stringify(winner));
    } else if (data1.startsWith("removePlayer:")) {
      var playerId = JSON.parse(data1.slice("removePlayer:".length));
      let numOfRemoved = 0;
      players.forEach(player => {
        if (player.PlayerID == playerId) {
          players.splice(players.indexOf(player), 1);
          numOfRemoved++;
        }
        if (player.instanceOfPlayer == playerId) {
          players.splice(players.indexOf(player), 1);
          numOfRemoved++;
        }
      });
      socket.write(JSON.stringify(numOfRemoved));
      socket.end();
    } else if (data1.startsWith("triggerSabotage:")) {
      socket.end();
      isEmergency = true;
      /**
       * @description an obj containing the room adn type of sabotage 
       * @property room
       * @property type
      */
      var obj = JSON.parse(data1.slice("triggerSabotage:".length));
      let room = obj.room;
      let type = obj.type;
      let typeExists = false;
      if (type != null) {
        typeExists = true;
      }
      let exists = false;
      allEmergencies.forEach(eme => {
        if(eme === room){
          exists = true
        }
      });
      if(exists == false)allEmergencies.push(room);
      switch (room) {
        case "Upper_Engine":
          
          break;
        case "Reactors":
          let timeLeft = Config.timeBeforeReactorBlows
          criticalTimer = setInterval(() => {
            emeMsg = ["reactors have", "been sabotaged", "fix them or die", "timeLeft: " + timeLeft]
            timeLeft--
            if(timeLeft == -1){
              clearInterval(criticalTimer)
              players.forEach(player => {
                if(!player.IsTraitor)killPlayer(player.playerId)
              });
              emeMsg =""
            }
          },1000)
          
          break;
        case "Lower_Engine":

          break;
        case "Security":

          break;
        case "MedBay":

          break;
        case "Electrical":
          emeMsg = ["Lights have been","sabotaged, fix them","to see again"]
          Config.VisionTiles = 1
          break;
        case "Storage":

          break;
        case "Communications":
          emeMsg = ["comms have been", "sabotaged fix them","to see tasks again"]
          break;
        case "Shields":

          break;
        case "Admin":

          break;
        case "Cafeteria":

          break;
        case "O2":
          let timeLeft2 = Config.timeUntilO2Depletes
          criticalTimer = setInterval(() => {
            emeMsg = ["oxygen has been", "been sabotaged", "oxygen is slowly", "depleting, fix it", "timeLeft: " + timeLeft2]
            timeLeft2--
            if(timeLeft2 == -1){
              clearInterval(criticalTimer)
              players.forEach(player => {
                if(!player.IsTraitor)killPlayer(player.playerId)
              });
              emeMsg =""
            }
          },1000)
          break;
        case "Weapons":

          break;
        case "Navigation":

          break;
        default:
          break;
      }
    }else if(data1.startsWith("removeSabotage:")){
      var obj = JSON.parse(data1.slice("removeSabotage:".length));
      let room = obj.room;
      let type = obj.type;
      let typeExists = false;
      if (type != null) {
        typeExists = true;
      }
      allEmergencies.forEach(eme => {
        if(eme === room){
          allEmergencies.splice(allEmergencies.indexOf(eme),1)
        }
      });
      emeMsg = [""]
      switch (room) {
        case "Upper_Engine":
          
          break;
        case "Reactors":
          clearInterval(criticalTimer);
          break;
        case "Lower_Engine":

          break;
        case "Security":

          break;
        case "MedBay":

          break;
        case "Electrical":
          Config.VisionTiles = visionBase
          break;
        case "Storage":

          break;
        case "Communications":
          break;
        case "Shields":

          break;
        case "Admin":

          break;
        case "Cafeteria":

          break;
        case "O2":
          clearInterval(criticalTimer);
          break;
        case "Weapons":

          break;
        case "Navigation":

          break;
        default:
          break;
      }
      if(allEmergencies.length == 0){
        isEmergency = false;
      }
    }


    else if (data1.startsWith("newPlayer: ")) {
      if (gameStarted == true) return socket.write("cannot join game has started");
      var NewPlayer = JSON.parse(data1.slice(11));
      var randNum = Math.floor(Math.random() * 100000);
      const Config = require("./FileSys/Config.json");
      const chalk = require("chalk");
      let colorArr = [chalk.blue, chalk.blueBright, chalk.cyan, chalk.cyanBright, chalk.green, chalk.greenBright, chalk.magenta, chalk.magentaBright, chalk.yellow, chalk.yellowBright]
      let color = Math.floor(Math.random() * colorArr.length)
      var RandIcon;
      if (Config.infiniteColors) {
        RandIcon = chalk.hex(Math.floor(Math.random() * 16777215).toString(16))(Config.PlayerIcon)
      } else {
        RandIcon = colorArr[color](Config.PlayerIcon)
      }
      var ShouldExit = false;
      while (ShouldExit == false) {
        if (players.length > 0) {
          let noChanges = true;
          players.forEach(player => {

            if (randNum == player.PlayerID) {
              randNum = Math.floor(Math.random() * 100000);
              noChanges = false;
            } else if (RandIcon == player.PlayerColor && !Config.infiniteColors) {
              color = Math.floor(Math.random() * colorArr.length)
              RandIcon = colorArr[color](Config.PlayerIcon)
              noChanges = false;
            }
          });
          if (noChanges) ShouldExit = true;
        } else {
          ShouldExit = true;
        }
      }

      NewPlayer.PlayerColor = RandIcon;
      NewPlayer.PlayerID = randNum;
      NewPlayer.x = Config.SaveMapCordPair.Home.x - Math.floor(Math.random() * 10);
      NewPlayer.y = Config.SaveMapCordPair.Home.y - Math.floor(Math.random() * 2);
      NewPlayer.spawnPos = {"x": NewPlayer.x, "y": NewPlayer.y}
      socket.write("SendPlayerWithIdBack: " + JSON.stringify([NewPlayer, Config]) + "\n")
      players.push(NewPlayer);
      console.log(`A new player has joined, there are ${players.length} players in the game, the max is like 10 about, type: "start" whenever you want to start the game.`)
    } else if (data1.startsWith("updatePlayer: ")) {
      var UpdatedPlayer = data1.slice(14);
      let i = 0;
      players.forEach(player => {
        if (UpdatedPlayer.PlayerID == player.PlayerID) {
          players[i] = player
        }
        i++;
      });
    }
    else if (data1.startsWith("sendPlayersToMePls: ")) {
      if (TraitorWin) {
        socket.write("TraitorWin");
        return;
      } else if (InnocentWin) {
        socket.write("InnocentWin");
        return;
      }

      var data5 = data1.slice(20)
      var UpdatedPlayer = JSON.parse(data5);
      let i = 0;
      let exists = false;
      if (CurrentTime != 0) {
        LastTime = CurrentTime
      }
      var date = new Date();
      CurrentTime = date.getTime();
      numtimes++
      if (LastTime != 0) {
        TotalTime = TotalTime + (CurrentTime - LastTime);
      }

      if (TotalTime > 950) {
        if (Config.Verbose) console.log(numtimes + "requests in one second")
        //console.log("there are currently "+players.length+" players in this lobby")
        numtimes = 0
        TotalTime = 0
      }
      let tasksLeft = false;
      players.forEach(player => {
        if (!player.IsTraitor && !player.tasksCompleted) tasksLeft = true;
        if (UpdatedPlayer.PlayerID == player.PlayerID) {
          players[i] = UpdatedPlayer;
          exists = true;
        }
        i++;
      });
      if (!tasksLeft) socket.write("InnocentWin");
      infoObj = {
        players,
        turnCount,
        "gameStarted?": true,
        isEmergency,
        allEmergencies,
        Config,
        emeMsg
      }
      if (gameStarted == false)
        infoObj = {
          players,
          turnCount,
          "gameStarted?": false,
          isEmergency,
          allEmergencies,
          Config
        }
      if(isEmergency){
        infoObj = {
          players,
          turnCount,
          "gameStarted?": true,
          isEmergency,
          allEmergencies,
          Config,
          emeMsg
        }
      }

      socket.write("hereAreYourPlayers: " + JSON.stringify(infoObj) + "\n");
      socket.end()
      // } else if(data1.startsWith("sendTick: ")){
      //   socket.write("hereAreYourTicks: " + turnCount + "\n");
    } else if (data1.startsWith("playerDeath: ")) {

      var playerToKillId = data1.slice(13)

      killPlayer(playerToKillId)

    }
  });

  socket.on('error', function (error) {
    if (Config.Verbose) console.log('Error : ' + error);
  });


  socket.on('end', function (data) {
    //kill player
  });

  socket.on('close', function (error) {
    //kill player
    if (error) {

    }
  });
});

// emits when any error occurs -> calls closed event immediately after this.
server.on('error', function (error) {
  if (Config.Verbose) console.log('Error: ' + error);
});

//emits when server is bound with server.listen
server.on('listening', function () {
  console.log('Server is listening!');
});



const port = prompt('What port do you want to host a server on, type \"-99\" for automatically assigned port: ')
if (port == "-99") {
  server.listen(async function () {
    const publicIp = require('public-ip');

    var address = server.address();
    var port = address.port;
    var family = address.family;
    //var ipaddr = address.address;
    console.log('Server is listening at port: ' + port);
    console.log('Server ip: ' + await publicIp.v4());
    console.log('Server is IP4/IP6: ' + family);
  });
} else {
  server.listen(port, async function () {
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

if (islistening) {
  console.log('Server is listening');
} else {
  console.log('Server is not listening');
}


