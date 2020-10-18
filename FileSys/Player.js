/*"#Program: A 
 #Program description:  
 #Programmer: Matthew Fuller
 #Course: CSC119-140
"*/
const Config = require("./Config.json")
module.exports.player = class { 
    Fill =" ";
    PreviousColType = " ";
    /** @deprecated map is stored in array, thus y does not need to equal length of a line */
    CurrentPosIndex  = Config.SaveMapTruePos.Home
    /** @deprecated map is stored in array, thus y does not need to equal length of a line */
    CurrentFalseXPos = Config.SaveMapCordPair.Home.x
    /** @deprecated map is stored in array, thus y does not need to equal length of a line */
    CurrentFalseyPos = Config.SaveMapCordPair.Home.y
    PlayerColor = Config.PlayerIcon.red;
    PlayerID;
    y = Config.SaveMapCordPair.Home.y;
    x = Config.SaveMapCordPair.Home.x;
    IsTraitor = false
    currentGameTick = 0;
    MovesPerTurn = Config.MovesPerTurn;
    MovesThisTurn = 0;
    ReplacedChar;
    IsDead = false;
    

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
    this.setPos(99,10);
    }
    
    CanMove(tickCount, NumOfSpaces){
        var canMove = true;
        if(tickCount == this.currentGameTick){
            if(this.MovesThisTurn >= this.MovesPerTurn){
                canMove = false;
            } else {
                if(Math.abs(this.MovesThisTurn + NumOfSpaces) <= this.MovesPerTurn){
                this.MovesThisTurn += NumOfSpaces;
                }else{
                    canMove = false;
                }
            }
        } else {
            this.currentGameTick = tickCount;
            this.MovesThisTurn = 0;
            return this.CanMove(tickCount, NumOfSpaces);
        }
        return canMove
    }
}
