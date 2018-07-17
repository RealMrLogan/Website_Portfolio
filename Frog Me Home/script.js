/* jshint esversion: 6 */
var myGamePiece;
var croc = [];
var homeIsland;

function startGame() {
  myGamePiece = new component(30, 30, "frog.png", 240, 550, "image");
  createCrocs();
  homeIsland = new component(100, 57, "castle.png", 230, 0, "image");
  myGameArea.start();
  openGreeting();
  window.addEventListener('keydown', function (e) {
    if (e.keyCode == 13) {

      closeGreeting();
    }
  });
}

function openGreeting() {
  console.log("Opened the greeting");
  const message = document.getElementsByClassName("message")[0];
  message.innerHTML = "Use the Key Pad to move your frog. <br /> <br />Get home to your island. <br /> <br />Press 'Enter' to start playing.";
  message.id = "greeting";
  const canvas = document.getElementsByTagName('canvas')[0];
  canvas.className = "blur";
  const endMessage = document.getElementById('endMessage');
  endMessage.style.display = "block";
}

function closeGreeting() {
  console.log("Closed the greeting");
  const canvas = document.getElementsByTagName('canvas')[0];
  canvas.className = "";
  const endMessage = document.getElementById('endMessage');
  endMessage.style.display = "none";
}

function createCrocs() {
  for (let i = 0; i < 10; i++) {
    croc.push(new component(100, 25, "croc.png", (Math.random() * 400), ((Math.random() * 450) + 75), "image"));
    if (i % 2 == 0) {
      croc[i].direction = "left";
      croc[i].image.src = "left_croc.png";
    }
  }
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 480;
    this.canvas.height = 600;
    this.context = this.canvas.getContext("2d");
    document.getElementById('div').appendChild(this.canvas);
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener('keydown', function (e) {
      myGameArea.key = e.keyCode;
    });
    window.addEventListener('keyup', function (e) {
        myGameArea.key = false;
    });
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function() {
    clearInterval(this.interval);
  }
};

function component(width, height, color, x, y, type) {
  this.type = type;
  if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }
  this.direction = "right";
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.update = function() {
    ctx = myGameArea.context;
    if (type == "image") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
  };
  this.crashWith = function(otherobj) {
    let myleft = this.x;
    let myright = this.x + (this.width);
    let mytop = this.y;
    let mybottom = this.y + (this.height);
    let otherleft = otherobj.x;
    let otherright = otherobj.x + (otherobj.width);
    let othertop = otherobj.y;
    let otherbottom = otherobj.y + (otherobj.height);
    let crash = true;
    if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
       crash = false;
    }
    return crash;
  };
}

function gameOver() {
  console.log("game over");
  const message = document.getElementsByClassName("message")[0];
  message.innerHTML = "You got chomped! <br /> Press 'CTRL+R' to restart.";
  message.id = "gameOver";
  const canvas = document.getElementsByTagName('canvas')[0];
  canvas.className = "blur";
  const endMessage = document.getElementById('endMessage');
  endMessage.style.display = "block";
}

function finishGame() {
  console.log("You did it!");
  const message = document.getElementsByClassName("message")[0];
  message.innerHTML = "Congratulations, you made it home! <br /> Press 'CTRL+R' to restart.";
  message.id = "finish";
  const canvas = document.getElementsByTagName('canvas')[0];
  canvas.className = "blur";
  const endMessage = document.getElementById('endMessage');
  endMessage.style.display = "block";
  myGamePiece.update();
  myGameArea.stop();
}

function moveCroc() {
  for (let i = 0; i < 10; i++) {
    if (croc[i].direction == "right") {
      croc[i].x += 0.75;
      if (croc[i].x > 480) {
        croc[i].x = -100;
      }
    } else {
      croc[i].x -= 0.75;
      if (croc[i].x < -100) {
        croc[i].x = 500;
      }
    }
    croc[i].update();
  }
}

function checkBoundaries() {
  const canvas = document.getElementsByTagName('canvas')[0];
  const ctx = canvas.getContext('2d');
  if (myGamePiece.x + 30 > canvas.width ||  // check on the right
      myGamePiece.x < canvas.width - 480 || // check on the left
      myGamePiece.y + 30 > canvas.height || // check on the bottom
      myGamePiece.y < canvas.height - 600) { // check on the top
    console.log("outside the border");
    return true;
  }
}

function updateGameArea() {
  for (let i = 0; i < 10; i++) {
    if (myGamePiece.crashWith(croc[i])) {
      myGameArea.stop();
      gameOver();
      return;
    }
  }
  myGameArea.clear();

  moveCroc();

  if (myGamePiece.crashWith(homeIsland)) {
    finishGame();
  }

  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
  if (myGameArea.key == 37) {checkBoundaries() == true ? myGamePiece.speedX = 2 : myGamePiece.speedX = -2; }
  if (myGameArea.key == 39) {checkBoundaries() == true ? myGamePiece.speedX = -2 : myGamePiece.speedX = 2; }
  if (myGameArea.key == 38) {checkBoundaries() == true ? myGamePiece.speedY = 2 : myGamePiece.speedY = -2; }
  if (myGameArea.key == 40) {checkBoundaries() == true ? myGamePiece.speedY = -2 : myGamePiece.speedY = 2; }
  myGamePiece.newPos();
  homeIsland.update();
  myGamePiece.update();
}
