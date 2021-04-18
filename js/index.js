let canvas;
let canvasContext;
let ballX = 50;
let ballSpeedX = 10;
let ballY = 50;
let ballSpeedY = 4;

let paddle1Y = 250;
let paddle2Y = 250;

let winningScore = 3;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;
const backDrop = document.querySelector('#backdrop');
let form = document.querySelector('#promtDiv');

let showingWinScreen = false;

let player1Score = 0;
let player2Score = 0;

startGame = ()=>{
    let inputValue = document.querySelector('#score');
   
    if(inputValue.value == ""){
        alert("Please input a winning score to continue")
    }
    else{

        winningScore = parseInt(inputValue.value);
        
        canvas.classList.remove('hide');
        hideOverlay();
                let framesPerSecond = 30;
        setInterval(() => {
            moveEverything();
            drawEverything();
        }, 1000 / framesPerSecond);


        canvas.addEventListener('mousedown', handleMouseClick)

        canvas.addEventListener('mousemove', function (evt) {
            let mousePos = calculateMousePos(evt);
            paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
        })

    }
   
    
}

function hideOverlay(){
    backDrop.classList.remove('visible');
    form.classList.add('hide');
}

function showOverlay(){
    backDrop.classList.add('visible');
    form.classList.toggle('hide');
}

function stopGame(){
    canvas.classList.add('hide');

    //Reloads page
    location.reload();
  
}


function calculateMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = evt.clientX - rect.left - root.scrollLeft;
    let mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };

}

//sets the game up for the next phase
function handleMouseClick() {
    if (showingWinScreen) {
        player1Score = 0;
        player2Score = 0;

        showingWinScreen = false;
        showOverlay();
        stopGame(); 

    }
}


function showProgressBar(){

    
    if (showingWinScreen) {
        canvasContext.fillStyle = "black";
        if (player1Score >= winningScore) {
            canvasContext.fillText("Left Player Won", 290, 100)
            progressBarRed();
        } else if (player2Score >= winningScore) {

            canvasContext.fillText("Right Player Won", 290, 100);
            progressBarBlue();
            showingWinScreen = true;

        }
        canvasContext.fillText("Click to continue", 300, 480);
        return;
    }


    progressBarBlue();
    progressBarRed();
}

//Draws progress bar red


function progressBarRed() {



    
    colorRect(100, 550, 2, 20, "red");
    colorRect(300, 550, 2, 20, "red");
    for(var i=550;i<570;i+=18) {
        if(i>551 && i <569){
            colorRect(100, i, 200, 2, "red");
            continue;
        }
        colorRect(100, i, 200, 2, "red");
    }
    colorRect(100, 550, player1Score*(200/winningScore), 20, "red");
}
function progressBarBlue() {
    colorRect(500, 550, 2, 20, "green");
    colorRect(700, 550, 2, 20, "green");
    for(var i=550;i<570;i+=18) {
        if(i>551 && i <569){
            colorRect(500, i, 200, 2, "green");
            continue;
        }
        colorRect(500, i, 200, 2, "green");
    }
    colorRect(700, 550, -player2Score*(200/winningScore), 20, "green");
}


//Confirms that the browser is loaded before uploading any Github code
window.onload = function () {
    // alert("I am Ready");
    canvas = document.querySelector('#gameCanvas');
    canvasContext = canvas.getContext('2d');
   

     backDrop.classList.add('visible');
     
     
     //Add click event here
     document.querySelector('button').addEventListener('click', ()=>{
         startGame();
     })
     
   

}

function ballReset() {
    if (player1Score >= winningScore || player2Score >= winningScore) {
        showingWinScreen = true
    }
     ballSpeedX = - ballSpeedX;
    
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function computerMovement() {
    let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
    if (paddle2YCenter < ballY - 35) {
        paddle2Y += 6;
    } else if (paddle2YCenter > ballY + 35) {
        paddle2Y -= 6;
    }
}

function moveEverything() {
    if (showingWinScreen) {
        return;
    }
    computerMovement();
    ballX = ballX + ballSpeedX;
    ballY = ballY + ballSpeedY;

    if (ballX < 0) {
        //Checks if the ball touches the paddle 
        if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX = - ballSpeedX;

            let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.35;
        } else {
            player2Score++;
            ballReset();
        }

    }
    if (ballX > canvas.width) {
        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX = - ballSpeedX;

            let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.35;

        } else {
            player1Score++;
            ballReset();
        }
    }
    if (ballY < 0) {
        ballSpeedY = - ballSpeedY;

    }
    if (ballY > canvas.height) {
        ballSpeedY = - ballSpeedY;
    }

}

function drawNet() {
    for (let i = 0; i < canvas.height; i += 40) {
        colorRect(canvas.width / 2 - 1, i, 2, 20, 'black');
    }
}

function drawEverything() {

    //The next line drawa blank black page
    colorRect(0, 0, canvas.width, canvas.height, 'white')

   
   

    //The next line draws player paddle
    // fillRect(x,y, width,heigh)
    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'red');

    drawNet();
    showProgressBar();
    // progressBarRed();
    // progressBarBlue();
  
    //This is the right computer paddle
    colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'green');

    //The next line draws ball itself
    //    colorRect(ballX,200,50,25);
    colorCircle(ballX, ballY, 10, 'blue');

    

    canvasContext.font = "30px verdana";
    // gradient
    let gradient = canvasContext.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "red");
    gradient.addColorStop("0.5", "red");
    gradient.addColorStop("1.0", "green");
    // Fill with gradient
    canvasContext.fillStyle = gradient;

    // canvasContext.fillStyle = 'black';
    canvasContext.fillText(player1Score, 100, 100)
    canvasContext.fillText(player2Score, canvas.width - 100, 100)






}

function colorCircle(centerX, centerY, radius, color) {
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();

}

colorRect = (leftX, topY, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(leftX, topY, width, height);
}




