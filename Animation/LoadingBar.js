/*Amoung us costs  :( 
Programmer: Matt/AuthoredEntropy*/

const readline = require("readline");

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
            process.stdout.write("\x1b[?25l");
            process.stdout.write("[");
            this.cursor = 1;
            readline.cursorTo(process.stdout, this.cursor)
            for (let i = 0; i < this.size; i++) {
                process.stdout.write("-")
            }
            process.stdout.write("]");
            this.cursor = 1;
            readline.cursorTo(process.stdout, this.cursor)
            let i = 0;
            this.timer = setInterval(() => {
                i++
                process.stdout.write("=");
                this.cursor++;
                readline.cursorTo(process.stdout, this.size+2);
                process.stdout.write((100 * i) / this.size + "% " + Message)
                readline.cursorTo(process.stdout, this.cursor);
                if (this.cursor > this.size) {
                    clearInterval(this.timer);
                    process.stdout.write("\x1B[?25h")
                    resolve();
                }
            }, this.Delay)
        })
        
        
    }
}