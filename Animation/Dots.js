/*Amoung us costs  :( 
Programmer: Matt/AuthoredEntropy*/
const Config = require("../FileSys/Config.json");
module.exports.dots = function DotAnimateProgress(message, rotations, waitTime) {
    return new Promise(resolve => {
        const readline = require("readline");
        
        const amountOfDots = 3;
        let i = 0;
        let r = 0;
        
        process.stdout.write("\x1B[?25l")
         var timer = setInterval(() => {
         readline.cursorTo(process.stdout, 0);
        
         i = (i + 1) % (amountOfDots + 1);
        
         
         if(r%2==0){
         var dots = new Array(i + 1).join(Config.VentIcon + " ");
         process.stdout.write(message+ dots);
         }else{
         dots = new Array(i + 1).join(Config.PlayerIcon + " ");
         process.stdout.write(message+ dots);
         }
         if(i==3){
            r++;
         }
         if (r == rotations) {
            clearInterval(timer);
            process.stdout.write("\x1B[?25h")
            readline.cursorTo(process.stdout, 0); 
            resolve();
        }
        }, waitTime);
    })
    
    
   }