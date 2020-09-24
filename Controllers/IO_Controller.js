/*Amoung us costs $5 :( 
Programmer: Matt/AuthoredEntropy*/

  //Global imports
  const MSGs = require("../FileSys/Msg.json");
  const readline = require('readline');
module.exports.baseFileSys = class {
  TFQuestion;
  PROMPT;
}
/**
 * @description the class responsible for handling input output
 */
module.exports.IO = class IO_Controller{
  //imports
  FileSys;
  CommandController = require("./CommandController");
  TFCMDs = new this.CommandController.TF();
  CMDs = new this.CommandController.CMD();
  PROMPT;
  util = require('util')
  colors = require('colors') // npm install colors
  rl;
  LoadFileSys(FileSystem){
    this.FileSys = FileSystem;
    this.PROMPT =  FileSystem.BaseFileSys.PROMPT;
  }
  

/**
 * @description initalise all variables needed, then run the BasicGameStartCommand
 */
constructor(){
  //this.FileSys 
  this.rl = readline.createInterface(process.stdin, process.stdout, this.completer)
  this.rl.on('line', (cmd => {
    this.exec(cmd.trim())
  })).on('close', () =>{
    // only gets triggered by ^C or ^D
    console.log(MSGs.QuitMSG.green);
    process.exit(0);
  });
}
  completer(line) {
  var completions = '.help .error .exit .quit .q .map .tasks .CompTasks .NotCompTasks'.split(' ')
  var hits = completions.filter(function(c) {
    if (c.indexOf(line) == 0) {
      return c;
    }
  });
  return [hits && hits.length ? hits : completions, line];
}



prompt() {
    var arrow    = this.FileSys.BaseFileSys.PROMPT
      , length = arrow.length
      ;
    this.rl.setPrompt(arrow.gray, length);
    this.rl.prompt();
  }
  /**
 * @description handles all input controls and commands
 */
async exec(command) {
    //game goes here

    //we can write it eventually... :( ඞ 
    if (command == "y") {
      await this.TFCMDs.YesNo(true);
    } else if (command == "n"){
      await this.TFCMDs.YesNo(false);
    }
     else{
    CMDs.BaseCommandProcessor(command)
    }
    this.prompt();
  }

}


