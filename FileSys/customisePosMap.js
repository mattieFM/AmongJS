module.exports = {
    change_hat: newPos("change_hat", "SNAKE", "change_color"),
    change_color: newPos("change_color","change_hat", "change_username"),
    change_username: newPos("change_username","change_color", "SNAKE"),
    SNAKE: newPos("SNAKE","change_username", "change_hat")
}
/**
 * @description return a dictionary containing the positions provided
 * @param {*} up what is above
 * @param {*} down what is below
 * @param {*} name  name
 * @returns a dictionary
 */
function newPos(name,up,down){
    return {"name": name,"left":null,"right": null, "up": up,"down":down}
}