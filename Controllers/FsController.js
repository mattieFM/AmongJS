/**Amoung us costs  :( 
Programmer: Matt/AuthoredEntropy*/
const colors = require('colors/safe');
const { read } = require('fs');
const { resolve } = require('path');
const { charAt } = require('../FileSys/BaseMap');
const Config = require("../FileSys/Config.json");
const utility = require("../Utility/util");
const util = new utility();
module.exports.baseFileSys = class {
    TFQuestionNum = 0;
    PROMPT;
    constructor(){
        this.PROMPT = Config.BasePrompt;
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
            this.fs.writeFile(Config.PATH + "\\FileSys\\BaseFileSystem.json", JSON.stringify(require("../Init").BaseFileSys), (err)=>{
              if(Config.Verbose)console.log("--FsController: baseFileSys has been written to a file")
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
    }
    SetCurrentMap(){
        if(!this.currentMap){this.currentMap = this.BaseMap.split("\n")}
    }
    currentMap;
    BaseMap = require("../FileSys/BaseMap");
    StatusTypes = require("../Utility/Enum/StatusEnum")
    Statuses = {
        Upper_Engine : this.StatusTypes.NORMAL,
        "Reactors" : this.StatusTypes.NORMAL,
        Lower_Engine : this.StatusTypes.NORMAL,
        Security : this.StatusTypes.NORMAL,
        MedBay : this.StatusTypes.NORMAL,
        Electrical : this.StatusTypes.NORMAL,
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
    async UpdateMapStatuses(player){
        const obj = await this.FileSys.Client2(player);
        this.SetCurrentMap();
        return new Promise(async resolve => {
            this.UnRenderPlayers();
            this.StripAnsi();
            this.UpdatePlayerVision(player)
            
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
                default:
                    break;
            }
            var assembledMap = this.currentMap.join(Config.ReplaceIcon); 
            var coloredMap = assembledMap.replace(name, coloredName);
            this.currentMap = coloredMap.split(Config.ReplaceIcon);
        });
        
        
        this.writeAssembledMap();
        resolve(this.currentMap);
        }) 
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
                    default:
                        break;
                }
                
                var assembledMap = this.currentMap.join(Config.ReplaceIcon); 
                var coloredMap = assembledMap.replace(coloredName, name);
                this.currentMap = coloredMap.split(Config.ReplaceIcon);
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
        PlayerCanMove(player, tickCount, NumOfSpaces){
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
                return this.PlayerCanMove(player, tickCount, NumOfSpaces);
            }
            return canMove
        }
        RelativePlayerMove(player, x, y){
            this.StripAnsi();
            this.removePlayerVision();
            var totalMove = x+y
            // if(totalMove > Config.MovesPerTurn || totalMove < -Config.MovesPerTurn){
            //     this.DisplayMsg(["YOU CANNOT MOVE"," MORE THAN" + Config.MovesPerTurn,"SPACES PER SECOND"])
            //     return;
            // }
            var CanMove = this.PlayerCanMove(player, this.FileSys.TickCount, totalMove);
            if(CanMove){
                let LocalX = x;
                let LocalY = x;
                x = player.x+x;
                y = player.y+y;
                const PlayerIcon = Config.PlayerIcon;
                const WallIcon = Config.WallIcon;
                var collision = this.Collision(x, y);
                if(collision){
                    this.collisionHandler(collision, player, x, y);
                }else{
                //this.currentMap = this.Replace(this.currentMap, player.x, player.y, "░");
                // this.currentMap = this.Replace(this.currentMap, x, y, Config.PlayerIcon);
                player.x = x;
                player.y = y;
                this.FileSys.player_1 = player;
                
                this.DisplayMsg(["Turn Num: " + this.FileSys.TickCount, " ", " ", " "], player);
                }
                this.StripAnsi();
                this.UpdateMapStatuses(player); 
                
                return;
            }else{
                this.DisplayMsg(["Dummy Dummy Dumb", "you can't move", "more than", Config.MovesPerTurn+ " spaces per turn"], player);
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
            const PlayerIcon = Config.PlayerIcon;
            const WallIcon = Config.WallIcon;
            var collision = this.Collision(x, y);
            if(collision){
                this.collisionHandler(collision, player, x, y);
            }else{
            this.currentMap = this.Replace(this.currentMap, player.x, player.y, "░");
            this.currentMap = this.Replace(this.currentMap, x, y, Config.PlayerIcon);
            player.x = x;
            player.y = y;
            }
            this.UpdateMapStatuses(player);
        }
        UpdatePlayerVision(player){
            this.deColorMap()
            let x = player.x
            let y = player.y
            let visionRadius = Config.VisionTiles;
            let StartXPos = x - (visionRadius*3)
            let StartYPos = y - visionRadius
            for (let index2 = 0; index2 < visionRadius*2+1; index2++) {
                for (let index = 0; index < visionRadius*6; index++) {
                    if(this.currentMap[StartYPos].charAt(StartXPos+1 +index) == Config.PlayerIcon){
                        this.FileSys.allPlayers.forEach(player => {
                            if(player.x == StartXPos+1+index){
                                this.currentMap = this.Replace(this.currentMap, StartXPos+1 + index, StartYPos, Config.PlayerIcon);}
                        });
                    }else if(this.currentMap[StartYPos].charAt(StartXPos+1 +index) == Config.WallIcon){

                    }else if (this.isLetter(this.currentMap[StartYPos].charAt(StartXPos+1 +index))){
                    }else{
                    this.currentMap = this.Replace(this.currentMap, StartXPos+1 + index, StartYPos, " ");
                    }
                }
                StartYPos++
        }
        
        }
        removePlayerVision(){
            var assembledMap = this.currentMap.join(Config.ReplaceIcon); 
            var NoVison = assembledMap.replace(/ /g, "░");
            this.currentMap = NoVison.split(Config.ReplaceIcon);
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
                case Config.WallIcon:
                    return CollisionEventWall;
                    break;
                case Config.PlayerIcon:
                    return CollisionEventPlayer;
                    break;
                case Config.AirIcon:
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
                        if(Config.Verbose)console.log("WallCollision")
                        this.DisplayMsg(Config.WallCollisionMsgArr, player);
                        break;
                    case "airblock":
                        if(Config.Verbose)console.log("AirBlockCollision")
                        this.DisplayMsg(Config.WallCollisionMsgArr, player);
                        break;
                    case "player":
                        if(Config.Verbose)console.log("PlayerCollision")
                        this.DisplayMsg(Config.WallCollisionMsgArr, player);
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
            this.PlayerMove(this.FileSys.player_1, Config.SaveMapCordPair.Home.x,Config.SaveMapCordPair.Home.y);
        }
        
        /** @deprecated AbsoluteMove is not longer possible --map is stored in array, not string */
        TruePlayerMove(index){
            var indexOfMovement = index;
            
            const PlayerIcon = Config.PlayerIcon;
            const WallIcon = Config.WallIcon;
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
// var assembledMap = this.currentMap.join(Config.ReplaceIcon); 
    // var coloredMap = assembledMap.replace(player.PlayerColor, Config.PlayerIcon);
    // this.currentMap = coloredMap.split(Config.ReplaceIcon);
    let lineNum = 0;
    this.currentMap.forEach(line => {
        this.currentMap[lineNum] = line.replace(player.PlayerColor, Config.PlayerIcon);
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
    var assembledMap = this.currentMap.join(Config.ReplaceIcon); 
    var coloredMap = assembledMap.replace(/ඞ/g, Config.AirIcon);
    this.currentMap = coloredMap.split(Config.ReplaceIcon);
}
async RenderPlayers(players){
    let numOfPlays =0;
    var multi = 0;
    let FalseMap = await this.currentMap.toString().split(",");
    
    let playerPromise1 = new Promise(resolve => {
        this.StripAnsi();
        let index = 1;
        players.forEach(player => {
            var charAtPlayerX = this.currentMap[player.y].charAt(player.x)
            if(charAtPlayerX == " "){
            let firstPart = this.currentMap[player.y].substr(0, player.x);
            let lastPart = this.currentMap[player.y].substr(player.x+1);
            this.currentMap[player.y] = firstPart + Config.PlayerIcon + lastPart;  
            FalseMap[player.y] = firstPart + Config.PlayerIcon + lastPart;  
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
            if((this.currentMap[player.y].includes(Config.PlayerIcon))){
                const stripAnsi = require('strip-ansi');
                var charAtPlayerX = this.currentMap[player.y].charAt(player.x)
                if(charAtPlayerX != Config.AirIcon){
                this.currentMap[player.y] = stripAnsi(this.currentMap[player.y]);
                let firstPart = this.currentMap[player.y].substr(0, player.x);
                let lastPart = this.currentMap[player.y].substr(player.x+1);
                this.currentMap[player.y] = firstPart + Config.replaceArr[replaceNum] + lastPart; 
                player.ReplacedChar = Config.replaceArr[replaceNum];
            }
                index++;
                replaceNum++;
            }});
            resolve();
    });
        let playerPromise3 = new Promise(resolve => {
            for (let indexhrsh = 0; indexhrsh < players.length; indexhrsh++) {
                    const player = players[indexhrsh];
                    for (let index2 = 0; index2 < Config.replaceArr.length; index2++) {
                        const char = Config.replaceArr[index2];
                        if(player.ReplacedChar == char){
                        this.currentMap[player.y] = this.currentMap[player.y].replace(char, player.PlayerColor);
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
        DisplayMsg(msgArr, player){
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
                var AddedWhiteSpace = MaxMsgLength - msg.length 
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
            this.UpdateMapStatuses(player);
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
            
            
            this.currentMap = this.Replace(this.currentMap, 4, TextBoxEnd, "║                  ║▓");
            this.currentMap = this.Replace(this.currentMap, 4, BoxEndPos, "▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒");
            this.currentMap = this.Replace(this.currentMap, 3, BoxEndPos+1, "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓");
            }
        }
        /** @deprecated map is stored in array, thus y does not need to equal length of a line thus this function is unused */
        MapGetLengthOfLine(i){
           var lines = this.BaseMap.split("\n")
           if(Config.Verbose)console.log(lines[i].replace(/ /g, "▒").replace(/\n/g, "▒▒"))
           if(Config.Verbose)console.log(lines[i].replace(/ /g, "▒").replace(/\n/g, "▒▒").length)
           return lines[i].replace(/ /g, "▒").replace(/\n/g, "▒▒").length+1;
        }
}