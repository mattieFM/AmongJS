/**Amoung us costs  :( 
Programmer: Matt/AuthoredEntropy*/

const Config = require("../FileSys/Config.json");
const utility = require("../Utility/util");
const util = new utility();
module.exports.baseFileSys = class {
    TFQuestionNum = 0;
    PROMPT;
    constructor(){
        this.PROMPT = Config.BasePrompt;
    }
}
module.exports.fs = class FsController{
    FileSys;
    LoadFileSys(FileSystem){
        this.FileSys = FileSystem;
    }
    
    /**@description Current Jank solution to solve question logic */
    
    getMap() {
        return new map().BaseMap;
    }
/**
 * 
 * @param {*} args the arguments that modify the result of the command as listed below
 * >> @description By default the command will just save basic info (info contained in the class "baseFileSys")
 * >> "-a" saves all data to a file
 * >> "-p" saves ONLY playerData to a file
 * >> "-add more later"
 */
    async WriteFileSys(args){
        var allData = false;
        var PlayerDataOnly = false;
        args = args.split("-");
        args.forEach(arg => {
            arg.replace("-", "");
            switch (arg) {
                case "a":
                    allData = true;
                    break;
                case "a":
                    PlayerDataOnly = true;
                    break;
                default:
                    break;
            }
        });
        
        let WriteBaseFileSysPromise = new Promise(resolve => {
            this.fs.writeFile(Config.PATH + "\\FileSys\\BaseFileSystem.json", JSON.stringify(require("../Init").BaseFileSys), (err)=>{
              if(Config.Verbose)console.log("--FsController: baseFileSys has been written to a file")
              resolve(true);
            })
          })
        if(a){
            //write all file systems to file
        } else if(p){
            //write only playerData to file
        } else {
            await WriteBaseFileSysPromise;
        }
    }
    
}
module.exports.map = class map {
    StatusTypes = require("../Utility/Enum/StatusEnum")
    Statuses = {
        UpperEngine : this.StatusTypes.NORMAL,
        Reactor : this.StatusTypes.NORMAL,
        LowerEngine : this.StatusTypes.NORMAL,
        Security : this.StatusTypes.NORMAL,
        MedBay : this.StatusTypes.NORMAL,
        Electrical : this.StatusTypes.NORMAL,
        Storage_ : this.StatusTypes.NORMAL,
        Communication : this.StatusTypes.NORMAL,
        Shields : this.StatusTypes.NORMAL,
        Admin : this.StatusTypes.NORMAL,
        Cafe : this.StatusTypes.NORMAL,
        O2 : this.StatusTypes.NORMAL,
        Weapons : this.StatusTypes.NORMAL,
        Navigation : this.StatusTypes.NORMAL
    }
    
    BaseMap = require("../FileSys/BaseMap");
}