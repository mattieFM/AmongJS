module.exports = {
    blue: newPos("blue", null, "brightBlue",null,"brightCyan"),
    brightBlue: newPos("brightBlue","blue", "cyan", null,"brightCyan"),
    cyan: newPos("cyan", "brightBlue", "brightBlue",null,"brightCyan"),
    brightCyan: newPos("brightCyan", null, "green","blue","megenta"),
    green: newPos("green","brightCyan","BrightGreen","blue","megenta"),
    BrightGreen: newPos("BrightGreen", "green",null,"blue","megenta"),
    "megenta": newPos("megenta",null,"BrightMegenta","brightCyan","brightYellow"),
    BrightMegenta: newPos("BrightMegenta","megenta","Yellow","brightCyan","brightYellow"),
    Yellow: newPos("Yellow","BrightMegenta",null,"brightCyan","brightYellow"),
    brightYellow: newPos("brightYellow", null, null,"megenta",null),
}
/**
 * @description return a dictionary containing the positions provided
 * @param {} left what is to the left
 * @param {*} right what is to the right
 * @param {*} up what is above
 * @param {*} down what is below
 * @param {*} name  name
 * @returns a dictionary
 */
function newPos(name,left,right,up,down,pos){
    return {"name": name,"left":left,"right": right, "up": up,"down":down}
}