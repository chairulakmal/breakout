// hide preview setImageVisible
function hideImage(id) {
  let img = document.getElementById(id);
  img.style.display = 'none';
}


const canvas = document.getElementById("breakoutCanvas");
const item = canvas.getContext("2d");


// ball
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height / 2;
let dx = 2;
let dy = -3;

// paddle
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// controller
let rightPressed = false;
let leftPressed = false;

// bricks
let brickRowCount = 3;
let brickColumnCount = 10;
let brickWidth = 50;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 25;
let bricks = []; // array of bricks
for (let i = 0; i < brickColumnCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickRowCount; j++) {
    bricks[i][j] = bricks[i][j] = {
      x: 0,
      y: 0,
      status: 1
    };;
  }
}

// score & lives

let score = 0;
let lives = 3;
let play = false;




document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener('keydown', function(e) {
  let key = e.keyCode;
  if (key === 80) // p key on keyboard
  {
    togglePause();
  }
});

// play/pause
function togglePause() {
  if (!play) {
    play = true; // play
    draw();
    hideImage('preview')

  } else if (play) {
    play = false; // pause
  }
}

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function collisionDetection() {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      let b = bricks[i][j];
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0; // if collision happens change status to 0
          score++; // and add score by 1
          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  item.font = "16px Slabo 27px";
  item.fillStyle = "#fff";
  item.fillText("Score: " + score, 12, 20);
}

function drawLives() {
  item.font = "16px S27pxlabo ";
  item.fillStyle = "#fff";
  item.fillText("Lives: " + lives, canvas.width - 62, 20);
}

function drawBall() {
  item.beginPath();
  item.arc(x, y, ballRadius, 0, Math.PI * 2);
  item.fillStyle = "#ccff00";
  item.fill();
  item.closePath();
}

function drawPaddle() {
  item.beginPath();
  item.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  item.fillStyle = "#fff";
  item.fill();
  item.closePath();
}

function drawBricks() {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      if (bricks[i][j].status == 1) { // check for brick status
        let brickX = (i * (brickWidth + brickPadding)) + brickOffsetLeft;
        let brickY = (j * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[i][j].x = brickX; // position each brick based on row & column
        bricks[i][j].y = brickY;
        item.beginPath();
        item.rect(brickX, brickY, brickWidth, brickHeight);
        item.fillStyle = "#ff6f61";
        item.fill();
        item.closePath();
      }
    }
  }
}

function draw() {
  if (play) {

    item.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();


    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        if (y = y - paddleHeight) {
          dy = -dy;
        }
      } else {
        lives--;
        if (lives < 1) {
          alert("GAME OVER");
          document.location.reload();
        } else {
          x = canvas.width / 2;
          y = canvas.height - 30;
          dx = 2;
          dy = -2;
          paddleX = (canvas.width - paddleWidth) / 2;
        }
      }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw); // loop by browser framerate
  }
}


draw();