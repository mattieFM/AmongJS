

/*#Program "Heck" 
 #Program description: very bad code 
 #Programmer: Matt /AuthoredEntropy
 #Course: Bad_JS.net.com.lol.funnyjoke.net
*/
 
const util = require("./Utility/util");
const MSGs = require("./FileSys/Msg.json");
const { Socket } = require("dgram");
const that = this;
const init = class {
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
BaseFileSys  = new this._FileSystem.baseFileSys(this.Config.BasePrompt);
allPlayers = []
util = new util();
playerClass = require("./FileSys/Player").player
player_1;
timer;
client;
TickCount;
port;
IpAdress;
WaitForImposter(player) {
    var net = require('net');

const client2  = new net.Socket();
client2.connect({
    port:this.port,
    host:this.IpAdress
  });
  client2.setTimeout(0);
  client2.on('connect', function() {
    client2.write('waiting');
  })
  client2.on('data', (data) => {
      console.log(data.toString())
    if(data.toString().startsWith("youAreTraitor")){
        this.player_1.IsTraitor = true;
        client2.end();
    }else{
        console.log(data)
        client2.end();
    }
});
client2.on('error',(error) =>{
    if(this.Config.Verbose)console.log('waitingError : ' + error);
  });
}
ConnectPlayer(player) {

    var net = require('net');
const prompt = require('prompt-sync')();

const client  = new net.Socket();

 this.IpAdress = prompt('What Ipv4 address do you want to connect to? (\"localhost\" if you are on a lan server): ');
 this.port = prompt('What port do you want to connect to? ');
 
 this.WaitForImposter(player);
const client2  = new net.Socket();
client2.connect({
    port:this.port,
    host:this.IpAdress
  });
  client2.on('data',function(data){
    //
    var data2 = data.toString();
    if(data2.startsWith("SendPlayerWithIdBack: ")){
        let fs = require("fs")
        let parsedData = JSON.parse(data2.slice(22));
        var UpdatedPlayer = parsedData[0]
        that.FileSystem.player_1 = UpdatedPlayer;
        that.FileSystem.Config = parsedData[1]
        that.FileSystem.ReportPlayer(that.FileSystem.player_1)
        that.FileSystem.PlayerDeath(that.FileSystem.player_1)
        client2.end();
    }
    if(data2.startsWith("hereAreYourPlayers: ")){
    var players2 = data2.slice(20);
    var obj = JSON.parse(players2);
    that.FileSystem.allPlayers = obj.players;
    that.FileSystem.TickCount= parseInt(obj.turnCount);
    if(data2.startsWith("cannot join game has started")){
        console.log("you cant join, the game has already started")
    }
}
client2.on('error',(error) =>{
    if(this.Config.Verbose)console.log('ConnectPlayerError : ' + error);
  });
// if(data2.startsWith("hereAreYourTicks: ")){
//     var turncount = data2.slice(18,data2.length-2);
//     this.TickCount = parseInt(turncount)
// }
});
client2.on("connect", function() {
    client2.write('newPlayer: ' + JSON.stringify(player) + "\n");
})

}
Client2(player) {
    return new Promise(resolve =>{
       
        var net = require('net');
        const client  = new net.Socket();
        client.connect({
          port:this.port,
          host:this.IpAdress
        });
        
        client.on('error',(error) =>{
            if(this.Config.Verbose)console.log('Client2Error : ' + error);
          });
          
        client.on('connect', () => {
        client.write("sendPlayersToMePls: "+ JSON.stringify(player)+"\n");
        });
        client.on('data', async (data) => {
            var data2 = data.toString();
            if(data2.includes("TraitorWin")){
                if(this.pause == true && this.emergency == false)await this.util.wait(6000);
                clearInterval(this.timer)
                clearInterval(this.emergencyInterval)
                await this.FsController.FileSys.map.endGameDisplay(["Turn Num: " + this.TickCount, "Imposters Win", "", ""], this.player_1);
                process.exit(0)
            }else if (data2.includes("InnocentWin")){
                if(this.pause == true && this.emergency == false) await this.util.wait(6000);
                clearInterval(this.timer)
                clearInterval(this.emergencyInterval)
                await this.FsController.FileSys.map.endGameDisplay(["Turn Num: " + this.TickCount, "Crewmates Win", "", ""], this.player_1);
                process.exit(0)
            }
            //
            
            if(data2.startsWith("SendPlayerWithIdBack: ")){
                var UpdatedPlayer = data2.slice(22);
                that.FileSystem.player_1 = JSON.parse(UpdatedPlayer)[0];
                
                client.end();
            }
            if(data2.startsWith("hereAreYourPlayers: ")){
            if(this.Config.Verbose)console.log("data = "+data2);
            var players2 = data2.slice(20);
            var obj = JSON.parse(players2);
            that.FileSystem.allPlayers = obj.players;
            that.FileSystem.TickCount= parseInt(obj.turnCount);
            resolve(obj);
            client.end();
        }
        });
    });
}
getMsgs() {
  return new Promise(resolve =>{
     
      var net = require('net');
      const client  = new net.Socket();
      client.connect({
        port:this.port,
        host:this.IpAdress
      });
      
      client.on('error',(error) =>{
          if(this.Config.Verbose)console.log('sendMsgsPlsError : ' + error);
        });
        
      client.on('connect', () => {
          
      client.write("sendMsgsPls");
      
      });
      client.on('data', async (data) => {
    
          var data2 = data.toString();
          if(this.Config.Verbose)console.log("data = "+data2);
          resolve(data2);
          client.end();
      
      });
  });
}
getResult() {
  return new Promise(resolve =>{
     
      var net = require('net');
      const client  = new net.Socket();
      client.connect({
        port:this.port,
        host:this.IpAdress
      });
      
      client.on('error',(error) =>{
          if(this.Config.Verbose)console.log('resulkterr : ' + error);
        });
        
      client.on('connect', () => {
          
      client.write("giveMeResults");
      
      });
      client.on('data', async (data) => {
          var data2 = data.toString();
          if(this.Config.Verbose)console.log("data = "+data2);
          resolve(data2);
          client.end();
      
      });
  });
}
sendMsg(msg){
  if(this.player_1.IsDead)return;
  return new Promise(resolve =>{
     
    var net = require('net');
    const client  = new net.Socket();
    client.connect({
      port:this.port,
      host:this.IpAdress
    });
    
    client.on('error',(error) =>{
        if(this.Config.Verbose)console.log('sendMsgError : ' + error);
      });
      
    client.on('connect', () => {
      var num = msg.split(" ").join("");
    if(!isNaN(num) && !this.Voted){
      
      client.write("sendMsgsToServer: " + this.player_1.PlayerColor + " : "+ "vote"+msg);
      
      if(!this.allPlayers[parseInt(num)-1].IsDead)this.Voted = true;
    } else if(!isNaN(num)){
      client.write("sendMsgsToServer: " + this.player_1.PlayerColor + " : "+ "No Vote For U");
    }
    
    else{
      client.write("sendMsgsToServer: " + this.player_1.PlayerColor + " : "+ msg);
    }
    
    
    
    resolve()
    client.end()
    });
    client.on('data', async (data) => {

    });
});
}
PlayerDeath(player){
    var net = require('net');

    const client2  = new net.Socket();
    client2.connect({
        port:this.port,
        host:this.IpAdress
      });
      client2.on('connect', function() {
        client2.write('DeathWaiting' + player.PlayerID);
      })
      client2.on('data', (data) => {
        
        this.FsController.FileSys.map.death(player)
        client2.end();
    });
    client2.on('error',(error) =>{
        if(this.Config.Verbose)console.log('DeathWaitingError : ' + error);
      });
      client2.setTimeout(0);
      client2.on('timeout', () => {
        console.log('socket timeout');
        client2.end();
});
}
ReportPlayer(player){
    var net = require('net');

    const client2  = new net.Socket();
    client2.connect({
        port:this.port,
        host:this.IpAdress
      });
      client2.on('connect', function() {
        client2.write('ReportWaiting' + player.PlayerID);
      })
      client2.on('data', (data) => {
        this.ReportPlayer(player);
        var data2 =data.toString()
        var data1 = JSON.parse(data2)
        this.FsController.FileSys.map.Report(player,data1)
        client2.end();
    });
    client2.on('error',(error) =>{
        console.log('ReportWaitingError : ' + error);
      });
      client2.setTimeout(0);
      client2.on('timeout', () => {
        console.log('socket timeout');
        client2.end();
});
}
SendReportToServer(player, dead){
  var net = require('net');

  const client2  = new net.Socket();
  client2.connect({
      port:this.port,
      host:this.IpAdress
    });
    let obj = {
      "reporter": player,
      "dead": dead
    }
    client2.on('connect', function() {
      client2.write('Report' + JSON.stringify(obj));
      client2.end()
    })

  client2.on('error',(error) =>{
      if(this.Config.Verbose)console.log('Report : ' + error);
    });

}
KillPlayer(id) {
    return new Promise(resolve =>{
        
        var net = require('net');
        const client3  = new net.Socket();
        client3.connect({
          port:this.port,
          host:this.IpAdress
        });
        
        client3.on('error',(error) =>{
            if(this.Config.Verbose)console.log('KillPlayerError : ' + error);
          });
          
        client3.on('connect', () => {
        client3.write("playerDeath: "+ JSON.stringify(id));
        client3.end();
        resolve();
        
        });
    });
}
    async BasicGameInit(){
        const prompt = require('prompt-sync')();
        var msgArr = MSGs.WelcomeMsg.split("\n")

        for (let i = 0; i < msgArr.length; i++) {
        const element = msgArr[i];
        console.log(element.gray);
        await this.util.wait(100);
        }
        const YesNo = prompt("[y/n]: ")
        if(YesNo.toLowerCase() == "y"){
            return this.ConnectPlayer(this.player_1);
        }else {
            process.exit(0);
        }
        
        //this.StartGame();
    }
    async StartGame(){
        
        this.timer = setInterval(async () => {
            await this.map.UpdateMapStatuses(this.player_1);
         
        }, this.Config.delay)
    }

    BaseInit(){
        //initalizing controllers into filesystem
        this.FsController = new this._FileSystem.fs();
        if(this.Config.Verbose)console.log("--Init: Fs Controller Initialized into Filesystem--")
        this.map = new this._FileSystem.map();
        if(this.Config.Verbose)console.log("--Init: Map Controller Initialized into Filesystem--")
        this.player_1 = new this.playerClass();
        if(this.Config.Verbose)console.log("--Init: player_1 Initialized into Filesystem--")
        this.CommandController = require("./Controllers/CommandController");
        this.CMDs = new this.CommandController.CMD();
        if(this.Config.Verbose)console.log("--Init: Command Controller Initialized into Filesystem--")
        this.IOController = new this.IO_Controller.IO();
        if(this.Config.Verbose)console.log("--Init: IO Controller Initialized into Filesystem--")
        
        this.player_1.LoadFileSys(this);
        if(this.Config.Verbose)console.log("--Init: FileSystem Initialized into player_1--")
        this.map.LoadFileSys(this);
        if(this.Config.Verbose)console.log("--Init: FileSystem Initialized into map--")
        this.FsController.LoadFileSys(this);
        if(this.Config.Verbose)console.log("--Init: FileSystem Initialized into Fs Controller--")
        this.CMDs.LoadFileSys(this)
        if(this.Config.Verbose)console.log("--Init: FileSystem Initialized into Command Controller--")
        this.IOController.LoadFileSys(this)
        if(this.Config.Verbose)console.log("--Init: FileSystem Initialized into IO Controller--")
        
    }
    constructor(){
        this.BaseInit();
        var client = this.BasicGameInit();
        this.StartGame();
    }
}
var TempSys = new init();
module.exports.FileSystem = TempSys;
