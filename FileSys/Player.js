/*"#Program: A 
 #Program description:  
 #Programmer: Matthew Fuller
 #Course: CSC119-140
"*/
const Config = require("./Config.json")
module.exports.player = class { 
    Fill =" ";
    PreviousColType = " ";
    FileSys;
    /** @deprecated map is stored in array, thus y does not need to equal length of a line */
    CurrentPosIndex  = Config.SaveMapTruePos.Home
    /** @deprecated map is stored in array, thus y does not need to equal length of a line */
    CurrentFalseXPos = Config.SaveMapCordPair.Home.x
    /** @deprecated map is stored in array, thus y does not need to equal length of a line */
    CurrentFalseyPos = Config.SaveMapCordPair.Home.y
    PlayerColor = Config.PlayerIcon.red;
    y = 10;
    x = 99;
    IsTraitor = false
    

    /** @deprecated map is stored in array, thus y does not need to equal length of a line */
    setPosIndex(){
        function GetIndex(x,y) {
            return x+y
        }
        if(this.y)
        this.CurrentPosIndex = GetIndex(this.CurrentXPos, this.y)
        else {
            this.setTrueyPos();{
            this.CurrentPosIndex = GetIndex(this.CurrentXPos, this.y)
        }
        return;
    } 
    
}
    setPos(x,y){
    this.x = x;
    this.y = y;
    }

    constructor(){
    }
    LoadFileSys(FileSystem){
    this.FileSys = FileSystem;
    this.setPos(99,10);
    }
    /** @deprecated map is stored in array, thus y does not need to equal length of a line */
    setTruePos(){
        var Length = this.FileSys.map.MapGetLengthOfLine(1)
        this.y = this.CurrentFalseyPos * Length
        return;
    }
}