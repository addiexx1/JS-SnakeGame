
//initial position
const grid = 22;
//snake body is an array of x and y poistion, initial position set at the middle of the grid
let snake = [{ x: grid/2, y: grid/2 }];
let eat = false;
const snakeMoveSpeed = 5;
let lastTimeStamp = 0;

//get the gameboard to draw the snake and apple
const container = document.getElementById("container");
let gameOver = false;
let newMove = { x: 0, y: 0 };
let lastMove = { x: 0, y: 0 };

window.addEventListener("keydown", (input) => {
  switch (input.key) {
    // x is up and down and y is left and right
    case "ArrowUp":
      //new move can not be the same or the opposite direction of the last move
      if (lastMove.x !== 0) break;
      newMove = { x: -1, y: 0 };
      break;
    case "ArrowDown":
      if (lastMove.x !== 0) break;
      newMove = { x: 1, y: 0};
      break;
    case "ArrowLeft":
      if (lastMove.y !== 0) break;
      newMove = { x: 0, y: -1 };
      break;
    case "ArrowRight":
      if (lastMove.y !== 0) break;
      newMove = { x: 0, y: 1 };
      break;
  }
})


function play(timeStamp){
  if (gameOver == true){

    if (confirm("Game Over. Press OK to Restart.")){
       window.location.reload();
    }
    return;
  }

  window.requestAnimationFrame(play);
  const seconds = (timeStamp - lastTimeStamp) / 1000;
  //convert milliseconds to seconds set a snake moving speed, so it renders at a speed that I want (1 / snakeMoveSpeed)
  if (seconds < (1 / snakeMoveSpeed)) {return;}

  lastTimeStamp = timeStamp;

  nextStep();
  drawContainer();
}

//window.requestAnimationFrame(play) play callback function return a time stamp when the function is called.
window.requestAnimationFrame(play);


// Snake

function drawSnake(container){
  snake.forEach((seg) => {
    
   // for each segment{x:position, y:position} of the snake body, create a div and give a class name"snake" to set up backgroud color.
    const snakeDiv = document.createElement("DIV");
    snakeDiv.className = "snake";
    
    // use gridRowStar/end gridColumnStart/End to draw one segment of snake. x:veritical y:horizontal
    snakeDiv.style.gridRowStart = seg.x;
    snakeDiv.style.gridRowEnd = seg.x+1;
    snakeDiv.style.gridColumnStart = seg.y;
    snakeDiv.style.gridColumnEnd = seg.y+1;
    container.appendChild(snakeDiv);
  })
}


function newSnake(){
  lastMove = newMove;
  //eat and add a tail
  if(eat){
    snake[snake.length] = {...snake[snake.length - 1]};
  }
  eat = false;

  //moving
  for (let i = snake.length - 1; i > 0; i--){
    //the second last block will be the new tail block and so on...
    snake[i] = {...snake[i-1]};
     
  }

  snake[0].x += newMove.x;//up x= x+1 and down x=x-1
  snake[0].y += newMove.y;//left to right
}

function positionCompare(pos1, pos2){
  //check if they are the same
  return (pos1.x == pos2.x && pos1.y == pos2.y);
}


//apple 

let apple = randomApple();

function randomApple() {
  let newApplePosition;
  if (newApplePosition == null || eat == true) {
    const randX = Math.floor(Math.random() * grid) + 1;
    const randY = Math.floor(Math.random() * grid) + 1;
    newApplePosition = {x: randX, y: randY};
  }
  return newApplePosition;
}

function eatApple() {
  if (positionCompare(snake[0],apple)) {
    eat = true;
    apple = randomApple();
  }
}

function appleUpdate(container) {
  const appleDiv = document.createElement("DIV");
  appleDiv.className = "apple";
  appleDiv.style.gridRowStart = apple.x; //vertical movement
  appleDiv.style.gridRowEnd = apple.x+1;
  appleDiv.style.gridColumnStart = apple.y; //horizontal movement
  appleDiv.style.gridColumnEnd = apple.y+1; 
  container.appendChild(appleDiv);
}


function hitTheWall(snake) {
  if(snake[0].x < 1 || snake[0].x > grid || snake[0].y < 1 || snake[0].y > grid){
   return true;
  }
  return false;

}

function ifIntersection(){
  let intersect = false;
  for (let i = 1; i < snake.length; i++){
    if(positionCompare(snake[0],snake[i])){
      intersect = true;
    }
  }
  return intersect;
}

function ifGameOver(){
  if( hitTheWall(snake)|| ifIntersection()){
    gameOver = true;
  }
  else gameOver = false;
}

function nextStep(){
  newSnake();
  eatApple();
  ifGameOver();
}

function drawContainer(){
  container.innerHTML = "";
  drawSnake(container);
  appleUpdate(container);
}

