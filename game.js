var canvas = document.getElementById("myCanvas");
            var ctx = canvas.getContext("2d");
            var x = canvas.width/2;
            var y = canvas.height-30;
            var dx = 4;
            var dy = -4;
            var ballRadius = 10;
            var paddleHeight = 10;
            var paddleWidth = 75;
            var paddleX = (canvas.width - paddleWidth)/2;
            var rightPressed = false;
            var leftPressed = false;
            var brickRowCount = 3;
            var brickColoumnCount = 5;
            var brickWidth = 75;
            var brickHeight = 20;
            var brickPadding = 10;
            var brickOffsetTop = 30;
            var brickOffsetLeft = 30;
            var bricks = [];
            var score = 0;
            var lives = 2;
            var spacePressed = false;
            for(var c = 0; c < brickColoumnCount; c++){
                bricks[c] = [];
                for(var r = 0; r < brickRowCount; r++){
                    bricks[c][r] = {x: 0, y : 0, status: 2};
                }
            }
            document.addEventListener("keydown",keyDownHandler,false);
            document.addEventListener("keyup",keyUpHandler,false);
            document.addEventListener("mousemove", mouseMoveHandler, false);
            function drawBricks(){
                for(var c = 0; c < brickColoumnCount; c++){
                    for(var r =0; r < brickRowCount; r++){
                        var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                        var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                        bricks[c][r].x = brickX;
                        bricks[c][r].y = brickY;
                        if(bricks[c][r].status == 2){
                            ctx.beginPath();
                            ctx.rect(brickX,brickY,brickWidth,brickHeight);
                            ctx.fillStyle = "#0095DD";
                            ctx.fill();
                            ctx.closePath();
                        }
                        else if(bricks[c][r].status == 1){
                            ctx.beginPath();
                            ctx.rect(brickX,brickY,brickWidth,brickHeight);
                            ctx.fillStyle = "red";
                            ctx.fill();
                            ctx.closePath();
                        }
                    }
                }
            }
            function mouseMoveHandler(e) {
                var relativeX = e.clientX - canvas.offsetLeft;
                if(relativeX > 0 && relativeX < canvas.width) {
                paddleX = relativeX - paddleWidth/2;
            }
}
            function keyDownHandler(e){
                if(e.key == "Right" || e.key == "ArrowRight"){
                    rightPressed = true;
                }
                else if(e.key == "Left" || e.key == "ArrowLeft"){
                    leftPressed = true;
                }
                else{
                    spacePressed = true;
                }
            }
            function keyUpHandler(e){
                if(e.key == "Right" || e.key == "ArrowRight") rightPressed = false;
                else if(e.key == "Left" || e.key == "ArrowLeft") leftPressed = false;
            }
            function drawScore() {
                ctx.font = "20px Arial";
                ctx.fillStyle = "aqua-blue";
                ctx.fillText("Score: "+score + "/15", 8, 20);
            }
            function drawLives() {
                    ctx.font = "22px Arial";
                    ctx.fillStyle = "royal-blue";
                    ctx.fillText("Lives: "+lives, canvas.width-80, 20);
            }
            function drawStart(){
                ctx.font = "32px Arial";
                ctx.fillStyle = "black";
                ctx.fillText("START",canvas.width/2 -50, canvas.height/2-20);                
            }
            function startText(){
                ctx.font = "20px Arial";
                ctx.fillStyle = "grey";
                ctx.fillText("Press any key to start",canvas.width/2 - 90, canvas.height/2+10);
            }
            function collisionDetection(){
                for(var c = 0; c < brickColoumnCount; c++){
                    for(var r = 0; r < brickRowCount; r++){
                        var b = bricks[c][r];
                        if(bricks[c][r].status != 0 && x >= b.x && x <= b.x + brickWidth && y >= b.y && y <= b.y + brickHeight){
                            dy = -dy;
                            bricks[c][r].status = bricks[c][r].status - 1;
                            if(bricks[c][r].status == 0)score++;
                            if(score == brickColoumnCount*brickRowCount){
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                swal({
                                    title: "Good job!",
                                    text: "You Won!",
                                    text: "Score : 15",
                                    icon: "success",
                                    }).then(function(){
                                       document.location.reload(); 
                                    });
                                // alert("CONGRATS! YOU WON!");
                                
                                //document.location.reload();
                                clearInterval(interval);
                            }
                        }
                    }
                }
            }
            function drawPaddle(){
                ctx.beginPath();
                ctx.rect(paddleX, canvas.height - paddleHeight,paddleWidth, paddleHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
            function drawBall(){
                ctx.beginPath();
                ctx.arc(x,y,ballRadius,0,Math.PI*2);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
            // drawPaddle();
            function draw(){
                // drawPaddle();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if(spacePressed == false) {
                    drawStart();
                    startText();
                    drawScore();
                    drawLives();
                }
                else{
                    drawBricks();
                    drawBall();
                    drawPaddle();
                    collisionDetection();
                    drawScore();
                    drawLives();
                    if(spacePressed == false) drawStart();
                    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;                
                    if(y+dy < ballRadius) dy = -dy;
                    else if(y + dy > canvas.height - ballRadius){
                        if(x+ballRadius >= paddleX && x <= paddleX + paddleWidth){
                            dy = -dy;
                        }
                        else{
                            lives--;
                            if(lives == 0){
                                //alert("GAME OVER");
                                swal({
                                title: "Oops!",
                                text: "Game Over!",
                                icon: "error",
                                button: "Play Again!",
                                }).then(function(){
                                    document.location.reload();
                                }); 
                                
                                //document.location.reload();
                                clearInterval(interval);
                            }
                            else{
                                x = canvas.width/2;
                                y = canvas.height-30;
                                dx = -4;
                                dy = 4;
                                paddleX = (canvas.width-paddleWidth)/2;
                            }
                        }
                    }
                    if(rightPressed) {
                        paddleX+=8;
                        if(paddleX + paddleWidth > canvas.width){
                            paddleX = canvas.width - paddleWidth;
                        }
                    }
                    else if(leftPressed) {
                        paddleX-=8;
                        if(paddleX < 0){
                            paddleX = 0;
                        }
                    }
                    x+=dx;
                    y+=dy;
                    // requestAnimationFrame(draw);
                }
            }
            var interval = setInterval(draw,10);  
            // draw();