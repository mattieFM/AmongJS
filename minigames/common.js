let Config = require("../FileSys/Config.json")
module.exports = class{
    writeAssembledMap(board){
        process.stdout.write("\x1b[?25l");
        var readline = require("readline");
        readline.cursorTo(process.stdout, 1, 1)
        process.stdout.write(board.join("\n"));
        process.stdout.write("\x1b[?25h");
    }
    async playFile(filePath, addatEnd = "", endFrame=false){
        const amountOfDots = 50;
        let i = 0;
        let r = 0;
        return new Promise(resolve => {
            var fs = require("fs");
        
        fs.readFile(filePath, (err, data) => {
        if (err) throw err;
        var FrameArr = JSON.parse(data);
        let index = 0;
        let length = FrameArr.length;
        if(endFrame != false){
            length -= endFrame
        }
        let timer = setInterval(() => {
            i = (i + 1) % (amountOfDots + 1);
            const frame = FrameArr[index];
            
            process.stdout.write("\x1b[?25l");
            var readline = require("readline");
            readline.cursorTo(process.stdout, 1, 1)
         
         if(r%2==0){
         var dots = new Array(i + 1).join(Config.VentIcon + " ");
         process.stdout.write(frame+ addatEnd+ dots);
         }else{
         dots = new Array(i + 1).join(Config.PlayerIcon + " ");
         process.stdout.write(frame+ addatEnd + dots);
         }
         if(i==50){
            r++;
         }

            process.stdout.write("\x1b[?25h");

            if(index == length-1){
                clearInterval(timer);
                resolve();
            }else{
                index++
            }
        }, 50);
        
        });
        })
        
    
}

}
