/*Amoung us costs  :( 
Programmer: Matt/AuthoredEntropy*/
const Config = require("../FileSys/Config.json");
module.exports.dots = function DotAnimateProgress(Delay) {
    return new Promise(resolve => {
        const readline = require("readline");
        const rl = readline.createInterface(process.stdin, process.stdout, this.completer)
        const amountOfDots = 3;
        
        rl.write("\x1B[?25l");
        process.stdout.write("\x1B[?25l");
         var timer = setInterval(() => {
         readline.cursorTo(process.stdout, 0);
         readline.cursorTo(rl, 0);
         i = (i + 1) % (amountOfDots + 1);
        
         
         if(r%2==0){
         var dots = new Array(i + 1).join(Config.VentIcon + " ");
         rl.write(message+ dots);
         }else{
         dots = new Array(i + 1).join(Config.PlayerIcon + " ");
         process.stdout.write(message+ dots);
         }
         if(i==3){
            r++;
         }
         if (r == rotations) {
            clearInterval(timer);
        
            readline.cursorTo(process.stdout, 0); 
            resolve();
        }
        }, delay);
    })
    
    
   }