let selected = 0;
let all = []
let Config = require("../FileSys/Config.json")
module.exports = function main() {
    return new Promise(resolve => {
        console.log("starting engine")
        generate()

        const readline = require("readline");
        let rl = readline.createInterface(process.stdin, process.stdout, this.completer)
        let timer = setInterval(() => {
            if(all[selected] == undefined){
                clearInterval(timer);
                resolve("win");
                return;
            }
            console.log("repeat after me: "+all[selected])
        }, 1000);
      process.stdin.on("keypress", (str, key) => {
            answer(key.name)
      });
    })
}
function generate(){
    all = [];
    for (let index = 0; index < Config.repeteLength; index++) {
        all.push(Math.floor(Math.random()*9)+1)
    }
}
function answer(key){
    let current = all[selected]
    if(parseInt(key) == current){selected ++}else{
        generate()
    }
}

