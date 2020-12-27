
module.exports = class {

    writeAssembledMap(board){
        process.stdout.write("\x1b[?25l");
        var readline = require("readline");
        readline.cursorTo(process.stdout, 1, 1)
        process.stdout.write(board.join("\n"));
        process.stdout.write("\x1b[?25h");
    }
    
    writeScore(){
        let space = "══════════════════════";
        let text = "score: " + score;
        while (text.length < space.length) {
            text += " ";
        }
        currentBoard[0] = currentBoard[0].replace(space, text)
    }
    playAgain(){
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

    
    drawSnake() {
        snakeBody.forEach(drawSnakePart);
    }
    Replace(Arr, x, y, Char){
        String.prototype.replaceAt = function(index, replacement) {
            return this.substr(0, x) + replacement + this.substr(index + replacement.length);
        }
        Arr[y] = Arr[y].replaceAt(x, Char)
        return Arr;
    }
    drawSnakePart(snakePart) {
        Replace(currentBoard, snakePart.x,snakePart.y, "██")
    
    }
    drawApple(applePos) {
        Replace(currentBoard, applePos.x,applePos.y, "▓▓")
    }
    colorBoard(){
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
    moveSnake() {
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
    changeDirection(key) {
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
}

