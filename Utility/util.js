const chalk = require("chalk");
let config = require("../FileSys/Config.json")
/*Among us costs  :( 
Programmer: Matt/AuthoredEntropy*/
module.exports = class util{
fileSys;
loadFileSys(filesys){
	this.fileSys = filesys;
}
Verbose = false;
wait(ms) {
	return new Promise(res => setTimeout(res, ms));
}
/**
 * 
 * @param {*} msg the msg to log to the console
 * @param {*} mode e: error l: logging w: warning p: pause
 * @param {*} wait the time to wait default 10000ms
 */
async log(msg, mode, wait = 10000){
	
	switch (mode) {
		case "e":
			if(config.Verbose){
			msg = "³" + msg;
			msg = chalk.redBright("ERROR: ")+chalk.red(msg)
			}else{msg = ""}
			break;
		case "l":
			if(config.Verbose){
			msg = "²" + msg;
			msg = chalk.greenBright("logging: ")+chalk.green(msg)
			}else{msg = ""}
			break;
		case "w":
			if(config.Verbose){
			msg = "¹" + msg;
			msg = chalk.yellowBright("WARN: ")+chalk.yellow(msg)
			}else{msg = ""}
			break;
		case "p":
			if(config.Verbose){
			msg = "²" + msg;
			this.fileSys.pause = true
			msg = chalk.greenBright("WARN: ")+chalk.green(msg)
			}else{msg = ""}
			break;
		default:
			break;
	}
	if(this.fileSys.emergency){
		this.fileSys.map.currentEmergencyMap[this.fileSys.map.currentEmergencyMap-1] = msg;
	}else{
		this.fileSys.map.currentMap[this.fileSys.map.currentMap.length-1] = msg;
	}
	if(mode =="p"){
		this.wait(wait)
		this.fileSys.pause = false
	}else{
		this.wait(wait)
		if(this.fileSys.emergency){
			this.fileSys.map.currentEmergencyMap[this.fileSys.map.currentEmergencyMap-1] = "";
		}else{
			this.fileSys.map.currentMap[this.fileSys.map.currentMap.length-1] = "";
		}
	}
	

}
}