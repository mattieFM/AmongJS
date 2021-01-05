/**
 * Among us costs $5 guess I should make it myself :( 
 * ...and thus Among JS was born
 * ...if at least 10 people donate $1 I will make 10cents an hour (on the high end) for coding this....
 * ... do I regret my decisions?...
 * only slightly.....
Programmer: Matt/AuthoredEntropy
*/

const chalk = require('chalk');
const colors = require('colors/safe');
const stripAnsi = require('strip-ansi');
const utility = require("../Utility/util");
/** @description the current message that is actively being displayed to the user on the main map screen 
 *   this has not been implemented yet and is only used in updateCurrentMsg a function that is not used
*/
let currentMsg = [];
/**@description the utility class that shares useful functions between all other classes */
const util = new utility();
/**@deprecated This was added in very early development, and should not be used */
module.exports.baseFileSys = class {
    TFQuestionNum = 0;
    PROMPT;
    constructor() {
        this.PROMPT = ">"
    }
}
/**
 * @description The main class of the game handling most client side interactions
 */
module.exports.fs = class FsController {
    /**
     * @description this variable refers to the init class, where all runtime variables that need to be 
     * accessible from all files are stored.
     * */
    FileSys;
    /**
     * @description assigns the filesystem to a variable after everything is properly initialized as to avoid errors.
     * @param {*} FileSystem the filesystem to load (the init class)
     */
    LoadFileSys(FileSystem) {
        this.FileSys = FileSystem;
    }

    /**
     * @description get the BaseMap object
     * @returns a new BaseMap object */
    getMap() {
        return new map().BaseMap;
    }
    /**
     * @deprecated added very early in development, and could be used to save data, although 
     * it was never used as data does not need to be saved in this game other than in memory
     * @param {*} args the arguments that modify the result of the command as listed below
     * >> @description By default the command will just save basic info (info contained in the class "baseFileSys")
     * >> "-a" saves all data to a file
     * >> "-p" saves ONLY playerData to a file
     * >> "-add more later"
     */
    async WriteFileSys(args) {
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
            this.fs.writeFile(this.FileSys.Config.PATH + "\\FileSys\\BaseFileSystem.json", JSON.stringify(require("../Init").BaseFileSys), (err) => {
                if (this.FileSys.Config.Verbose) console.log("--FsController: baseFileSys has been written to a file")
                resolve(true);
            })
        })
        if (a) {
            //write all file systems to file
        } else if (p) {
            //write only playerData to file
        } else {
            await WriteBaseFileSysPromise;
        }
    }

}
/**
 * @description the class that represents the map: the board that players move on.
 */
module.exports.map = class {
    sabotageMap = require("../FileSys/SabatageMap").split("\n");
    /**@description the variable representing the init class, where all global runtime variables are stored*/
    FileSys;
    /**
     * @description this will define a color theme, that is used for status coloring and load the current map
     */
    constructor() {
        colors.setTheme({
            funny: 'rainbow',
            merica: "america",
            normal: 'green',
            tasks: 'yellow',
            emergency: 'red'
        });
        this.SetCurrentMap();
    }
    /**
     * @description 
     * this will load the specified filesystem into the proper variable
     * additionally this is where any tasks/quests are activated.
     * although they can be changed later
     * 
     * ONLY USE AFTER ALL RELEVANT VARIABLES ARE DEFINED.
     * @param {*} FileSystem the filesystem to load 
     */
    LoadFileSys(FileSystem) {
        this.FileSys = FileSystem;
        this.FileSys.player_1.gasQuestActive = true
        this.FileSys.player_1.uploadTaskActive = true
        this.FileSys.player_1.fixElecQuestActive = true
        this.FileSys.player_1.startEngineQuestActive = true
        this.setupTasks();
    }
    /**
     * @description this will set the current map variable to the proper starting value: an array containing the BaseMap
     */
    SetCurrentMap() {
        if (!this.currentMap) {
            this.currentMap = this.BaseMap.split("\n")
            this.currentEmergencyMap = this.currentEmergencyMap.split("\n")

        }

    }
    /**@description this represents the main playable map */
    currentMap;
    /**@description this represents the emergency meeting map: the voting and discussion area */
    currentEmergencyMap = require("../FileSys/EmergencyMeetingMap");
    /**@description the base value of the main map */
    BaseMap = require("../FileSys/BaseMap");
    /**@enum StatusTypes represents all possible statuses that a area can have */
    StatusTypes = require("../Utility/Enum/StatusEnum")
    /**@description the statuses of every area on the map AS RENDERED to the player */
    Statuses = {
        Upper_Engine: this.StatusTypes.NORMAL,
        "Reactors": this.StatusTypes.NORMAL,
        Lower_Engine: this.StatusTypes.NORMAL,
        Security: this.StatusTypes.NORMAL,
        MedBay: this.StatusTypes.NORMAL,
        Electrical: this.StatusTypes.TASKSAVAILABLE,
        "Storage": this.StatusTypes.NORMAL,
        Communications: this.StatusTypes.NORMAL,
        Shields: this.StatusTypes.NORMAL,
        Admin: this.StatusTypes.NORMAL,
        Cafeteria: this.StatusTypes.NORMAL,
        O2: this.StatusTypes.NORMAL,
        Weapons: this.StatusTypes.NORMAL,
        Navigation: this.StatusTypes.NORMAL
    }
    /**@description the statuses of every area as it relates to back end task management */
    TaskStatuses = {
        Upper_Engine: this.StatusTypes.NORMAL,
        "Reactors": this.StatusTypes.NORMAL,
        Lower_Engine: this.StatusTypes.NORMAL,
        Security: this.StatusTypes.NORMAL,
        MedBay: this.StatusTypes.NORMAL,
        Electrical: this.StatusTypes.NORMAL,
        "Storage": this.StatusTypes.NORMAL,
        Communications: this.StatusTypes.NORMAL,
        Shields: this.StatusTypes.NORMAL,
        Admin: this.StatusTypes.NORMAL,
        Cafeteria: this.StatusTypes.NORMAL,
        O2: this.StatusTypes.NORMAL,
        Weapons: this.StatusTypes.NORMAL,
        Navigation: this.StatusTypes.NORMAL
    }
    emergencyStatuses = {
        Upper_Engine: this.StatusTypes.NORMAL,
        "Reactors": this.StatusTypes.NORMAL,
        Lower_Engine: this.StatusTypes.NORMAL,
        Security: this.StatusTypes.NORMAL,
        MedBay: this.StatusTypes.NORMAL,
        Electrical: this.StatusTypes.NORMAL,
        "Storage": this.StatusTypes.NORMAL,
        Communications: this.StatusTypes.NORMAL,
        Shields: this.StatusTypes.NORMAL,
        Admin: this.StatusTypes.NORMAL,
        Cafeteria: this.StatusTypes.NORMAL,
        O2: this.StatusTypes.NORMAL,
        Weapons: this.StatusTypes.NORMAL,
        Navigation: this.StatusTypes.NORMAL
    }
    /**@description the names of every area as they are displayed on the map */
    Names = {
        Upper_Engine: "Upper_Engine",
        Reactors: "Reactors",
        Lower_Engine: "Lower_Engine",
        Security: "Security",
        MedBay: "MedBay",
        Electrical: "Electrical",
        "Storage": "Storage",
        Communications: "Communications",
        Shields: "Shields",
        Admin: "Admin",
        Cafe: "Cafeteria",
        O2: "O2",
        Weapons: "Weapons",
        Navigation: "Navigation"
    }
    /**@deprecated this will randomize all map statuses as tasks now exist it should not be used unless testing*/
    RandomizeMapStatuses() {

        var StatusArr = Object.keys(this.Statuses);

        return new Promise(resolve => {

            StatusArr.forEach(name => {
                switch (Math.floor((Math.random() * 3) + 1)) {
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
    /**
     * @description kill the player controlled by this client and display the death animation (then unpause)
     * @param {Object} player the player controlled by this client
     */
    async death(player) {

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
                    if (index == length - 1) {
                        clearInterval(timer);
                        this.FileSys.pause = false;
                        resolve();
                        player.IsDead = true;
                    } else {
                        index++
                    }
                }, 50);

            });
        })


    }
    /**
     * @description currently not used but will be implemented soon
     * update the current displayed message, the message will stay this way until this function is fired again
     */
    updateCurrentMsg(msg) {
        if(!this.FileSys.pauseAutoMsg)
        currentMsg = msg
        return;
    }

    once = false;
    rooms = [];
    /**
     * @description this is the main function that renders the game, it should be called in the main game loop
     * @param {Object} player the player controlled by this client
     */
    async UpdateMapStatuses(player) {
        if (this.FileSys.pause | this.FileSys.emergency | this.sabotageMapActive) { if (util.Verbose) console.log("PAUSED"); return }
        const obj = await this.FileSys.getPlayersAndTick(player);
        if (obj["gameStarted?"] == false) {
            this.FileSys.gameStarted = false;
            this.once = false;
            //console.log(chalk.blue("You are in the lobby, please wait for the host to start the game"))
            //player.moveOverride = true;
            this.currentMap = require("../FileSys/lobbyMap").split("\n")
        } else {
            if (!this.once) {
                this.FileSys.gameStarted = true;
                this.currentMap = this.BaseMap.split("\n")
                this.PlayerMove(player, player.spawnPos.x, player.spawnPos.y)
                player.moveOverride = false;
                this.once = true
            }
            this.FileSys.sabotageMsg = obj.emeMsg
            if(this.FileSys.sabotageMsg[0].includes("comms") == false) this.FileSys.dontRenderTasks = false;
        }
        
        if (obj.isEmergency) {
            this.FileSys.sabotageActive = true;
            if (this.rooms != obj.allEmergencies) {
                this.rooms.forEach(room2 => {
                    let exists = false
                    obj.allEmergencies.forEach(room => {
                        if (room2 == room) {
                            exists = true
                        }
                    });
                    if (!exists) {
                        this.emergencyStatuses[room2] = this.StatusTypes.NORMAL;
                    }
                });
            }
            
            this.rooms = obj.allEmergencies;
            this.rooms.forEach(room => {
                this.emergencyStatuses[room] = this.StatusTypes.EMERGENCY;
            });
        } else {
            if (this.rooms != obj.allEmergencies) {
                this.rooms.forEach(room2 => {
                    let exists = false
                    obj.allEmergencies.forEach(room => {
                        if (room2 == room) {
                            exists = true
                        }
                    });
                    if (!exists) {
                        this.emergencyStatuses[room2] = this.StatusTypes.NORMAL;
                    }
                });
            }
            this.FileSys.sabotageActive = false;
        }

        this.SetCurrentMap();
        return new Promise(async resolve => {
            this.UnRenderPlayers();
            this.StripAnsi();
            this.UpdatePlayerVision(player)
            if (obj["gameStarted?"] == true) {
                if (player.IsTraitor == true) {
                    this.updateCurrentMsg(["Turn Num: " + this.FileSys.TickCount, "Imposter", "kill your friends", "", "", "kill Cooldown:" + player.nextKillTurn])
                    this.DisplayMsg(["Turn Num: " + this.FileSys.TickCount, "Imposter", "kill your friends", "", "", "kill Cooldown:" + player.nextKillTurn], player, true);
                } else {
                    this.updateCurrentMsg(["Turn Num: " + this.FileSys.TickCount, "Crewmate", "compete tasks", " "])
                    this.DisplayMsg(["Turn Num: " + this.FileSys.TickCount, "Crewmate", "compete tasks", " "], player, true);
                }
            } else {
                this.updateCurrentMsg(["Turn Num: " + this.FileSys.TickCount, "the game has not", "started, press \"q\"", "near the", "\"computer\" to", "customize your", "character"])
                this.DisplayMsg(["Turn Num: " + this.FileSys.TickCount, "the game has not", "started, press \"q\"", "near the", "\"computer\" to", "customize your", "character"], player, true);
            }
            if (player.IsDead == true) {
                player.PlayerColor = chalk.hex("#DBE7E7")(this.FileSys.Config.PlayerIcon);
                obj.players.push(player);
                if (player.IsTraitor == true) {
                    this.updateCurrentMsg(["Turn Num: " + this.FileSys.TickCount, "hey shitass...", "wanna see me lose", "among us?"])
                    this.DisplayMsg(["Turn Num: " + this.FileSys.TickCount, "hey shitass...", "wanna see me lose", "among us?"], player, true);
                } else {
                    this.updateCurrentMsg(["Turn Num: " + this.FileSys.TickCount, "You are dead", "complete your tasks", " "])
                    this.DisplayMsg(["Turn Num: " + this.FileSys.TickCount, "You are dead", "complete your tasks", " "], player, true);
                }
            }
            let msg = currentMsg;
            if(this.FileSys.sabotageActive){
                    currentMsg = msg.concat(this.FileSys.sabotageMsg)
                    this.DisplayMsg(["Turn Num: " + this.FileSys.TickCount, "You are dead", "complete your tasks", " "], player, true);
                    if(this.FileSys.sabotageMsg[0].includes("comms")) this.FileSys.dontRenderTasks = true;
                    
            }
            await this.RenderPlayers(obj.players);
            this.currentMap.forEach(line => {
                if (line.includes("³")) {
                    this.currentMap[this.currentMap.indexOf(line)] = chalk.red(line)
                };
                if (line.includes("²")) {
                    this.currentMap[this.currentMap.indexOf(line)] = chalk.green(line)
                };
                if (line.includes("¹")) {
                    this.currentMap[this.currentMap.indexOf(line)] = chalk.yellow(line)
                };
            });

            var NamesArr = Object.values(this.Names);
            NamesArr.forEach(name => {
                var status = this.Statuses[name];
                var coloredName = name;
                if (this.emergencyStatuses[name] != this.StatusTypes.EMERGENCY && !this.FileSys.dontRenderTasks) {
                    switch (status) {
                        case "Sabotaged":
                            coloredName = chalk.red(name);
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
                } else if(this.emergencyStatuses[name] == this.StatusTypes.EMERGENCY){
                    coloredName = chalk.red(name)
                }else{
                    coloredName = chalk.green(name)
                }
                /**@description the current map assembled into one string */
                var assembledMap = this.currentMap.join(this.FileSys.Config.ReplaceIcon);
                /**@description the current map assembled into one string with one name replaced with its proper color */
                var coloredMap = assembledMap.replace(name, coloredName);
                this.currentMap = coloredMap.split(this.FileSys.Config.ReplaceIcon);
            });

            this.writeAssembledMap();
            resolve(this.currentMap);
        })
    }
    /**
     * @description render the end game display screen
     * @param {*} msg the message to display at the end of the game (who wins)
     * @param {*} player the player controlled by this client
     */
    endGameDisplay(msg, player) {
        this.UnRenderPlayers();
        this.StripAnsi();
        this.DisplayMsg(msg, player, true)
        var NamesArr = Object.values(this.Names);
        const obj = this.FileSys.getPlayersAndTick(player);
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
            /**@description the current map assembled into one string */
            var assembledMap = this.currentMap.join(this.FileSys.Config.ReplaceIcon);
            /**@description the current map assembled into one string with one name replaced with its proper color */
            var coloredMap = assembledMap.replace(name, coloredName);
            this.currentMap = coloredMap.split(this.FileSys.Config.ReplaceIcon);
        });

        this.writeAssembledMap();
        return
    }
    /**@description this will strip any ansi color from all names on the map*/
    deColorMap() {
        var NamesArr = Object.values(this.Names);
        NamesArr.forEach(name => {
            /**@description the status of the current name */
            var status = this.Statuses[name];
            /**@description current name */
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
            /**@description the current map assembled into one string */
            var assembledMap = this.currentMap.join(this.FileSys.Config.ReplaceIcon);
            /**@description the current map assembled into one string with one name replaced with its proper color */
            var coloredMap = assembledMap.replace(coloredName, name);
            this.currentMap = coloredMap.split(this.FileSys.Config.ReplaceIcon);
        });
    }
    /**@description a function that will render the currentMap variable to console */
    writeAssembledMap() {
        process.stdout.write("\x1b[?25l");
        var readline = require("readline");
        readline.cursorTo(process.stdout, 1, 1)
        process.stdout.write(this.currentMap.join("\n"));
        process.stdout.write("\x1b[?25h");
    }
    /**
     * @description this will reset the map to its original state, this will not change statuses or player locations 
     * @deprecated don't use this, This function should be changed to actualy reset the statuses player locations and map*/
    reset() {
        this.currentMap = this.BaseMap.split("\n")
    }
    /**@description remove all asni characters from the currentMap variable */
    StripAnsi() {
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
    PlayerCanMove(player, tickCount, x, y) {
        if (player.moveOverride == true) return (false);
        let NumOfSpaces = x * .5 + y
        var canMove = true;
        if (tickCount == player.currentGameTick) {
            if (player.MovesThisTurn >= player.MovesPerTurn) {
                canMove = false;
            } else {
                if (Math.abs(player.MovesThisTurn + NumOfSpaces) <= player.MovesPerTurn) {
                    player.MovesThisTurn += NumOfSpaces;
                } else {
                    canMove = false;
                }
            }
        } else {
            player.currentGameTick = tickCount;
            player.MovesThisTurn = 0;
            return this.PlayerCanMove(player, tickCount, x, y);
        }
        return canMove
    }
    /**
     * @notdeprecated dumbass
     * @param {*} player the player controlled by this client
     * @param {*} x the x cord pos to move
     * @param {*} y the y cord pos to move
     */
    RelativePlayerMove(player, x, y) {
        x = x * 2
        this.StripAnsi();
        this.removePlayerVision();
        // if(totalMove > this.FileSys.Config.MovesPerTurn || totalMove < -this.FileSys.Config.MovesPerTurn){
        //     this.DisplayMsg(["YOU CANNOT MOVE"," MORE THAN" + this.FileSys.Config.MovesPerTurn,"SPACES PER SECOND"])
        //     return;
        // }
        var CanMove = this.PlayerCanMove(player, this.FileSys.TickCount, x, y);
        if (CanMove) {
            let LocalX = x;
            let LocalY = x;
            x = player.x + x;
            y = player.y + y;
            const PlayerIcon = this.FileSys.Config.PlayerIcon;
            const WallIcon = this.FileSys.Config.WallIcon;
            var collision = this.Collision(x, y);
            if (collision) {
                this.collisionHandler(collision, player, x, y);
            } else {
                //this.currentMap = this.Replace(this.currentMap, player.x, player.y, "░");
                // this.currentMap = this.Replace(this.currentMap, x, y, this.FileSys.Config.PlayerIcon);
                player.x = x;
                player.y = y;
                this.FileSys.player_1 = player;


            }
            this.StripAnsi();
            this.UpdateMapStatuses(player);

            return;
        } else {
            return;
        }
    }
    /**
     * @description will allow the player to move to a specified x y position on the map ignoring turns, but not ignoring collisions
     * @param {*} player the player to move
     * @param {*} x x cord of position to move to
     * @param {*} y y cord of position to move to
     */
    PlayerMove(player, x, y) {
        this.StripAnsi();
        this.removePlayerVision();
        var collision = this.Collision(x, y);
        if (collision) {
            this.collisionHandler(collision, player, x, y);
        } else {
            player.x = x;
            player.y = y;
            this.FileSys.player_1 = player;
        }
        this.StripAnsi();
        this.UpdateMapStatuses(player);
        return;
    }
    /**
     * @description kill the first player found when probing the kill range, if player is traitor
     * @param {*} player The current player controlled by this client
     */
    KillPlayerWithinRange(player) {
        if (player.IsTraitor == false) return;
        if (!(this.FileSys.TickCount >= player.nextKillTurn)) return;
        let killer = player;
        let killRange = this.FileSys.Config.KillRange;
        let hasKilled = false
        this.FileSys.allPlayers.forEach(play => {
            if (play.IsTraitor == false) {
                if (hasKilled) return;
                let xDistance = (Math.abs(killer.x - play.x) / 2)
                let yDistance = Math.abs(killer.y - play.y)
                if (xDistance + yDistance <= killRange) {
                    this.FileSys.KillPlayer(play.PlayerID);
                    hasKilled = true
                }
            }
        });
        if (hasKilled == true) {
            killer.nextKillTurn = this.FileSys.TickCount + this.FileSys.Config.killCooldown;
        }
    }
    /**
     * @description pause the map and let the player sabotage the map if they are a traitor
     * @param {*} player the player controled by this client
     */
    Sabotage(player) {
        if (!player.IsTraitor) return;
        this.FileSys.pause = true;

    }
    /**
     * @description used for sabotage map
     * @param {String} text the string to render a box around
     * @param renChar the charector to render the box out of
     */
    async renderBoxAroundText(text, renChar = "█") {
        let indexOfText = await this.checkMapForText(this.sabotageMap, text)
        if (indexOfText) {
            let line = this.sabotageMap[indexOfText];
            let wordStart = parseInt(line.indexOf(text));
            let wordEnd = wordStart + text.length;
            let yLength = 4
            let xLength = text.length + Math.floor(text.length / 3) + 1;
            let xOrgin = (wordStart - Math.floor(text.length / 3) / 2) - 1;
            if (xLength < 6) { xLength = 9; xOrgin = wordStart - (xLength / 2) + 1 }
            if (text.length > 8) yLength = 6
            let boxCords = this.getBoxCords(xOrgin, indexOfText, xLength, yLength)
            boxCords.forEach(cord => {
                if (this.FileSys.Config.Verbose) console.log(cord)
                let x = cord.x;
                let y = cord.y;
                this.Replace(this.sabotageMap, x, y, renChar)
            })

            process.stdout.write("\x1b[?25l");
            var readline = require("readline");
            readline.cursorTo(process.stdout, 1, 1)
            process.stdout.write(this.sabotageMap.join("\n"));
            process.stdout.write("\x1b[?25h");
        }
    }
    /**
    * @description used for sabotage map
    * @param {String} text the string to erase a box from
    */
    eraseBoxFromText(text) {
        //just render a box of spaces
        this.renderBoxAroundText(text, " ")
    }
    /**
     * @description gets all x,y cord pairs to render a box around text
     * @param {*} xLen the x length of the box
     * @param {*} yLen the y length of the box
     * @param {*} xOrigin the x cord origin of the box (farthest right point in the box)
     * @param {*} yOrigin the y cord origin of the box (lowest point in the box)
     * @returns an array of cord pairs {x:x,y:y}
     */
    getBoxCords(xOrigin, yOrigin, xLen, yLen) {
        let cords = [];
        let x = xOrigin
        let y = yOrigin
        for (let i = 0; i < xLen; i++) {
            cords.push({ "x": x + (i), "y": y - (yLen / 2) })
            cords.push({ "x": x + (i), "y": y + (yLen / 2) })
            cords.push({ "x": x + (i + 1), "y": y + (yLen / 2) })
            cords.push({ "x": x + (i + 2), "y": y + (yLen / 2) })
            cords.push({ "x": x + (i - 1), "y": y + (yLen / 2) })

        }
        for (let z = 0; z < yLen; z++) {
            cords.push({ "x": x - 1, "y": (y - (yLen / 2)) + z })
            cords.push({ "x": x + xLen + 1, "y": (y - (yLen / 2)) + z })
            cords.push({ "x": x, "y": (y - (yLen / 2)) + z })
            cords.push({ "x": x + xLen, "y": (y - (yLen / 2)) + z })
        }
        return cords;
    }
    /**
     * 
     * @param {*} map the array representing the map to check
     * @param {*} text the text to check for
     * @returns promise for the index in the array that includes the text or false if none
     */
    checkMapForText(map, text) {
        return new Promise(resolve => {
            let object = false;
            map.forEach(line => {
                if (line.includes(text)) {
                    object = map.indexOf(line);
                }
            });
            resolve(object)
        })

    }
    activateCustomizeMenu() {
        console.clear();
        let config = this.FileSys.Config
        this.FileSys.customMenuActive = true;
        this.FileSys.pause = true;
        this.sabotageMap = require("../FileSys/customisePlayerMap").split("\n")
        this.renderBoxAroundText("change_hat")
        this.FileSys.currentMenuPos = "change_hat";
    }
    deactivateCustomizeSelector() {
        this.FileSys.customMenuActive = false;
        this.FileSys.pause = false;
    }
    activateColorMenu() {
        console.clear();
        let config = this.FileSys.Config
        this.FileSys.colorMenuActive = true;
        this.FileSys.pause = true;
        this.sabotageMap = require("../FileSys/colorMap").split("\n")
        this.renderBoxAroundText("blue")
        this.FileSys.currentMenuPos = "blue";
    }
    deactivateColorSelector() {
        this.FileSys.colorMenuActive = false;
        this.FileSys.pause = false;
    }
    /**@description open the sabotage menu and activate the keypress listener for it */
    activateSabotageSelector() {
        this.sabotageMap = require("../FileSys/SabatageMap").split("\n");
        let config = this.FileSys.Config
        this.FileSys.sabotageMapActive = true;
        this.FileSys.pause = true;
        this.FileSys.map.renderBoxAroundText("Cafeteria")
        this.FileSys.currentMenuPos = "Cafeteria";
    }
    /**@description deactivate the selector for sabotage  */
    deactivateSabotageSelector() {
        this.FileSys.sabotageMapActive = false;
        this.FileSys.pause = false;
    }
    activateVentMapSelector() {
        this.sabotageMap = require("../FileSys/SabatageMap").split("\n");
        let config = this.FileSys.Config
        this.FileSys.ventMapActive = true;
        this.FileSys.pause = true;
        if (this.FileSys.word == "none") this.FileSys.word = "Cafeteria"
        this.FileSys.map.renderBoxAroundText(this.FileSys.word)
        this.FileSys.currentMenuPos = this.FileSys.word;
    }
    /**@description deactivate the selector for sabotage  */
    deactivateVentMapSelector() {
        this.FileSys.ventMapActive = false;
        this.FileSys.pause = false;
    }

    /**@description pass a key.name and this will move the active menu accordingly*/
    moveInMenu(key) {
        let PosMap;
        if (this.FileSys.ventMapActive) {
            PosMap = require("../FileSys/selectPosMap")
            let currentPos = PosMap[this.FileSys.currentMenuPos];
            if (key == "q") {
                this.eraseBoxFromText(currentPos["name"])
                this.deactivateVentMapSelector();
                async function run(that) {
                    that.PlayerMove(that.FileSys.player_1, currentPos["pos"].x, currentPos["pos"].y)
                }
                run(this);
                return

            }
            let newPos = currentPos[key];
            if (newPos != null) {
                this.eraseBoxFromText(currentPos["name"])
                this.FileSys.map.renderBoxAroundText(newPos)
                this.FileSys.currentMenuPos = newPos;
            }
        }
        if (this.FileSys.sabotageMapActive) {
            PosMap = require("../FileSys/selectPosMap")
            let currentPos = PosMap[this.FileSys.currentMenuPos];
            if (key == "q") {
                this.eraseBoxFromText(currentPos["name"])
                this.deactivateSabotageSelector();
                if (currentPos["subMenu"] != null) {
                    this.FileSys.triggerSabotage(currentPos["name"])
                } else {
                    this.FileSys.triggerSabotage(currentPos["name"], currentPos["subMenu"])
                }
                return
            }
            let newPos = currentPos[key];
            if (newPos != null) {
                this.eraseBoxFromText(currentPos["name"])
                this.FileSys.map.renderBoxAroundText(newPos)
                this.FileSys.currentMenuPos = newPos;
            }
        }
        if (this.FileSys.customMenuActive) {
            PosMap = require("../FileSys/customisePosMap")
            let currentPos = PosMap[this.FileSys.currentMenuPos];
            if (key == "q") {
                this.eraseBoxFromText(currentPos["name"])
                this.deactivateCustomizeSelector();
                this.openCustomMenu(this.FileSys.player_1, currentPos["name"])
                return
            }
            let newPos = currentPos[key];
            if (newPos != null) {
                this.eraseBoxFromText(currentPos["name"])
                this.FileSys.map.renderBoxAroundText(newPos)
                this.FileSys.currentMenuPos = newPos;
            }
        }
        if (this.FileSys.colorMenuActive) {
            PosMap = require("../FileSys/colorPosMap")
            let currentPos = PosMap[this.FileSys.currentMenuPos];
            if (key == "q") {
                this.eraseBoxFromText(currentPos["name"])
                this.deactivateColorSelector();
                //change color
                return
            }
            let newPos = currentPos[key];
            if (newPos != null) {
                this.eraseBoxFromText(currentPos["name"])
                this.FileSys.map.renderBoxAroundText(newPos)
                this.FileSys.currentMenuPos = newPos;
            }
        }

    }

    /**
     * @description when in an emergency render the letter typed at the bottem of the map, allowing the player to type
     * @param {*} letter the key typed
     */
    async type(letter) {
        if (!letter) return;
        if (letter == "backspace" | letter == "delete") {
            this.currentEmergencyMap[this.currentEmergencyMap.length - 1] = this.currentEmergencyMap[this.currentEmergencyMap.length - 1].slice(0, -1);
        } else if (letter == "clear") {
            this.currentEmergencyMap[this.currentEmergencyMap.length - 1] = " "
        } else if (letter == "space") {
            this.currentEmergencyMap[this.currentEmergencyMap.length - 1] = this.currentEmergencyMap[this.currentEmergencyMap.length - 1] + " "
        }
        else if (letter == "return") {
            if (this.currentEmergencyMap[this.currentEmergencyMap.length - 1].startsWith(" ")) {
                this.currentEmergencyMap[this.currentEmergencyMap.length - 1] = this.currentEmergencyMap[this.currentEmergencyMap.length - 1].substring(1);
            }
            this.FileSys.sendMsg(this.currentEmergencyMap[this.currentEmergencyMap.length - 1]);
            this.currentEmergencyMap[this.currentEmergencyMap.length - 1] = " ";
        } else if (letter.length == 1) {
            this.currentEmergencyMap[this.currentEmergencyMap.length - 1] = this.currentEmergencyMap[this.currentEmergencyMap.length - 1] + letter
        } else {
            return;
        }

    }
    /**
     * @deprecated used for testing, clears and stops ememergecies
     */
    async stopEmergency() {
        clearInterval(this.FileSys.emergencyInterval);
        this.FileSys.emergency = false
    }
    /**
     * @description start an emergency meeting from a report of a dead body, this is triggered when a report is send from the server, should not be used client side unless triggered by server
     * @param {*} player the player being controlled by this client
     * @param {*} reporter the player that reported this emergency
     */
    async Report(player, reporter) {
        this.FileSys.Voted = false;
        this.FileSys.player_1.HasVoted = false;
        let msgs = []
        this.FileSys.pause = true
        this.FileSys.emergency = true
        await this.FileSys.util.wait(33);
        if (this.FileSys.Config.Verbose) console.log("here")
        this.FileSys.emergencyInterval = setInterval(async () => {
            msgs = await this.FileSys.getMsgs();
            let parsed = await JSON.parse(msgs);
            msgs = parsed[0];
            let remainingTime = parsed[1];

            let obj = await this.FileSys.getPlayersAndTick(player);
            let falsePlayers = await obj.players
            let x = 1;
            let i = 5;
            let Msgarr = []
            await falsePlayers.forEach(player => {
                if (player.isRendered && !player.isCorpse || player.isGhost){
                    Msgarr.push(x.toString() + ": " + this.FileSys.Config.replaceArr[0])
                }
                x++
            });
            
            
            Msgarr.push(x.toString() + ": skip vote")
            Msgarr.push("")
            Msgarr.push("NAMES")
            await falsePlayers.forEach(player => {
                if (player.isRendered && !player.isCorpse || player.isGhost){
                    Msgarr.push(this.FileSys.Config.replaceArr[0] + " : " +player.userName)
                }
                x++
            });
            Msgarr.push("time left: " + remainingTime)

            if (msgs.length > 44) {
                for (let index = 0; index < msgs.length - 44; index++) {
                    const element = array[index];
                    msgs.shift();
                }
            }
            if (remainingTime < 1) {
                clearInterval(this.FileSys.emergencyInterval);
                let result = await this.FileSys.getResult();
                result = await JSON.parse(result)
                if (isNaN(result)) {
                    this.updateEmergencyMap(["no one was ejected"], Msgarr, true);
                } else {
                    this.updateEmergencyMap([await obj.players[result - 1].PlayerColor + " " + obj.players[result - 1].userName + " has been ejected"], Msgarr, true);
                }
                this.FileSys.pause = false
                this.FileSys.emergency = false
            } else {
                this.updateEmergencyMap(msgs, Msgarr, true);
            }

            falsePlayers.forEach(player => {
                if (!player.isRendered && !player.isGhost) return;
                if (player.PlayerID == reporter) {
                    this.currentEmergencyMap[i] = this.currentEmergencyMap[i].replace(this.FileSys.Config.replaceArr[0] + "           ", player.PlayerColor + " : alive <-");
                }
                else if (player.IsDead) {
                    this.currentEmergencyMap[i] = this.currentEmergencyMap[i].replace(this.FileSys.Config.replaceArr[0] + "        ", player.PreviousColor + " : dead ");
                } else {
                    this.currentEmergencyMap[i] = this.currentEmergencyMap[i].replace(this.FileSys.Config.replaceArr[0] + "        ", player.PlayerColor + " : alive")
                    
                }
                i++
            });
            i +=3
            falsePlayers.forEach(player => {
                if (!player.isRendered && !player.isGhost) return;
                this.currentEmergencyMap[i] = this.currentEmergencyMap[i].replace(this.FileSys.Config.replaceArr[0], player.PlayerColor);
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
            if (remainingTime < 1) await this.FileSys.util.wait(6000);

        }, this.FileSys.Config.delay)



    }
    /**
     * @description report a body within the report distance then set the body in question to invisible
     * @param {*} player the player controlled by this client
     */
    ReportBodyWithinRange(player) {
        let reporter = player;
        let ReportRange = this.FileSys.Config.VisionTiles;
        if (reporter.IsDead == true) return;
        this.FileSys.allPlayers.forEach(play => {
            if (play.IsDead == true) {
                let xDistance = (Math.abs(reporter.x - play.x) / 2)
                let yDistance = Math.abs(reporter.y - play.y)
                if (xDistance + yDistance <= ReportRange) {
                    if (play.PlayerColor == this.FileSys.Config.PlayerIcon.red && play.isRendered) {
                        this.FileSys.SendReportToServer(reporter, play);
                    }
                }
            }
        });

    }
    /**
     * @description render all entities within the player's vision
     * @param {*} player the player controlled by this client
     */
    UpdatePlayerVision(player) {
        this.deColorMap()
        let x = player.x
        let y = player.y
        let visionRadius = this.FileSys.Config.VisionTiles;
        let StartXPos = x - (visionRadius * 3)
        let StartYPos = y - visionRadius
        for (let index2 = 0; index2 < visionRadius * 2 + 1; index2++) {
            for (let index = 0; index < visionRadius * 6; index++) {
                if (this.currentMap[StartYPos].charAt(StartXPos + 1 + index) == this.FileSys.Config.PlayerIcon) {
                    this.FileSys.allPlayers.forEach(player => {
                        if (player.x == StartXPos + 1 + index) {
                            this.currentMap = this.Replace(this.currentMap, StartXPos + 1 + index, StartYPos, this.FileSys.Config.PlayerIcon);
                        }
                    });
                } else if (this.currentMap[StartYPos].charAt(StartXPos + 1 + index) == this.FileSys.Config.WallIcon) {

                } else if (this.isLetter(this.currentMap[StartYPos].charAt(StartXPos + 1 + index))) {
                    let word = "";
                    let x = -1;
                    while (this.isLetter(this.currentMap[StartYPos].charAt(StartXPos - x + index) || this.currentMap[StartYPos].charAt(StartXPos - x + index) == "_")) {
                        x++;
                    }
                    x--
                    while (this.isLetter(this.currentMap[StartYPos].charAt(StartXPos - x + index) || this.currentMap[StartYPos].charAt(StartXPos + x + index) == "_")) {
                        word = word + this.currentMap[StartYPos].charAt(StartXPos - x + index);
                        x--;
                    }
                    this.FileSys.word = word;

                } else {
                    this.currentMap = this.Replace(this.currentMap, StartXPos + 1 + index, StartYPos, " ");
                }
            }
            StartYPos++
        }

    }
    /**
     * @description change statuses on map based on what task quests are active
     */
    async setupTasks() {
        if (this.FileSys.player_1.gasQuestActive) {
            this.TaskStatuses.Upper_Engine = this.StatusTypes.TASKSAVAILABLE
            this.Statuses.Lower_Engine = this.StatusTypes.UNAVALIBLE
            this.TaskStatuses.Lower_Engine = this.StatusTypes.TASKSAVAILABLE
            this.Statuses.Upper_Engine = this.StatusTypes.UNAVALIBLE
            this.Statuses.Storage = this.StatusTypes.TASKSAVAILABLE
            this.TaskStatuses.Storage = this.StatusTypes.TASKSAVAILABLE
        }
        if (this.FileSys.player_1.uploadTaskActive) {
            this.TaskStatuses.Admin = this.StatusTypes.TASKSAVAILABLE
            this.Statuses.Admin = this.StatusTypes.TASKSAVAILABLE
            this.TaskStatuses.Security = this.StatusTypes.TASKSAVAILABLE
            this.Statuses.Security = this.StatusTypes.UNAVALIBLE;
        }
        if (this.FileSys.player_1.startEngineQuestActive) {
            this.TaskStatuses.Reactors = this.StatusTypes.TASKSAVAILABLE
            this.Statuses.Reactors = this.StatusTypes.TASKSAVAILABLE
        }
        if (this.FileSys.player_1.fixElecQuestActive) {
            this.TaskStatuses.Electrical = this.StatusTypes.TASKSAVAILABLE
            this.Statuses.Electrical = this.StatusTypes.TASKSAVAILABLE
        }
    }
    async emeTask(area) {
        let result;
        switch (area) {
            case "Electrical":
                if (this.FileSys.player_1.fixElecQuestActive == true) {
                    let wiring = require("../minigames/wiring")
                    this.FileSys.pause = true;
                    result = await wiring();

                }
                break;

            default:
                result = "win"
                break;
        }
        if (result == "win") {
            this.FileSys.completeSabotageTask(area)
        }
        this.FileSys.pause = false;
        return result
    }
    /**
     * @description the function triggered whenever a task is attempted
     */
    async miniGame() {
        let tasks = 0;
        var StatusArr = Object.keys(this.TaskStatuses);


        let currentArea = this.FileSys.word;
        let currentAreaStatus = this.TaskStatuses[currentArea];
        if (this.emergencyStatuses[currentArea] == this.StatusTypes.EMERGENCY) {
            await this.emeTask(currentArea)

        } else if (currentAreaStatus == this.StatusTypes.TASKSAVAILABLE) {
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
                    if (!this.FileSys.player_1.hasGas && this.FileSys.player_1.gasQuestActive == true)
                        this.FileSys.cardFrame = 0;
                    result = await this.getFuelTask(this)
                    this.Statuses.Storage = this.StatusTypes.UNAVALIBLE
                    if (this.TaskStatuses.Lower_Engine == this.StatusTypes.TASKSAVAILABLE)
                        this.Statuses.Lower_Engine = this.StatusTypes.HIGHLIGHT
                    if (this.TaskStatuses.Upper_Engine == this.StatusTypes.TASKSAVAILABLE)
                        this.Statuses.Upper_Engine = this.StatusTypes.HIGHLIGHT
                    break;
                case "Lower_Engine":
                    if (this.FileSys.player_1.hasGas && !this.FileSys.player_1.fueledLower && this.FileSys.player_1.gasQuestActive == true) {
                        result = await this.fillReactorsWithGas(this);
                        this.FileSys.player_1.fueledLower = true;
                        this.FileSys.player_1.hasGas = false;
                        this.Statuses.Lower_Engine = this.TaskStatuses.Lower_Engine;
                        this.Statuses.Upper_Engine = this.TaskStatuses.Upper_Engine;
                        this.Statuses.Storage = this.TaskStatuses.Storage
                        if (this.FileSys.player_1.fueledUpper && this.FileSys.player_1.fueledLower) this.FileSys.player_1.gasQuestActive = false;
                    } else {

                    }
                    break;
                case "Upper_Engine":
                    if (this.FileSys.player_1.hasGas && !this.FileSys.player_1.fueledUpper && this.FileSys.player_1.gasQuestActive == true) {
                        result = await this.fillReactorsWithGas(this);
                        this.FileSys.player_1.fueledUpper = true;
                        this.FileSys.player_1.hasGas = false;
                        this.Statuses.Lower_Engine = this.TaskStatuses.Lower_Engine;
                        this.Statuses.Upper_Engine = this.TaskStatuses.Upper_Engine;
                        this.Statuses.Storage = this.TaskStatuses.Storage
                        if (this.FileSys.player_1.fueledUpper && this.FileSys.player_1.fueledLower) this.FileSys.player_1.gasQuestActive = false;
                    } else {
                        //fix engines
                    }
                    break
                case "Admin":
                    if (this.FileSys.player_1.uploadTaskActive == true && !this.FileSys.player_1.hasData) {
                        result = await download();
                        this.FileSys.player_1.hasData = true;
                        this.Statuses.Security = this.StatusTypes.HIGHLIGHT;
                    } else {
                        result = await this.swipeCard(this);
                    }
                    break;
                case "Security":
                    if (this.FileSys.player_1.uploadTaskActive == true && this.FileSys.player_1.hasData) {
                        result = await upload();
                        this.FileSys.player_1.hasData = false;
                        this.Statuses.Security = this.TaskStatuses.Security;
                    } else if (this.FileSys.player_1.snake) {
                        result = await snake(this.FileSys.Config.snakeGameGoal)
                    } else {
                        //add game
                    }
                    break;
                case "Electrical":
                    if (this.FileSys.player_1.fixElecQuestActive == true) {
                        let wiring = require("../minigames/wiring")
                        this.FileSys.pause = true;
                        result = await wiring();

                    }
                    break;
                case "Reactors":
                    if (this.FileSys.player_1.startEngineQuestActive)
                        result = await repeat();
                    break;
                default:
                    break;
            }



            if (result == "win") {

                await this.renderTaskComp(20, "./taskCompeted.txt")

                this.FileSys.pause = false;
                this.TaskStatuses[currentArea] = this.StatusTypes.NORMAL;
                this.Statuses[currentArea] = this.StatusTypes.NORMAL;
            } else if (result = "partial") {

                await this.renderTaskComp(20, "./taskCompeted.txt")

                this.FileSys.pause = false;
            } else {

                this.FileSys.pause = false;
            }
            StatusArr.forEach(name => {
                if (this.TaskStatuses[name] == this.StatusTypes.TASKSAVAILABLE) {
                    tasks++
                }
            });
            if (tasks == 0) {
                this.FileSys.player_1.tasksCompleted = true;
            }
        }

    }
    /**
     * @location admin
     * @description the swipe card task
     * @param {*} that this
     */
    swipeCard(that) {
        return new Promise((resolve) => {
            that.FileSys.swipeCardActive = true;
            let timer = setInterval(async () => {
                let frame = that.FileSys.cardFrame;
                await this.renderFileFrame(frame, "./card.txt")
                if (frame == 5) {
                    let rand = Math.floor(Math.random() * 10)
                    if (rand > 5) {
                        that.FileSys.cardFrame = 0;
                        that.FileSys.swipeCardActive = false;
                        clearInterval(timer)

                        resolve("win")
                    } else {
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

                    that.FileSys.cardFrame = 0
                }
            }, 100)

        })
    }
    /**
     * @location reactors (upper or lower)
     * @description the fill reactors with gass task
     * @param {*} that this
     */
    async fillReactorsWithGas(that) {
        return new Promise((resolve) => {
            that.FileSys.fuelFrame = 0;
            that.FileSys.pause = true;
            let i = 7;
            let timer = setInterval(() => {
                that.renderFileFrame(i, "./fuelFrames.txt")
                i--;
                if (i == -1) {
                    clearInterval(timer);
                    that.FileSys.fuelTaskActive = false;
                    that.FileSys.player_1.hasGas = false;
                    that.FileSys.player_1.gasQuestActive = false
                    resolve("win");
                }
            }, 500)
        })
    }
    /**
     * @location storage
     * @description the task to get fuel 
     * @param {*} that this
     */
    async getFuelTask(that) {
        that.FileSys.fuelTaskActive = true;
        let value = "partial"
        if (that.FileSys.player_1.fueledUpper || that.FileSys.player_1.fueledLower) {
            value = "win"
        }
        return new Promise((resolve) => {

            that.FileSys.fuelFrame = 0;
            that.FileSys.pause = true;
            let timer = setInterval(async () => {
                await that.renderFileFrame(that.FileSys.fuelFrame, "./fuelFrames.txt")
                if (that.FileSys.fuelFrame == 7) {
                    clearInterval(timer);
                    that.FileSys.fuelTaskActive = false;
                    that.FileSys.player_1.hasGas = true;
                    that.FileSys.player_1.gasQuestActive = true
                    that.FileSys.fuelFrame = 0;
                    await util.wait(1000);
                    resolve(value);
                }
            }, 100)
        }).catch();


    }
    /**
     * @description render a specific frame from a file
     * @param {*} i the index of the frame to render
     * @param {*} file the file to read
     */
    async renderFileFrame(i, file) {
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
    /**
     * @description render the task completed animation
     * @param {*} delay the delay between frames
     * @param {*} file the file to use
     */
    renderTaskComp(delay, file) {
        return new Promise((resolve) => {

            const fs = require("fs")
            let data = fs.readFileSync(file)
            var FrameArr = JSON.parse(data);
            let i = 0;
            let timer = setInterval(() => {
                process.stdout.write("\x1b[?25l");
                var readline = require("readline");
                readline.cursorTo(process.stdout, 1, 1)
                process.stdout.write(FrameArr[i]);
                process.stdout.write("\x1b[?25h");
                if (i + 1 >= FrameArr.length) {
                    clearInterval(timer)
                    resolve();
                }
                i++


            }, delay);
        })







    }
    /**
     * @description waits 1000ms (base) then logs a string
     * @param {*} word the string to log
     * @param {*} delay the optional delay before logging default 1000ms
     */
    async waitThenLog(word, delay = 1000) {
        console.log(word);
        await this.FileSys.util.wait(delay);
    }
    /**@description remove all vision from the player, replacing " "  "░" with */
    removePlayerVision() {
        var assembledMap = this.currentMap.join(this.FileSys.Config.ReplaceIcon);
        var NoVison = assembledMap.replace(/ /g, "░");
        this.currentMap = NoVison.split(this.FileSys.Config.ReplaceIcon);
    }
    lastColor = null;
    /**@description get the player to select a color */
    chooseColor(player) {
        let colors = [chalk.blue, chalk.blueBright, chalk.cyan, chalk.cyanBright, chalk.green, chalk.greenBright, chalk.magenta, chalk.magentaBright, chalk.yellow, chalk.yellowBright];
        this.lastColor = null;
        return new Promise(resolve => {
            this.FileSys.colorPickerActive = true;
            let timer = setInterval(async () => {
                if (this.FileSys.selectedColor == -99) {
                    let obj = await this.FileSys.getPlayersAndTick(player)
                    let players = await obj["players"]
                    let exists = false;
                    if(!this.FileSys.Config.infiniteColors)
                    players.forEach(play => {
                        if (play.PlayerColor == colors[this.lastColor](this.FileSys.Config.PlayerIcon)) {
                            exists = true;
                        }
                    });
                    if(!exists){
                    player.PlayerColor = colors[this.lastColor](this.FileSys.Config.PlayerIcon);
                    this.FileSys.player_1 = player
                    this.FileSys.selectedColor = this.lastColor;
                    this.FileSys.colorPickerActive = false;
                    clearInterval(timer)
                    resolve()
                    }else{
                        this.FileSys.selectedColor = 0;
                        return
                    }
                }
                if (this.lastColor != this.FileSys.selectedColor && this.FileSys.selectedColor != -99) {
                    let map = require("../FileSys/colorMap")[0]

                    let updatedMap;
                    stripAnsi(map);
                    let obj = await this.FileSys.getPlayersAndTick(player)
                    let players = await obj["players"]
                    let exists = false;
                    if(!this.FileSys.Config.infiniteColors)
                    players.forEach(play => {
                        if (play.PlayerColor == colors[this.FileSys.selectedColor](this.FileSys.Config.PlayerIcon)) {
                            exists = true;
                        }
                    });
                    if(player.PlayerColor ==colors[this.FileSys.selectedColor](this.FileSys.Config.PlayerIcon)){
                        exists = false;
                    }
                    if (!exists) {
                        updatedMap = await map.replace(/▓/g, colors[this.FileSys.selectedColor]("▓"))
                        updatedMap = await updatedMap.replace(/▒/g, colors[this.FileSys.selectedColor]("▒"))
                        updatedMap = await updatedMap.replace(/░/g, colors[this.FileSys.selectedColor]("░"))
                    } else {
                        updatedMap = await map.replace(/▓/g, chalk.red("▓"))
                        updatedMap = await updatedMap.replace(/▒/g, chalk.red("▒"))
                        updatedMap = await updatedMap.replace(/░/g, chalk.red("░"))
                    }
                    console.log(updatedMap)
                }
                this.lastColor = this.FileSys.selectedColor
            })
        }, 1000)
    }
    /**
     * @description open the customise player menu if the player is near the "computer"
     * @param {*} player, the player controlled by this client
     */
    async openCustomMenu(player, menu) {
        let prompt = require("prompt-sync")();
        switch (menu) {
            case "change_hat":
                //open hat menu
                break;
            case "change_color":
                this.FileSys.pause = true
                let color = await this.chooseColor(player);
                console.clear()
                this.FileSys.pause = false
                
                break
            case "change_username":
                console.clear();
                this.FileSys.pause = true
               
                let username = prompt("please enter your username below (less than 15 charecters)")
                while(username.length >= 15){
                  username = prompt("enter your username, and now that you didn't listen to me you only get 13 chars for you username\n i hope your happy \n enter below:")
                }
                this.FileSys.player_1.userName = username;
                this.FileSys.pause = false
                break;
            case "SNAKE":
                
                let snake = require("../minigames/snake").main
                let goal = prompt("how many points would you like to get before the game ends?")
                if(isNaN(goal)){
                    console.log("u suck, stop tring to brake this (you didn't enter a integer)")
                }else{
                    this.FileSys.pause = true
                    await snake(goal)
                    this.FileSys.pause = false;
                }
                console.clear()
                
                break;
            default:
                break;
        }
    }
    /**
     * @description check if there is a collision where the player is moving
     * @param {*} x the x cord
     * @param {*} y the y cord
     */
    Collision(x, y) {
        var collider = this.currentMap[y].charAt(x);
        var CollisionEvent = null;
        class CollisionEventBase {
            CollisionTypes = { letter: "letter", wall: "wall", player: "player", air: "airblock" }
            CollisionType = null
        }
        if (this.isLetter(collider)) {
            if (this.FileSys.player_1.hat == collider) {
                var CollisionEvent = CollisionEventBase;
                CollisionEvent.CollisionType = CollisionEventBase.air;
                return CollisionEvent;
            }
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
    /**
     * @description a switch statement that handles all types of collisions
     * @param {*} collisionEvent  the type of collision
     * @param {*} player the player controlled by this client
     * @param {*} x the x cord
     * @param {*} y the y cord
     */
    collisionHandler(collisionEvent, player, x, y) {
        return new Promise(async resolve => {
            switch (collisionEvent.CollisionType) {
                case "letter":
                    await this.LetterCollider(collisionEvent, player, x, y)
                    break;
                case "wall":
                    if (this.FileSys.Config.Verbose) console.log("WallCollision")
                    this.DisplayMsg(this.FileSys.Config.WallCollisionMsgArr, player);
                    break;
                case "airblock":
                    if (this.FileSys.Config.Verbose) console.log("AirBlockCollision")
                    this.DisplayMsg(this.FileSys.Config.WallCollisionMsgArr, player);
                    break;
                case "player":
                    if (this.FileSys.Config.Verbose) console.log("PlayerCollision")
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
     * @description if a letter is collided with, due to its color code special things must happen
     * @param {*} collisionEvent the collision event
     * @param {*} player the player controlled by this client
     * @param {*} x the x cord
     * @param {*} y the y cord
     */
    async LetterCollider(collisionEvent, player, x, y) {
        var line = this.currentMap[y];
        var letter = line.charAt(x);
        var shouldExit = false;
        var word = [];
        word[0] = letter;
        i = 0;
        //if collision occurs in the middle of the word, subtract this from the initial x
        var numToLeft = 0;
        const getWord = new Promise(resolve => {
            var left = true;
            var right = true;

            /**@description Tolerance (how many spaces should be allowed before next letter) */
            let t = 2
            while (left) {
                let LeftLetter = line.charAt(x - i);
                let localTolerance = t;
                if (this.isLetter(LeftLetter)) {
                    if (localTolerance != t) {
                        for (let index = 0; index < t - localTolerance; index++) {
                            word.unshift(" ");
                            numToLeft++;
                        }
                        localTolerance = t;
                    }
                    word.unshift(LeftLetter);
                    numToLeft++;
                } else {
                    localTolerance--
                }

                if (localTolerance = 0) {
                    left = false
                    i = 0;
                }
                i++
            }
            while (right) {
                let RightLetter = line.charAt(x + i);
                let localTolerance = t;
                if (this.isLetter(RightLetter)) {
                    if (localTolerance != t) {
                        for (let index = 0; index < t - localTolerance; index++) {
                            word.push(" ");
                        }
                        localTolerance = t;
                    }
                    word.unshift(RightLetter);
                } else {
                    localTolerance--
                }

                if (localTolerance = 0) {
                    right = false
                    i = 0;
                }
                i++
            }
            if (!left && !right) {
                resolve(word.join())
            }
        })
        const AssembledWord = await getWord();
        const X_ofWord = (x - numToLeft);
        const xCordInsideWord = x - X_ofWord;
    }
    /**
     * @description check if string is composted of letters or underscores
     * @param {*} str the string to check
     * @returns boolean 
     */
    isLetter(str) {
        return str.length === 1 && str.match(/[a-z]/i) || str.match(/_/i);
    }
    /**
     * @description replace a char in an array with an x y cord system
     * NOTE: allows more than one char
     * @param {*} Arr the array to use
     * @param {*} x the index of a string to replace
     * @param {*} y the index of the array to use
     * @param {*} Char the charector to replace specified indexies with
     */
    Replace(Arr, x, y, Char) {
        String.prototype.replaceAt = function (index, replacement) {
            return this.substr(0, x) + replacement + this.substr(index + replacement.length);
        }
        Arr[y] = Arr[y].replaceAt(x, Char)
        return Arr;
    }
    /**
     * @deprecated moves the player to an old spawn location, mostly handled server side now
     */
    PlayerHome() {//72 x cafe y 10
        this.PlayerMove(this.FileSys.player_1, this.FileSys.Config.SaveMapCordPair.Home.x, this.FileSys.Config.SaveMapCordPair.Home.y);
    }

    /** @deprecated AbsoluteMove is not longer possible --map is stored in array, not string */
    TruePlayerMove(index) {
        return console.error("TruePlayerMove CANNOT be used, the map is not stored in a string thus this will not work")
        var indexOfMovement = index;

        const PlayerIcon = this.FileSys.Config.PlayerIcon;
        const WallIcon = this.FileSys.Config.WallIcon;
        if (this.Collision(indexOfMovement)) {
            this.collisionHandler();
        } else {
            this.currentMap = this.Replace(this.currentMap, indexOfMovement, PlayerIcon);
        }
        this.UpdateMapStatuses(player);
    }
    /**@deprecated using StripAnsi(); instead --npm install strip-ansi */
    DeColorPlayer(player) {
        return new Promise(resolve => {
            // var assembledMap = this.currentMap.join(this.FileSys.Config.ReplaceIcon); 
            // var coloredMap = assembledMap.replace(player.PlayerColor, this.FileSys.Config.PlayerIcon);
            // this.currentMap = coloredMap.split(this.FileSys.Config.ReplaceIcon);
            let lineNum = 0;
            this.currentMap.forEach(line => {
                this.currentMap[lineNum] = line.replace(player.PlayerColor, this.FileSys.Config.PlayerIcon);
                lineNum++;
            });
            if (lineNum == this.currentMap.length) {
                this.writeAssembledMap();
                resolve();
            }
        })
    }
    /**
     * @description replace all rendered players with air
     */
    UnRenderPlayers() {
        let hatArr = []
        this.FileSys.allPlayers.forEach(player => {
            hatArr.push(player.hat)
        });
        this.StripAnsi();
        var assembledMap = this.currentMap.join(this.FileSys.Config.ReplaceIcon);
        var coloredMap = assembledMap.replace(/ඞ/g, this.FileSys.Config.AirIcon);
        this.currentMap = coloredMap.split(this.FileSys.Config.ReplaceIcon);
        hatArr.forEach(hat => {
            var assembledMap = this.currentMap.join(this.FileSys.Config.ReplaceIcon);
            var coloredMap = assembledMap.replace(hat, this.FileSys.Config.AirIcon);
            this.currentMap = coloredMap.split(this.FileSys.Config.ReplaceIcon);
        });
    }
    /**
     * @description render players onto a specified map
     * @param {*} players all players 
     * @param {*} map the map to replace
     * @param {*} renderAll weathor to render invisable players
     */
    async RenderPlayers(players, map = this.currentMap, renderAll = false) {
        let numOfPlays = 0;
        var multi = 0;
        let FalseMap = await map.toString().split(",");
        let playerPromise1 = new Promise(resolve => {
            this.StripAnsi(map);
            let index = 1;
            players.forEach(player => {
                var charAtPlayerX = map[player.y].charAt(player.x)
                var charAtPlayerHatX = map[player.y - 1].charAt(player.x)
                if (charAtPlayerX == " " && player.isRendered || renderAll == true || this.FileSys.player_1 == player || this.FileSys.player_1.isGhost && charAtPlayerX == " ") {
                    let firstPart = map[player.y].substr(0, player.x);
                    let lastPart = map[player.y].substr(player.x + 1);
                    map[player.y] = firstPart + this.FileSys.Config.PlayerIcon + lastPart;
                    FalseMap[player.y] = firstPart + this.FileSys.Config.PlayerIcon + lastPart;
                }
                if (charAtPlayerHatX == " " && player.hasHat && player.isRendered || renderAll == true || this.FileSys.player_1 == player || this.FileSys.player_1.isGhost && charAtPlayerX == " ") {
                    let firstPart = map[player.y - 1].substr(0, player.x);
                    let lastPart = map[player.y - 1].substr(player.x + 1);
                    map[player.y - 1] = firstPart + player.hat + lastPart;
                    FalseMap[player.y - 1] = firstPart + player.hat + lastPart;
                }
                if (index == players.length) {
                    resolve();
                }
                index++;

            });

        });
        let playerPromise2 = new Promise(resolve => {
            let index = 1;
            var replaceNum = 0;
            players.forEach(player => {
                if ((map[player.y].includes(this.FileSys.Config.PlayerIcon))) {
                    const stripAnsi = require('strip-ansi');
                    var charAtPlayerX = map[player.y].charAt(player.x)
                    if (charAtPlayerX != this.FileSys.Config.AirIcon && player.isRendered) {
                        map[player.y] = stripAnsi(map[player.y]);
                        let firstPart = map[player.y].substr(0, player.x);
                        let lastPart = map[player.y].substr(player.x + 1);
                        map[player.y] = firstPart + this.FileSys.Config.replaceArr[replaceNum] + lastPart;
                        player.ReplacedChar = this.FileSys.Config.replaceArr[replaceNum];
                    }
                    index++;
                    replaceNum++;
                }
            });
            resolve();
        });
        let playerPromise3 = new Promise(resolve => {
            for (let indexhrsh = 0; indexhrsh < players.length; indexhrsh++) {
                const player = players[indexhrsh];
                for (let index2 = 0; index2 < this.FileSys.Config.replaceArr.length; index2++) {
                    const char = this.FileSys.Config.replaceArr[index2];
                    if (player.ReplacedChar == char) {
                        map[player.y] = map[player.y].replace(char, player.PlayerColor);
                    }
                }
                if (indexhrsh == players.length - 1) {
                    resolve();
                }
            }




        });
        await playerPromise1.then(await playerPromise2.then(await playerPromise3));




    }
    /**
     * @deprecated im not sure why this exists it seems like it might have a use possibly, but for the most part is useless
     * @param {*} players all players
     * @param {*} x probably the x cord
     */
    getPlayerByX(players, x) {
        return new Promise(resolve => {
            players.forEach(player => {
                if (player.x = x) {
                    resolve(player);
                }
            })
        })


    }
    /**
     * @description the message feild on the left of the normal map, but for emergencies
     * @param {*} msgArr the array of messages to display
     */
    EmergencySmallDisplay(msgArr) {
        let that = this
        function ReduceMsgBox(num) {

            for (let index = 0; index < num; index++) {
                var BoxEndPos;
                var BoxStartPos;
                var TextBoxStart;
                var TextBoxEnd;
                var TextAreaStart;
                var TextAreaEnd;
                var lineNum = 0;
                that.currentEmergencyMap.forEach(line => {
                    if (line.includes("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒")) {
                        if (BoxStartPos) {
                            BoxEndPos = lineNum;
                        } else {
                            BoxStartPos = lineNum;
                        }
                    } else if (line.includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒")) {
                        if (TextBoxStart) {
                            TextBoxEnd = lineNum;
                        } else {
                            TextBoxStart = lineNum;
                        }
                    } else if (line.includes("│")) {
                        if (TextAreaStart) {
                            if (that.currentEmergencyMap[lineNum + 1].includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒")) TextAreaEnd = lineNum;
                        } else {
                            TextAreaStart = lineNum;
                        }
                    }
                    lineNum++
                });


                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 3, TextBoxEnd, "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒");
                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 3, BoxEndPos, "██████████████████████▒");
                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 3, TextBoxEnd - 1, "▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒");
            }
        }
        function ExtendMsgBox(num) {
            for (let index = 0; index < num; index++) {
                var BoxEndPos;
                var BoxStartPos;
                var TextBoxStart;
                var TextBoxEnd;
                var TextAreaStart;
                var TextAreaEnd;
                var lineNum = 0;
                that.currentEmergencyMap.forEach(line => {
                    if (line.includes("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒")) {
                        if (BoxStartPos) {
                            BoxEndPos = lineNum;
                        } else {
                            BoxStartPos = lineNum;
                        }
                    } else if (line.includes("▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒")) {
                        if (TextBoxStart) {
                            TextBoxEnd = lineNum;
                        } else {
                            TextBoxStart = lineNum;
                        }
                    } else if (line.includes("│                  │")) {
                        if (TextAreaStart) {
                            TextAreaEnd = lineNum;
                        } else {
                            TextAreaStart = lineNum;
                        }
                    }
                    lineNum++
                });


                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 3, TextBoxEnd, "▓│                  │▓▒");
                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 3, BoxEndPos, "▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒");
                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 3, BoxEndPos + 1, "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒");
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
            if (line.includes("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓")) {
                if (BoxStartPos) {
                    BoxEndPos = lineNum;
                } else {
                    BoxStartPos = lineNum;
                }
            } else if (line.includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒")) {
                if (TextBoxStart) {
                    TextBoxEnd = lineNum;
                } else {
                    TextBoxStart = lineNum;
                }
            } else if (line.includes("│")) {
                if (TextAreaStart) {
                    if (that.currentEmergencyMap[lineNum + 1].includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒")) TextAreaEnd = lineNum;
                } else {
                    TextAreaStart = lineNum;
                }
            }
            if (line.includes("│")) {
                CurrentMsgs.push(that.currentEmergencyMap[lineNum].split("│")[1]);
            }
            lineNum++
        });
        var msgPos = TextAreaStart;
        msgArr.forEach(msg => {
            var AddedWhiteSpace = MaxMsgLength - stripAnsi(msg).length
            if (AddedWhiteSpace < 0) {
                msg = msg.slice(0, MaxMsgLength);
            } else {
                for (let index = 0; index < AddedWhiteSpace; index++) {
                    msg = msg + " ";
                }
            };


            if (that.currentEmergencyMap[msgPos].includes("│")) {
                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 5, msgPos, msg);
            } else {
                ExtendMsgBox(1);
                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 5, msgPos, msg);
            }
            msgPos++;
        });
        var numLinesToDel = CurrentMsgs.length - msgArr.length;
        if (numLinesToDel < 0) {
            numLinesToDel = 0;
        }
        var m = 0;
        ReduceMsgBox(numLinesToDel);
    }
    /**
     * 
     * @param {*} msgArr the array of messages to display
     * @param {*} player the player controlled by this client
     * @param {*} yn weathor or not to immediately updateMapStatuses() after the function completes
     */
    DisplayMsg(msgArr, player, yn = false) {
        msgArr = currentMsg;
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
            if (line.includes("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓")) {
                if (BoxStartPos) {
                    BoxEndPos = lineNum;
                } else {
                    BoxStartPos = lineNum;
                }
            } else if (line.includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒")) {
                if (TextBoxStart) {
                    TextBoxEnd = lineNum;
                } else {
                    TextBoxStart = lineNum;
                }
            } else if (line.includes("║")) {
                if (TextAreaStart) {
                    if (this.currentMap[lineNum + 1].includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒")) TextAreaEnd = lineNum;
                } else {
                    TextAreaStart = lineNum;
                }
            }
            if (line.includes("║")) {
                CurrentMsgs.push(this.currentMap[lineNum].split("║")[1]);
            }
            lineNum++
        });
        var msgPos = TextAreaStart;
        msgArr.forEach(msg => {
            var AddedWhiteSpace = MaxMsgLength - stripAnsi(msg).length
            if (AddedWhiteSpace < 0) {
                msg = msg.slice(0, MaxMsgLength);
            } else {
                for (let index = 0; index < AddedWhiteSpace; index++) {
                    msg = msg + " ";
                }
            };


            if (this.currentMap[msgPos].includes("║")) {
                this.currentMap = this.Replace(this.currentMap, 5, msgPos, msg);
            } else {
                this.ExtendMsgBox(1);
                this.currentMap = this.Replace(this.currentMap, 5, msgPos, msg);
            }
            msgPos++;
        });
        var numLinesToDel = CurrentMsgs.length - msgArr.length;
        if (numLinesToDel < 0) {
            numLinesToDel = 0;
        }
        var m = 0;
        this.ReduceMsgBox(numLinesToDel);
        if (yn == false) this.UpdateMapStatuses(player);
    }
    /**
     * 
     * @description update the emergency meeting map
     * @param {*} msgArr the main message array rendered in the chat box
     * @param {*} msgArrSmall the small msg array used to display players
     * @param {*} Gimme if true do not print the map immidietly and instead return it
     * 
     */
    updateEmergencyMap(msgArr, msgArrSmall = false, Gimme = false) {
        var that = this
        function ReduceMsgBoxEM(num) {
            for (let index = 0; index < num; index++) {
                var BoxEndPos;
                var BoxStartPos;
                var TextBoxStart;
                var TextBoxEnd;
                var TextAreaStart;
                var TextAreaEnd;
                var lineNum = 0;
                that.currentEmergencyMap.forEach(line => {
                    if (line.includes("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓")) {
                        if (BoxStartPos) {
                            BoxEndPos = lineNum;
                        } else {
                            BoxStartPos = lineNum;
                        }
                    } else if (line.includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒")) {
                        if (TextBoxStart) {
                            TextBoxEnd = lineNum;
                        } else {
                            TextBoxStart = lineNum;
                        }
                    } else if (line.includes("║║")) {
                        if (TextAreaStart) {
                            if (that.currentEmergencyMap[lineNum + 1].includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒")) TextAreaEnd = lineNum;
                        } else {
                            TextAreaStart = lineNum;
                        }
                    }
                    lineNum++
                });


                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 40, TextBoxEnd, "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓");
                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 40, BoxEndPos, "██████████████████████████████████████████████████████████████████████████████████████████████████████████████████████");
                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 42, TextBoxEnd - 1, "▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓");
            }
        }
        function ExtendMsgBoxEM(num) {
            for (let index = 0; index < num; index++) {
                var BoxEndPos;
                var BoxStartPos;
                var TextBoxStart;
                var TextBoxEnd;
                var TextAreaStart;
                var TextAreaEnd;
                var lineNum = 0;
                that.currentEmergencyMap.forEach(line => {
                    if (line.includes("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓")) {
                        if (BoxStartPos) {
                            BoxEndPos = lineNum;
                        } else {
                            BoxStartPos = lineNum;
                        }
                    } else if (line.includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒")) {
                        if (TextBoxStart) {
                            TextBoxEnd = lineNum;
                        } else {
                            TextBoxStart = lineNum;
                        }
                    } else if (line.includes("║║                                                                                                              ║║")) {
                        if (TextAreaStart) {
                            TextAreaEnd = lineNum;
                        } else {
                            TextAreaStart = lineNum;
                        }
                    }
                    lineNum++
                });


                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 42, TextBoxEnd, "║║                                                                                                              ║║▓▓");
                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 42, BoxEndPos, "▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒");
                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 40, BoxEndPos + 1, "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓");
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
            if (line.includes("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓")) {
                if (BoxStartPos) {
                    BoxEndPos = lineNum;
                } else {
                    BoxStartPos = lineNum;
                }
            } else if (line.includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒")) {
                if (TextBoxStart) {
                    TextBoxEnd = lineNum;
                } else {
                    TextBoxStart = lineNum;
                }
            } else if (line.includes("║║")) {
                if (TextAreaStart) {
                    if (that.currentEmergencyMap[lineNum + 1].includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒")) TextAreaEnd = lineNum;
                } else {
                    TextAreaStart = lineNum;
                }
            }
            if (line.includes("║║")) {
                CurrentMsgs.push(that.currentEmergencyMap[lineNum].split("║║")[1]);
            }
            lineNum++
        });
        var msgPos = TextAreaStart;
        msgArr.forEach(msg => {
            var AddedWhiteSpace = MaxMsgLength - stripAnsi(msg).length
            if (AddedWhiteSpace < 0) {
                msg = msg.slice(0, MaxMsgLength);
            } else {
                for (let index = 0; index < AddedWhiteSpace; index++) {
                    msg = msg + " ";
                }
            };


            if (that.currentEmergencyMap[msgPos].includes("║║")) {
                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 44, msgPos, msg);
            } else {
                ExtendMsgBoxEM(1);
                that.currentEmergencyMap = that.Replace(that.currentEmergencyMap, 44, msgPos, msg);
            }
            msgPos++;
        });
        var numLinesToDel = CurrentMsgs.length - msgArr.length;
        if (numLinesToDel < 0) {
            numLinesToDel = 0;
        }
        var m = 0;
        ReduceMsgBoxEM(numLinesToDel);
        if (msgArrSmall != false) {
            this.EmergencySmallDisplay(msgArrSmall);
        }
        if (Gimme == false) {
            process.stdout.write("\x1b[?25l");
            var readline = require("readline");
            readline.cursorTo(process.stdout, 1, 1)
            process.stdout.write(that.currentEmergencyMap.join("\n"));
            process.stdout.write("\x1b[?25h");
        } else {
            return that.currentEmergencyMap;
        }
    }
    /**
     * @description reduce the message box by x number of lines (on main map)
     * @param {*} num the number of lines to reduce the box by
     */
    ReduceMsgBox(num) {
        for (let index = 0; index < num; index++) {
            var BoxEndPos;
            var BoxStartPos;
            var TextBoxStart;
            var TextBoxEnd;
            var TextAreaStart;
            var TextAreaEnd;
            var lineNum = 0;
            this.currentMap.forEach(line => {
                if (line.includes("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓")) {
                    if (BoxStartPos) {
                        BoxEndPos = lineNum;
                    } else {
                        BoxStartPos = lineNum;
                    }
                } else if (line.includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒")) {
                    if (TextBoxStart) {
                        TextBoxEnd = lineNum;
                    } else {
                        TextBoxStart = lineNum;
                    }
                } else if (line.includes("║")) {
                    if (TextAreaStart) {
                        if (this.currentMap[lineNum + 1].includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒")) TextAreaEnd = lineNum;
                    } else {
                        TextAreaStart = lineNum;
                    }
                }
                lineNum++
            });


            this.currentMap = this.Replace(this.currentMap, 3, TextBoxEnd, "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓");
            this.currentMap = this.Replace(this.currentMap, 3, BoxEndPos, "░░░░░░░░░░░░░░░░░░░░░░");
            this.currentMap = this.Replace(this.currentMap, 4, TextBoxEnd - 1, "▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓");
        }
    }
    /**
     * @description extend the msg box by x line (on main map)
     * @param {*} num the number of lines to extend the msg box by
     */
    ExtendMsgBox(num) {
        for (let index = 0; index < num; index++) {
            var BoxEndPos;
            var BoxStartPos;
            var TextBoxStart;
            var TextBoxEnd;
            var TextAreaStart;
            var TextAreaEnd;
            var lineNum = 0;
            this.currentMap.forEach(line => {
                if (line.includes("▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓")) {
                    if (BoxStartPos) {
                        BoxEndPos = lineNum;
                    } else {
                        BoxStartPos = lineNum;
                    }
                } else if (line.includes("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒")) {
                    if (TextBoxStart) {
                        TextBoxEnd = lineNum;
                    } else {
                        TextBoxStart = lineNum;
                    }
                } else if (line.includes("║                  ║")) {
                    if (TextAreaStart) {
                        TextAreaEnd = lineNum;
                    } else {
                        TextAreaStart = lineNum;
                    }
                }
                lineNum++
            });


            this.currentMap = this.Replace(this.currentMap, 4, TextBoxEnd, "║                  ║▓▒");
            this.currentMap = this.Replace(this.currentMap, 4, BoxEndPos, "▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒");
            this.currentMap = this.Replace(this.currentMap, 3, BoxEndPos + 1, "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▒");
        }
    }
    /** @deprecated map is stored in array, thus y does not need to equal length of a line thus this function is unused */
    MapGetLengthOfLine(i) {
        var lines = this.BaseMap.split("\n")
        if (this.FileSys.Config.Verbose) console.log(lines[i].replace(/ /g, "▒").replace(/\n/g, "▒▒"))
        if (this.FileSys.Config.Verbose) console.log(lines[i].replace(/ /g, "▒").replace(/\n/g, "▒▒").length)
        return lines[i].replace(/ /g, "▒").replace(/\n/g, "▒▒").length + 1;
    }
}