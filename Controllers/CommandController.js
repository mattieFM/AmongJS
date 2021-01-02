/**
 * Among us costs $5 guess I should make it myself :( 
 * ...and thus AmongJS was born
 * yes.. this is coded in javascript...
 * a browser based language
 * could I of used python.... yes....
 * did i? no
 * ...
 * instead i used node.js...
 * did i even use typescript...
 * nope
 * ....
 * ....
 * ... do I regret my decisions?...
 * only slightly.....
Programmer: Matt/AuthoredEntropy
*/
const util = require("../Utility/util")
const MSGs = require("../FileSys/Msg.json");
const Config = require("../FileSys/Config.json")
/**
 * @description The class containing all commands
 */
//const CMDThat = this;

module.exports.CMD = class {
    constructor(){
    }
    util = new util();             
    self = this;
    QuestionNum;
    FileSys;
    PROMPT;
    IOController;
    LoadFileSys(FileSystem){
    this.FileSys = FileSystem
    this.QuestionNum = this.FileSys.BaseFileSys.TFQuestionNum;
    this.PROMPT = this.FileSys.BaseFileSys.PROMPT;
    this.IOController = this.FileSys.IOController;
    this.util.loadFileSys(FileSystem)
    }
    /**@description The basic command processor, processing all commands sent to it, then sending them to more advanced handlers/emitting events */
     ArrowMoveMultiplier =1;
    BaseCommandProcessor(command){
        let started = this.FileSys.gameStarted;
        if(this.FileSys.pause) return;
        if (command[0] == ".") {
            
            var args = command.split(" ");
            switch (command.split(" ")[0].slice(1)) {
                case "help":
                    console.log(MSGs.AdvancedHelpMsg);
                        break;
                case "map":
                        this.FileSys.map.UpdateMapStatuses(this.FileSys.player_1);
                        break;
                case "updateMap":
                        this.FileSys.map.UpdateMapStatuses(this.FileSys.player_1);
                        break;
                case "randMap":
                        this.FileSys.map.RandomizeMapStatuses();
                        this.FileSys.map.UpdateMapStatuses(this.FileSys.player_1);
                        break;
                case "home":
                        this.FileSys.map.PlayerHome();
                        break;
                case "death":
                        this.FileSys.map.death(this.FileSys.player_1);
                        break;
                case "clear":
                    var clear = require('clear');
                    clear();
                        break;
                case "move":
                    this.FileSys.map.PlayerMove(this.FileSys.player_1, parseInt(args[1]), parseInt(args[2]));
                        break;
                case "resetMap":
                            this.FileSys.map.reset()
                        break;
                case "deColorMap":
                            this.FileSys.map.StripAnsi();
                        break;
                case "changeArrowMoveAmount":
                        this.ArrowMoveMultiplier = parseInt(args[1]);
                    break;
                case "w":
                    this.FileSys.map.RelativePlayerMove(this.FileSys.player_1, 0, -1 * Multiplier);
                    break;
                case "a":
                    this.FileSys.map.RelativePlayerMove(this.FileSys.player_1, -1 * Multiplier, 0 );
                    break;
                case "d":
                    this.FileSys.map.RelativePlayerMove(this.FileSys.player_1, 1 * Multiplier, 0);
                    break;
                case "s":
                    this.FileSys.map.RelativePlayerMove(this.FileSys.player_1, 0, 1 * Multiplier);
                    break;
                case "q":
                    this.FileSys.map.miniGame();
                    break;
                    case "up":
                    this.FileSys.map.RelativePlayerMove(this.FileSys.player_1, 0, -1 * this.ArrowMoveMultiplier);
                    break;
                case "x":
                    if(this.FileSys.player_1.IsTraitor & !this.FileSys.ventMapActive & started)
                    this.FileSys.map.activateSabotageSelector();
                    break;
                case "c":
                    if(this.FileSys.player_1.IsTraitor && !this.FileSys.sabotageMapActive & started)
                    this.FileSys.map.activateVentMapSelector();
                    break;
                case "e":
                    if(Config.emergencyMeetingsPerGamePerPlayer > this.FileSys.player_1.emergencyMeetingsCalled & started & this.FileSys.TickCount >= this.FileSys.player_1.emergencyCoolDown & this.FileSys.word == "Cafeteria" & !this.FileSys.sabotageActive){
                    
                    this.FileSys.SendReportToServer(this.FileSys.player_1, null);
                    this.FileSys.player_1.emergencyMeetingsCalled++;
                    this.FileSys.player_1.emergencyCoolDown + this.FileSys.Config.emergencyCoolDown;
                    }
                    break;
                case "warp":
                    this.FileSys.map.activateVentMapSelector()
                    break;
                case "left":
                    this.FileSys.map.RelativePlayerMove(this.FileSys.player_1, -1 * this.ArrowMoveMultiplier, 0 );
                    break;
                case "right":
                    this.FileSys.map.RelativePlayerMove(this.FileSys.player_1, 1 * this.ArrowMoveMultiplier, 0);
                    break;
                case "down":
                    this.FileSys.map.RelativePlayerMove(this.FileSys.player_1, 0, 1 * this.ArrowMoveMultiplier);
                    break;
                case "msg":
                    args = command.split(",");
                    var msgArr2 = args.slice(1);
                    this.FileSys.map.DisplayMsg(msgArr2, this.FileSys.player_1);
                    break;
                case "shift":
                    //sabatoge
                    break;
                case "k":
                    this.FileSys.map.KillPlayerWithinRange(this.FileSys.player_1);
                    break;
                case "r":
                    this.FileSys.map.ReportBodyWithinRange(this.FileSys.player_1);
                    break;
                case "stopEme":
                    this.FileSys.map.stopEmergency();
                    break;
                case "pause":
                    if(this.FileSys.pause == true){
                        this.FileSys.pause = false 
                    } else{
                        this.FileSys.pause = true
                    }
                    break;
                
                case "longMsg":
                    let msgArr =[]
                    args.forEach(arg => {
                        if(arg != args[0]){
                            msgArr.push(arg)
                        }
                    });
                    this.FileSys.map.updateEmergencyMap(msgArr, msgArr)
                    break;
                case "shortMsg":
                    let msgArr12 =[]
                    args.forEach(arg => {
                        if(arg != args[0]){
                            msgArr12.push(arg)
                        }
                    });
                    this.FileSys.map.EmergencySmallDisplay(msgArr12);
                    break;
                
                case "sendMsg":
                    let msgArr13 =[]
                    args.forEach(arg => {
                        if(arg != args[0]){
                            msgArr13.push(arg)
                        }
                    });
                    this.FileSys.sendMsg(msgArr13.join(" "))
                    break;
                    
                    default: 
                if(!this.FileSys.emergency){
                console.log(('\'' + command  + '\' is not a command dude, sorryz').yellow);
                }
                        break;
                    
            }
            
        } else {
            // only print if they typed something
            if (command !== '' && !this.FileSys.emergency) {
            console.log(('\'' + command  + '\' is not a command dude, sorryz (type \".help\" for all commands)').yellow);
            }
        }
    }
    

    /**
     * @deprecated added in early deveolopment, probably shouldn't be used
     * @description Simple Welcome Message (starts the game) */
    async BasicGameStart() {
    var msgArr = MSGs.WelcomeMsg.split("\n")
    for (let i = 0; i < msgArr.length; i++) {
        const element = msgArr[i];
        console.log(element.gray);
        await this.FileSys.util.wait(100);
    }
    
    this.QuestionNum = 1;
    this.UpdatePrompt('[y/n]:'.grey);
    this.IOController.prompt();
    this.UpdatePrompt('> '.grey);
}

    UpdatePrompt(newPrompt) {
    this.FileSys.BaseFileSys.PROMPT = newPrompt;
}
/**@deprecated added in early development don't use this */
async YesNo(bool) {
    const dots = require("../Animation/Dots").dots;
    const readline = require("readline");
    var LoadBar_1 = require("../Animation/LoadingBar");
    var LoadBar = new LoadBar_1(20);
    switch (this.QuestionNum) {
        case 1:
            if(bool){
                this.QuestionNum = 0;
                var msgArr = MSGs.BasicHelpMsg.split("\n")
                for (let i = 0; i < msgArr.length; i++) {
                const element = msgArr[i];
                console.log(element.gray);
                await this.FileSys.util.wait(100);
    }
                await dots("Loading ", 7, 100);
                readline.cursorTo(process.stdout, 0); 
                await LoadBar.Start("Loaded");
                //await that.FileSys.util.wait(1000);
                this.QuestionNum++
                readline.cursorTo(process.stdout, 100);  
                process.stdout.write("\n")
                readline.cursorTo(process.stdout, 0); 
                } else{
                    console.log('Press \"Ctrl+All+f4\" for hacks'.green);
                    await this.FileSys.util.wait(100);
                    process.exit();
                }
            break;
        case 0:
            if(bool){
                console.log("I didn't ask any true or false question, you table!".toLocaleUpperCase().red);
            } else {
                console.log("M8, I didn't ask a question".toLocaleLowerCase().yellow);
            }
            break;
        default:
            break;
    }
    this.QuestionNum = 0;
}
}
