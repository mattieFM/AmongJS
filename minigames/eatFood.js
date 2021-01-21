/**
 * @description make num number of sandwiches then resolve
 * @param {*} num the number of sandwiches to make
 * @returns a promise that resolves when the mini-game completes
 */
function startMiniGame(num) {
    return new Promise(resolve => {
        
    })
}

async function audioTest() {
    const sound = require("sound-play");
    sound.play("test.mp3").then((response) => console.log("done"));
}

audioTest() 



// let prompt = require("prompt-sync")()
// prompt("hi")