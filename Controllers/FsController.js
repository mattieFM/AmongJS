/**Amoung us costs  :( 
Programmer: Matt/AuthoredEntropy*/
const colors = require('colors/safe');
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
module.exports.map = class {
    
    constructor(){
        colors.setTheme({
            funny: 'rainbow',
            merica: "america",
            normal: 'green',
            tasks: 'yellow',
            emergency: 'red'
        });
    }
    currentMap;
    BaseMap = require("../FileSys/BaseMap");
    StatusTypes = require("../Utility/Enum/StatusEnum")
    Statuses = {
        "Upper Engine" : this.StatusTypes.NORMAL,
        "Reactors" : this.StatusTypes.NORMAL,
        "Lower Engine" : this.StatusTypes.NORMAL,
        Security : this.StatusTypes.NORMAL,
        MedBay : this.StatusTypes.NORMAL,
        Electrical : this.StatusTypes.NORMAL,
        "Storage" : this.StatusTypes.NORMAL,
        Communications : this.StatusTypes.NORMAL,
        Shields : this.StatusTypes.NORMAL,
        Admin : this.StatusTypes.NORMAL,
        Cafeteria : this.StatusTypes.NORMAL,
        O2 : this.StatusTypes.NORMAL,
        Weapons : this.StatusTypes.NORMAL,
        Navigation : this.StatusTypes.NORMAL
    }
    Names = {
        UpperEngine : "Upper Engine",
        Reactor : "Reactors",
        LowerEngine : "Lower Engine",
        Security : "Security",
        MedBay : "MedBay",
        Electrical : "Electrical",
        Storage_ : "Storage",
        Communications : "Communications",
        Shields : "Shields",
        Admin : "Admin",
        Cafe : "Cafeteria",
        O2 : "O2",
        Weapons : "Weapons",
        Navigation : "Navigation"
    }
    RandomizeMapStatuses(){
        var StatusArr = Object.keys(this.Statuses);
        return new Promise(resolve => {
            
            StatusArr.forEach(name => {
                switch (Math.floor((Math.random() * 3) +1)) {
                    case 1:
                        this.Statuses[name] = this.StatusTypes.NORMAL;
                        break;
                    case 2:
                        this.Statuses[name] = this.StatusTypes.TASKSAVAILABLE;
                        break;
                    case 3:
                        this.Statuses[name] = this.StatusTypes.EMERGENCY;
                        break;
                    default:
                        break;
                } 
            });
            resolve();
        })
        
    }
    UpdateMapStatuses(){
        if(!this.currentMap){this.currentMap = this.BaseMap}
        return new Promise(resolve => {
            var NamesArr = Object.values(this.Names);
            console.log(NamesArr);
            NamesArr.forEach(name => {
                if(name == "Lower-Engine"){console.log(name)}
            var status = this.Statuses[name];
            var coloredName = name;
            switch (status) {
                case "Sabotaged":
                    coloredName = colors.emergency(name);
                    break;
                case "TasksHere":
                    coloredName = colors.tasks(name);
                    break;
                case "Normal":
                    coloredName = colors.normal(name);
                    break;
                default:
                    break;
            }
            this.currentMap = this.currentMap.replace(name, coloredName);
        });
        resolve(this.currentMap)
        })
}
}