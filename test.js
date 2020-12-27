const chalk = require('chalk');
async function renderTaskComp(delay, file){
    console.clear();
    const fs = require("fs")
    let data = fs.readFileSync(file)
        var FrameArr = JSON.parse(data);
        let i =0;
        let timer = setInterval(() => {
            process.stdout.write("\x1b[?25l");
            var readline = require("readline");
            readline.cursorTo(process.stdout, 1, 1)
            let frame = FrameArr[i];
            for (var x = 0; x < frame.length; x++) {
                let char =frame.charAt(x)
                if(char != "(" && char != "\n"){
                    fram.replace(char, chalk.green(char))
                }
            }
            process.stdout.write(frame);
            process.stdout.write("\x1b[?25h");
            if(i+1 >= FrameArr.length){
                clearInterval(timer)
                return data;
            }
            i++


        }, delay);
        
      
        
        
  
    
}
renderTaskComp(1000/40, "./taskCompeted.txt")