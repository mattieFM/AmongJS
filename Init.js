

/*#Program "Heck" 
 #Program description: very bad code --amoung us rip off
 #Programmer: Matt /AuthoredEntropy
 #Course: Bad_JS.net.com.lol.funnyjoke.net
*/
const util = require("./Utility/util");
const MSGs = require("./FileSys/Msg.json");
const Config = require("./FileSys/Config.json");
const that = this;
const init = class {
_FileSystem = require("./Controllers/FsController");
IO_Controller = require("./Controllers/IO_Controller");
FsController;
CommandController;
TFCMDs;
CMDs;
map;
BaseFileSys  = new this._FileSystem.baseFileSys(Config.BasePrompt);
allPlayers = []
util = new util();
playerClass = require("./FileSys/Player").player
player_1;
timer;
client;
TickCount;
port;
IpAdress;

ConnectPlayer(player) {
    var net = require('net');
const prompt = require('prompt-sync')();

const client  = new net.Socket();

 this.IpAdress = prompt('What Ipv4 address do you want to connect to? (\"localhost\" if you are on a lan server): ');
 this.port = prompt('What port do you want to connect to? ');
const client2  = new net.Socket();
client2.connect({
    port:this.port,
    host:this.IpAdress
  });
  client2.on('data',function(data){
    //
    var data2 = data.toString();
    if(data2.startsWith("SendPlayerWithIdBack: ")){
        var UpdatedPlayer = data2.slice(22);
        that.FileSystem.player_1 = JSON.parse(UpdatedPlayer);
        client2.end();
    }
    if(data2.startsWith("hereAreYourPlayers: ")){
    var players2 = data2.slice(20);
    var obj = JSON.parse(players2);
    that.FileSystem.allPlayers = obj.players;
    that.FileSystem.TickCount= parseInt(obj.turnCount);
    
}
client2.on('error',(error) =>{
    console.log('ConnectPlayerError : ' + error);
  });
// if(data2.startsWith("hereAreYourTicks: ")){
//     var turncount = data2.slice(18,data2.length-2);
//     this.TickCount = parseInt(turncount)
// }
});
client2.write('newPlayer: ' + JSON.stringify(player) + "\n");
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
            console.log('Client2Error : ' + error);
          });
          
        client.on('connect', () => {
        client.write("sendPlayersToMePls: "+ JSON.stringify(player)+"\n");
          var address = client.address();
          var port = address.port;
          var family = address.family;
          var ipaddr = address.address;
          // writing data to server
          
        });
        client.on('data', (data) => {
            //
            var data2 = data.toString();
            if(data2.startsWith("SendPlayerWithIdBack: ")){
                var UpdatedPlayer = data2.slice(22);
                that.FileSystem.player_1 = JSON.parse(UpdatedPlayer);
            }
            if(data2.startsWith("hereAreYourPlayers: ")){
            if(Config.Verbose)console.log("data = "+data2);
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
KillPlayer(id) {
    return new Promise(resolve =>{
        var net = require('net');
        const client3  = new net.Socket();
        client3.connect({
          port:this.port,
          host:this.IpAdress
        });
        
        client3.on('error',(error) =>{
            console.log('KillPlayerError : ' + error);
          });
          
        client3.on('connect', () => {
        client3.write("playerDeath: "+ JSON.stringify(id)+"\n");
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
    UpdatePlayer(player){
        
    }
    async StartGame(){
        await this.util.wait(1000);
        this.timer = setInterval(async () => {
            this.map.UpdateMapStatuses(this.player_1);
        }, Config.delay)
    }

    BaseInit(){
        //initalizing controllers into filesystem
        this.FsController = new this._FileSystem.fs();
        if(Config.Verbose)console.log("--Init: Fs Controller Initialized into Filesystem--")
        this.map = new this._FileSystem.map();
        if(Config.Verbose)console.log("--Init: Map Controller Initialized into Filesystem--")
        this.player_1 = new this.playerClass();
        if(Config.Verbose)console.log("--Init: player_1 Initialized into Filesystem--")
        this.CommandController = require("./Controllers/CommandController");
        this.CMDs = new this.CommandController.CMD();
        if(Config.Verbose)console.log("--Init: Command Controller Initialized into Filesystem--")
        this.IOController = new this.IO_Controller.IO();
        if(Config.Verbose)console.log("--Init: IO Controller Initialized into Filesystem--")
        
        this.player_1.LoadFileSys(this);
        if(Config.Verbose)console.log("--Init: FileSystem Initialized into player_1--")
        this.map.LoadFileSys(this);
        if(Config.Verbose)console.log("--Init: FileSystem Initialized into map--")
        this.FsController.LoadFileSys(this);
        if(Config.Verbose)console.log("--Init: FileSystem Initialized into Fs Controller--")
        this.CMDs.LoadFileSys(this)
        if(Config.Verbose)console.log("--Init: FileSystem Initialized into Command Controller--")
        this.IOController.LoadFileSys(this)
        if(Config.Verbose)console.log("--Init: FileSystem Initialized into IO Controller--")
        
    }
    constructor(){
        this.BaseInit();
        var client = this.BasicGameInit();
        this.StartGame();
    }
}
var TempSys = new init();
module.exports.FileSystem = TempSys;
