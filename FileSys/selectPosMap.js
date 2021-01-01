module.exports = {
    Upper_Engine: newPos("Upper_Engine", "Reactors", "Cafeteria","Cafeteria","Reactors", {"x":48,"y":13}),
    Reactors: newPos("Reactors",null, "Security", "Upper_Engine","Lower_Engine", {"x":36,"y":24}),
    Lower_Engine: newPos("Lower_Engine", "Reactors", "Storage","Reactors","Storage",{"x":49,"y":37}),
    Security: newPos("Security", "Reactors", "MedBay","Upper_Engine","Lower_Engine",{"x":58,"y":24}),
    MedBay: newPos("MedBay","Security","O2","Cafeteria","Storage",{"x":72,"y":22}),
    Electrical: newPos("Electrical", "Storage","Admin","O2","Storage",{"x":112,"y":32}),
    "Storage": newPos("Storage","Lower_Engine","Electrical","MedBay","Communications",{"x":82,"y":39}),
    Communications: newPos("Communications","Storage","Shields",null,null,{"x":105,"y":47}),
    Shields: newPos("Shields","Storage","Navigation","Electrical","Communications",{"x":133,"y":41}),
    Admin: newPos("Admin", "O2", "Navigation","Weapons","Shields",{"x":133,"y":26}),
    Cafeteria: newPos("Cafeteria", "Upper_Engine","Weapons",null,null,{"x":100,"y":7}),
    O2: newPos("O2","MedBay","Admin","Weapons","Electrical",{"x":127,"y":21}),
    Weapons: newPos("Weapons","Cafeteria",null,"Cafeteria","O2",{"x":131,"y":12}),
    Navigation: newPos("Navigation","Admin",null,null,null,{"x":162,"y":29})
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
    return {"name": name,"left":left,"right": right, "up": up,"down":down, "pos": pos}
}