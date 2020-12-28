/*
 #Programmer: Matt /AuthoredEntropy
*/
/**
 * the config file
 */
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
    /**@description the previous color of a corpse this will be null unless this is a corpse */
    PreviousColor;
    /**@description i got no clue what this is for */
    displayMsg;
    /**@description the current render icon of the player (the player icon with ansi color code) */
    PlayerColor = Config.PlayerIcon.red;
    /**@description the unquie id of the player */
    PlayerID;
    /**@description weather the player has voted */
    HasVoted = false;
    /**@description weather the player should be rendered */
    isRendered = true;
    /**@description if the player is a ghost */
    isGhost = false;
    /**@description if the player has gas as it relates to the feul tasks */
    hasGas = false;
    /**@description if the player has feuled the upper engine */
    fueledUpper = false;
    /**@description if the fix electrical quest is active */
    fixElecQuestActive = false
    /**@description if the start engine quest is active */
    startEngineQuestActive = false;
    /**@description if the lower engine has been feuled by the player */
    fueledLower = false;
    /**@description if the gas quest is active */
    gasQuestActive = false;
    /**@description if the player has the data for the upload quest */
    hasData = false;
    /**@description if the upload quest is active */
    uploadTaskActive = false;
    /**@description all completed tasks */
    compTasks = [];
    /**@description if the snake quest is active */
    snake = false;
    /**@description the last quest that was completed by the player */
    lastTask = null;
    /**@description if the player has finished all tasks */
    tasksCompleted = false;
    /**@description the next turn that the imposter can kill */
    nextKillTurn = 0;
    /**@description the total number of emergency meetings this player has called */
    emergencyMeetingsCalled = 0;
    /**@description the next turn an emergency meeting can be called */
    emergencyCoolDown =0;
    /**@description the y cord of the player */
    y = Config.SaveMapCordPair.Home.y;
    /**@description the x cord of the player */
    x = Config.SaveMapCordPair.Home.x;
    /**@description if the player is a traitor */
    IsTraitor = false
    /**@description the current tick of the game */
    currentGameTick = 0;
    /**@description the total moves a player can make in one turn */
    MovesPerTurn = Config.MovesPerTurn;
    /**@description the total moves taken this turn */
    MovesThisTurn = 0;
    /**@description the charector this player has been replaced with when rendering DO NOT TOUCH */
    ReplacedChar;
    /**@description  stop the player from moving*/
    moveOverride;
    /**@description if the player is dead */
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
