/*#Program "Hecking heck V2" 
 #Programmer: Matt /AuthoredEntropy
*/

const util = require("./Utility/util");
const MSGs = require("./FileSys/Msg.json");
const { player } = require("./FileSys/Player");

const that = this;
const init = class {
  dontRenderTasks = false;
  sabotageMsg = [""]
  selectedColor = 0;
  pauseAutoMsg = false;
  colorMenuActive = false;
  colorPickerActive = false;
  customMenuActive = false;
  gameStarted = false;
  ventMapActive = false;
  currentMenuPos = "Cafeteria";
  sabotageActive = false;
  sabotageMapActive= false;
  Voted = false;
  Config = require("./FileSys/Config.json");
  _FileSystem = require("./Controllers/FsController");
  IO_Controller = require("./Controllers/IO_Controller");
  FsController;
  emergencyInterval;
  emergency = false;
  word = "none";
  pause = false;
  CommandController;
  swipeCardActive = false;
  cardFrame = 0;
  TFCMDs;
  fuelTaskActive = false;
  fuelFrame = 0;
  CMDs;
  map;
  BaseFileSys = new this._FileSystem.baseFileSys(this.Config.BasePrompt);
  allPlayers = []
  util = new util();
  playerClass = require("./FileSys/Player").player
  player_1;
  timer;
  client;
  TickCount;
  port;
  IpAdress;
  /**
   * @description send a net socket to the server that will receive data indicating weathor it is the traitor or not
   * @param {*} player the player controlled by this client
   */
  WaitForImposter(player) {
    var net = require('net');

    const client = new net.Socket();
    client.connect({
      port: this.port,
      host: this.IpAdress
    });
    client.setTimeout(0);
    client.on('connect', function () {
      client.write('waiting');
    })
    client.on('data', (data) => {
      console.log(data.toString())
      if (data.toString().startsWith("youAreTraitor")) {
        this.player_1.IsTraitor = true;
        client.end();
      } else {
        console.log(data)
        client.end();
      }
    });
    client.on('error', (error) => {
      if (this.Config.Verbose) console.log('waitingError : ' + error);
    });
  }
  /**
   * @description remove a sabotage event from the server
   * @param {*} room the room
   * @param {*} subType if multiple types of sabotage are avalible for that room, the type to remove
   * @returns Promise
   */
  completeSabotageTask(room, subType = null){
    return new Promise(resolve => {
      var net = require('net');

      const client = new net.Socket();
      client.connect({
        port: this.port,
        host: this.IpAdress
      });
      client.setTimeout(0);
      let obj = {
        "room":room,
        "type":subType
      }
      client.on('connect', function () {
        client.write('removeSabotage:' + JSON.stringify(obj));
      })
      client.on('data', (data) => {
        client.end();
        
        resolve();
      });
      client.on('error', (error) => {
        if (this.Config.Verbose) console.log('Err-removeSabotage: ' + JSON.stringify(obj));
      });
    })
  }
  /**
   * @description trigger a sabotage event on the server
   * @param {*} room the room to sabotage
   * @param {*} subType if multiple types of sabotage are avalible for that room, the type to activate
   * @returns Promise
   */
  triggerSabotage(room, subType = null){
    return new Promise(resolve => {
      var net = require('net');

      const client = new net.Socket();
      client.connect({
        port: this.port,
        host: this.IpAdress
      });
      client.setTimeout(0);
      let obj = {
        "room":room,
        "type":subType
      }
      client.on('connect', function () {
        client.write('triggerSabotage:' + JSON.stringify(obj));
      })
      client.on('data', (data) => {
        client.end();
        resolve();
      });
      client.on('error', (error) => {
        if (this.Config.Verbose) console.log('Err-triggerSabotage: ' + JSON.stringify(obj));
      });
    })
  }
  /**
   * @description send a new player to the server and load the server's config file into memory
   * @param {*} player the player controlled by this client
   */
  ConnectPlayer(player) {

    var net = require('net');
    const prompt = require('prompt-sync')();

    const client = new net.Socket();

    this.IpAdress = prompt('What Ipv4 address do you want to connect to? (\"localhost\" if you are on a lan server): ');
    this.port = prompt('What port do you want to connect to? ');

    this.WaitForImposter(player);
    client.connect({
      port: this.port,
      host: this.IpAdress
    });
    client.on('data', function (data) {
      //
      var data2 = data.toString();
      if (data2.startsWith("SendPlayerWithIdBack: ")) {
        let fs = require("fs")
        let parsedData = JSON.parse(data2.slice(22));
        var UpdatedPlayer = parsedData[0]
        that.FileSystem.player_1 = UpdatedPlayer;
        that.FileSystem.Config = parsedData[1]
        that.FileSystem.ReportPlayer(that.FileSystem.player_1)
        that.FileSystem.PlayerDeath(that.FileSystem.player_1)
        client.end();
      }
      if (data2.startsWith("hereAreYourPlayers: ")) {
        var players2 = data2.slice(20);
        var obj = JSON.parse(players2);
        that.FileSystem.allPlayers = obj.players;
        that.FileSystem.TickCount = parseInt(obj.turnCount);
        if (data2.startsWith("cannot join game has started")) {
          console.log("you cant join, the game has already started")
        }
      }
      client.on('error', (error) => {
        if (this.Config.Verbose) console.log('ConnectPlayerError : ' + error);
      });
      // if(data2.startsWith("hereAreYourTicks: ")){
      //     var turncount = data2.slice(18,data2.length-2);
      //     this.TickCount = parseInt(turncount)
      // }
    });
    client.on("connect", function () {
      client.write('newPlayer: ' + JSON.stringify(player) + "\n");
    })

  }
  /**@description connect to the server and remove specified client*/
  removePlayerFromServer(id){
    return new Promise(resolve => {
      var net = require('net');

      const client = new net.Socket();
      client.connect({
        port: this.port,
        host: this.IpAdress
      });
      client.setTimeout(0);
      client.on('connect', function () {
        client.write('removePlayer:' + id);
      })
      client.on('data', (data) => {
        client.end();
        resolve(data);
      });
      client.on('error', (error) => {
        if (this.Config.Verbose) console.log('removePlayer: ' + id);
      });
    })
    
  }
  /**
   * @description sends the player object to the server
   * @returns a json string containing an object with an array of all players and the turn number
   * @param {*} player the palyer controled by this client
   */
  getPlayersAndTick(player) {
    return new Promise(resolve => {

      var net = require('net');
      const client = new net.Socket();
      client.connect({
        port: this.port,
        host: this.IpAdress
      });

      client.on('error', (error) => {
        if (this.Config.Verbose) console.log('getPlayersAndTick : ' + error);
      });

      client.on('connect', () => {
        client.write("sendPlayersToMePls: " + JSON.stringify(player) + "\n");
      });
      client.on('data', async (data) => {
        var data2 = data.toString();
        if (data2.includes("TraitorWin")) {
          if (this.pause == true && this.emergency == false) await this.util.wait(6000);
          clearInterval(this.timer)
          clearInterval(this.emergencyInterval)
          await this.FsController.FileSys.map.endGameDisplay(["Turn Num: " + this.TickCount, "Imposters Win", "", ""], this.player_1);
          process.exit(0)
        } else if (data2.includes("InnocentWin")) {
          if (this.pause == true && this.emergency == false) await this.util.wait(6000);
          clearInterval(this.timer)
          clearInterval(this.emergencyInterval)
          await this.FsController.FileSys.map.endGameDisplay(["Turn Num: " + this.TickCount, "Crewmates Win", "", ""], this.player_1);
          process.exit(0)
        }
        //

        if (data2.startsWith("SendPlayerWithIdBack: ")) {
          var UpdatedPlayer = data2.slice(22);
          that.FileSystem.player_1 = JSON.parse(UpdatedPlayer)[0];

          client.end();
        }
        if (data2.startsWith("hereAreYourPlayers: ")) {
          if (this.Config.Verbose) console.log("data = " + data2);
          var players2 = data2.slice(20);
          var obj = JSON.parse(players2);
          that.FileSystem.allPlayers = obj.players;
          that.FileSystem.TickCount = parseInt(obj.turnCount);
          that.FileSystem.Config = obj.Config
          resolve(obj);
          client.end();
        }
      });
    });
  }
  /**
   * @description get all msgs from the sever that are to be displayed durring an emergency meeting
   * @returns a json containing an array of messages*/
  getMsgs() {
    return new Promise(resolve => {

      var net = require('net');
      const client = new net.Socket();
      client.connect({
        port: this.port,
        host: this.IpAdress
      });

      client.on('error', (error) => {
        if (this.Config.Verbose) console.log('sendMsgsPlsError : ' + error);
      });

      client.on('connect', () => {

        client.write("sendMsgsPls");

      });
      client.on('data', async (data) => {

        var data2 = data.toString();
        if (this.Config.Verbose) console.log("data = " + data2);
        resolve(data2);
        client.end();

      });
    });
  }
  /**
   * @description querry the server for the result of an emergnecy meeting
   * @returns "tie" or the number of the player that is voted out
   */
  getResult() {
    return new Promise(resolve => {

      var net = require('net');
      const client = new net.Socket();
      client.connect({
        port: this.port,
        host: this.IpAdress
      });

      client.on('error', (error) => {
        if (this.Config.Verbose) console.log('resulkterr : ' + error);
      });

      client.on('connect', () => {

        client.write("giveMeResults");

      });
      client.on('data', async (data) => {
        var data2 = data.toString();
        if (this.Config.Verbose) console.log("data = " + data2);
        resolve(data2);
        client.end();

      });
    });
  }
  /**
   * @description send a message to the server to display during emergency meetings
   * @param {*} msg a string that represents the message to send
   */
  sendMsg(msg) {
    if (this.player_1.IsDead) return;
    return new Promise(resolve => {

      var net = require('net');
      const client = new net.Socket();
      client.connect({
        port: this.port,
        host: this.IpAdress
      });

      client.on('error', (error) => {
        if (this.Config.Verbose) console.log('sendMsgError : ' + error);
      });

      client.on('connect', () => {
        var num = msg.split(" ").join("");
        if (!isNaN(num) && !this.Voted) {

          client.write("sendMsgsToServer: " + this.player_1.PlayerColor + " : " + "vote" + msg);
          if(num < this.allPlayers.length){
          if (!this.allPlayers[parseInt(num) - 1].IsDead) this.Voted = true;
          }else{
            this.Voted = true
          }
        } else if (!isNaN(num)) {
          client.write("sendMsgsToServer: " + this.player_1.PlayerColor + " : " + "No Vote For U");
        }

        else {
          client.write("sendMsgsToServer: " + this.player_1.PlayerColor + " : " + msg);
        }



        resolve()
        client.end()
      });
      client.on('data', async (data) => {

      });
    });
  }
  /**
   * @description connect a net socket to the server, the net socket will receive data if this player dies
   * @param {*} player the player controlled by this client
   */
  PlayerDeath(player) {
    var net = require('net');

    const client = new net.Socket();
    client.connect({
      port: this.port,
      host: this.IpAdress
    });
    client.on('connect', function () {
      client.write('DeathWaiting' + player.PlayerID);
    })
    client.on('data', (data) => {
      let newPlayer = JSON.parse(data.toString().slice("die:".length))
      this.player_1 = newPlayer;
      this.FsController.FileSys.map.death(this.player_1)
      client.end();
    });
    client.on('error', (error) => {
      if (this.Config.Verbose) console.log('DeathWaitingError : ' + error);
    });
    client.setTimeout(0);
    client.on('timeout', () => {
      console.log('socket timeout');
      client.end();
    });
  }
  /**
   * @description connect a net socket to the server, this net socket will be added to a list of net sockets that will recive data when a report is triggered
   * @param {*} player the player controlled by this client
   */
  ReportPlayer(player) {
    var net = require('net');

    const client = new net.Socket();
    client.connect({
      port: this.port,
      host: this.IpAdress
    });
    client.on('connect', function () {
      client.write('ReportWaiting' + player.PlayerID);
    })
    client.on('data', (data) => {
      this.ReportPlayer(this.player_1);
      var data2 = data.toString()
      var data1 = JSON.parse(data2)
      this.FsController.FileSys.map.Report(this.player_1, data1)
      client.end();
    });
    client.on('error', (error) => {
      console.log('ReportWaitingError : ' + error);
    });
    client.setTimeout(0);
    client.on('timeout', () => {
      console.log('socket timeout');
      client.end();
    });
  }
  /**
   * @description report a dead body to the server triggering an emergency meeting.
   * @param {*} player the player controlled by this client
   * @param {*} dead the dead player being reported
   */
  SendReportToServer(player, dead) {
    var net = require('net');

    const client = new net.Socket();
    client.connect({
      port: this.port,
      host: this.IpAdress
    });
    let obj = {
      "reporter": player,
      "dead": dead
    }
    client.on('connect', function () {
      client.write('Report' + JSON.stringify(obj));
      client.end()
    })

    client.on('error', (error) => {
      if (this.Config.Verbose) console.log('Report : ' + error);
    });

  }
  /**
   * @description kill a target player by sending the id to the server
   * @param {*} id the playerID of the player to kill
   */
  KillPlayer(id) {
    return new Promise(resolve => {

      var net = require('net');
      const client3 = new net.Socket();
      client3.connect({
        port: this.port,
        host: this.IpAdress
      });

      client3.on('error', (error) => {
        if (this.Config.Verbose) console.log('KillPlayerError : ' + error);
      });

      client3.on('connect', () => {
        client3.write("playerDeath: " + JSON.stringify(id));
        client3.end();
        resolve();

      });
    });
  }
  /**@description ask if the player wants to play the game, then run connectPlayer() if they answer y */
  async BasicGameInit() {
    const prompt = require('prompt-sync')();
    var msgArr = MSGs.WelcomeMsg.split("\n")

    for (let i = 0; i < msgArr.length; i++) {
      const element = msgArr[i];
      console.log(element.gray);
      await this.util.wait(100);
    }
    const YesNo = prompt("[y/n]: ")
    if (YesNo == null || YesNo == "") {
      console.log("you didn't answer anything so i took the liberty to kill you, hope that was ok...");
      process.exit(0);
    }
    if (YesNo.toLowerCase() == "y") {
      try {
        return this.ConnectPlayer(this.player_1);
      } catch (error) {
        console.log("err: Could not connect");
        process.exit(0);
      }

    } else {
      process.exit(0);
    }
  }
  async StartGame() {

    this.timer = setInterval(async () => {
      await this.map.UpdateMapStatuses(this.player_1);

    }, this.Config.delay)
  }
/**@description loads filesystem into all controllers and loads all controllers into filesystem */
  BaseInit() {
    //initalizing controllers into filesystem
    this.FsController = new this._FileSystem.fs();
    if (this.Config.Verbose) console.log("--Init: Fs Controller Initialized into Filesystem--")
    this.map = new this._FileSystem.map();
    if (this.Config.Verbose) console.log("--Init: Map Controller Initialized into Filesystem--")
    this.player_1 = new this.playerClass();
    if (this.Config.Verbose) console.log("--Init: player_1 Initialized into Filesystem--")
    this.CommandController = require("./Controllers/CommandController");
    this.CMDs = new this.CommandController.CMD();
    if (this.Config.Verbose) console.log("--Init: Command Controller Initialized into Filesystem--")
    this.IOController = new this.IO_Controller.IO();
    if (this.Config.Verbose) console.log("--Init: IO Controller Initialized into Filesystem--")

    this.util.loadFileSys(this);
    this.player_1.LoadFileSys(this);
    if (this.Config.Verbose) console.log("--Init: FileSystem Initialized into player_1--")
    this.map.LoadFileSys(this);
    if (this.Config.Verbose) console.log("--Init: FileSystem Initialized into map--")
    this.FsController.LoadFileSys(this);
    if (this.Config.Verbose) console.log("--Init: FileSystem Initialized into Fs Controller--")
    this.CMDs.LoadFileSys(this)
    if (this.Config.Verbose) console.log("--Init: FileSystem Initialized into Command Controller--")
    this.IOController.LoadFileSys(this)
    if (this.Config.Verbose) console.log("--Init: FileSystem Initialized into IO Controller--")
    let prompt = require("prompt-sync")();
    let username = prompt("please enter your username below (less than 15 charecters)")
    while(username.length >= 15){
      username = prompt("enter your username, and now that you didn't listen to me you only get 13 chars for you username\n i hope your happy \n enter below:")
    }
    this.player_1.userName = username;
  }
  /**@description by creating a new init object the game is started */
  constructor() {
    this.BaseInit();
    var client = this.BasicGameInit();
    this.StartGame();
  }
}
var TempSys = new init();
module.exports.FileSystem = TempSys;
