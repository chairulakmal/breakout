var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// ball
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height / 2;
var dx = 2;
var dy = -3;

// paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

// controller
var rightPressed = false;
var leftPressed = false;

// bricks
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 33;
var bricks = []; // array of bricks
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = bricks[c][r] = {
      x: 0,
      y: 0,
      status: 1
    };;
  }
}

// score & lives

var score = 0;
var lives = 3;
var paused = false;




document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener('keydown', function(e) {
  var key = e.keyCode;
  if (key === 80) // p key on keyboard
  {
    togglePause();
  }
});

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
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

function togglePause() {
  if (!paused) {
    paused = true; // pause
  } else if (paused) {
    paused = false;
    draw(); // play
  }
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
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
  ctx.font = "16px Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) { // check for brick status
        var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#ff6f61";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
  if (!paused) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
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



/*
// red square
ctx.beginPath();
ctx.rect(20, 40, 50, 50);
ctx.fillStyle = "#FF0000";
ctx.fill();
ctx.closePath();

// green circle
ctx.beginPath();
ctx.arc(240, 160, 20, 0, Math.PI * 2, false);
ctx.fillStyle = "green";
ctx.fill();
ctx.closePath();

// blue rectangle
ctx.beginPath();
ctx.rect(180, 20, 100, 80);
ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
ctx.stroke();
ctx.closePath();
*/