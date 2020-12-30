 let chalk = require("chalk")
 const map  = require("./FileSys/SabatageMap").split("\n");
 let hi = class hello{
    sabotageMap = require("./FileSys/SabatageMap").split("\n");
    getBoxCords(xOrigin,yOrigin,xLen,yLen){
        let cords = [];
        let x = xOrigin
        let y = yOrigin
        for (let i = 0; i < xLen; i++) {
            cords.push({"x": x+(i), "y": y-(yLen/2)})
            cords.push({"x": x+(i), "y": y+(yLen/2)})
            cords.push({"x": x+(i+1), "y": y+(yLen/2)})
        }
        for (let z = 0; z < yLen; z++) {
            cords.push({"x": x, "y": (y-(yLen/2))+z})
            cords.push({"x": x+xLen, "y": (y-(yLen/2))+z})
        }
        return cords;
    }
    checkMapForText(map, text){
        return new Promise(resolve => {
            let object = false;
            map.forEach(line => {
                if(line.includes(text)){
                    object = map.indexOf(line);
                }
            });
            resolve(object)
        })
        
    }
    Replace(Arr, x, y, Char) {
        String.prototype.replaceAt = function (index, replacement) {
            return this.substr(0, x) + replacement + this.substr(index + replacement.length);
        }
        Arr[y] = Arr[y].replaceAt(x, Char)
        return Arr;
    }
    async renderBoxAroundText(text){
        let indexOfText =await this.checkMapForText(this.sabotageMap,text)
        if(indexOfText){
            let line = this.sabotageMap[indexOfText];
            let wordStart = parseInt(line.indexOf(text));
            let wordEnd = wordStart + text.length;
            let boxCords = this.getBoxCords(wordStart-3, indexOfText, text.length+6, 6)
            boxCords.forEach(cord=>{
                console.log(cord)
                let x= cord.x;
                let y = cord.y;
                this.Replace(this.sabotageMap,x,y,"█")
            })
            
            console.log(this.sabotageMap)
        }
    }
 }

 let inst = new hi();
 inst.renderBoxAroundText("Upper_Engine")
