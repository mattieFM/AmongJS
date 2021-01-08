const stripAnsi = require("strip-ansi");
const chalk = require("chalk");
const { resolve } = require("path");
let xv = 2;
let yv = 0;
let x = 180;
let y2 = Math.floor(Math.random() * 4) * 5 + 2;
applePos = { x: x, y: y2 };
let y = Math.floor(Math.random() * 4) * 5 + 2;
let allWires = [];
let snakeBody = [
  { x: 28, y: y },
  { x: 26, y: y },
  { x: 24, y: y },
  { x: 22, y: y },
  { x: 20, y: y },
];
let score = 0;
const endLine = `══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════`;
const line = `║                                                                                                                                                                                                        ║`;
const board = [
  endLine,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  line,
  endLine,
];
let currentBoard = board;
let gameHasStarted = false;
let changingDirection = false;
let gameHasEnded = false;
let quit = false;
//main();
const wires = generateWires();

let workingWires = JSON.parse(JSON.stringify(wires))

function writeAssembledMap(board) {
  process.stdout.write("\x1b[?25l");
  var readline = require("readline");
  readline.cursorTo(process.stdout, 1, 1);
  process.stdout.write(board.join("\n"));
  process.stdout.write("\x1b[?25h");
}
let msg = ""
let shouldDraw = true;
let timer


let trueEnd = false;

module.exports = async function main() {
  msg="use the up and down arrows to select the wire then press \"q\" to start"
  quit = false;
  
  gameHasEnded = false;
  gameHasStarted = false;
  xv = 2;
  yv = 0;
  const readline = require("readline");
  let rl = readline.createInterface(process.stdin, process.stdout, this.completer)
  process.stdin.on("keypress", (str, key) => {
    if (
      key.name == "left" ||
      key.name == "right" ||
      key.name == "up" ||
      key.name == "down" ||
      key.name =="q"
    ) {
      changeDirection(key.name);
    }
  });
  
  
    return new Promise(resolve => {
      timer = setInterval(() => {
        let goal = 4;
        //resolve(score =4)
        if (gameHasEnded && gameHasStarted && !trueEnd) {
          playAgain(); 
        }
        changingDirection = false;
  
        i = 0;
        currentBoard.forEach((line) => {
          currentBoard[i] = stripAnsi(line);
          i++;
        });
        currentBoard = [
          endLine,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          line,
          endLine,
        ];
        if(!trueEnd){
        if (gameHasStarted) {
          moveSnake();
        }
        if(shouldDraw){
          renderSelect()
        }else{
          drawSnake();
        }
          
        renderAllWires(wires);
        colorBoard();
        writeScore(msg);
        writeAssembledMap(currentBoard);
      }
      if (score >= goal) {
        clearInterval(timer);
        trueEnd = true;
        resolve("win");
      }
      if (quit == true) {
        clearInterval(timer);
        resolve("cancel");
      }
      }, 1000/30);
    });
    
}
let selected = 0
function renderSelect(){
  
  if(workingWires[0].length == 0){
    shouldDraw = false
    gameHasStarted = true;
    return("END")
  }
  let x = workingWires[0][selected].x-4;
  let y = workingWires[0][selected].y;
  let selectBody=getBoxCords(x,y,6,3)
  
  selectBody.forEach(drawSnakePart);
}
function getBoxCords(xOrigin,yOrigin,xLen,yLen){
  let cords = [];
  let x = xOrigin
  let y = yOrigin
  for (let i = 0; i < xLen; i++) {
      cords.push({"x": x+(i*2), "y": y-2})
      cords.push({"x": x+(i*2), "y": y+2})
  }
  for (let z = 0; z < yLen; z++) {
      cords.push({"x": x, "y": (y-1)+z})
      cords.push({"x": x+10, "y": (y-1)+z})
  }
  return cords;
}
function writeScore(msg) {
  let space = "══════════════════════════════════════════════════════════════════════════";
  let text = msg
  while (text.length < space.length) {
    text += "═";
  }
  currentBoard[0] = currentBoard[0].replace(space, text);
}
function select(key) {
  renderAllWires(wires);
  colorBoard();
  msg="use the up and down arrows to select the wire then press \"q\" to start"
  
  if(key == "q"){
    shouldDraw= false;
    msg="use the arrow keys and connect the wire"
    let y = workingWires[0][selected].y
  snakeBody = [
    { x: 28, y: y },
    { x: 26, y: y },
    { x: 24, y: y },
    { x: 22, y: y },
    { x: 20, y: y },
  ];
    gameHasStarted = true;
  }else if(key == "up"){
    if(selected > 0){
      selected--;
    }
  }else if(key == "down"){
    if(selected < workingWires[0].length-1){
      selected++;
    }
  }
}
function generateWires() {
  let leftWires = [];
  let rightWires = [];
  let rand = Math.floor(Math.random()*4)+1
    let nums = []
    nums.push(rand)
    let shouldExit = false
    while(!shouldExit){
      let exists = false
    nums.forEach(num => {
        if (num == rand){
          exists = true
        }
    });
    if(exists == true){
      rand = Math.floor(Math.random()*4)+1
    }else{
      nums.push(rand)
      if(nums.length == 4){
        shouldExit = true
      }
    }
  }
    let x = 180;
    rightWires.push({"x": x, "y": 5, "num":nums[0]});
    rightWires.push({"x": x, "y": 10, "num":nums[1]});
    rightWires.push({"x": x, "y": 15, "num":nums[2]});
    rightWires.push({"x": x, "y": 20, "num":nums[3]});

    let x2 = 10;
    rand = Math.floor(Math.random()*4)+1
    let nums2 = []
    nums2.push(rand)
    shouldExit = false
    while(!shouldExit){
      let exists = false
    nums2.forEach(num => {
        if (num == rand){
          exists = true
        }
    });
    if(exists == true){
      rand = Math.floor(Math.random()*4)+1
    }else{
      nums2.push(rand)
      if(nums2.length == 4){
        shouldExit = true
      }
    }
  }
    leftWires.push({"x": x2, "y": 5, "num":nums2[0]});
    leftWires.push({"x": x2, "y": 10, "num":nums2[1]});
    leftWires.push({"x": x2, "y": 15, "num":nums2[2]});
    leftWires.push({"x": x2, "y": 20, "num":nums2[3]});
  return [leftWires, rightWires];
}
function renderAllWires(wires) {
  const LWires = wires[0];
  const RWires = wires[1];
  let i = 1;

  RWires.forEach((wire) => {
    Replace(currentBoard, wire.x, wire.y, "<<" +wire.num);
    i++;
  });
  LWires.forEach((wire) => {
    Replace(currentBoard, wire.x, wire.y, wire.num+"<<" );
    i++;
  });
}
function playAgain() {
  shouldDraw= true;
  selected = 0;
  let y = Math.floor(Math.random() * 4)
  allWires.push(snakeBody);
  gameHasEnded = false;
  gameHasStarted = false;
  xv = 2;
  yv = 0;
}
function gameEnd(body, giveData = false) {
  let countedParts = body.reduce((accumulator, obj) => {
    if ("x" + obj.x + "y" + obj.y in accumulator) {
      accumulator["x" + obj.x + "y" + obj.y]++;
    } else {
      accumulator["x" + obj.x + "y" + obj.y] = 1;
    }
    return accumulator;
  }, {});
  if (!giveData) {
    let values = Object.keys(countedParts).map(function (key) {
      return countedParts[key];
    });
    let result = values.some((el) => el > 1);
    return result;
  } else {
    return countedParts;
  }
}

function drawSnake() {
  allWires.forEach((snake) => {
    snake.forEach(drawWirePart);
  });
  snakeBody.forEach(drawSnakePart);
}
function Replace(Arr, x, y, Char) {
  String.prototype.replaceAt = function (index, replacement) {
    return (
      this.substr(0, x) + replacement + this.substr(index + replacement.length)
    );
  };
  Arr[y] = Arr[y].replaceAt(x, Char);
  return Arr;
}
function drawSnakePart(snakePart) {
  Replace(currentBoard, snakePart.x, snakePart.y, "██");
}
function drawWirePart(snakePart) {
  Replace(currentBoard, snakePart.x, snakePart.y, "¥¥");
}
function drawApple(applePos) {
  Replace(currentBoard, applePos.x, applePos.y, "▓▓");
}
function colorBoard() {
  let x = 0;
  let i = 0;
  currentBoard.forEach((line) => {
    currentBoard[i] = line.replace(/█/g, chalk.white("█"));
    i++;
  });
  i = 0;
  currentBoard.forEach((line) => {
    currentBoard[i] = line.replace(/<<1/g, chalk.red("██a"));
    i++;
  });
  i = 0;
  currentBoard.forEach((line) => {
    currentBoard[i] = line.replace(/<<2/g, chalk.green("██b"));
    i++;
  });
  i = 0;
  currentBoard.forEach((line) => {
    currentBoard[i] = line.replace(/<<3/g, chalk.cyan("██c"));
    i++;
  });
  i = 0;
  currentBoard.forEach((line) => {
    currentBoard[i] = line.replace(/<<4/g, chalk.blue("██d"));
    i++;
  });
  i = 0;
  currentBoard.forEach((line) => {
    currentBoard[i] = line.replace(/1<</g, chalk.red("a██"));
    i++;
  });
  i = 0;
  currentBoard.forEach((line) => {
    currentBoard[i] = line.replace(/2<</g, chalk.green("b██"));
    i++;
  });
  i = 0;
  currentBoard.forEach((line) => {
    currentBoard[i] = line.replace(/3<</g, chalk.cyan("c██"));
    i++;
  });
  i = 0;
  currentBoard.forEach((line) => {
    currentBoard[i] = line.replace(/4<</g, chalk.blue("d██"));
    i++;
  });
  i =0

  currentBoard.forEach((line) => {
    currentBoard[i] = line.replace(/"¥"/g, chalk.grey("█"));
    i++;
  });
  i = 0;
}
function moveSnake() {
  const head = { x: snakeBody[0].x + xv, y: snakeBody[0].y + yv };
  if (head.x > line.length - 2) head.x = 2;
  else if (head.x < 0) head.x = line.length - 2;
  else if (head.y > 30) head.y = 1;
  else if (head.y < 1) head.y = 30;
  if (gameEnd([head].concat(snakeBody))) return (gameHasEnded = true);
  snakeBody.unshift(head);
  wires[1].forEach(applePos => {
  
          if (
            (head.x == applePos.x && head.y == applePos.y) ||
            (head.x == applePos.x + 1 && head.y == applePos.y) ||
            (head.x == applePos.x - 1 && head.y == applePos.y)
          ) {
            
            let activeWire = workingWires[0][selected].num;
            if (activeWire === applePos.num){
            let x = 180;
            let y = Math.floor(Math.random() * 4) * 5 + 2;
            applePos = { x: x, y: y };
            score++;
            workingWires[0].splice(selected, 1)
            return (gameHasEnded = true);
            }
          }
        
    
  });
  
}
function changeDirection(key) {

  if (!gameHasStarted) {return select(key);}
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
