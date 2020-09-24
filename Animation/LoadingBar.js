/*Amoung us costs  :( 
Programmer: Matt/AuthoredEntropy*/

const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout, this.completer)
module.exports = class loadingBar {
    timer;
    size;
    Delay;
    cursor;
    constructor (size){
        this.size = size;
        this.cursor = 0;
        this.Delay = 100;
    }
    Update(newSize , newDelay){
        this.size = newSize;
        this.Delay = newDelay
    }
    Start(Message){
        return new Promise(resolve => {
            rl.write("\x1b[?25l");
            rl.write("[");
            this.cursor = 1;
            readline.cursorTo(rl, this.cursor)
            for (let i = 0; i < this.size; i++) {
                rl.write("-")
            }
            rl.write("]");
            this.cursor = 1;
            readline.cursorTo(rl, this.cursor)
            let i = 0;
            this.timer = setInterval(() => {
                i++
                rl.write("=");
                this.cursor++;
                readline.cursorTo(rl, this.size+2);
                rl.write((100 * i) / this.size + "% " + Message)
                readline.cursorTo(rl, this.cursor);
                if (this.cursor > this.size) {
                    clearInterval(this.timer);
                    rl.write("\x1B[?25h")
                    resolve();
                }
            }, this.Delay)
        })
        
        
    }
}