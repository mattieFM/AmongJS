

/*#Program "Heck" 
 #Program description: very bad code --amoung us rip off
 #Programmer: Matt /AuthoredEntropy
 #Course: Bad_JS.net.com.lol.funnyjoke.net
*/
const util = require("./Utility/util");
const MSGs = require("./FileSys/Msg.json");
const Config = require("./FileSys/Config.json");
const init = class {
_FileSystem = require("./Controllers/FsController");
IO_Controller = require("./Controllers/IO_Controller");
FsController;
CommandController;
TFCMDs;
CMDs;
map;
BaseFileSys  = new this._FileSystem.baseFileSys(Config.BasePrompt);
util = new util();
playerClass = require("./FileSys/Player").player
player_1;
    BasicGameInit(){
        this.CMDs.BasicGameStart();
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
        this.BasicGameInit();
    }
}
var TempSys = new init();
module.exports.FileSystem = TempSys;
