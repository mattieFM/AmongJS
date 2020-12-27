const common = require("./common")
let sharedFunc = new common()


module.exports = function runDownload() {
    return new Promise(async resolve => {
        await sharedFunc.playFile("./minigames/download.txt", "DOWNLOADING FILES: ");
        resolve("win")
    })
}
