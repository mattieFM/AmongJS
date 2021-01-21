    const stripAnsi = require('strip-ansi');
    const chalk = require('chalk');
    let xv = -2; let yv = 0;
    applePos = {x: 100, y:20};
    snakeBody =[
        { x: 95, y: 25 },
        { x: 97, y: 25 },
        { x: 99, y: 25 },
        { x: 101, y: 25 },
        { x: 103, y: 25 }];
    let score = 5;
    let msgLine = "use arrow keys to move, eat apples   GOAL:"
    const endLine = `══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════`
    const line = `║                                                                                                                                                                                                        ║`;
    const board = ["",endLine,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,endLine]
    let currentBoard = board;
    let gameHasStarted = false;
    let changingDirection = false;
    let gameHasEnded =false;
    let quit = false;
    //main();
  
    function writeAssembledMap(board){
        process.stdout.write("\x1b[?25l");
        var readline = require("readline");
        readline.cursorTo(process.stdout, 1, 1)
        process.stdout.write(board.join("\n"));
        process.stdout.write("\x1b[?25h");
    }
    module.exports.main = function main(goal,optMsg = msgLine) {
        board[0] = msgLine + " "+ goal
        quit = false;
        snakeBody =[
            { x: 95, y: 25 },
            { x: 97, y: 25 },
            { x: 99, y: 25 },
            { x: 101, y: 25 },
            { x: 103, y: 25 }];
        gameHasEnded = false;
        gameHasStarted = false;
        xv = -2;
        yv = 0;
        score = 5;
        return new Promise(resolve => {
            const readline = require('readline');
            readline.emitKeypressEvents(process.stdin);
            process.stdin.setRawMode(true);
    
            process.stdin.on('keypress', (str, key) => {
                if(key.name == "left" || key.name == "right" || key.name == "up" || key.name == "down"){
                changeDirection(key.name)
                }
            })
            let timer = setInterval(() => {
                if(score >= goal){
                    clearInterval(timer);
                    resolve("win")
                }
                if(quit == true){
                    clearInterval(timer);
                    resolve("cancel")
                }
                if (gameHasEnded && gameHasStarted) {playAgain(); return clearInterval(timer);}
                changingDirection = false;
                
                i =0;
                currentBoard.forEach(line => {
                    currentBoard[i] = stripAnsi(line);
                    i++
                });
                console.clear();
                currentBoard =  [endLine,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,line,endLine]
                if(gameHasStarted){
                    moveSnake();}
                drawSnake();
                drawApple(applePos);
                colorBoard();
                writeScore()
                writeAssembledMap(currentBoard);
            },1000 /10);
        })
    }
    function writeScore(){
        let space = "══════════════════════";
        let text = "score: " + score;
        while (text.length < space.length) {
            text += " ";
        }
        currentBoard[0] = currentBoard[0].replace(space, text)
    }
    function playAgain(){
        let prompt = require("prompt-sync")();;
        let yn =  prompt("would you like to play again? [y/n]:")
        if(yn == "y"){
            snakeBody =[
                { x: 95, y: 25 },
                { x: 97, y: 25 },
                { x: 99, y: 25 },
                { x: 101, y: 25 },
                { x: 103, y: 25 }];
            gameHasEnded = false;
            gameHasStarted = false;
            xv = -2;
            yv = 0;
            main();
        }else{
            quit = true;
        }
        
}
    function gameEnd(body, giveData = false) {
        let countedParts = body.reduce((accumulator, obj) => {
            if ("x" + obj.x + "y" + obj.y in accumulator) {
                accumulator["x" + obj.x + "y" + obj.y]++
            } else {
                accumulator["x" + obj.x + "y" + obj.y] = 1
            }
            return accumulator;
        }, {});
        if(!giveData){
        let values = Object.keys(countedParts).map(function (key) {
            return countedParts[key];
        });
        let result = values.some(el => el > 1)
        return result
        }else{
            return countedParts;
        }
    }

    function drawSnake() {
        snakeBody.forEach(drawSnakePart);
    }
    function Replace(Arr, x, y, Char){
        String.prototype.replaceAt = function(index, replacement) {
            return this.substr(0, x) + replacement + this.substr(index + replacement.length);
        }
        Arr[y] = Arr[y].replaceAt(x, Char)
        return Arr;
    }
    function drawSnakePart(snakePart) {
        Replace(currentBoard, snakePart.x,snakePart.y, "██")
 
    }
    function drawApple(applePos) {
        Replace(currentBoard, applePos.x,applePos.y, "▓▓")
    }
    function colorBoard(){
        let x =0;
        let i =0;
        currentBoard.forEach(line => {
            currentBoard[i] = line.replace((/█/g), chalk.green("█"))
            i++
        });
        i =0;
        currentBoard.forEach(line => {
            currentBoard[i] = line.replace((/▓▓/g), chalk.red("██"))
            i++
        });
    }
    function moveSnake() {
        const head = { x: snakeBody[0].x + xv, y: snakeBody[0].y + yv };
        if(head.x > line.length -2)head.x = 2;
        else if(head.x < 0)head.x = line.length -2
        else if(head.y > 30)head.y = 1
        else if(head.y < 1)head.y = 30
        if(gameEnd([head].concat(snakeBody))) return gameHasEnded = true;
        snakeBody.unshift(head);
        if(head.x == applePos.x && head.y == applePos.y || head.x == applePos.x+1 && head.y == applePos.y|| head.x == applePos.x-1 && head.y == applePos.y){
            let x = Math.floor(Math.random() *198)+1
            let y = Math.floor(Math.random() *29)+1;
            applePos = {"x":x,"y":y}
            score++
        }else{
        snakeBody.pop();
        }
        
        
    }
    function changeDirection(key) {
        if(!gameHasStarted) return gameHasStarted = true;
        if (changingDirection) return;
        changingDirection = true;
        const keyPressed = key;
        const goingLeft = -2 === xv;
        const goingRight = 2 === xv;
        const goingDown = -1 === yv;
        const goingUp = 1 === yv;
        switch (keyPressed) {
            case "left":
                if (goingRight || goingLeft) return;
                xv = -2;
                yv = 0;
                break;
            case "right":
                if (goingRight || goingLeft) return;
                xv = 2;
                yv = 0;
                break;
            case "up":
                if (goingUp || goingDown) return;
                yv = -1;
                xv = 0;
                break;
            case "down":
                if (goingUp || goingDown) return;
                yv = 1;
                xv = 0;
                break;
            default:
                break;
        }

    }