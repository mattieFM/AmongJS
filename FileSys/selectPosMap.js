module.exports = {
    Upper_Engine: newPos("Upper_Engine", "Reactors", "Cafeteria","Cafeteria","Reactors"),
    Reactors: newPos("Reactors",null, "Security", "Upper_Engine","Lower_Engine"),
    Lower_Engine: newPos("Lower_Engine", "Reactors", "Storage","Reactors","Storage"),
    Security: newPos("Security", "Reactors", "MedBay","Upper_Engine","Lower_Engine"),
    MedBay: newPos("MedBay","Security","O2","Cafeteria","Storage"),
    Electrical: newPos("Electrical", "Storage","Admin","O2","Storage"),
    "Storage": newPos("Storage","Lower_Engine","Electrical","MedBay","Communications"),
    Communications: newPos("Communications","Storage","Shields",null,null),
    Shields: newPos("Shields","Storage","Navigation","Electrical","Communications"),
    Admin: newPos("Admin", "O2", "Navigation","Weapons","Shields"),
    Cafeteria: newPos("Cafeteria", "Upper_Engine","Weapons",null,null),
    O2: newPos("O2","MedBay","Admin","Weapons","Electrical"),
    Weapons: newPos("Weapons","Cafeteria",null,"Cafeteria","O2"),
    Navigation: newPos("Navigation","Admin",null,null,null)
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
function newPos(name,left,right,up,down){
    return {"name": name,"left":left,"right": right, "up": up,"down":down}
}