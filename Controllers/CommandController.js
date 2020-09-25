
/*Amoung us costs $5 :( 
Programmer: Matt/AuthoredEntropy*/
const MSGs = require("../FileSys/Msg.json");
const Config = require("../FileSys/Config.json");
/**
 * @description The class containing all commands
 */
//const CMDThat = this;

module.exports.CMD = class {
    constructor(){
    }
    
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
    }
    /**@description The basic command processor, processing all commands sent to it, then sending them to more advanced handlers/emitting events */
    
    BaseCommandProcessor(command){
        if (command[0] == ".") {
            var args = command.split(" ");
            switch (command.split(" ")[0].slice(1)) {
                case "help":
                    console.log(MSGs.AdvancedHelpMsg);
                        break;
                case "map":
                        this.FileSys.map.UpdateMapStatuses();
                        break;
                case "updateMap":
                        this.FileSys.map.UpdateMapStatuses();
                        break;
                case "randMap":
                        this.FileSys.map.RandomizeMapStatuses();
                        this.FileSys.map.UpdateMapStatuses();
                        break;
                case "home":
                        this.FileSys.map.PlayerHome();
                        break;
                case "clear":
                    var clear = require('clear');
                    clear();
                        break;
                case "move":
                    this.FileSys.map.PlayerMove(this.FileSys.player_1, parseInt(args[1]), parseInt(args[2]));
                        break;
                case "absoluteMove":
                        
                        this.FileSys.map.TruePlayerMove(parseInt(args[1]));
                        break;
                case "resetMap":
                            this.FileSys.map.reset()
                        break;
                case "deColorMap":
                            this.FileSys.map.deColorMap();
                        break;
                case "deColorPlayer":
                            this.FileSys.map.DeColorPlayer(this.FileSys.player_1);
                        break;
                case "w":
                    var Multiplier = 1;
                    if(parseInt(args[1])){
                        Multiplier = parseInt(args[1])
                    }
                    this.FileSys.map.RelativePlayerMove(this.FileSys.player_1, 0, -1 * Multiplier);
                    break;
                case "a":
                    var Multiplier = 1;
                    if(parseInt(args[1])){
                        Multiplier = parseInt(args[1])
                    }
                    this.FileSys.map.RelativePlayerMove(this.FileSys.player_1, -1 * Multiplier, 0 );
                    break;
                case "d":
                    var Multiplier = 1;
                    if(parseInt(args[1])){
                        Multiplier = parseInt(args[1])
                    }
                    this.FileSys.map.RelativePlayerMove(this.FileSys.player_1, 1 * Multiplier, 0);
                    break;
                case "s":
                    var Multiplier = 1;
                    if(parseInt(args[1])){
                        Multiplier = parseInt(args[1])
                    }
                    this.FileSys.map.RelativePlayerMove(this.FileSys.player_1, 0, 1 * Multiplier);
                    break;
                default: console.log(('\'' + command  + '\' is not a command dude, sorryz').yellow);
                        break;
                
                    
            }
            
        } else {
            // only print if they typed something
            if (command !== '') {
            console.log(('\'' + command  + '\' is not a command dude, sorryz (type \".help\" for all commands)').yellow);
            }
        }
    }
    

    /**@description Simple Welcome Message (starts the game) */
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
    
        default:
            break;
    }
    this.QuestionNum = 0;
}
}

// /**
//  * @description True / False command controller
//  */

// var that = this;
// module.exports.TF = class TFController{
//     QuestionNum;
//     FileSys;
//     LoadFileSys(FileSystem){
//         this
//     that.FileSys = FileSystem
//     that.QuestionNum = that.FileSys.BaseFileSys.TFQuestionNum;
//     }

//     constructor(){
        
//     }
    
    
    
    // }
    
    