
/*Amoung us costs $5 :( 
Programmer: Matt/AuthoredEntropy*/
const MSGs = require("../FileSys/Msg.json");
const Config = require("../FileSys/Config.json");
/**
 * @description The class containing all commands
 */
module.exports.CMD = class CommandController{
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
        if (command[0] = ".") {
            switch (command.slice(1)) {
                case "help":
                    console.log(MSGs.AdvancedHelpMsg);
                    break;
                case "map":
                    console.log(getMap())
            
                default:
                    break;
            }
        } else {
            // only print if they typed something
            if (command !== '') {
            console.log(('\'' + command  + '\' is not a command dude, sorryz').yellow);
            }
        }
    }
    

    /**@description Simple Welcome Message (starts the game) */
    BasicGameStart() {
    console.log(MSGs.WelcomeMsg.grey);
    this.QuestionNum = 0;
    this.UpdatePrompt('[y/n]:'.grey);
    this.IOController.prompt();
    this.UpdatePrompt('> '.grey);
}

    UpdatePrompt(newPrompt) {
    this.FileSys.BaseFileSys.PROMPT = newPrompt;
}
}
/**
 * @description True / False command controller
 */

var that = this;
module.exports.TF = class TFController{
    QuestionNum;
    FileSys;
    LoadFileSys(FileSystem){
        this
    that.FileSys = FileSystem
    that.QuestionNum = that.FileSys.BaseFileSys.TFQuestionNum;
    }

    constructor(){
        
    }
    
    
    async YesNo(bool) {
        const dots = require("../Animation/Dots").dots;
        const readline = require("readline");
        var LoadBar_1 = require("../Animation/LoadingBar");
        var LoadBar = new LoadBar_1(20);
        switch (that.QuestionNum) {
            case 0:
                if(bool){
                    console.log(MSGs.BasicHelpMsg);
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
                        await that.FileSys.util.wait(100);
                        process.exit();
                    }
                break;
        
            default:
                break;
        }
    }
    }
    
    