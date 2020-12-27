/**Amoung us costs  :( 
Programmer: Matt/AuthoredEntropy*/
const chalk = require('chalk');
const colors = require('colors/safe');
const { read } = require('fs');
const { resolve } = require('path');
const { kill } = require('process');
const stripAnsi = require('strip-ansi');
const { charAt } = require('../FileSys/BaseMap');
const utility = require("../Utility/util");
let players;
let currentMsg;
const util = new utility();
module.exports.baseFileSys = class {
    TFQuestionNum = 0;
    PROMPT;
    constructor(){
        this.PROMPT = ">"
    }
}
module.exports.fs = class FsController{
    FileSys;
    LoadFileSys(FileSystem){
        this.FileSys = FileSystem;
    }
    
    /**@description Current Jank solution to solve question logic */
    
    getMap() {
        return new map().BaseMap;
    }
/**
 * 
 * @param {*} args the arguments that modify the result of the command as listed below
 * >> @description By default the command will just save basic info (info contained in the class "baseFileSys")
 * >> "-a" saves all data to a file
 * >> "-p" saves ONLY playerData to a file
 * >> "-add more later"
 */
    async WriteFileSys(args){
        var allData = false;
        var PlayerDataOnly = false;
        args = args.split("-");
        args.forEach(arg => {
            arg.replace("-", "");
            switch (arg) {
                case "a":
                    allData = true;
                    break;
                case "a":
                    PlayerDataOnly = true;
                    break;
                default:
                    break;
            }
        });
        
        let WriteBaseFileSysPromise = new Promise(resolve => {
            this.fs.writeFile(this.FileSys.Config.PATH + "\\FileSys\\BaseFileSystem.json", JSON.stringify(require("../Init").BaseFileSys), (err)=>{
              if(this.FileSys.Config.Verbose)console.log("--FsController: baseFileSys has been written to a file")
              resolve(true);
            })
          })
        if(a){
            //write all file systems to file
        } else if(p){
            //write only playerData to file
        } else {
            await WriteBaseFileSysPromise;
        }
    }
    
}
module.exports.map = class {
    FileSys;
    constructor(){
        colors.setTheme({
            funny: 'rainbow',
            merica: "america",
            normal: 'green',
            tasks: 'yellow',
            emergency: 'red'
        });
        this.SetCurrentMap();
        
    }
    LoadFileSys(FileSystem){
        this.FileSys = FileSystem;
        this.FileSys.player_1.gasQuestActive= true
        this.FileSys.player_1.uploadTaskActive = true
        this.FileSys.player_1.fixElecQuestActive = true
        this.FileSys.player_1.startEngineQuestActive = true
        this.setupTasks();
    }
    SetCurrentMap(){
        if(!this.currentMap){
            this.currentMap = this.BaseMap.split("\n")
            this.currentEmergencyMap = this.currentEmergencyMap.split("\n")
        }
        
    }
    currentMap;
    currentEmergencyMap = require("../FileSys/EmergencyMeetingMap");
    BaseMap = require("../FileSys/BaseMap");
    StatusTypes = require("../Utility/Enum/StatusEnum")
    Statuses = {
        Upper_Engine : this.StatusTypes.NORMAL,
        "Reactors" : this.StatusTypes.NORMAL,
        Lower_Engine : this.StatusTypes.NORMAL,
        Security : this.StatusTypes.NORMAL,
        MedBay : this.StatusTypes.NORMAL,
        Electrical : this.StatusTypes.TASKSAVAILABLE,
        "Storage" : this.StatusTypes.NORMAL,
        Communications : this.StatusTypes.NORMAL,
        Shields : this.StatusTypes.NORMAL,
        Admin : this.StatusTypes.NORMAL,
        Cafeteria : this.StatusTypes.NORMAL,
        O2 : this.StatusTypes.NORMAL,
        Weapons : this.StatusTypes.NORMAL,
        Navigation : this.StatusTypes.NORMAL
    }
    TaskStatuses = {
        Upper_Engine : this.StatusTypes.NORMAL,
        "Reactors" : this.StatusTypes.NORMAL,
        Lower_Engine : this.StatusTypes.NORMAL,
        Security : this.StatusTypes.NORMAL,
        MedBay : this.StatusTypes.NORMAL,
        Electrical : this.StatusTypes.TASKSAVAILABLE,
        "Storage" : this.StatusTypes.NORMAL,
        Communications : this.StatusTypes.NORMAL,
        Shields : this.StatusTypes.NORMAL,
        Admin : this.StatusTypes.NORMAL,
        Cafeteria : this.StatusTypes.NORMAL,
        O2 : this.StatusTypes.NORMAL,
        Weapons : this.StatusTypes.NORMAL,
        Navigation : this.StatusTypes.NORMAL
    }
    Names = {
        Upper_Engine : "Upper_Engine",
        Reactors : "Reactors",
        Lower_Engine : "Lower_Engine",
        Security : "Security",
        MedBay : "MedBay",
        Electrical : "Electrical",
        "Storage" : "Storage",
        Communications : "Communications",
        Shields : "Shields",
        Admin : "Admin",
        Cafe : "Cafeteria",
        O2 : "O2",
        Weapons : "Weapons",
        Navigation : "Navigation"
    }
    RandomizeMapStatuses(){
        
        var StatusArr = Object.keys(this.Statuses);
        
        return new Promise(resolve => {
            
            StatusArr.forEach(name => {
                switch (Math.floor((Math.random() * 3) +1)) {
                    case 1:
                        this.Statuses[name] = this.StatusTypes.NORMAL;
                        break;
                    case 2:
                        this.Statuses[name] = this.StatusTypes.TASKSAVAILABLE;
                        break;
                    case 3:
                        this.Statuses[name] = this.StatusTypes.EMERGENCY;
                        break;
                    default:
                        break;
                } 
            });
            resolve();
        })
        
    }
    async death(player){
        
            return new Promise(resolve => {
                this.FileSys.pause = true;
                var fs = require("fs");
            
            fs.readFile("./AmoungUs1.txt", (err, data) => {
            if (err) throw err;
            var FrameArr = JSON.parse(data);
            let index = 0;
            let length = FrameArr.length;
            let timer = setInterval(() => {
                const frame = FrameArr[index];
                process.stdout.write("\x1b[?25l");
                var readline = require("readline");
                readline.cursorTo(process.stdout, 1, 1)
                process.stdout.write(frame);
                process.stdout.write("\x1b[?25h");
                if(index == length-1){
                    clearInterval(timer);
                    this.FileSys.pause = false;
                    resolve();
                    player.IsDead = true;
                }else{
                    index++
                }
            }, 50);
            
            });
            })
            
        
    }
    updateCurrentMsg(msg){
        currentMsg = msg
        return;
    }
    async UpdateMapStatuses(player){
        if(this.FileSys.pause | this.FileSys.emergency){if(util.Verbose)console.log("PAUSED");return }
        const obj = await this.FileSys.Client2(player);
        if(obj["gameStarted?"] == false){
            console.log(chalk.blue("You are in the lobby, please wait for the host to start the game"))
            player.moveOverride = true;
            return
        } else{
            player.moveOverride = false;
        }
        
        this.SetCurrentMap();
        return new Promise(async resolve => {
            this.UnRenderPlayers();
            this.StripAnsi();
            this.UpdatePlayerVision(player)
            if(player.IsTraitor == true){
                this.DisplayMsg(["Turn Num: " + this.FileSys.TickCount, "Imposter", "kill your friends", "", "", "kill Cooldown:" + player.nextKillTurn], player, true);
            }else{
                this.DisplayMsg(["Turn Num: " + this.FileSys.TickCount, "Crewmate", "compete tasks", " "], player, true);
            }
       
            if(player.IsDead == true){
                player.PlayerColor = chalk.hex("#DBE7E7")(this.FileSys.Config.PlayerIcon);
                obj.players.push(player);
                if(player.IsTraitor == true){
                    this.DisplayMsg(["Turn Num: " + this.FileSys.TickCount, "hey shitass...", "wanna see me lose", "among us?"], player, true);
                }else{
                this.DisplayMsg(["Turn Num: " + this.FileSys.TickCount, "You are dead", "complete your tasks", " "], player, true);
                }
            }
            await this.RenderPlayers(obj.players);
            
            var NamesArr = Object.values(this.Names);
            NamesArr.forEach(name => {
            var status = this.Statuses[name];
            var coloredName = name;
            switch (status) {
                case "Sabotaged":
                    coloredName = colors.emergency(name);
                    break;
                case "TasksHere":
                    coloredName = colors.tasks(name);
                    break;
                case "Normal":
                    coloredName = colors.normal(name);
                    break;
                case "Highlight":
                    coloredName = chalk.cyan(name);
                    break;
                case "Unavial":
                    coloredName = chalk.hex("#705454").strikethrough(name);
                    break;
                default:
                    break;
            }
            var assembledMap = this.currentMap.join(this.FileSys.Config.ReplaceIcon); 
            var coloredMap = assembledMap.replace(name, coloredName);
            this.currentMap = coloredMap.split(this.FileSys.Config.ReplaceIcon);
        });
        
        this.writeAssembledMap();
        resolve(this.currentMap);
        }) 
}

        endGameDisplay(msg, player){
            this.UnRenderPlayers();
            this.StripAnsi();
            this.DisplayMsg(msg, player, true)
            var NamesArr = Object.values(this.Names);
            const obj = this.FileSys.Client2(player);
            this.RenderPlayers(obj.players, this.currentMap, true);
            NamesArr.forEach(name => {
            var status = this.Statuses[name];
            var coloredName = name;
            switch (status) {
                case "Sabotaged":
                    coloredName = colors.emergency(name);
                    break;
                case "TasksHere":
                    coloredName = colors.tasks(name);
                    break;
                case "Normal":
                    coloredName = colors.normal(name);
                    break;
                default:
                    break;
            }
            var assembledMap = this.currentMap.join(this.FileSys.Config.ReplaceIcon); 
            var coloredMap = assembledMap.replace(name, coloredName);
            this.currentMap = coloredMap.split(this.FileSys.Config.ReplaceIcon);
            });
            
        this.writeAssembledMap();
        return
        }
        deColorMap(){
            var NamesArr = Object.values(this.Names);
            NamesArr.forEach(name => {
                var status = this.Statuses[name];
                var coloredName = name;
                switch (status) {
                    case "Sabotaged":
                        coloredName = colors.emergency(name);
                        break;
                    case "TasksHere":
                        coloredName = colors.tasks(name);
                        break;
                    case "Normal":
                        coloredName = colors.normal(name);
                        break;
                    case "Highlight":
                        coloredName = chalk.cyan(name);
                        break;
                    case "Unavial":
                        coloredName = chalk.hex("#705454").strikethrough(name);
                        break;
                    default:
                        break;
                }
                
                var assembledMap = this.currentMap.join(this.FileSys.Config.ReplaceIcon); 
                var coloredMap = assembledMap.replace(coloredName, name);
                this.currentMap = coloredMap.split(this.FileSys.Config.ReplaceIcon);
            });
        }
        writeAssembledMap(){
            process.stdout.write("\x1b[?25l");
            var readline = require("readline");
            readline.cursorTo(process.stdout, 1, 1)
            process.stdout.write(this.currentMap.join("\n"));
            process.stdout.write("\x1b[?25h");
        }
        reset(){
            this.currentMap = this.BaseMap.split("\n")
        }
        StripAnsi(){
            const stripAnsi = require('strip-ansi');
            var lineNum = 0;
            this.currentMap.forEach(line => {
                this.currentMap[lineNum] = stripAnsi(line);
                lineNum++;
            });
        }
        /**
         * @description will allow the player to move to a new location relative to their current pos 
         * NOTE: does not ignore turns or collisions
         * @param {*} player the player to move
         * @param {*} x x cord of position to move to
         * @param {*} y y cord of position to move to
         */
        PlayerCanMove(player, tickCount, x,y){
            if(player.moveOverride == true) return(false);
            let NumOfSpaces = x*.5 +y
            var canMove = true;
            if(tickCount == player.currentGameTick){
                if(player.MovesThisTurn >= player.MovesPerTurn){
                    canMove = false;
                } else {
                    if(Math.abs(player.MovesThisTurn + NumOfSpaces) <= player.MovesPerTurn){
                        player.MovesThisTurn += NumOfSpaces;
                    }else{
                        canMove = false;
                    }
                }
            } else {
                player.currentGameTick = tickCount;
                player.MovesThisTurn = 0;
                return this.PlayerCanMove(player, tickCount, x,y);
            }
            return canMove
        }
        RelativePlayerMove(player, x, y){
            x = x *2
            this.StripAnsi();
            this.removePlayerVision();
            // if(totalMove > this.FileSys.Config.MovesPerTurn || totalMove < -this.FileSys.Config.MovesPerTurn){
            //     this.DisplayMsg(["YOU CANNOT MOVE"," MORE THAN" + this.FileSys.Config.MovesPerTurn,"SPACES PER SECOND"])
            //     return;
            // }
            var CanMove = this.PlayerCanMove(player, this.FileSys.TickCount, x,y);
            if(CanMove){
                let LocalX = x;
                let LocalY = x;
                x = player.x+x;
                y = player.y+y;
                const PlayerIcon = this.FileSys.Config.PlayerIcon;
                const WallIcon = this.FileSys.Config.WallIcon;
                var collision = this.Collision(x, y);
                if(collision){
                    this.collisionHandler(collision, player, x, y);
                }else{
                //this.currentMap = this.Replace(this.currentMap, player.x, player.y, "░");
                // this.currentMap = this.Replace(this.currentMap, x, y, this.FileSys.Config.PlayerIcon);
                player.x = x;
                player.y = y;
                this.FileSys.player_1 = player;
                
                
                }
                this.StripAnsi();
                this.UpdateMapStatuses(player); 
                
                return;
            }else{
                return;
            }
        }
        /**
         * @description will allow the player to move to a specified x y position on the map ignoring turns, but not ignoring collisions
         * @param {*} player the player to move
         * @param {*} x x cord of position to move to
         * @param {*} y y cord of position to move to
         */
        PlayerMove(player, x, y){
            this.removePlayerVision();
            this.StripAnsi();
            const PlayerIcon = this.FileSys.Config.PlayerIcon;
            const WallIcon = this.FileSys.Config.WallIcon;
            var collision = this.Collision(x, y);
            if(collision){
                this.collisionHandler(collision, player, x, y);
            }else{
            this.currentMap = this.Replace(this.currentMap, player.x, player.y, "░");
            this.currentMap = this.Replace(this.currentMap, x, y, this.FileSys.Config.PlayerIcon);
            player.x = x;
            player.y = y;
            }
            this.UpdateMapStatuses(player);
        }
        KillPlayerWithinRange(player){
            if(player.IsTraitor == false) return;
            if(!(this.FileSys.TickCount >= player.nextKillTurn)) return;
            let killer = player;
            let killRange = this.FileSys.Config.KillRange;
            let hasKilled = false
            this.FileSys.allPlayers.forEach(play => {
                if(play.IsTraitor == false){
                if(hasKilled) return;
                let xDistance = (Math.abs(killer.x - play.x)/2)
                let yDistance = Math.abs(killer.y - play.y) 
                if(xDistance + yDistance <= killRange){
                    this.FileSys.KillPlayer(play.PlayerID);
                    hasKilled = true
                }
            }
            });
            if(hasKilled == true){
                killer.nextKillTurn = this.FileSys.TickCount + this.FileSys.Config.killCooldown;
            }
        }
        async type(letter){
            if(!letter) return;
            if(letter == "backspace" | letter == "delete"){
                this.currentEmergencyMap[this.currentEmergencyMap.length-1] = this.currentEmergencyMap[this.currentEmergencyMap.length-1].slice(0, -1);
            }else if(letter == "clear"){
                this.currentEmergencyMap[this.currentEmergencyMap.length-1] = " "
            }else if(letter == "space"){
                this.currentEmergencyMap[this.currentEmergencyMap.length-1] = this.currentEmergencyMap[this.currentEmergencyMap.length-1] + " "
            }
            else if(letter == "return"){
                if(this.currentEmergencyMap[this.currentEmergencyMap.length-1].startsWith(" ")){
                    this.currentEmergencyMap[this.currentEmergencyMap.length-1] = this.currentEmergencyMap[this.currentEmergencyMap.length-1].substring(1);
                }
                this.FileSys.sendMsg(this.currentEmergencyMap[this.currentEmergencyMap.length-1]);
                this.currentEmergencyMap[this.currentEmergencyMap.length-1] = " ";
            }else if(letter.length == 1){
                this.currentEmergencyMap[this.currentEmergencyMap.length-1] = this.currentEmergencyMap[this.currentEmergencyMap.length-1] + letter
            }else{
                return;
            }
            
        }
        async stopEmergency(){
            clearInterval(this.FileSys.emergencyInterval);
            this.FileSys.emergency = false
        }
        async Report(player, reporter){
            this.FileSys.Voted = false;
            this.FileSys.player_1.HasVoted = false;
            let msgs = []
            this.FileSys.pause = true
            this.FileSys.emergency = true
            await this.FileSys.util.wait(33);
            if(this.FileSys.Config.Verbose)console.log("here")
            this.FileSys.emergencyInterval = setInterval(async () => {
            msgs = await this.FileSys.getMsgs();
            let parsed = await JSON.parse(msgs);
            msgs = parsed[0];
            let remainingTime = parsed[1];
            
            let obj = await this.FileSys.Client2(player);
            let falsePlayers = await obj.players
            let x = 1;
            let i =5;
            let Msgarr = []
            await falsePlayers.forEach(player => {
                if(player.isRendered || player.isGhost)Msgarr.push(x.toString() +": "+ this.FileSys.Config.replaceArr[0])
                x++
            });
            Msgarr.push(x.toString() +": skip vote")
            Msgarr.push("time left: " + remainingTime)

            if(msgs.length > 44){
                for (let index = 0; index < msgs.length - 44; index++) {
                    const element = array[index];
                    msgs.shift();
                }
            }
            if(remainingTime < 1){
                clearInterval(this.FileSys.emergencyInterval);
                let result = await this.FileSys.getResult();
                result = await JSON.parse(result)
                if(isNaN(result)){
                    this.updateEmergencyMap(["no one was ejected"], Msgarr, true);
                }else{
                this.updateEmergencyMap([await obj.players[result-1].PlayerColor +" has been ejected"], Msgarr, true);
                }
                this.FileSys.pause = false
                this.FileSys.emergency = false
            }else{
            this.updateEmergencyMap(msgs, Msgarr, true);
            }
            
            falsePlayers.forEach(player => {
                if(!player.isRendered && !player.isGhost) return;
                if(player.PlayerID == reporter){
                    this.currentEmergencyMap[i]=this.currentEmergencyMap[i].replace(this.FileSys.Config.replaceArr[0] +"           ", player.PlayerColor+ " : alive <-");
                }
                else if(player.IsDead){
                    this.currentEmergencyMap[i]=this.currentEmergencyMap[i].replace(this.FileSys.Config.replaceArr[0] +"        ", player.PreviousColor+ " : dead ");
                }else {
                    this.currentEmergencyMap[i]=this.currentEmergencyMap[i].replace(this.FileSys.Config.replaceArr[0] +"        ", player.PlayerColor+" : alive")
                }
                i++
                
            });

            process.stdout.write("\x1b[?25l");
            var readline = require("readline");
            readline.cursorTo(process.stdout, 1, 1)
            process.stdout.write(this.currentEmergencyMap.join("\n"));
            process.stdout.write("\x1b[?25h");
            
            const stripAnsi = require('strip-ansi');
            var lineNum = 0;
            this.currentEmergencyMap.forEach(line => {
                this.currentEmergencyMap[lineNum] = stripAnsi(line);
                lineNum++;
            });
            if(remainingTime < 1)await this.FileSys.util.wait(6000);

        }, this.FileSys.Config.delay)
            


        }
        ReportBodyWithinRange(player){
            let reporter = player;
            let ReportRange = this.FileSys.Config.VisionTiles;
            if(reporter.IsDead == true) return;
            this.FileSys.allPlayers.forEach(play => {
                if(play.IsDead == true){
                let xDistance = (Math.abs(reporter.x - play.x)/2)
                let yDistance = Math.abs(reporter.y - play.y) 
                if(xDistance + yDistance <= ReportRange){
                    if(play.PlayerColor == this.FileSys.Config.PlayerIcon.red){
                        this.FileSys.SendReportToServer(reporter, play);
                    }
                }
            }
            });
            
        }
        UpdatePlayerVision(player){
            this.deColorMap()
            let x = player.x
            let y = player.y
            let visionRadius = this.FileSys.Config.VisionTiles;
            let StartXPos = x - (visionRadius*3)
            let StartYPos = y - visionRadius
            for (let index2 = 0; index2 < visionRadius*2+1; index2++) {
                for (let index = 0; index < visionRadius*6; index++) {
                    if(this.currentMap[StartYPos].charAt(StartXPos+1 +index) == this.FileSys.Config.PlayerIcon){
                        this.FileSys.allPlayers.forEach(player => {
                            if(player.x == StartXPos+1+index){
                                this.currentMap = this.Replace(this.currentMap, StartXPos+1 + index, StartYPos, this.FileSys.Config.PlayerIcon);}
                        });
                    }else if(this.currentMap[StartYPos].charAt(StartXPos+1 +index) == this.FileSys.Config.WallIcon){

                    }else if (this.isLetter(this.currentMap[StartYPos].charAt(StartXPos+1 +index))){
                        let word = "";
                        let x =-1;
                        while (this.isLetter(this.currentMap[StartYPos].charAt(StartXPos-x +index)|| this.currentMap[StartYPos].charAt(StartXPos-x +index) == "_")) {
                            x++;
                        }
                        x--
                        while (this.isLetter(this.currentMap[StartYPos].charAt(StartXPos-x +index)|| this.currentMap[StartYPos].charAt(StartXPos+x +index) == "_")) {
                            word = word + this.currentMap[StartYPos].charAt(StartXPos-x +index);
                            x--;
                        }
                        this.FileSys.word = word;
                        
                    }else{
                    this.currentMap = this.Replace(this.currentMap, StartXPos+1 + index, StartYPos, " ");
                    }
                }
                StartYPos++
        }
        
        }
        async setupTasks(){
            if(this.FileSys.player_1.gasQuestActive){
                this.TaskStatuses.Upper_Engine =this.StatusTypes.TASKSAVAILABLE
                this.Statuses.Lower_Engine = this.StatusTypes.UNAVALIBLE
                this.TaskStatuses.Lower_Engine =this.StatusTypes.TASKSAVAILABLE
                this.Statuses.Upper_Engine = this.StatusTypes.UNAVALIBLE
                this.Statuses.Storage = this.StatusTypes.TASKSAVAILABLE
                this.TaskStatuses.Storage = this.StatusTypes.TASKSAVAILABLE
            }
            if(this.FileSys.player_1.uploadTaskActive){
                this.TaskStatuses.Admin = this.StatusTypes.TASKSAVAILABLE
                this.Statuses.Admin = this.StatusTypes.TASKSAVAILABLE
                this.TaskStatuses.Security = this.StatusTypes.TASKSAVAILABLE
                this.Statuses.Security = this.StatusTypes.UNAVALIBLE;
            }
            if(this.FileSys.player_1.startEngineQuestActive){
                this.TaskStatuses.Reactors = this.StatusTypes.TASKSAVAILABLE
                this.Statuses.Reactors = this.StatusTypes.TASKSAVAILABLE
            }
            if(this.FileSys.player_1.fixElecQuestActive){
                this.TaskStatuses.Electrical = this.StatusTypes.TASKSAVAILABLE
                this.Statuses.Electrical = this.StatusTypes.TASKSAVAILABLE
            }
        }
        async miniGame(){
            let tasks = 0;
            var StatusArr = Object.keys(this.TaskStatuses);
            
            
            let currentArea = this.FileSys.word;
            let currentAreaStatus = this.TaskStatuses[currentArea];
            if(currentAreaStatus == this.StatusTypes.EMERGENCY){
                //emergency task
            }else
            if(currentAreaStatus == this.StatusTypes.TASKSAVAILABLE){
                let repeat = require("../minigames/repeteAfterMe")
                let snake = require("../minigames/snake").main;
                let download = require("../minigames/download");
                let upload = require("../minigames/upload");
                let randNum = Math.floor(Math.random() * 3);
                let playerLast = this.FileSys.player_1.lastTask
                
                this.FileSys.pause = true;
                let result;
                switch (currentArea) {
                    case "Storage":
                        if(!this.FileSys.player_1.hasGas &&this.FileSys.player_1.gasQuestActive == true)
                        this.FileSys.cardFrame = 0;
                        result= await this.getFuelTask(this)
                        this.Statuses.Storage = this.StatusTypes.UNAVALIBLE
                        if(this.TaskStatuses.Lower_Engine == this.StatusTypes.TASKSAVAILABLE)
                        this.Statuses.Lower_Engine = this.StatusTypes.HIGHLIGHT
                        if(this.TaskStatuses.Upper_Engine == this.StatusTypes.TASKSAVAILABLE)
                        this.Statuses.Upper_Engine = this.StatusTypes.HIGHLIGHT
                        break;
                    case "Lower_Engine":
                        if(this.FileSys.player_1.hasGas && !this.FileSys.player_1.fueledLower && this.FileSys.player_1.gasQuestActive == true){
                            result= await this.fillReactorsWithGas(this);
                            this.FileSys.player_1.fueledLower = true;
                            this.FileSys.player_1.hasGas = false;
                            this.Statuses.Lower_Engine = this.TaskStatuses.Lower_Engine;
                            this.Statuses.Upper_Engine = this.TaskStatuses.Upper_Engine;
                            this.Statuses.Storage = this.TaskStatuses.Storage
                            if(this.FileSys.player_1.fueledUpper && this.FileSys.player_1.fueledLower) this.FileSys.player_1.gasQuestActive = false;
                        }else{
                            
                        }
                        break;
                    case "Upper_Engine":
                        if(this.FileSys.player_1.hasGas && !this.FileSys.player_1.fueledUpper && this.FileSys.player_1.gasQuestActive == true){
                            result= await this.fillReactorsWithGas(this);
                            this.FileSys.player_1.fueledUpper = true;
                            this.FileSys.player_1.hasGas = false;
                            this.Statuses.Lower_Engine = this.TaskStatuses.Lower_Engine;
                            this.Statuses.Upper_Engine = this.TaskStatuses.Upper_Engine;
                            this.Statuses.Storage = this.TaskStatuses.Storage
                            if(this.FileSys.player_1.fueledUpper && this.FileSys.player_1.fueledLower) this.FileSys.player_1.gasQuestActive = false;
                        }else{
                            //fix engines
                        }
                        break
                    case "Admin":
                        if(this.FileSys.player_1.uploadTaskActive == true && !this.FileSys.player_1.hasData){
                            result =await download();
                            this.FileSys.player_1.hasData = true;
                            this.Statuses.Security = this.StatusTypes.HIGHLIGHT;
                    }else{
                        result = await this.swipeCard(this);
                    }
                        break;
                    case "Security":
                        if(this.FileSys.player_1.uploadTaskActive == true && this.FileSys.player_1.hasData){
                            result= await upload();
                            this.FileSys.player_1.hasData = false;
                            this.Statuses.Security = this.TaskStatuses.Security;
                    }else if(this.FileSys.player_1.snake){
                        result= await snake(this.FileSys.Config.snakeGameGoal)
                    }else{  
                        //add game
                    }   
                        break;
                    case "Electrical":
                        if(this.FileSys.player_1.fixElecQuestActive == true){
                            let wiring = require("../minigames/wiring")
                            this.FileSys.pause = true;
                            result =await wiring();
                        
                    }
                    break;
                    case "Reactors":
                        if(this.FileSys.player_1.startEngineQuestActive)
                        result = await repeat();
                    break;
                    default:
                        break;
                }

                

                if(result == "win"){
                    
                    await this.renderTaskComp(20, "./taskCompeted.txt")
                    
                    this.FileSys.pause = false;
                    this.TaskStatuses[currentArea] = this.StatusTypes.NORMAL;
                    this.Statuses[currentArea] = this.StatusTypes.NORMAL;
                }else if(result = "partial"){
                    
                    await this.renderTaskComp(20, "./taskCompeted.txt")
                    
                    this.FileSys.pause = false;
                }else {
                    
                    this.FileSys.pause = false;
                }
                StatusArr.forEach(name => {
                    if(this.TaskStatuses[name] == this.StatusTypes.TASKSAVAILABLE){
                        tasks++
                    }
                }); 
                if(tasks == 0){
                    this.FileSys.player_1.tasksCompleted = true;
                }
            }

        }
        swipeCard(that){
            return new Promise((resolve)=> {
                that.FileSys.swipeCardActive = true;
                let timer = setInterval(async ()=> {
                    let frame = that.FileSys.cardFrame;
                    await this.renderFileFrame(frame, "./card.txt")
                    if(frame == 5){
                        let rand = Math.floor(Math.random() * 10)
                        if(rand > 5){
                            that.FileSys.cardFrame = 0;
                            that.FileSys.swipeCardActive = false;
                            clearInterval(timer)
                            
                            resolve("win")
                        }else{
                        process.stdout.write("\x1b[?25l");
                        var readline = require("readline");
                        
                        readline.cursorTo(process.stdout, 1, 1)
                        process.stdout.write(`//  
                        //                                                                                                                                                
                        //  TTTTTTTTTTTTTTTTTTTTTTT                                       FFFFFFFFFFFFFFFFFFFFFF                                            tttt          
                        //  T:::::::::::::::::::::T                                       F::::::::::::::::::::F                                         ttt:::t          
                        //  T:::::::::::::::::::::T                                       F::::::::::::::::::::F                                         t:::::t          
                        //  T:::::TT:::::::TT:::::T                                       FF::::::FFFFFFFFF::::F                                         t:::::t          
                        //  TTTTTT  T:::::T  TTTTTT   ooooooooooo      ooooooooooo          F:::::F       FFFFFF  aaaaaaaaaaaaa       ssssssssss   ttttttt:::::ttttttt    
                        //          T:::::T         oo:::::::::::oo  oo:::::::::::oo        F:::::F               a::::::::::::a    ss::::::::::s  t:::::::::::::::::t    
                        //          T:::::T        o:::::::::::::::oo:::::::::::::::o       F::::::FFFFFFFFFF     aaaaaaaaa:::::a ss:::::::::::::s t:::::::::::::::::t    
                        //          T:::::T        o:::::ooooo:::::oo:::::ooooo:::::o       F:::::::::::::::F              a::::a s::::::ssss:::::stttttt:::::::tttttt    
                        //          T:::::T        o::::o     o::::oo::::o     o::::o       F:::::::::::::::F       aaaaaaa:::::a  s:::::s  ssssss       t:::::t          
                        //          T:::::T        o::::o     o::::oo::::o     o::::o       F::::::FFFFFFFFFF     aa::::::::::::a    s::::::s            t:::::t          
                        //          T:::::T        o::::o     o::::oo::::o     o::::o       F:::::F              a::::aaaa::::::a       s::::::s         t:::::t          
                        //          T:::::T        o::::o     o::::oo::::o     o::::o       F:::::F             a::::a    a:::::a ssssss   s:::::s       t:::::t    tttttt
                        //        TT:::::::TT      o:::::ooooo:::::oo:::::ooooo:::::o     FF:::::::FF           a::::a    a:::::a s:::::ssss::::::s      t::::::tttt:::::t
                        //        T:::::::::T      o:::::::::::::::oo:::::::::::::::o     F::::::::FF           a:::::aaaa::::::a s::::::::::::::s       tt::::::::::::::t
                        //        T:::::::::T       oo:::::::::::oo  oo:::::::::::oo      F::::::::FF            a::::::::::aa:::a s:::::::::::ss          tt:::::::::::tt
                        //        TTTTTTTTTTT         ooooooooooo      ooooooooooo        FFFFFFFFFFF             aaaaaaaaaa  aaaa  sssssssssss              ttttttttttt  
`);
                        process.stdout.write("\x1b[?25h");
                        clearInterval(timer)
                        await util.wait(1000);
                        resolve(that.swipeCard(that));
                        }
                        
                        that.FileSys.cardFrame =0
                    }
                }, 100)
                
            })
        }
        async fillReactorsWithGas(that){
            return new Promise((resolve) => {
                that.FileSys.fuelFrame = 0;
                that.FileSys.pause = true;
                let i= 7;
                let timer = setInterval(()=> {
                    that.renderFileFrame(i,"./fuelFrames.txt")
                    i--;
                    if(i == -1){
                        clearInterval(timer);
                        that.FileSys.fuelTaskActive = false;
                        that.FileSys.player_1.hasGas = false;
                        that.FileSys.player_1.gasQuestActive = false
                        resolve("win");
                    }
                },500)
            })
        }
        
        async getFuelTask(that){
            that.FileSys.fuelTaskActive = true;
            let value = "partial"
            if(that.FileSys.player_1.fueledUpper || that.FileSys.player_1.fueledLower){
                value = "win"
            }
            return new Promise((resolve) => {
                
                that.FileSys.fuelFrame = 0;
                that.FileSys.pause = true;
                let timer = setInterval(async ()=> {
                    await that.renderFileFrame(that.FileSys.fuelFrame,"./fuelFrames.txt")
                    if(that.FileSys.fuelFrame == 7){
                        clearInterval(timer);
                        that.FileSys.fuelTaskActive = false;
                        that.FileSys.player_1.hasGas = true;
                        that.FileSys.player_1.gasQuestActive = true
                        that.FileSys.fuelFrame = 0;
                        await util.wait(1000);
                        resolve(value);
                    }
                },100)
            }).catch();
            
            
        }
        async renderFileFrame(i, file){
            const fs = require("fs")
            let data = fs.readFileSync(file)
                var FrameArr = JSON.parse(data);
                process.stdout.write("\x1b[?25l");
                var readline = require("readline");
                readline.cursorTo(process.stdout, 1, 1)
                process.stdout.write(FrameArr[i]);
                process.stdout.write("\x1b[?25h");
                return data;
                
          
            
        }
        renderTaskComp(delay, file){
            return new Promise((resolve) => {
               
                const fs = require("fs")
                let data = fs.readFileSync(file)
                    var FrameArr = JSON.parse(data);
                    let i =0;
                    let timer = setInterval(() => {
                        process.stdout.write("\x1b[?25l");
                        var readline = require("readline");
                        readline.cursorTo(process.stdout, 1, 1)
                        process.stdout.write(FrameArr[i]);
                        process.stdout.write("\x1b[?25h");
                        if(i+1 >= FrameArr.length){
                            clearInterval(timer)
                            resolve();
                        }
                        i++
    
    
                    }, delay);
            })
            
                
              
                
                
          
            
        }
        async waitThenLog(word){
            console.log(word);
            await this.FileSys.util.wait(1000);
        }
        removePlayerVision(){
            var assembledMap = this.currentMap.join(this.FileSys.Config.ReplaceIcon); 
            var NoVison = assembledMap.replace(/ /g, "░");
            this.currentMap = NoVison.split(this.FileSys.Config.ReplaceIcon);
        }
        
        Collision(x, y){
            var collider = this.currentMap[y].charAt(x);
            var CollisionEvent = null;
            class CollisionEventBase  {
                CollisionTypes = {letter: "letter", wall: "wall", player: "player", air: "airblock"}
                CollisionType = null
            }
            if(this.isLetter(collider)){
                var CollisionEvent = CollisionEventBase;
                CollisionEvent.CollisionType = CollisionEventBase.wall;
                return CollisionEvent;
            }
            var CollisionEventWall = new CollisionEventBase();
            CollisionEventWall.CollisionType = CollisionEventWall.CollisionTypes.wall;
            var CollisionEventPlayer = new CollisionEventBase();
            CollisionEventPlayer.CollisionType = CollisionEventPlayer.CollisionTypes.wall;
            var CollisionEventAir = new CollisionEventBase();
            CollisionEventAir.CollisionType = CollisionEventAir.CollisionTypes.air;
            switch (collider) {
                case this.FileSys.Config.WallIcon:
                    return CollisionEventWall;
                    break;
                case this.FileSys.Config.PlayerIcon:
                    return CollisionEventPlayer;
                    break;
                case this.FileSys.Config.AirIcon:
                    return null
                case " ":
                     return null;
                    break;
                default:
                    return null;
                    break;
            }
           
        }
        collisionHandler(collisionEvent, player, x, y){
            return new Promise(async resolve => {
                switch (collisionEvent.CollisionType) {
                    case "letter":
                        await this.LetterCollider(collisionEvent, player, x, y)
                        break;
                    case "wall":
                        if(this.FileSys.Config.Verbose)console.log("WallCollision")
                        this.DisplayMsg(this.FileSys.Config.WallCollisionMsgArr, player);
                        break;
                    case "airblock":
                        if(this.FileSys.Config.Verbose)console.log("AirBlockCollision")
                        this.DisplayMsg(this.FileSys.Config.WallCollisionMsgArr, player);
                        break;
                    case "player":
                        if(this.FileSys.Config.Verbose)console.log("PlayerCollision")
                        this.DisplayMsg(this.FileSys.Config.WallCollisionMsgArr, player);
                        break;
                    case " ":
                        break;
                    default:
                        break;
                }
                resolve();
            })
        }
        /**
         * @description: if a letter is collided with, due to its color code special things must happen
         */
        async LetterCollider(collisionEvent, player, x, y){
            var line = this.currentMap[y];
            var letter = line.charAt(x);
            var shouldExit = false;
            var word = [];
            word[0] = letter;
            i=0;
            //if collision occurs in the middle of the word, subtract this from the initial x
            var numToLeft = 0;
                const getWord = new Promise(resolve => {
                var left = true;
                var right = true;
                
                /**@description Tolerance (how many spaces should be allowed before next letter) */
                let t = 2
                while(left){
                    let LeftLetter = line.charAt(x-i);
                    let localTolerance = t;
                    if(this.isLetter(LeftLetter)){
                    if(localTolerance != t){
                        for (let index = 0; index < t-localTolerance; index++) {
                            word.unshift(" ");
                            numToLeft++;
                        }
                        localTolerance = t;
                    }
                    word.unshift(LeftLetter);
                    numToLeft++;
                    }else{
                        localTolerance--
                    }
                    
                    if(localTolerance=0){
                    left = false
                    i=0;
                    }
                    i++
                }
                while(right){
                    let RightLetter = line.charAt(x+i);
                    let localTolerance = t;
                    if(this.isLetter(RightLetter)){
                    if(localTolerance != t){
                        for (let index = 0; index < t-localTolerance; index++) {
                            word.push(" ");
                        }
                        localTolerance = t;
                    }
                    word.unshift(RightLetter);
                    }else{
                        localTolerance--
                    }
                    
                    if(localTolerance=0){
                        right = false
                    i=0;
                    }
                    i++
                }
                if(!left && !right){
                    resolve(word.join())
                }
                })
            const AssembledWord = await getWord();
            const X_ofWord = (x - numToLeft);
            const xCordInsideWord = x - X_ofWord;
        }
        isLetter(str) {
            return str.length === 1 && str.match(/[a-z]/i) || str.match(/_/i);
          }
        Replace(Arr, x, y, Char){
            String.prototype.replaceAt = function(index, replacement) {
                return this.substr(0, x) + replacement + this.substr(index + replacement.length);
            }
            Arr[y] = Arr[y].replaceAt(x, Char)
            return Arr;
        }
        PlayerHome(){//72 x cafe y 10
            this.PlayerMove(this.FileSys.player_1, this.FileSys.Config.SaveMapCordPair.Home.x,this.FileSys.Config.SaveMapCordPair.Home.y);
        }
        
        /** @deprecated AbsoluteMove is not longer possible --map is stored in array, not string */
        TruePlayerMove(index){
            var indexOfMovement = index;
            
            const PlayerIcon = this.FileSys.Config.PlayerIcon;
            const WallIcon = this.FileSys.Config.WallIcon;
            if(this.Collision(indexOfMovement)){
                this.collisionHandler();
            }else{
            this.currentMap = this.Replace(this.currentMap, indexOfMovement, PlayerIcon);
            }
            this.UpdateMapStatuses(player);
        }
/**@deprecated using StripAnsi(); instead --npm install strip-ansi */
DeColorPlayer(player){
    return new Promise(resolve => {
// var assembledMap = this.currentMap.join(this.FileSys.Config.ReplaceIcon); 
    // var coloredMap = assembledMap.replace(player.PlayerColor, this.FileSys.Config.PlayerIcon);
    // this.currentMap = coloredMap.split(this.FileSys.Config.ReplaceIcon);
    let lineNum = 0;
    this.currentMap.forEach(line => {
        this.currentMap[lineNum] = line.replace(player.PlayerColor, this.FileSys.Config.PlayerIcon);
        lineNum++;
    });
    if(lineNum == this.currentMap.length){
        this.writeAssembledMap();
        resolve();
    }
    })
}
UnRenderPlayers(){
    this.StripAnsi();
    var assembledMap = this.currentMap.join(this.FileSys.Config.ReplaceIcon); 
    var coloredMap = assembledMap.replace(/ඞ/g, this.FileSys.Config.AirIcon);
    this.currentMap = coloredMap.split(this.FileSys.Config.ReplaceIcon);
}
async RenderPlayers(players, map =this.currentMap, renderAll = false){
    let numOfPlays =0;
    var multi = 0;
    let FalseMap = await map.toString().split(",");
    let playerPromise1 = new Promise(resolve => {
        this.StripAnsi(map);
        let index = 1;
        players.forEach(player => {
            var charAtPlayerX = map[player.y].charAt(player.x)
            if(charAtPlayerX == " " && player.isRendered|| renderAll == true){
            let firstPart = map[player.y].substr(0, player.x);
            let lastPart = map[player.y].substr(player.x+1);
            map[player.y] = firstPart + this.FileSys.Config.PlayerIcon + lastPart;  
            FalseMap[player.y] = firstPart + this.FileSys.Config.PlayerIcon + lastPart;  
        }
            if(index == players.length){
                resolve();
            }
            index++;
        
        });
       
    })
    let playerPromise2 = new Promise(resolve => {
        let index = 1;
        var replaceNum = 0;
         players.forEach(player => {
            if((map[player.y].includes(this.FileSys.Config.PlayerIcon))){
                const stripAnsi = require('strip-ansi');
                var charAtPlayerX = map[player.y].charAt(player.x)
                if(charAtPlayerX != this.FileSys.Config.AirIcon && player.isRendered){
                map[player.y] = stripAnsi(map[player.y]);
                let firstPart = map[player.y].substr(0, player.x);
                let lastPart = map[player.y].substr(player.x+1);
                map[player.y] = firstPart + this.FileSys.Config.replaceArr[replaceNum] + lastPart; 
                player.ReplacedChar = this.FileSys.Config.replaceArr[replaceNum];
            }
                index++;
                replaceNum++;
            }});
            resolve();
    });
        let playerPromise3 = new Promise(resolve => {
            for (let indexhrsh = 0; indexhrsh < players.length; indexhrsh++) {
                    const player = players[indexhrsh];
                    for (let index2 = 0; index2 < this.FileSys.Config.replaceArr.length; index2++) {
                        const char = this.FileSys.Config.replaceArr[index2];
                        if(player.ReplacedChar == char){
                            map[player.y] = map[player.y].replace(char, player.PlayerColor);
                        }
                    }
                    if(indexhrsh == players.length-1){
                    resolve();
                    }
            }
                
            
            
            
        });
        await playerPromise1.then(await playerPromise2.then(await playerPromise3));
        
        
    
    
}
        getPlayerByX(players, x){
            return new Promise(resolve => {
                players.forEach(player => {
                    if(player.x = x){
                        resolve(player);
                    }
                })
            })
            
            
        }
        EmergencySmallDisplay(msgArr){
            let that = this
            function ReduceMsgBox(num){

                for (let index = 0; index < num; index++) {
                    var BoxEndPos;
                    var BoxStartPos;
                    var TextBoxStart;
                    var TextBoxEnd;
                    var TextAreaStart;
                    var TextAreaEnd;
                    var lineNum = 0;
                    that.currentEmergencyMap.forEach(line => {
                        if(line.includes("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒")){
                            if(BoxStartPos){
                                BoxEndPos = lineNum;
                            } else {
                                BoxStartPos = lineNum;
                            }
                        } else if(line.includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒")){
                            if(TextBoxStart){
                                TextBoxEnd = lineNum;
                            } else {
                                TextBoxStart = lineNum;
                            }
                        } else if(line.includes("│")){
                            if(TextAreaStart){
                                if(that.currentEmergencyMap[lineNum+1].includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒"))TextAreaEnd = lineNum;
                            } else {
                                TextAreaStart = lineNum;
                            }
                        }
                        lineNum++
                    });
                    
                    
                    that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 3, TextBoxEnd, "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒");
                    that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 3, BoxEndPos, "██████████████████████▒");
                    that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 3, TextBoxEnd-1, "▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒");
                    }
            }
            function ExtendMsgBox(num){
                for (let index = 0; index < num; index++) {
                var BoxEndPos;
                var BoxStartPos;
                var TextBoxStart;
                var TextBoxEnd;
                var TextAreaStart;
                var TextAreaEnd;
                var lineNum = 0;
                that.currentEmergencyMap.forEach(line => {
                    if(line.includes("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒")){
                        if(BoxStartPos){
                            BoxEndPos = lineNum;
                        } else {
                            BoxStartPos = lineNum;
                        }
                    } else if(line.includes("▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒")){
                        if(TextBoxStart){
                            TextBoxEnd = lineNum;
                        } else {
                            TextBoxStart = lineNum;
                        }
                    } else if(line.includes("│                  │")){
                        if(TextAreaStart){
                            TextAreaEnd = lineNum;
                        } else {
                            TextAreaStart = lineNum;
                        }
                    }
                    lineNum++
                });
                
                
                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 3, TextBoxEnd, "▓│                  │▓▒");
                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 3, BoxEndPos, "▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒");
                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 3, BoxEndPos+1, "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒");
                }
            }
            
            var MaxMsgLength = "                  ".length //18
            var lineNum = 0;
            let i = 0;
            var BoxEndPos;
                var BoxStartPos;
                var TextBoxStart;
                var TextBoxEnd;
                var TextAreaStart;
                var TextAreaEnd;
                var lineNum = 0;
                var CurrentMsgs = [];
                that.currentEmergencyMap.forEach(line => {
                    if(line.includes("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓")){
                        if(BoxStartPos){
                            BoxEndPos = lineNum;
                        } else {
                            BoxStartPos = lineNum;
                        }
                    } else if(line.includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒")){
                        if(TextBoxStart){
                            TextBoxEnd = lineNum;
                        } else {
                            TextBoxStart = lineNum;
                        }
                    } else if(line.includes("│")){
                        if(TextAreaStart){
                            if(that.currentEmergencyMap[lineNum+1].includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒"))TextAreaEnd = lineNum;
                        } else {
                            TextAreaStart = lineNum;
                        }
                    }
                    if(line.includes("│")){
                        CurrentMsgs.push(that.currentEmergencyMap[lineNum].split("│")[1]);
                        }
                    lineNum++
                });
                var msgPos = TextAreaStart;
            msgArr.forEach(msg => {
                var AddedWhiteSpace = MaxMsgLength - stripAnsi(msg).length  
                if(AddedWhiteSpace < 0){
                    msg = msg.slice(0, MaxMsgLength);
                }else{
                    for (let index = 0; index < AddedWhiteSpace; index++) {
                        msg = msg + " ";
                    }
                };
                
                
                if(that.currentEmergencyMap[msgPos].includes("│")){
                    that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 5, msgPos, msg);
                }else{
                    ExtendMsgBox(1);
                    that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 5, msgPos, msg);
                }   
                msgPos++;
            });
            var numLinesToDel = CurrentMsgs.length - msgArr.length;
            if(numLinesToDel < 0){
                numLinesToDel = 0;
            }
            var m = 0;
            ReduceMsgBox(numLinesToDel);
        }
        DisplayMsg(msgArr, player, yn = false){
            
            var MaxMsgLength = "                  ".length //18
            var lineNum = 0;
            let i = 0;
            var BoxEndPos;
                var BoxStartPos;
                var TextBoxStart;
                var TextBoxEnd;
                var TextAreaStart;
                var TextAreaEnd;
                var lineNum = 0;
                var CurrentMsgs = [];
                this.currentMap.forEach(line => {
                    if(line.includes("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓")){
                        if(BoxStartPos){
                            BoxEndPos = lineNum;
                        } else {
                            BoxStartPos = lineNum;
                        }
                    } else if(line.includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒")){
                        if(TextBoxStart){
                            TextBoxEnd = lineNum;
                        } else {
                            TextBoxStart = lineNum;
                        }
                    } else if(line.includes("║")){
                        if(TextAreaStart){
                            if(this.currentMap[lineNum+1].includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒"))TextAreaEnd = lineNum;
                        } else {
                            TextAreaStart = lineNum;
                        }
                    }
                    if(line.includes("║")){
                        CurrentMsgs.push(this.currentMap[lineNum].split("║")[1]);
                        }
                    lineNum++
                });
                var msgPos = TextAreaStart;
            msgArr.forEach(msg => {
                var AddedWhiteSpace = MaxMsgLength - stripAnsi(msg).length  
                if(AddedWhiteSpace < 0){
                    msg = msg.slice(0, MaxMsgLength);
                }else{
                    for (let index = 0; index < AddedWhiteSpace; index++) {
                        msg = msg + " ";
                    }
                };
                
                
                if(this.currentMap[msgPos].includes("║")){
                this.currentMap = this.Replace(this.currentMap, 5, msgPos, msg);
                }else{
                    this.ExtendMsgBox(1);
                    this.currentMap = this.Replace(this.currentMap, 5, msgPos, msg);
                }   
                msgPos++;
            });
            var numLinesToDel = CurrentMsgs.length - msgArr.length;
            if(numLinesToDel < 0){
                numLinesToDel = 0;
            }
            var m = 0;
            this.ReduceMsgBox(numLinesToDel);
            if(yn == false)this.UpdateMapStatuses(player);
        }

        updateEmergencyMap(msgArr, msgArrSmall =false, Gimme = false){
            var that = this
            function ReduceMsgBoxEM(num){
                for (let index = 0; index < num; index++) {
                    var BoxEndPos;
                    var BoxStartPos;
                    var TextBoxStart;
                    var TextBoxEnd;
                    var TextAreaStart;
                    var TextAreaEnd;
                    var lineNum = 0;
                    that.currentEmergencyMap.forEach(line => {
                        if(line.includes("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓")){
                            if(BoxStartPos){
                                BoxEndPos = lineNum;
                            } else {
                                BoxStartPos = lineNum;
                            }
                        } else if(line.includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒")){
                            if(TextBoxStart){
                                TextBoxEnd = lineNum;
                            } else {
                                TextBoxStart = lineNum;
                            }
                        } else if(line.includes("║║")){
                            if(TextAreaStart){
                                if(that.currentEmergencyMap[lineNum+1].includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒"))TextAreaEnd = lineNum;
                            } else {
                                TextAreaStart = lineNum;
                            }
                        }
                        lineNum++
                    });
                    
                    
                    that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 40, TextBoxEnd, "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓");
                    that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 40, BoxEndPos, "██████████████████████████████████████████████████████████████████████████████████████████████████████████████████████");
                    that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 42, TextBoxEnd-1, "▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓");
                    }
            }
            function ExtendMsgBoxEM(num){
                for (let index = 0; index < num; index++) {
                var BoxEndPos;
                var BoxStartPos;
                var TextBoxStart;
                var TextBoxEnd;
                var TextAreaStart;
                var TextAreaEnd;
                var lineNum = 0;
                that.currentEmergencyMap.forEach(line => {
                    if(line.includes("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓")){
                        if(BoxStartPos){
                            BoxEndPos = lineNum;
                        } else {
                            BoxStartPos = lineNum;
                        }
                    } else if(line.includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒")){
                        if(TextBoxStart){
                            TextBoxEnd = lineNum;
                        } else {
                            TextBoxStart = lineNum;
                        }
                    } else if(line.includes("║║                                                                                                              ║║")){
                        if(TextAreaStart){
                            TextAreaEnd = lineNum;
                        } else {
                            TextAreaStart = lineNum;
                        }
                    }
                    lineNum++
                });
                
                
                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 42, TextBoxEnd, "║║                                                                                                              ║║▓▓");
                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 42, BoxEndPos, "▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒");
                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 40, BoxEndPos+1, "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓");
                }
            }
            var MaxMsgLength = "                                                                                                                ".length //18
            var lineNum = 0;
            let i = 0;
            var BoxEndPos;
                var BoxStartPos;
                var TextBoxStart;
                var TextBoxEnd;
                var TextAreaStart;
                var TextAreaEnd;
                var lineNum = 0;
                var CurrentMsgs = [];
                that.currentEmergencyMap.forEach(line => {
                    if(line.includes("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓")){
                        if(BoxStartPos){
                            BoxEndPos = lineNum;
                        } else {
                            BoxStartPos = lineNum;
                        }
                    } else if(line.includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒")){
                        if(TextBoxStart){
                            TextBoxEnd = lineNum;
                        } else {
                            TextBoxStart = lineNum;
                        }
                    } else if(line.includes("║║")){
                        if(TextAreaStart){
                            if(that.currentEmergencyMap[lineNum+1].includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒"))TextAreaEnd = lineNum;
                        } else {
                            TextAreaStart = lineNum;
                        }
                    }
                    if(line.includes("║║")){
                        CurrentMsgs.push(that.currentEmergencyMap[lineNum].split("║║")[1]);
                        }
                    lineNum++
                });
                var msgPos = TextAreaStart;
            msgArr.forEach(msg => {
                var AddedWhiteSpace = MaxMsgLength - stripAnsi(msg).length 
                if(AddedWhiteSpace < 0){
                    msg = msg.slice(0, MaxMsgLength);
                }else{
                    for (let index = 0; index < AddedWhiteSpace; index++) {
                        msg = msg + " ";
                    }
                };
                
                
                if(that.currentEmergencyMap[msgPos].includes("║║")){
                    that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 44, msgPos, msg);
                }else{
                    ExtendMsgBoxEM(1);
                    that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 44, msgPos, msg);
                }   
                msgPos++;
            });
            var numLinesToDel = CurrentMsgs.length - msgArr.length;
            if(numLinesToDel < 0){
                numLinesToDel = 0;
            }
            var m = 0;
            ReduceMsgBoxEM(numLinesToDel);
            if(msgArrSmall != false){
            this.EmergencySmallDisplay(msgArrSmall);
            }
            if(Gimme == false){
            process.stdout.write("\x1b[?25l");
            var readline = require("readline");
            readline.cursorTo(process.stdout, 1, 1)
            process.stdout.write(that.currentEmergencyMap.join("\n"));
            process.stdout.write("\x1b[?25h");
        }
        }
       
        ReduceMsgBox(num){
            for (let index = 0; index < num; index++) {
                var BoxEndPos;
                var BoxStartPos;
                var TextBoxStart;
                var TextBoxEnd;
                var TextAreaStart;
                var TextAreaEnd;
                var lineNum = 0;
                this.currentMap.forEach(line => {
                    if(line.includes("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓")){
                        if(BoxStartPos){
                            BoxEndPos = lineNum;
                        } else {
                            BoxStartPos = lineNum;
                        }
                    } else if(line.includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒")){
                        if(TextBoxStart){
                            TextBoxEnd = lineNum;
                        } else {
                            TextBoxStart = lineNum;
                        }
                    } else if(line.includes("║")){
                        if(TextAreaStart){
                            if(this.currentMap[lineNum+1].includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒"))TextAreaEnd = lineNum;
                        } else {
                            TextAreaStart = lineNum;
                        }
                    }
                    lineNum++
                });
                
                
                this.currentMap = this.Replace(this.currentMap, 3, TextBoxEnd, "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓");
                this.currentMap = this.Replace(this.currentMap, 3, BoxEndPos, "░░░░░░░░░░░░░░░░░░░░░░");
                this.currentMap = this.Replace(this.currentMap, 4, TextBoxEnd-1, "▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓");
                }
        }
        ExtendMsgBox(num){
            for (let index = 0; index < num; index++) {
            var BoxEndPos;
            var BoxStartPos;
            var TextBoxStart;
            var TextBoxEnd;
            var TextAreaStart;
            var TextAreaEnd;
            var lineNum = 0;
            this.currentMap.forEach(line => {
                if(line.includes("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓")){
                    if(BoxStartPos){
                        BoxEndPos = lineNum;
                    } else {
                        BoxStartPos = lineNum;
                    }
                } else if(line.includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒")){
                    if(TextBoxStart){
                        TextBoxEnd = lineNum;
                    } else {
                        TextBoxStart = lineNum;
                    }
                } else if(line.includes("║                  ║")){
                    if(TextAreaStart){
                        TextAreaEnd = lineNum;
                    } else {
                        TextAreaStart = lineNum;
                    }
                }
                lineNum++
            });
            
            
            this.currentMap = this.Replace(this.currentMap, 4, TextBoxEnd, "║                  ║▓▒");
            this.currentMap = this.Replace(this.currentMap, 4, BoxEndPos, "▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒");
            this.currentMap = this.Replace(this.currentMap, 3, BoxEndPos+1, "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒");
            }
        }
        /** @deprecated map is stored in array, thus y does not need to equal length of a line thus this function is unused */
        MapGetLengthOfLine(i){
           var lines = this.BaseMap.split("\n")
           if(this.FileSys.Config.Verbose)console.log(lines[i].replace(/ /g, "▒").replace(/\n/g, "▒▒"))
           if(this.FileSys.Config.Verbose)console.log(lines[i].replace(/ /g, "▒").replace(/\n/g, "▒▒").length)
           return lines[i].replace(/ /g, "▒").replace(/\n/g, "▒▒").length+1;
        }
}