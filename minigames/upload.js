const common = require("./common")
let sharedFunc = new common()

module.exports = function upload() {
    return new Promise(async resolve => {
        await sharedFunc.playFile("./minigames/download.txt", "UPLOADING FILES: ", 100);
        resolve("win")
    })
}
