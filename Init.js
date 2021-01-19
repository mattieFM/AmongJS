/*#Program "Hecking heck V2" 
 #Programmer: Matt /AuthoredEntropy
*/

const util = require("./Utility/util");
const MSGs = require("./FileSys/Msg.json");
const { player } = require("./FileSys/Player");
const { fs } = require("./Controllers/FsController");

const that = this;
const init = class {
  quickStart = false;
  clientConfig = require("./FileSys/ClientConfig.json")
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
  sabotageMapActive = false;
  Voted = false;
  Config = require("./FileSys/Config.json");
  _FileSystem = require("./Controllers/FsController");
  IO_Controller = require("./Controllers/IO_Controller");
  FsController;
  emergencyInterval;
  emergency = false;
  word = "Cafeteria";
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
  completeSabotageTask(room, subType = null) {
    return new Promise(resolve => {
      var net = require('net');

      const client = new net.Socket();
      client.connect({
        port: this.port,
        host: this.IpAdress
      });
      client.setTimeout(0);
      let obj = {
        "room": room,
        "type": subType
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
  triggerSabotage(room, subType = null) {
    return new Promise(resolve => {
      var net = require('net');

      const client = new net.Socket();
      client.connect({
        port: this.port,
        host: this.IpAdress
      });
      client.setTimeout(0);
      let obj = {
        "room": room,
        "type": subType
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
  removePlayerFromServer(id) {
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
          await this.FsController.FileSys.map.endGameDisplay(["Turn Num: " + this.TickCount, "Imposters Win", "", "", "",], this.player_1);
          process.exit(0)
        } else if (data2.includes("InnocentWin")) {
          if (this.pause == true && this.emergency == false) await this.util.wait(6000);
          clearInterval(this.timer)
          clearInterval(this.emergencyInterval)
          await this.FsController.FileSys.map.endGameDisplay(["Turn Num: " + this.TickCount, "Crewmates Win", "", "", "",], this.player_1);
          process.exit(0)
        }
        //

        if (data2.startsWith("SendPlayerWithIdBack: ")) {
          var UpdatedPlayer = data2.slice(22);
          that.FileSystem.player_1 = JSON.parse(UpdatedPlayer)[0];

          client.end();
        }
        let completeData = "";
        if (data2.startsWith("hereAreYourPlayers: ")) {
          if (this.Config.Verbose) console.log("data = " + data2);
          
          completeData = completeData + data2;
         
          if(completeData.includes("EndOfTransmission")){
            console.log("recived Data")
            completeData = completeData.replace("EndOfTransmission","")
            completeData = completeData.replace("StartOfTransmission","")
            var players2 = completeData.slice(20);
            
            try {
              var obj = JSON.parse(players2);
            } catch (error) {
              let fs = require("fs")
              fs.writeFileSync(__dirname + "//obj.txt", players2)
            }
            
            that.FileSystem.allPlayers = obj.players;
            that.FileSystem.TickCount = parseInt(obj.turnCount);
            if(obj.Config)that.FileSystem.Config = obj.Config
            resolve(obj);
            client.end();
          }
         
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
          if (num < this.allPlayers.length) {
            if (!this.allPlayers[parseInt(num) - 1].IsDead) this.Voted = true;
          } else {
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
  async BasicGameInit(that) {
    let colors = require("colors")
    return new Promise( async resolve => {
      const prompt = require('prompt-sync')();
      var msgArr = MSGs.WelcomeMsg;
      let sentence = msgArr
      for (let i = 0; i < sentence.length; i++) {
        process.stdout.write(colors.grey(sentence.substring(0 + i, 1 + i)))
        await that.util.wait(50)
      }
      console.log()
      const YesNo = prompt("[y/n]: ")
      if (YesNo == null || YesNo == "") {
         sentence = colors.red("you didn't answer anything so i took the liberty to kill you, hope that was ok...")
        for (let i = 0; i < sentence.length; i++) {
        process.stdout.write(colors.grey(sentence.substring(0 + i, 1 + i)))
        await that.util.wait(50)
      }
        process.exit(0);
      }
      if (YesNo.toLowerCase() == "y") {
        sentence = (MSGs.doYouNeedHelpMsg)
        for (let i = 0; i < sentence.length; i++) {
        process.stdout.write(colors.blue(sentence.substring(0 + i, 1 + i)))
        await that.util.wait(50)
      }
      console.log()
      const needsHelp = prompt("[y/n]: ")
      if(needsHelp == "y"){
        sentence = (MSGs.newHelpMsg)
        for (let i = 0; i < sentence.length; i++) {
        process.stdout.write(colors.grey(sentence.substring(0 + i, 1 + i)))
        await that.util.wait(50)
      }
      console.log()
      }else{
        sentence = (MSGs.NoHelpNeeded)
        for (let i = 0; i < sentence.length; i++) {
        process.stdout.write(colors.grey(sentence.substring(0 + i, 1 + i)))
        await that.util.wait(50)
      }
      console.log()
      }
        try {
          this.ConnectPlayer(this.player_1)
          resolve()
          
          
        } catch (error) {
          console.log("err: Could not connect");
          process.exit(0);
        }
  
      } else {
        process.exit(0);
      }
      
    })
    
  }
  async StartGame() {
   
    this.timer = setInterval(async () => {
        await this.map.UpdateMapStatuses(this.player_1, false);
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
  }
  userNameAndHat(that) {
    return new Promise (async (resolve) => {
      let colors = require("colors")
      let prompt = require("prompt-sync")();
      let sentence = "please enter your username below (less than 15 charecters)"
        for (let i = 0; i < sentence.length; i++) {
          process.stdout.write(colors.blue(sentence.substring(0 + i, 1 + i)))
          await that.util.wait(25)
        }
        console.log();
      let username = prompt(colors.blue(":"))
      while (username.length >= 15) {
        sentence = "enter your username, and now that you didn't listen to me you only get 13 chars for you username\n i hope your happy \n enter below:"
        for (let i = 0; i < sentence.length; i++) {
          process.stdout.write(colors.red(sentence.substring(0 + i, 1 + i)))
          await that.util.wait(25)
        }
        console.log();
      username = prompt(colors.blue(":"))

      }
      this.player_1.userName = username;
      console.log();
      console.log();
      console.log();
      sentence = "please enter your hat \nhats can be any single character that meets the requirements below:"
        for (let i = 0; i < sentence.length; i++) {
          process.stdout.write(colors.blue(sentence.substring(0 + i, 1 + i)))
          await that.util.wait(25)
        }
      sentence = "\n not a letter not an underscore \n not the number 2, \n not the vent icon \n not the character icon"
      for (let i = 0; i < sentence.length; i++) {
        process.stdout.write(colors.grey(sentence.substring(0 + i, 1 + i)))
        await that.util.wait(25)
      }
      console.log();
      let hat = prompt(colors.blue(" :"))
      let chalk = require("chalk")
      while (this.map.isLetter(hat) || hat == this.Config.PlayerIcon || hat == this.Config.VentIcon || hat.length > 1) {
        console.log(chalk.red("invalid HAT") + "\nplease enter your hat \n hats can be any single character that meets the requirements below:\n not a letter not an underscore \n not the number 2, \n not the vent icon \n not the character icon")
        hat = prompt(":")
      }
      this.player_1.hat = hat;
      console.log();
      console.log();
      console.log();
      resolve()
    })
    
  }
  async getSentence() {
    let randNum = Math.floor(Math.random() * 24)

    switch (randNum) {
      case 0:
        return "loading colorblind mode"
        break;
      case 1:
        return "executing non colored mode"
        break;
      case 2:
        return "ensuring you are color blind"
        break;
      case 3:
        return "jk lol just loading 16mil true color library"
        break;
      case 4:
        return "attaching memory editor"
        break;
      case 5:
        return "attaching color blind color fixer"
        break;
      case 6:
        return "booting up the decolorizing dragon"
        break;
      case 7:
        return "calling the ANSI Stripper (they will arrive in 5 min)"
        break;
      case 8:
        return "adding color just to remove it"
        break;
      case 9:
        return "recoloring the sun"
        break;
      case 10:
        return "installing the decolorizing virus"
        break;
      case 11:
        return "booting into safe mode"
        break;
      case 12:
        return "booting into color Blind mode"
        break;
      case 13:
        return "initalizing blinding radiance"
        break;
      case 14:
        return "spoiling the end game movie (you can't see it, im using the right colors)"
        break;
      case 15:
        return "trolling trolls on reddit by telling them they are colorblind and making them waste time taking a test, just to figure out that they are colorblind and i get sent to the principles office of reddit for bulling"
        break;
      case 16:
        return "initalizing dusk soundtrack and mapping the beats to grayscale values"
        break;
      case 17:
        return "watching a wonderful life in black and white"
        break;
      case 18:
        return "adding colors to the world again"
        break;
      case 19:
        return "firing the decolorizing dragon"
        break;
      case 20:
        return "hiring a new decolorizing dragon"
        break;
      case 21:
        return "proving the world is flat by showing how colors don't properly bounce in the atmosphere"
        break;
      case 22:
        return "initalizing cool color creation colorization colonization coding COD"
        break;
      case 23:
        return "See the same colors the same way when you and me see? Is my red blue for you, or my green your green too? Could it be true we see different hues? And, say, we do, then how would we discover this fact? And even if we did, would there be any impact? I don't think this would affect us personally, But I think it would have ripple effects throughout the interior design industry."
        break;



      default:
        break;
    }
  }
  processArgs(that) {
    return new Promise(resolve => {
      process.argv.forEach(async function (val, index, array) {
        if (index >= 2) {
          let prefix = val.substring(0, 1);
          if (val.substring(1, 2) == "-") {
            prefix == "--"
          }
          
          switch (prefix) {
            case "-":
              //client Launch Options
              switch (val) {
                case"-QuickStart":
                that.quickStart = true;
                break
                case "-ClrBlindMode":
                  let colors = require("colors")
                  that.clientConfig.clrBlindMod = true

                  console.log(colors.america("launching into Color Blind Mode"))
                  await that.util.wait(100)
                  for (let index = 0; index < 15; index++) {
                    let sentence = await that.getSentence();
                    for (let i = 0; i < sentence.length; i++) {
                      process.stdout.write(colors.random(sentence.substring(0 + i, 1 + i)))
                      await that.util.wait(25)
                    }
                    process.stdout.write("\n")

                  }
                  process.stdout.write("\n")
                  process.stdout.write("\n")
                  process.stdout.write("\n")
                  process.stdout.write(colors.red("COLOR BLIND MODE INITIALIZED"))
                  process.stdout.write("\n")
                  process.stdout.write("\n")
                  process.stdout.write("\n")
                  resolve()
                  break;

                default:
                  resolve()
                  break;
              }
            case "--":
              resolve()
              //server Launch Options
              break;
            default:
              resolve()
              break;
          }
        }
        if(process.argv.length <3)resolve()
      });
    })

  }
  loadTunes(that) {
    return new Promise(async resolve => {
      let colors = require("colors")
      let sentence = "LOADING TUNES"
      for (let i = 0; i < sentence.length; i++) {
        process.stdout.write(colors.red(sentence.substring(0 + i, 1 + i)))
        await that.util.wait(500)
      }
      process.stdout.write("\n")
      sentence = "LOADED TUNES"
      for (let i = 0; i < sentence.length; i++) {
        process.stdout.write(colors.green(sentence.substring(0 + i, 1 + i)))
        await that.util.wait(25)
      }
      process.stdout.write("\n")
      process.stdout.write("\n")
      process.stdout.write("\n")
      resolve()
    })
    
  }
  /**@description by creating a new init object the game is started */
  constructor() {
    console.clear()
    console.log(MSGs.opening)
    this.BaseInit();
    this.processArgs(this).then(() => {
      if(!this.quickStart)
      this.loadTunes(this).then(()=> {
      this.userNameAndHat(this).then(()=> {
        this.BasicGameInit(this).then(()=>{
          this.StartGame();
        })})})
      if(this.quickStart)this.userNameAndHat(this).then(()=> {
        this.BasicGameInit(this).then(()=>{
          this.StartGame();
        })
        
      })
      })

  }
}
var TempSys = new init();
module.exports.FileSystem = TempSys;
