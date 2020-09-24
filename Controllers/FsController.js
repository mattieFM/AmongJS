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
        "Upper Engine" : this.StatusTypes.NORMAL,
        "Reactors" : this.StatusTypes.NORMAL,
        "Lower Engine" : this.StatusTypes.NORMAL,
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
        UpperEngine : "Upper Engine",
        Reactor : "Reactors",
        LowerEngine : "Lower Engine",
        Security : "Security",
        MedBay : "MedBay",
        Electrical : "Electrical",
        Storage_ : "Storage",
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
    UpdateMapStatuses(){
        this.SetCurrentMap();
        return new Promise(resolve => {
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
        writeAssembledMap(){
            var readline = require("readline");
            readline.cursorTo(process.stdout, 1, 1)
            process.stdout.write(this.currentMap.join("\n"));
        }
        reset(){
            this.currentMap = this.BaseMap.split("\n")
        }
        PlayerMove(player, x, y){
            const PlayerIcon = Config.PlayerIcon;
            const WallIcon = Config.WallIcon;
            var collision = this.Collision(x, y);
            if(collision){
                this.collisionHandler(collision, player, x, y);
            }else{
            this.currentMap = this.Replace(this.currentMap, player.x, player.y, " ");
            this.currentMap = this.Replace(this.currentMap, x, y, PlayerIcon);
            player.setPos(x, y);
            }
            this.UpdateMapStatuses();
        }
        
        Collision(x, y){
            var collider = this.currentMap[y].charAt(x);
            var CollisionEvent = null;
            var CollisionEventBase = {
                CollisionTypes: {letter: "letter", wall: "wall", player: "player"},
                CollisionType: null

            }
            if(this.isLetter(collider)){
                var CollisionEvent = CollisionEventBase;
                CollisionEvent.CollisionType = CollisionEventBase.letter;
                return CollisionEvent;
            }
            var CollisionEventWall = CollisionEventBase;
            CollisionEventWall.CollisionType = CollisionEventBase.CollisionTypes.wall;
            var CollisionEventPlayer = CollisionEventBase;
            CollisionEventPlayer.CollisionType = CollisionEventBase.CollisionTypes.wall;
            switch (collider) {
                case Config.WallIcon:
                    return CollisionEventWall;
                    break;
                case Config.PlayerIcon:
                    return CollisionEventPlayer;
                    break;
                case " ":
                     return null;
                    break;
                default:
                    return CollisionEventWall;
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
                        //if(Config.Verbose)console.log("collision")
                        this.currentMap = this.Replace(this.currentMap, x, y, Config.PlayerIcon + " ");
                        break;
                    case "player":
                        //if(Config.Verbose)console.log("collision")
                        this.currentMap = this.Replace(this.currentMap, x, y, Config.PlayerIcon);
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
            return str.length === 1 && str.match(/[a-z]/i);
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
            this.UpdateMapStatuses();
        }
        /** @deprecated map is stored in array, thus y does not need to equal length of a line thus this function is unused */
        MapGetLengthOfLine(i){
           var lines = this.BaseMap.split("\n")
           if(Config.Verbose)console.log(lines[i].replace(/ /g, "▒").replace(/\n/g, "▒▒"))
           if(Config.Verbose)console.log(lines[i].replace(/ /g, "▒").replace(/\n/g, "▒▒").length)
           return lines[i].replace(/ /g, "▒").replace(/\n/g, "▒▒").length+1;
        }
}